#!/usr/bin/env python3
"""
Q-Shield — PQC IoT Device with REAL Post-Quantum Cryptography
Uses liboqs to perform actual Kyber/Dilithium operations and measure performance.
"""

import json
import time
import random
import sys
import os
import argparse
import threading
import requests
import paho.mqtt.client as mqtt

try:
    import oqs
    HAS_OQS = True
    print("✅ liboqs loaded successfully")
    print(f"   Version: {oqs.oqs_version()}")
except ImportError:
    HAS_OQS = False
    print("⚠️  liboqs not available — running in simulation mode")

PROXY_HOST = os.environ.get("PROXY_HOST", "localhost")
PROXY_PORT = 8883
PROXY_HTTP_PORT = 8080
TOPIC = "iot/pqc/telemetry"
BENCHMARK_INTERVAL = 3  # seconds between full benchmarks

# -----------------------------------------------------------------------
# PQC Algorithm Registry
# -----------------------------------------------------------------------

KEM_ALGORITHMS = [
    ("Kyber512",    "ML-KEM-512"),
    ("Kyber768",    "ML-KEM-768"),
    ("Kyber1024",   "ML-KEM-1024"),
]

SIG_ALGORITHMS = [
    ("Dilithium2",  "ML-DSA-44"),
    ("Dilithium3",  "ML-DSA-65"),
    ("Dilithium5",  "ML-DSA-87"),
]


def resolve_name(alg_type, legacy, standard):
    """Find the right algorithm name for this liboqs build."""
    if not HAS_OQS:
        return None
    available = (
        oqs.get_enabled_kem_mechanisms()
        if alg_type == "KEM"
        else oqs.get_enabled_sig_mechanisms()
    )
    if standard in available:
        return standard
    if legacy in available:
        return legacy
    return None


# -----------------------------------------------------------------------
# Benchmarks — Real PQC operations
# -----------------------------------------------------------------------

def benchmark_kem(algo_name, iterations=5):
    """Run real KEM keygen + encapsulation + decapsulation, return avg timing."""
    keygen_t, encaps_t, decaps_t = [], [], []
    details = {}

    for _ in range(iterations):
        kem = oqs.KeyEncapsulation(algo_name)

        t0 = time.perf_counter()
        pk = kem.generate_keypair()
        keygen_t.append((time.perf_counter() - t0) * 1000)

        t0 = time.perf_counter()
        ct, ss = kem.encap_secret(pk)
        encaps_t.append((time.perf_counter() - t0) * 1000)

        t0 = time.perf_counter()
        ss2 = kem.decap_secret(ct)
        decaps_t.append((time.perf_counter() - t0) * 1000)

        details = kem.details

    kg = sum(keygen_t) / len(keygen_t)
    ec = sum(encaps_t) / len(encaps_t)
    dc = sum(decaps_t) / len(decaps_t)

    return {
        "type": "KEM",
        "name": algo_name,
        "keygen_ms": round(kg, 3),
        "encaps_ms": round(ec, 3),
        "decaps_ms": round(dc, 3),
        "total_ms": round(kg + ec + dc, 3),
        "pk_bytes": details.get("length_public_key", 0),
        "sk_bytes": details.get("length_secret_key", 0),
        "ct_bytes": details.get("length_ciphertext", 0),
    }


def benchmark_sig(algo_name, iterations=5):
    """Run real signature keygen + sign + verify, return avg timing."""
    keygen_t, sign_t, verify_t = [], [], []
    message = b"Q-Shield IoT telemetry - PQC signature benchmark payload"
    details = {}

    for _ in range(iterations):
        sig = oqs.Signature(algo_name)

        t0 = time.perf_counter()
        pk = sig.generate_keypair()
        keygen_t.append((time.perf_counter() - t0) * 1000)

        t0 = time.perf_counter()
        signature = sig.sign(message)
        sign_t.append((time.perf_counter() - t0) * 1000)

        t0 = time.perf_counter()
        valid = sig.verify(message, signature, pk)
        verify_t.append((time.perf_counter() - t0) * 1000)

        details = sig.details

    kg = sum(keygen_t) / len(keygen_t)
    sn = sum(sign_t) / len(sign_t)
    vf = sum(verify_t) / len(verify_t)

    return {
        "type": "SIG",
        "name": algo_name,
        "keygen_ms": round(kg, 3),
        "sign_ms": round(sn, 3),
        "verify_ms": round(vf, 3),
        "total_ms": round(kg + sn + vf, 3),
        "pk_bytes": details.get("length_public_key", 0),
        "sk_bytes": details.get("length_secret_key", 0),
        "sig_bytes": details.get("length_signature", 0),
    }


def run_all_benchmarks():
    """Benchmark every supported PQC algorithm. Returns dict of results."""
    if not HAS_OQS:
        return {}

    results = {}

    for legacy, standard in KEM_ALGORITHMS:
        name = resolve_name("KEM", legacy, standard)
        if name:
            try:
                r = benchmark_kem(name)
                display = standard if name == standard else legacy
                results[display] = r
                print(f"  🔑 {display}: {r['total_ms']:.2f}ms "
                      f"(keygen={r['keygen_ms']:.2f} encaps={r['encaps_ms']:.2f} decaps={r['decaps_ms']:.2f})")
            except Exception as e:
                print(f"  ⚠ {legacy}: {e}")

    for legacy, standard in SIG_ALGORITHMS:
        name = resolve_name("SIG", legacy, standard)
        if name:
            try:
                r = benchmark_sig(name)
                display = standard if name == standard else legacy
                results[display] = r
                print(f"  ✍️  {display}: {r['total_ms']:.2f}ms "
                      f"(keygen={r['keygen_ms']:.2f} sign={r['sign_ms']:.2f} verify={r['verify_ms']:.2f})")
            except Exception as e:
                print(f"  ⚠ {legacy}: {e}")

    return results


def post_metrics(benchmarks):
    """POST benchmark results to the proxy's HTTP endpoint."""
    url = f"http://{PROXY_HOST}:{PROXY_HTTP_PORT}/report-metrics"
    try:
        requests.post(url, json={"algorithms": benchmarks}, timeout=2)
    except Exception as e:
        print(f"  ⚠ POST metrics failed: {e}")


# -----------------------------------------------------------------------
# MQTT setup
# -----------------------------------------------------------------------

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print(f"✅ [{userdata['client_id']}] Connected to proxy (PQC port {PROXY_PORT})")
    else:
        print(f"❌ [{userdata['client_id']}] Connection failed: rc={rc}")


def on_disconnect(client, userdata, rc):
    print(f"⚠️  [{userdata['client_id']}] Disconnected (rc={rc})")


def create_payload(algo_display, last_bench):
    """Create MQTT payload with real crypto timing data and large sensor arrays."""
    algo_data = last_bench.get(algo_display, {})
    return json.dumps({
        "device_id": f"pqc-{algo_display.lower()}",
        "environment": {
            "temperature": round(22.0 + random.uniform(-2, 5), 2),
            "humidity": round(45.0 + random.uniform(-5, 10), 2),
            "pressure": round(1013.25 + random.uniform(-10, 10), 2),
        },
        "system": {
            "cpu_usage": round(random.uniform(10, 80), 1),
            "memory_free_mb": int(random.uniform(128, 512)),
            "battery_level": round(random.uniform(70, 100), 1),
            "uptime": int(time.time()) - 1600000000,
        },
        "sensors": {
            "vibration_x": [round(random.uniform(-1, 1), 3) for _ in range(5)],
            "vibration_y": [round(random.uniform(-1, 1), 3) for _ in range(5)],
            "vibration_z": [round(random.uniform(-1, 1), 3) for _ in range(5)],
        },
        "crypto": {
            "algorithm": algo_display,
            "type": algo_data.get("type", "KEM"),
            "total_ms": algo_data.get("total_ms", 0),
            "pk_bytes": algo_data.get("pk_bytes", 0),
        },
        "status": "OK",
        "timestamp": int(time.time()),
    })


# -----------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Q-Shield PQC Device — Real Crypto")
    parser.add_argument(
        "--kem",
        default="Kyber768",
        help="Primary KEM algorithm for MQTT traffic (default: Kyber768)",
    )
    parser.add_argument(
        "--client-id",
        default=None,
        help="MQTT client ID (auto-generated if not set)",
    )
    args = parser.parse_args()

    # Resolve the primary KEM name
    primary_kem = args.kem
    for legacy, standard in KEM_ALGORITHMS:
        if args.kem in (legacy, standard):
            primary_kem = standard
            break

    client_id = args.client_id or f"pqc-{primary_kem.lower()}"

    print(f"🔌 [{client_id}] Starting PQC Device — Real Crypto Mode")
    print(f"   Target:    {PROXY_HOST}:{PROXY_PORT}")
    print(f"   Topic:     {TOPIC}")
    print(f"   Algorithm: {primary_kem}")
    if HAS_OQS:
        print(f"   Available KEMs: {len(oqs.get_enabled_kem_mechanisms())}")
        print(f"   Available SIGs: {len(oqs.get_enabled_sig_mechanisms())}")
    print()

    # --- Initial benchmark ---
    print("📊 Running initial PQC benchmark...")
    last_bench = run_all_benchmarks()
    if last_bench:
        post_metrics(last_bench)
        print(f"   ✅ Benchmarked {len(last_bench)} algorithms\n")

    # --- Background benchmark loop ---
    last_payload = ""

    def payload_reporter():
        nonlocal last_payload
        url = f"http://{PROXY_HOST}:{PROXY_HTTP_PORT}/report-payload"
        while True:
            time.sleep(1)
            if last_payload:
                try:
                    requests.post(url, json={"type": "pqc", "payload": last_payload}, timeout=1)
                except Exception:
                    pass

    threading.Thread(target=payload_reporter, daemon=True).start()

    def benchmark_loop():
        nonlocal last_bench
        while True:
            time.sleep(BENCHMARK_INTERVAL)
            print("📊 Re-benchmarking all PQC algorithms...")
            last_bench = run_all_benchmarks()
            if last_bench:
                post_metrics(last_bench)

    bench_thread = threading.Thread(target=benchmark_loop, daemon=True)
    bench_thread.start()

    # --- MQTT connection ---
    userdata = {"client_id": client_id}
    client = mqtt.Client(client_id=client_id, userdata=userdata)
    client.on_connect = on_connect
    client.on_disconnect = on_disconnect

    try:
        client.connect(PROXY_HOST, PROXY_PORT, keepalive=60)
    except Exception as e:
        print(f"❌ [{client_id}] Cannot connect: {e}")
        print("   Make sure the Q-Shield proxy is running on port 8883.")
        sys.exit(1)

    client.loop_start()

    try:
        seq = 0
        while True:
            payload = create_payload(primary_kem, last_bench)
            last_payload = payload
            client.publish(TOPIC, payload, qos=0)
            seq += 1
            if seq % 5 == 0:
                total_ms = last_bench.get(primary_kem, {}).get("total_ms", "N/A")
                print(f"📡 [{client_id}] Sent {seq} msgs | {primary_kem} crypto: {total_ms}ms")
            time.sleep(1)
    except KeyboardInterrupt:
        print(f"\n🛑 [{client_id}] Shutting down.")
    finally:
        client.loop_stop()
        client.disconnect()


if __name__ == "__main__":
    main()
