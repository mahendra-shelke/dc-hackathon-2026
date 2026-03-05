import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cpu, Shield, Search, AlertTriangle, CheckCircle2,
    Terminal, Copy, ChevronDown, ChevronUp, Wifi,
    FileKey, Server, ArrowRight, Activity, HardDrive, Fingerprint,
    Lock, Unlock, RefreshCw, Download, Eye, Clock,
} from 'lucide-react';
import { kernelAgents } from '../data/blueprint';
import type { CertStatus } from '../types';

/* ── Brownfield device inventory (simulated discovered devices) ── */
const brownfieldDevices = [
    {
        id: 'bf-001', hostname: 'meter-node-114', ip: '10.22.4.114', mac: 'AA:BB:CC:11:22:33',
        manufacturer: 'Landis+Gyr', model: 'S650', firmware: '0.3.2', protocol: 'DLMS/COSEM',
        memoryKB: 16, cpuMHz: 16, uptime: '142d 7h', certStatus: 'none' as CertStatus,
        currentAlgo: 'None', serialNumber: '—', issuer: '—', expiry: '—',
        lastSeen: '2s ago', industry: 'Industrial', connection: 'NB-IoT',
        discoveredVia: 'Kernel Module v1.0.4', riskScore: 100,
    },
    {
        id: 'bf-002', hostname: 'sensor-bp-monitor-88', ip: '172.20.5.88', mac: 'DE:AD:BE:EF:00:88',
        manufacturer: 'Philips', model: 'MX800', firmware: '2.1.1', protocol: 'HL7/FHIR',
        memoryKB: 64, cpuMHz: 72, uptime: '89d 14h', certStatus: 'none' as CertStatus,
        currentAlgo: 'None', serialNumber: '—', issuer: '—', expiry: '—',
        lastSeen: '9s ago', industry: 'Medical', connection: 'BLE 5.0',
        discoveredVia: 'Kernel Module v1.0.4', riskScore: 99,
    },
    {
        id: 'bf-003', hostname: 'legacy-terminal-03', ip: '10.50.0.3', mac: '00:1A:2B:3C:4D:5E',
        manufacturer: 'Siemens', model: 'S7-300', firmware: '0.1.0', protocol: 'Modbus/TCP',
        memoryKB: 8, cpuMHz: 8, uptime: '412d 3h', certStatus: 'none' as CertStatus,
        currentAlgo: 'None', serialNumber: '—', issuer: '—', expiry: '—',
        lastSeen: '31s ago', industry: 'Industrial', connection: 'UART',
        discoveredVia: 'Kernel Module v1.0.2', riskScore: 100,
    },
    {
        id: 'bf-004', hostname: 'scada-plc-07', ip: '10.22.1.7', mac: '02:42:AC:14:00:07',
        manufacturer: 'Allen-Bradley', model: '1769-L33ER', firmware: '0.9.1', protocol: 'EtherNet/IP',
        memoryKB: 32, cpuMHz: 48, uptime: '67d 22h', certStatus: 'classical' as CertStatus,
        currentAlgo: 'RSA-2048', serialNumber: '0A:3F:9C:2D:88:71:E4:B0', issuer: 'DigiCert IoT ICA G2',
        expiry: '2025-11-14', lastSeen: '7s ago', industry: 'Industrial', connection: 'Ethernet',
        discoveredVia: 'Kernel Module v1.0.4', riskScore: 85,
    },
    {
        id: 'bf-005', hostname: 'hub-smarthome-22a', ip: '192.168.1.22', mac: 'F0:18:98:AA:22:BB',
        manufacturer: 'Samsung', model: 'ST-HUB-v3', firmware: '1.2.0', protocol: 'Matter/Thread',
        memoryKB: 128, cpuMHz: 120, uptime: '34d 9h', certStatus: 'classical' as CertStatus,
        currentAlgo: 'ECDSA P-256', serialNumber: '5B:C1:D7:44:20:A9:3E:FF', issuer: 'DigiCert IoT ICA G2',
        expiry: '2026-08-22', lastSeen: '4s ago', industry: 'Smart Home', connection: 'Wi-Fi + Thread',
        discoveredVia: 'Kernel Module v1.0.3', riskScore: 55,
    },
    {
        id: 'bf-006', hostname: 'hvac-ctrl-unit-19', ip: '10.30.8.19', mac: 'B8:27:EB:19:48:CC',
        manufacturer: 'Honeywell', model: 'WEB-8000', firmware: '1.4.7', protocol: 'BACnet/IP',
        memoryKB: 48, cpuMHz: 64, uptime: '203d 11h', certStatus: 'classical' as CertStatus,
        currentAlgo: 'RSA-1024', serialNumber: '7F:AA:0B:C3:56:12:D8:9E', issuer: 'Legacy Internal CA',
        expiry: '2025-04-30', lastSeen: '12s ago', industry: 'Enterprise', connection: 'Ethernet',
        discoveredVia: 'Kernel Module v1.0.4', riskScore: 92,
    },
    {
        id: 'bf-007', hostname: 'water-valve-ctrl-44', ip: '10.22.9.44', mac: 'DC:A6:32:44:00:11',
        manufacturer: 'Itron', model: 'FC-200', firmware: '0.6.3', protocol: 'Wireless M-Bus',
        memoryKB: 12, cpuMHz: 24, uptime: '518d 1h', certStatus: 'none' as CertStatus,
        currentAlgo: 'None', serialNumber: '—', issuer: '—', expiry: '—',
        lastSeen: '18s ago', industry: 'Industrial', connection: 'NB-IoT',
        discoveredVia: 'Kernel Module v1.0.4', riskScore: 100,
    },
    {
        id: 'bf-008', hostname: 'patient-tag-209', ip: '172.20.12.209', mac: 'E4:5F:01:09:20:99',
        manufacturer: 'Zebra', model: 'ZT411', firmware: '1.0.8', protocol: 'BLE Beacon',
        memoryKB: 24, cpuMHz: 32, uptime: '56d 18h', certStatus: 'none' as CertStatus,
        currentAlgo: 'None', serialNumber: '—', issuer: '—', expiry: '—',
        lastSeen: '5s ago', industry: 'Medical', connection: 'BLE 4.2',
        discoveredVia: 'Kernel Module v1.0.4', riskScore: 97,
    },
    {
        id: 'bf-009', hostname: 'gateway-edge-12', ip: '10.22.6.12', mac: '70:B3:D5:12:AB:CC',
        manufacturer: 'Advantech', model: 'UNO-2484G', firmware: '2.3.0', protocol: 'OPC-UA',
        memoryKB: 256, cpuMHz: 1200, uptime: '21d 8h', certStatus: 'hybrid' as CertStatus,
        currentAlgo: 'ML-KEM-768 + ECDSA P-256', serialNumber: '3A:FF:B2:10:77:C9:4D:E1', issuer: 'DigiCert Hybrid ICA G3',
        expiry: '2027-06-15', lastSeen: '1s ago', industry: 'Industrial', connection: 'Ethernet',
        discoveredVia: 'Kernel Module v1.0.4', riskScore: 18,
    },
    {
        id: 'bf-010', hostname: 'sensor-env-pqc-01', ip: '10.22.7.101', mac: 'A4:CF:12:01:PQ:C1',
        manufacturer: 'Bosch', model: 'BME688', firmware: '3.0.1-pqc', protocol: 'MQTT/TLS 1.3',
        memoryKB: 64, cpuMHz: 80, uptime: '12d 4h', certStatus: 'pqc' as CertStatus,
        currentAlgo: 'ML-KEM-512 + FN-DSA-512', serialNumber: 'C8:01:A3:9F:22:5B:D0:74', issuer: 'DigiCert PQC ICA G1',
        expiry: '2028-01-20', lastSeen: '3s ago', industry: 'Industrial', connection: 'Wi-Fi',
        discoveredVia: 'Kernel Module v1.0.4', riskScore: 5,
    },
];

/* ── SDK Snippets ── */
const sdkSnippets: Record<string, string> = {
    python: `from digicert_iot import KernelModule, CertProbe

# Initialize the lightweight kernel module
km = KernelModule(
    endpoint="dtm.digicert.com",
    device_id="meter-node-114",
    transport="nb-iot",       # uart | ble | nb-iot
    auth_token="Bearer <bootstrap_token>"
)

# Probe local certificate store
probe = CertProbe(km)
result = probe.scan()

print(f"Cert Status:  {result.status}")        # none | classical | hybrid | pqc
print(f"Algorithm:    {result.algorithm}")       # RSA-2048, ECDSA P-256, etc.
print(f"Serial:       {result.serial_number}")
print(f"Issuer:       {result.issuer}")
print(f"Expiry:       {result.not_after}")
print(f"Firmware Hash:{result.firmware_sha256}")

# Report telemetry to DigiCert DTM
km.report_telemetry({
    "memory_kb": 16,
    "cpu_mhz":   16,
    "cert":      result.to_dict(),
    "uptime_s":  result.uptime_seconds,
})`,
    c: `#include <digicert/kernel_module.h>
#include <digicert/cert_probe.h>

int main(void) {
    /* Initialize on constrained hardware (≥ 8KB RAM) */
    dc_km_config_t cfg = {
        .endpoint  = "dtm.digicert.com",
        .device_id = "scada-plc-07",
        .transport = DC_TRANSPORT_UART,
        .auth      = "<bootstrap_token>",
    };
    dc_km_t *km = dc_km_init(&cfg);

    /* Scan local certificate store */
    dc_cert_result_t cert;
    dc_cert_probe(km, &cert);

    printf("Status:    %s\\n", dc_cert_status_str(cert.status));
    printf("Algorithm: %s\\n", cert.algorithm);
    printf("Serial:    %s\\n", cert.serial);
    printf("Issuer:    %s\\n", cert.issuer);
    printf("Expiry:    %s\\n", cert.not_after);
    printf("FW Hash:   %s\\n", cert.fw_sha256);

    /* Report to DTM */
    dc_telemetry_t tel = {
        .memory_kb = 32,
        .cpu_mhz   = 48,
        .cert      = &cert,
    };
    dc_km_report(km, &tel);
    dc_km_free(km);
    return 0;
}`,
    go: `package main

import (
    "fmt"
    "log"

    dciot "github.com/digicert/iot-sdk-go"
)

func main() {
    // Connect via lightweight kernel module
    km, err := dciot.NewKernelModule(dciot.Config{
        Endpoint:  "dtm.digicert.com",
        DeviceID:  "hub-smarthome-22a",
        Transport: dciot.TransportBLE,
        AuthToken: "<bootstrap_token>",
    })
    if err != nil {
        log.Fatal(err)
    }
    defer km.Close()

    // Probe certificates on device
    result, err := km.ProbeCerts()
    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Cert Status:   %s\\n", result.Status)
    fmt.Printf("Algorithm:     %s\\n", result.Algorithm)
    fmt.Printf("Serial:        %s\\n", result.SerialNumber)
    fmt.Printf("Issuer:        %s\\n", result.Issuer)
    fmt.Printf("Expiry:        %s\\n", result.NotAfter)
    fmt.Printf("Firmware Hash: %s\\n", result.FirmwareSHA256)

    // Upload telemetry
    km.ReportTelemetry(dciot.Telemetry{
        MemoryKB: 128,
        CPUMHz:   120,
        Cert:     result,
    })
}`,
    rust: `use digicert_iot::{KernelModule, Config, Transport, CertProbe};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize the lightweight kernel module
    let km = KernelModule::new(Config {
        endpoint:  "dtm.digicert.com".into(),
        device_id: "water-valve-ctrl-44".into(),
        transport: Transport::NbIot,
        auth_token: "<bootstrap_token>".into(),
    })?;

    // Probe local certificate store
    let probe = CertProbe::new(&km);
    let result = probe.scan()?;

    println!("Cert Status:   {}", result.status);
    println!("Algorithm:     {}", result.algorithm);
    println!("Serial:        {}", result.serial_number);
    println!("Issuer:        {}", result.issuer);
    println!("Expiry:        {}", result.not_after);
    println!("Firmware Hash: {}", result.firmware_sha256);

    // Report telemetry to DigiCert DTM
    km.report_telemetry(digicert_iot::Telemetry {
        memory_kb: 12,
        cpu_mhz:   24,
        cert:      result.into(),
        uptime_s:  44_755_200, // 518 days
    })?;

    Ok(())
}`,
    java: `import com.digicert.iot.KernelModule;
import com.digicert.iot.CertProbe;
import com.digicert.iot.CertResult;
import com.digicert.iot.Telemetry;
import com.digicert.iot.Transport;

public class BrownfieldDiscovery {
    public static void main(String[] args) throws Exception {
        // Initialize the lightweight kernel module
        KernelModule km = KernelModule.builder()
            .endpoint("dtm.digicert.com")
            .deviceId("hvac-ctrl-unit-19")
            .transport(Transport.ETHERNET)
            .authToken("<bootstrap_token>")
            .build();

        // Probe local certificate store
        CertProbe probe = new CertProbe(km);
        CertResult result = probe.scan();

        System.out.printf("Cert Status:   %s%n", result.getStatus());
        System.out.printf("Algorithm:     %s%n", result.getAlgorithm());
        System.out.printf("Serial:        %s%n", result.getSerialNumber());
        System.out.printf("Issuer:        %s%n", result.getIssuer());
        System.out.printf("Expiry:        %s%n", result.getNotAfter());
        System.out.printf("Firmware Hash: %s%n", result.getFirmwareSha256());

        // Report telemetry to DigiCert DTM
        km.reportTelemetry(Telemetry.builder()
            .memoryKb(48)
            .cpuMhz(64)
            .cert(result)
            .build());

        km.close();
    }
}`,
    node: `import { KernelModule, CertProbe, Transport } from '@digicert/iot-sdk';

async function main() {
  // Initialize the lightweight kernel module
  const km = new KernelModule({
    endpoint:  'dtm.digicert.com',
    deviceId:  'patient-tag-209',
    transport: Transport.BLE,
    authToken: '<bootstrap_token>',
  });

  // Probe local certificate store
  const probe = new CertProbe(km);
  const result = await probe.scan();

  console.log('Cert Status:  ', result.status);      // none | classical | hybrid | pqc
  console.log('Algorithm:    ', result.algorithm);
  console.log('Serial:       ', result.serialNumber);
  console.log('Issuer:       ', result.issuer);
  console.log('Expiry:       ', result.notAfter);
  console.log('Firmware Hash:', result.firmwareSha256);

  // Report telemetry to DigiCert DTM
  await km.reportTelemetry({
    memoryKb: 24,
    cpuMhz:   32,
    cert:     result.toJSON(),
    uptimeS:  4_924_800, // 57 days
  });

  await km.close();
}

main().catch(console.error);`,
};

/* ── Helpers ── */
function certStatusColor(status: CertStatus) {
    switch (status) {
        case 'none': return { label: 'No Certificate', color: '#E5753C', bg: 'rgba(229,117,60,0.12)' };
        case 'classical': return { label: 'Classical', color: 'var(--theme-text-muted)', bg: 'var(--theme-card-inner)' };
        case 'hybrid': return { label: 'Hybrid', color: 'var(--theme-text-secondary)', bg: 'var(--theme-card-inner)' };
        case 'pqc': return { label: 'PQC Ready', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' };
    }
}

function riskColor(score: number) {
    if (score >= 90) return '#ef4444';
    if (score >= 70) return '#E5753C';
    if (score >= 50) return '#eab308';
    return '#22c55e';
}

export default function KernelModulePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDevice, setSelectedDevice] = useState<typeof brownfieldDevices[0] | null>(null);
    const [activeSDK, setActiveSDK] = useState('python');
    const [sdkExpanded, setSdkExpanded] = useState(false);
    const [scanningDevice, setScanningDevice] = useState<string | null>(null);
    const [copiedSnippet, setCopiedSnippet] = useState(false);

    const noCertDevices = brownfieldDevices.filter(d => d.certStatus === 'none');
    const classicalDevices = brownfieldDevices.filter(d => d.certStatus === 'classical');
    const hybridDevices = brownfieldDevices.filter(d => d.certStatus === 'hybrid');
    const pqcDevices = brownfieldDevices.filter(d => d.certStatus === 'pqc');
    const securedDevices = [...hybridDevices, ...pqcDevices];
    const totalBrownfield = brownfieldDevices.length;
    const kmAgents = kernelAgents.filter(a => a.agentType === 'kernelModule');

    const filteredDevices = brownfieldDevices.filter(d =>
        d.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.ip.includes(searchQuery) ||
        d.mac.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    function handleScan(deviceId: string) {
        setScanningDevice(deviceId);
        setTimeout(() => {
            setScanningDevice(null);
            const device = brownfieldDevices.find(d => d.id === deviceId);
            if (device) setSelectedDevice(device);
        }, 1500);
    }

    function handleCopy() {
        navigator.clipboard.writeText(sdkSnippets[activeSDK]);
        setCopiedSnippet(true);
        setTimeout(() => setCopiedSnippet(false), 2000);
    }

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
                            >
                                <Cpu className="w-5 h-5" style={{ color: 'var(--theme-text-secondary)' }} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>
                                    Kernel Module + SDK
                                </h1>
                                <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>
                                    Brownfield device discovery — certificates, telemetry & identity for constrained hardware
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                        style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-medium" style={{ color: 'var(--theme-text-secondary)' }}>
                            {kmAgents.length} Kernel Modules Active
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* KPI Metrics */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-4 gap-4"
            >
                {[
                    { label: 'Brownfield Discovered', value: totalBrownfield, icon: HardDrive, accent: 'var(--theme-text-secondary)' },
                    { label: 'No Certificate', value: noCertDevices.length, icon: Unlock, accent: '#E5753C' },
                    { label: 'Classical (At Risk)', value: classicalDevices.length, icon: AlertTriangle, accent: '#eab308' },
                    { label: 'Secured (Hybrid + PQC)', value: securedDevices.length, icon: CheckCircle2, accent: '#22c55e' },
                ].map(({ label, value, icon: Icon, accent }) => (
                    <div
                        key={label}
                        className="rounded-2xl p-5"
                        style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <Icon className="w-3.5 h-3.5" style={{ color: accent }} />
                            <span className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>{label}</span>
                        </div>
                        <span className="text-3xl font-bold" style={{ color: 'var(--theme-text)' }}>{value}</span>
                    </div>
                ))}
            </motion.div>

            {/* Cert Status Breakdown Bar */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl p-5"
                style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
            >
                <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>
                        Brownfield Certificate Coverage
                    </div>
                    <div className="flex gap-4">
                        {[
                            { label: 'No Cert', count: noCertDevices.length, color: '#E5753C' },
                            { label: 'Classical', count: classicalDevices.length, color: 'var(--theme-text-muted)' },
                            { label: 'Hybrid', count: hybridDevices.length, color: '#60a5fa' },
                            { label: 'PQC', count: pqcDevices.length, color: '#22c55e' },
                        ].map(s => (
                            <div key={s.label} className="flex items-center gap-1.5 text-[10px]" style={{ color: 'var(--theme-text-muted)' }}>
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                                {s.label}: {s.count}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="h-3 rounded-full overflow-hidden flex" style={{ backgroundColor: 'var(--theme-bar-bg)' }}>
                    <motion.div
                        className="h-full"
                        style={{ backgroundColor: '#E5753C' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(noCertDevices.length / totalBrownfield) * 100}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                    />
                    <motion.div
                        className="h-full"
                        style={{ backgroundColor: 'var(--theme-text-muted)' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(classicalDevices.length / totalBrownfield) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                    />
                    <motion.div
                        className="h-full"
                        style={{ backgroundColor: '#60a5fa' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(hybridDevices.length / totalBrownfield) * 100}%` }}
                        transition={{ duration: 1, delay: 0.7 }}
                    />
                    <motion.div
                        className="h-full"
                        style={{ backgroundColor: '#22c55e' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(pqcDevices.length / totalBrownfield) * 100}%` }}
                        transition={{ duration: 1, delay: 0.9 }}
                    />
                </div>
                <div className="flex justify-between mt-2 text-[10px]" style={{ color: 'var(--theme-text-dim)' }}>
                    <span>{Math.round((noCertDevices.length / totalBrownfield) * 100)}% uncredentialed · {Math.round((securedDevices.length / totalBrownfield) * 100)}% secured</span>
                    <span>{totalBrownfield} brownfield devices scanned</span>
                </div>
            </motion.div>

            {/* Search + Device Table */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="rounded-2xl overflow-hidden"
                style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
            >
                {/* Table header */}
                <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--theme-card-border)' }}>
                    <div>
                        <div className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>
                            Brownfield Device Inventory
                        </div>
                        <div className="text-[11px]" style={{ color: 'var(--theme-text-muted)' }}>
                            Devices discovered via Kernel Module telemetry — click any row to inspect
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div
                            className="flex items-center gap-2 px-3 py-2 rounded-lg"
                            style={{ backgroundColor: 'var(--theme-bg)', border: '1px solid var(--theme-card-border)' }}
                        >
                            <Search className="w-3.5 h-3.5" style={{ color: 'var(--theme-text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Search hostname, IP, MAC, OEM…"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="bg-transparent text-xs outline-none w-56"
                                style={{ color: 'var(--theme-text)' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr>
                                {['Device / Host', 'IP Address', 'OEM', 'Protocol', 'Cert Status', 'Algorithm', 'Risk', 'Actions'].map(h => (
                                    <th
                                        key={h}
                                        className="text-left text-[10px] font-semibold uppercase tracking-wider px-5 py-3"
                                        style={{ color: 'var(--theme-text-dim)', borderBottom: '1px solid var(--theme-card-border)' }}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDevices.map((device, i) => {
                                const certBadge = certStatusColor(device.certStatus);
                                const scanning = scanningDevice === device.id;
                                const isSelected = selectedDevice?.id === device.id;
                                return (
                                    <motion.tr
                                        key={device.id}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + i * 0.04 }}
                                        onClick={() => setSelectedDevice(device)}
                                        className="cursor-pointer transition-colors"
                                        style={{
                                            borderBottom: '1px solid var(--theme-card-border)',
                                            backgroundColor: isSelected ? 'var(--theme-card-inner)' : 'transparent',
                                        }}
                                    >
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <Cpu className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--theme-text-secondary)' }} />
                                                <div>
                                                    <div className="text-xs font-medium" style={{ color: 'var(--theme-text)' }}>{device.hostname}</div>
                                                    <div className="text-[10px]" style={{ color: 'var(--theme-text-dim)' }}>{device.connection}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="text-[11px] font-mono" style={{ color: 'var(--theme-text-muted)' }}>{device.ip}</span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="text-[11px]" style={{ color: 'var(--theme-text-secondary)' }}>{device.manufacturer}</span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--theme-card-inner)', color: 'var(--theme-text-muted)' }}>
                                                {device.protocol}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span
                                                className="text-[10px] font-semibold px-2 py-0.5 rounded"
                                                style={{ backgroundColor: certBadge.bg, color: certBadge.color }}
                                            >
                                                {certBadge.label}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="text-[11px]" style={{ color: device.currentAlgo === 'None' ? '#E5753C' : 'var(--theme-text-secondary)' }}>
                                                {device.currentAlgo === 'None' ? '—' : device.currentAlgo}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-1.5">
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: riskColor(device.riskScore) }}
                                                />
                                                <span className="text-[11px] font-medium" style={{ color: riskColor(device.riskScore) }}>
                                                    {device.riskScore}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <button
                                                onClick={e => { e.stopPropagation(); handleScan(device.id); }}
                                                className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-md transition-colors"
                                                style={{
                                                    backgroundColor: 'var(--theme-card-inner)',
                                                    color: 'var(--theme-text-secondary)',
                                                }}
                                                disabled={scanning}
                                            >
                                                {scanning ? (
                                                    <><RefreshCw className="w-3 h-3 animate-spin" /> Scanning…</>
                                                ) : (
                                                    <><Eye className="w-3 h-3" /> Inspect</>
                                                )}
                                            </button>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div
                    className="px-5 py-3 flex items-center gap-2 text-[10px]"
                    style={{ borderTop: '1px solid var(--theme-card-border)', color: 'var(--theme-text-dim)' }}
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live feed · Kernel Module telemetry every 5s · {filteredDevices.length} devices shown
                </div>
            </motion.div>

            {/* Device Detail Panel */}
            <AnimatePresence>
                {selectedDevice && (
                    <motion.div
                        key="device-detail"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-2xl overflow-hidden"
                        style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
                    >
                        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--theme-card-border)' }}>
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: 'var(--theme-card-inner)' }}
                                >
                                    <Fingerprint className="w-4 h-4" style={{ color: 'var(--theme-text-secondary)' }} />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>
                                        Device Identity — {selectedDevice.hostname}
                                    </div>
                                    <div className="text-[11px]" style={{ color: 'var(--theme-text-muted)' }}>
                                        Discovered via {selectedDevice.discoveredVia} · Last seen {selectedDevice.lastSeen}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedDevice(null)}
                                className="text-[10px] px-2 py-1 rounded-md transition-colors"
                                style={{ backgroundColor: 'var(--theme-card-inner)', color: 'var(--theme-text-muted)' }}
                            >
                                Close
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-0">
                            {/* Hardware Info */}
                            <div className="p-5" style={{ borderRight: '1px solid var(--theme-card-border)' }}>
                                <div className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--theme-text-dim)' }}>
                                    Hardware & Network
                                </div>
                                <div className="space-y-2.5">
                                    {[
                                        { icon: Server, label: 'Manufacturer', value: `${selectedDevice.manufacturer} ${selectedDevice.model}` },
                                        { icon: HardDrive, label: 'Firmware', value: selectedDevice.firmware },
                                        { icon: Activity, label: 'Memory / CPU', value: `${selectedDevice.memoryKB} KB / ${selectedDevice.cpuMHz} MHz` },
                                        { icon: Wifi, label: 'Connection', value: selectedDevice.connection },
                                        { icon: Clock, label: 'Uptime', value: selectedDevice.uptime },
                                        { icon: Cpu, label: 'Protocol', value: selectedDevice.protocol },
                                    ].map(({ icon: Icon, label, value }) => (
                                        <div key={label} className="flex items-start gap-2">
                                            <Icon className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: 'var(--theme-text-dim)' }} />
                                            <div>
                                                <div className="text-[10px]" style={{ color: 'var(--theme-text-dim)' }}>{label}</div>
                                                <div className="text-xs font-medium" style={{ color: 'var(--theme-text-secondary)' }}>{value}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Certificate Info */}
                            <div className="p-5" style={{ borderRight: '1px solid var(--theme-card-border)' }}>
                                <div className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--theme-text-dim)' }}>
                                    Certificate Details
                                </div>
                                <div className="space-y-2.5">
                                    {[
                                        {
                                            icon: selectedDevice.certStatus === 'none' ? Unlock : Lock, label: 'Status',
                                            value: certStatusColor(selectedDevice.certStatus).label,
                                            color: certStatusColor(selectedDevice.certStatus).color
                                        },
                                        { icon: FileKey, label: 'Algorithm', value: selectedDevice.currentAlgo === 'None' ? 'No crypto identity' : selectedDevice.currentAlgo },
                                        { icon: Fingerprint, label: 'Serial Number', value: selectedDevice.serialNumber },
                                        { icon: Shield, label: 'Issuer', value: selectedDevice.issuer },
                                        { icon: Clock, label: 'Expiry', value: selectedDevice.expiry },
                                        { icon: Terminal, label: 'MAC Address', value: selectedDevice.mac },
                                    ].map(({ icon: Icon, label, value, color }) => (
                                        <div key={label} className="flex items-start gap-2">
                                            <Icon className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: 'var(--theme-text-dim)' }} />
                                            <div>
                                                <div className="text-[10px]" style={{ color: 'var(--theme-text-dim)' }}>{label}</div>
                                                <div className="text-xs font-medium" style={{ color: color || 'var(--theme-text-secondary)' }}>{value}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Risk & Recommendation */}
                            <div className="p-5">
                                <div className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--theme-text-dim)' }}>
                                    Risk Assessment & Action
                                </div>
                                <div className="space-y-3">
                                    <div
                                        className="rounded-xl p-3"
                                        style={{ backgroundColor: 'var(--theme-card-inner)' }}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px]" style={{ color: 'var(--theme-text-dim)' }}>Risk Score</span>
                                            <span className="text-lg font-bold" style={{ color: riskColor(selectedDevice.riskScore) }}>
                                                {selectedDevice.riskScore}/100
                                            </span>
                                        </div>
                                        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--theme-bar-bg)' }}>
                                            <div
                                                className="h-full rounded-full transition-all"
                                                style={{ width: `${selectedDevice.riskScore}%`, backgroundColor: riskColor(selectedDevice.riskScore) }}
                                            />
                                        </div>
                                    </div>

                                    <div className="text-xs leading-relaxed" style={{ color: 'var(--theme-text-muted)' }}>
                                        {selectedDevice.certStatus === 'none' ? (
                                            <>
                                                <span style={{ color: '#E5753C' }} className="font-semibold">⚠ No cryptographic identity.</span>{' '}
                                                This device has no TLS certificate, no key material, and no firmware signature. It is invisible to your PKI and represents your highest unknown risk.
                                            </>
                                        ) : selectedDevice.riskScore >= 85 ? (
                                            <>
                                                <span style={{ color: '#ef4444' }} className="font-semibold">⚠ Critical:</span>{' '}
                                                Running {selectedDevice.currentAlgo} — disallowed under CNSA 2.0. Certificate expires {selectedDevice.expiry}. Immediate migration to ML-KEM-512 + FN-DSA-512 recommended.
                                            </>
                                        ) : (
                                            <>
                                                <span style={{ color: '#eab308' }} className="font-semibold">△ At Risk:</span>{' '}
                                                Classical algorithm ({selectedDevice.currentAlgo}) will be sunset by 2030. Plan hybrid certificate transition via Kernel Module SDK.
                                            </>
                                        )}
                                    </div>

                                    <div className="flex gap-2 mt-2">
                                        <button
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-semibold transition-colors"
                                            style={{ backgroundColor: 'var(--theme-text)', color: 'var(--theme-bg)' }}
                                        >
                                            <Download className="w-3 h-3" />
                                            Export Report
                                        </button>
                                        <button
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-medium transition-colors"
                                            style={{ backgroundColor: 'var(--theme-card-inner)', color: 'var(--theme-text-secondary)', border: '1px solid var(--theme-card-border)' }}
                                        >
                                            <ArrowRight className="w-3 h-3" />
                                            Start Migration
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SDK Integration */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl overflow-hidden"
                style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
            >
                <button
                    onClick={() => setSdkExpanded(!sdkExpanded)}
                    className="w-full flex items-center justify-between px-5 py-4"
                    style={{ borderBottom: sdkExpanded ? '1px solid var(--theme-card-border)' : 'none' }}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: 'var(--theme-card-inner)' }}
                        >
                            <Terminal className="w-4 h-4" style={{ color: 'var(--theme-text-secondary)' }} />
                        </div>
                        <div className="text-left">
                            <div className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>
                                SDK Integration — Find Certificates on Brownfield Devices
                            </div>
                            <div className="text-[11px]" style={{ color: 'var(--theme-text-muted)' }}>
                                Embed cert discovery into existing firmware · Python, C, Go, Rust, Java, Node.js · ≥ 8KB RAM
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                            {Object.keys(sdkSnippets).map(lang => (
                                <button
                                    key={lang}
                                    onClick={e => { e.stopPropagation(); setActiveSDK(lang); if (!sdkExpanded) setSdkExpanded(true); }}
                                    className="text-[10px] font-mono px-2 py-1 rounded-md transition-colors"
                                    style={{
                                        backgroundColor: activeSDK === lang ? 'var(--theme-card-inner)' : 'transparent',
                                        color: activeSDK === lang ? 'var(--theme-text)' : 'var(--theme-text-dim)',
                                        border: activeSDK === lang ? '1px solid var(--theme-card-border)' : '1px solid transparent',
                                    }}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                        {sdkExpanded ? (
                            <ChevronUp className="w-4 h-4" style={{ color: 'var(--theme-text-muted)' }} />
                        ) : (
                            <ChevronDown className="w-4 h-4" style={{ color: 'var(--theme-text-muted)' }} />
                        )}
                    </div>
                </button>

                <AnimatePresence>
                    {sdkExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                        >
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2 text-[10px]" style={{ color: 'var(--theme-text-dim)' }}>
                                        <Terminal className="w-3 h-3" />
                                        digicert-iot-sdk / cert-probe / {activeSDK}
                                    </div>
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md transition-colors"
                                        style={{ backgroundColor: 'var(--theme-card-inner)', color: 'var(--theme-text-muted)' }}
                                    >
                                        {copiedSnippet ? (
                                            <><CheckCircle2 className="w-3 h-3" style={{ color: '#22c55e' }} /> Copied!</>
                                        ) : (
                                            <><Copy className="w-3 h-3" /> Copy</>
                                        )}
                                    </button>
                                </div>
                                <pre
                                    className="text-[11px] leading-relaxed p-4 rounded-xl overflow-x-auto font-mono"
                                    style={{ backgroundColor: 'var(--theme-bg)', color: 'var(--theme-text-secondary)', border: '1px solid var(--theme-card-border)' }}
                                >
                                    {sdkSnippets[activeSDK]}
                                </pre>
                                <div className="mt-3 grid grid-cols-3 gap-3">
                                    {[
                                        { label: 'Minimum RAM', value: '8 KB', detail: 'No OS required' },
                                        { label: 'Transports', value: 'UART / BLE / NB-IoT', detail: 'Auto-detected' },
                                        { label: 'Cert Formats', value: 'X.509, PKCS#7, DER, PEM', detail: 'Auto-parsed' },
                                    ].map(({ label, value, detail }) => (
                                        <div
                                            key={label}
                                            className="rounded-xl p-3"
                                            style={{ backgroundColor: 'var(--theme-card-inner)' }}
                                        >
                                            <div className="text-[10px]" style={{ color: 'var(--theme-text-dim)' }}>{label}</div>
                                            <div className="text-xs font-semibold" style={{ color: 'var(--theme-text)' }}>{value}</div>
                                            <div className="text-[10px]" style={{ color: 'var(--theme-text-muted)' }}>{detail}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* How it works */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <h2 className="text-base font-bold mb-4" style={{ color: 'var(--theme-text)' }}>
                    How Brownfield Discovery Works
                </h2>
                <div className="grid grid-cols-4 gap-4">
                    {[
                        {
                            step: '01', title: 'Deploy Module',
                            detail: 'Flash the lightweight kernel module onto constrained devices. ≥ 8KB RAM. No OS needed. Works over UART, BLE, or NB-IoT.',
                            icon: Download,
                        },
                        {
                            step: '02', title: 'Probe Certificates',
                            detail: 'The module scans local certificate stores — X.509, DER, PEM. Reports cert status, algorithm, serial, issuer, and expiry to DTM.',
                            icon: Search,
                        },
                        {
                            step: '03', title: 'Report Telemetry',
                            detail: 'RAM, CPU, firmware hash, uptime, and heartbeat streamed to DigiCert Device Trust Manager. Battery-efficient chunked uploads.',
                            icon: Activity,
                        },
                        {
                            step: '04', title: 'Issue PQC Cert',
                            detail: 'DTM provisions ML-KEM-512 + FN-DSA-512 certificates for constrained hardware. Hybrid mode available for backward compatibility.',
                            icon: Shield,
                        },
                    ].map(({ step, title, detail, icon: Icon }, i) => (
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.55 + i * 0.08 }}
                            className="rounded-2xl p-5"
                            style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-2xl font-black" style={{ color: 'var(--theme-text-dim)' }}>{step}</span>
                                <Icon className="w-4 h-4" style={{ color: 'var(--theme-text-muted)' }} />
                            </div>
                            <div className="text-sm font-bold mb-2" style={{ color: 'var(--theme-text)' }}>{title}</div>
                            <div className="text-xs leading-relaxed" style={{ color: 'var(--theme-text-muted)' }}>{detail}</div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Risk Score Methodology */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="rounded-2xl overflow-hidden"
                style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
            >
                <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--theme-card-border)' }}>
                    <div className="flex items-center gap-3">
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: 'var(--theme-card-inner)' }}
                        >
                            <Activity className="w-4 h-4" style={{ color: 'var(--theme-text-secondary)' }} />
                        </div>
                        <div>
                            <div className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>
                                Risk Score Methodology
                            </div>
                            <div className="text-[11px]" style={{ color: 'var(--theme-text-muted)' }}>
                                How the 0–100 risk score is calculated for each brownfield device
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-5">
                    <div className="text-xs leading-relaxed mb-4" style={{ color: 'var(--theme-text-muted)' }}>
                        Each device receives a composite risk score from <strong style={{ color: 'var(--theme-text)' }}>0</strong> (fully secured) to <strong style={{ color: 'var(--theme-text)' }}>100</strong> (maximum risk). The score is computed from five weighted factors assessed during Kernel Module telemetry:
                    </div>
                    <div className="grid grid-cols-5 gap-3 mb-4">
                        {[
                            {
                                factor: 'Certificate Status',
                                weight: '35%',
                                detail: 'No cert = 35pts. Classical (RSA/ECDSA) = 15–25pts based on key strength. Hybrid = 5pts. PQC = 0pts.',
                                color: '#E5753C',
                            },
                            {
                                factor: 'Algorithm Strength',
                                weight: '25%',
                                detail: 'RSA-1024 = 25pts. RSA-2048 = 18pts. ECDSA P-256 = 12pts. ML-KEM/FN-DSA = 0pts.',
                                color: '#eab308',
                            },
                            {
                                factor: 'Certificate Expiry',
                                weight: '15%',
                                detail: 'Expired = 15pts. <90 days = 10pts. <1 year = 5pts. >1 year = 0pts. No cert = 15pts.',
                                color: '#ef4444',
                            },
                            {
                                factor: 'Firmware Age',
                                weight: '15%',
                                detail: 'Uptime >1yr without update = 15pts. >6mo = 10pts. >90d = 5pts. <90d = 0pts.',
                                color: '#a855f7',
                            },
                            {
                                factor: 'Device Capability',
                                weight: '10%',
                                detail: 'Cannot run PQC (<16KB RAM) = 10pts. Constrained (16–64KB) = 5pts. Capable (>64KB) = 0pts.',
                                color: '#60a5fa',
                            },
                        ].map(({ factor, weight, detail, color }) => (
                            <div
                                key={factor}
                                className="rounded-xl p-3"
                                style={{ backgroundColor: 'var(--theme-card-inner)' }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-semibold" style={{ color }}>{weight}</span>
                                </div>
                                <div className="text-xs font-semibold mb-1" style={{ color: 'var(--theme-text)' }}>{factor}</div>
                                <div className="text-[10px] leading-relaxed" style={{ color: 'var(--theme-text-muted)' }}>{detail}</div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-[10px]" style={{ color: 'var(--theme-text-dim)' }}>Score ranges:</div>
                        {[
                            { range: '90–100', label: 'Critical', color: '#ef4444' },
                            { range: '70–89', label: 'High', color: '#E5753C' },
                            { range: '50–69', label: 'Medium', color: '#eab308' },
                            { range: '20–49', label: 'Low', color: '#60a5fa' },
                            { range: '0–19', label: 'Secured', color: '#22c55e' },
                        ].map(({ range, label, color }) => (
                            <div key={range} className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                                <span className="text-[10px] font-medium" style={{ color }}>{range}</span>
                                <span className="text-[10px]" style={{ color: 'var(--theme-text-dim)' }}>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
