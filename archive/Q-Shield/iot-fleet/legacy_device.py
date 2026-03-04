#!/usr/bin/env python3
"""
Q-Shield — Legacy IoT Device Simulator
Connects to the proxy on Port 1884 (Legacy/ECDSA) and publishes telemetry.
"""

import json
import time
import random
import sys
import os
import threading
import requests
import paho.mqtt.client as mqtt

PROXY_HOST = os.environ.get("PROXY_HOST", "localhost")
PROXY_PORT = 1884
TOPIC = "iot/legacy/telemetry"
CLIENT_ID = "legacy-device-001"


def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print(f"✅ [{CLIENT_ID}] Connected to proxy (Legacy port {PROXY_PORT})")
    else:
        print(f"❌ [{CLIENT_ID}] Connection failed with code {rc}")


def on_disconnect(client, userdata, rc):
    print(f"⚠️  [{CLIENT_ID}] Disconnected (rc={rc}). Reconnecting...")


def on_publish(client, userdata, mid):
    pass  # silent publish confirmation


def create_payload():
    """Generate a realistic, large sensor payload."""
    return json.dumps({
        "device_id": CLIENT_ID,
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
        "status": "OK",
        "algo": "ECDSA-P256",
        "timestamp": int(time.time()),
    })


def main():
    print(f"🔌 [{CLIENT_ID}] Starting Legacy Device Simulator...")
    print(f"   Target: {PROXY_HOST}:{PROXY_PORT}")
    print(f"   Topic:  {TOPIC}")
    print()

    client = mqtt.Client(client_id=CLIENT_ID)
    client.on_connect = on_connect
    client.on_disconnect = on_disconnect
    client.on_publish = on_publish

    try:
        client.connect(PROXY_HOST, PROXY_PORT, keepalive=60)
    except Exception as e:
        print(f"❌ [{CLIENT_ID}] Cannot connect: {e}")
        print("   Make sure the Q-Shield proxy is running on port 1884.")
        sys.exit(1)

    # --- Background payload reporter ---
    last_payload = ""

    def payload_reporter():
        nonlocal last_payload
        url = f"http://{PROXY_HOST}:8080/report-payload"
        while True:
            time.sleep(1)
            if last_payload:
                try:
                    requests.post(url, json={"type": "legacy", "payload": last_payload}, timeout=1)
                except Exception:
                    pass

    threading.Thread(target=payload_reporter, daemon=True).start()

    client.loop_start()

    try:
        seq = 0
        while True:
            payload = create_payload()
            last_payload = payload
            result = client.publish(TOPIC, payload, qos=0)
            seq += 1
            if seq % 5 == 0:
                print(f"📡 [{CLIENT_ID}] Sent {seq} messages | Last: {payload[:60]}...")
            time.sleep(1)
    except KeyboardInterrupt:
        print(f"\n🛑 [{CLIENT_ID}] Shutting down gracefully.")
    finally:
        client.loop_stop()
        client.disconnect()


if __name__ == "__main__":
    main()
