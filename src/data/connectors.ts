import type {
  ConnectorConfig,
  DiscoveredDevice,
  DeviceGroup,
  RiskLevel,
} from '../types';
import { riskLevelFromScore } from '../utils';

export const defaultConnectors: ConnectorConfig[] = [
  {
    id: 'azure-iot',
    type: 'azure-iot',
    name: 'Azure IoT Hub',
    icon: 'Cloud',
    status: 'disconnected',
    endpoint: 'iot-fleet.azure-devices.net',
    protocol: 'MQTT / AMQP',
    devicesDiscovered: 0,
    color: '#0078D4',
  },
  {
    id: 'aws-iot',
    type: 'aws-iot',
    name: 'AWS IoT Core',
    icon: 'CloudCog',
    status: 'disconnected',
    endpoint: 'a1b2c3-ats.iot.us-east-1.amazonaws.com',
    protocol: 'MQTT / HTTPS',
    devicesDiscovered: 0,
    color: '#FF9900',
  },
  {
    id: 'scada-opcua',
    type: 'scada-opcua',
    name: 'SCADA / OPC-UA',
    icon: 'Radio',
    status: 'disconnected',
    endpoint: 'opcua://scada-gw.plant.local:4840',
    protocol: 'OPC-UA',
    devicesDiscovered: 0,
    color: '#4CAF50',
  },
  {
    id: 'matter-thread',
    type: 'matter-thread',
    name: 'Matter / Thread',
    icon: 'Wifi',
    status: 'disconnected',
    endpoint: '192.168.1.1:5540',
    protocol: 'Matter / Thread',
    devicesDiscovered: 0,
    color: '#742EAA',
  },
  {
    id: 'custom-api',
    type: 'custom-api',
    name: 'Custom REST API',
    icon: 'Globe',
    status: 'disconnected',
    endpoint: 'https://fleet-api.company.com/v2/devices',
    protocol: 'REST / HTTPS',
    devicesDiscovered: 0,
    color: '#64748B',
  },
];

export const simulatedDiscoveryDevices: DiscoveredDevice[] = [
  // Azure IoT Hub — enterprise & medical devices
  { id: 'az-01', connectorId: 'azure-iot', ipAddress: '10.0.1.14', hostname: 'patient-monitor-01', deviceType: 'Patient Monitor', manufacturer: 'Philips', firmwareVersion: '4.2.1', currentAlgorithm: 'RSA-2048', keySize: 2048, industry: 'medical', deviceClass: 'mid-range' },
  { id: 'az-02', connectorId: 'azure-iot', ipAddress: '10.0.1.22', hostname: 'infusion-pump-03', deviceType: 'Infusion Pump', manufacturer: 'Baxter', firmwareVersion: '3.8.0', currentAlgorithm: 'RSA-2048', keySize: 2048, industry: 'medical', deviceClass: 'constrained' },
  { id: 'az-03', connectorId: 'azure-iot', ipAddress: '10.0.1.35', hostname: 'mri-scanner-01', deviceType: 'MRI Scanner', manufacturer: 'Siemens Healthineers', firmwareVersion: '7.1.3', currentAlgorithm: 'ECDSA-P256', keySize: 256, industry: 'medical', deviceClass: 'powerful' },
  { id: 'az-04', connectorId: 'azure-iot', ipAddress: '10.0.1.41', hostname: 'wearable-ecg-12', deviceType: 'Wearable ECG', manufacturer: 'Medtronic', firmwareVersion: '2.0.4', currentAlgorithm: 'ECDSA-P256', keySize: 256, industry: 'medical', deviceClass: 'constrained' },
  { id: 'az-05', connectorId: 'azure-iot', ipAddress: '10.0.2.10', hostname: 'ip-cam-lobby-01', deviceType: 'IP Camera', manufacturer: 'Axis', firmwareVersion: '11.4.2', currentAlgorithm: 'RSA-2048', keySize: 2048, industry: 'enterprise', deviceClass: 'mid-range' },
  { id: 'az-06', connectorId: 'azure-iot', ipAddress: '10.0.2.15', hostname: 'access-ctrl-fl2', deviceType: 'Access Controller', manufacturer: 'HID Global', firmwareVersion: '6.1.0', currentAlgorithm: 'ECDSA-P256', keySize: 256, industry: 'enterprise', deviceClass: 'mid-range' },
  { id: 'az-07', connectorId: 'azure-iot', ipAddress: '10.0.2.20', hostname: 'network-sw-core', deviceType: 'Network Switch', manufacturer: 'Cisco', firmwareVersion: '17.9.4', currentAlgorithm: 'ECDSA-P384', keySize: 384, industry: 'enterprise', deviceClass: 'powerful' },
  { id: 'az-08', connectorId: 'azure-iot', ipAddress: '10.0.1.50', hostname: 'blood-analyzer-02', deviceType: 'Blood Analyzer', manufacturer: 'Abbott', firmwareVersion: '5.3.1', currentAlgorithm: 'RSA-2048', keySize: 2048, industry: 'medical', deviceClass: 'mid-range' },

  // AWS IoT Core — smart-home & industrial devices
  { id: 'aws-01', connectorId: 'aws-iot', ipAddress: '10.1.0.5', hostname: 'smart-lock-front', deviceType: 'Smart Lock', manufacturer: 'Yale', firmwareVersion: '3.2.1', currentAlgorithm: 'ECDSA-P256', keySize: 256, industry: 'smart-home', deviceClass: 'constrained' },
  { id: 'aws-02', connectorId: 'aws-iot', ipAddress: '10.1.0.12', hostname: 'thermostat-living', deviceType: 'Smart Thermostat', manufacturer: 'Nest', firmwareVersion: '5.9.3', currentAlgorithm: 'ECDSA-P256', keySize: 256, industry: 'smart-home', deviceClass: 'constrained' },
  { id: 'aws-03', connectorId: 'aws-iot', ipAddress: '10.1.0.18', hostname: 'smart-hub-main', deviceType: 'Smart Hub', manufacturer: 'Samsung SmartThings', firmwareVersion: '4.1.0', currentAlgorithm: 'ECDSA-P384', keySize: 384, industry: 'smart-home', deviceClass: 'mid-range' },
  { id: 'aws-04', connectorId: 'aws-iot', ipAddress: '10.1.0.25', hostname: 'light-strip-kit1', deviceType: 'Smart Lighting', manufacturer: 'Philips Hue', firmwareVersion: '1.88.1', currentAlgorithm: 'AES-128-PSK', keySize: 128, industry: 'smart-home', deviceClass: 'constrained' },
  { id: 'aws-05', connectorId: 'aws-iot', ipAddress: '10.1.1.10', hostname: 'conveyor-ctrl-01', deviceType: 'Conveyor Controller', manufacturer: 'Rockwell', firmwareVersion: '8.2.0', currentAlgorithm: 'RSA-2048', keySize: 2048, industry: 'industrial', deviceClass: 'mid-range' },
  { id: 'aws-06', connectorId: 'aws-iot', ipAddress: '10.1.1.15', hostname: 'temp-sensor-bay3', deviceType: 'Temperature Sensor', manufacturer: 'Honeywell', firmwareVersion: '2.1.4', currentAlgorithm: 'AES-128-PSK', keySize: 128, industry: 'industrial', deviceClass: 'constrained' },
  { id: 'aws-07', connectorId: 'aws-iot', ipAddress: '10.1.1.20', hostname: 'edge-node-plant2', deviceType: 'Edge Compute Node', manufacturer: 'Dell', firmwareVersion: '3.5.1', currentAlgorithm: 'ECDSA-P256', keySize: 256, industry: 'industrial', deviceClass: 'powerful' },
  { id: 'aws-08', connectorId: 'aws-iot', ipAddress: '10.1.0.30', hostname: 'doorbell-cam-01', deviceType: 'Video Doorbell', manufacturer: 'Ring', firmwareVersion: '3.48.2', currentAlgorithm: 'ECDSA-P256', keySize: 256, industry: 'smart-home', deviceClass: 'constrained' },

  // SCADA / OPC-UA — industrial devices
  { id: 'sc-01', connectorId: 'scada-opcua', ipAddress: '10.2.0.100', hostname: 'plc-line1-main', deviceType: 'PLC', manufacturer: 'Siemens', firmwareVersion: '4.5.2', currentAlgorithm: 'RSA-1024', keySize: 1024, industry: 'industrial', deviceClass: 'constrained' },
  { id: 'sc-02', connectorId: 'scada-opcua', ipAddress: '10.2.0.101', hostname: 'plc-line2-aux', deviceType: 'PLC', manufacturer: 'Allen-Bradley', firmwareVersion: '33.011', currentAlgorithm: 'RSA-1024', keySize: 1024, industry: 'industrial', deviceClass: 'constrained' },
  { id: 'sc-03', connectorId: 'scada-opcua', ipAddress: '10.2.0.110', hostname: 'scada-gw-north', deviceType: 'SCADA Gateway', manufacturer: 'Schneider Electric', firmwareVersion: '6.0.8', currentAlgorithm: 'RSA-2048', keySize: 2048, industry: 'industrial', deviceClass: 'mid-range' },
  { id: 'sc-04', connectorId: 'scada-opcua', ipAddress: '10.2.0.115', hostname: 'hmi-panel-ctrl', deviceType: 'HMI Panel', manufacturer: 'ABB', firmwareVersion: '5.2.0', currentAlgorithm: 'RSA-2048', keySize: 2048, industry: 'industrial', deviceClass: 'mid-range' },
  { id: 'sc-05', connectorId: 'scada-opcua', ipAddress: '10.2.0.120', hostname: 'vibration-mon-01', deviceType: 'Vibration Sensor', manufacturer: 'Emerson', firmwareVersion: '2.3.1', currentAlgorithm: 'AES-128-PSK', keySize: 128, industry: 'industrial', deviceClass: 'constrained' },
  { id: 'sc-06', connectorId: 'scada-opcua', ipAddress: '10.2.0.125', hostname: 'flow-meter-tank2', deviceType: 'Flow Meter', manufacturer: 'Endress+Hauser', firmwareVersion: '3.0.7', currentAlgorithm: 'AES-128-PSK', keySize: 128, industry: 'industrial', deviceClass: 'constrained' },

  // Matter / Thread — smart-home devices
  { id: 'mt-01', connectorId: 'matter-thread', ipAddress: '10.3.0.10', hostname: 'lock-garage-01', deviceType: 'Smart Lock', manufacturer: 'Schlage', firmwareVersion: '2.4.0', currentAlgorithm: 'ECDSA-P256', keySize: 256, industry: 'smart-home', deviceClass: 'constrained' },
  { id: 'mt-02', connectorId: 'matter-thread', ipAddress: '10.3.0.11', hostname: 'thermostat-bed', deviceType: 'Smart Thermostat', manufacturer: 'Ecobee', firmwareVersion: '4.8.2', currentAlgorithm: 'ECDSA-P256', keySize: 256, industry: 'smart-home', deviceClass: 'constrained' },
  { id: 'mt-03', connectorId: 'matter-thread', ipAddress: '10.3.0.12', hostname: 'light-kitchen-01', deviceType: 'Smart Lighting', manufacturer: 'IKEA Tradfri', firmwareVersion: '2.3.093', currentAlgorithm: 'AES-128-PSK', keySize: 128, industry: 'smart-home', deviceClass: 'constrained' },
  { id: 'mt-04', connectorId: 'matter-thread', ipAddress: '10.3.0.13', hostname: 'speaker-living', deviceType: 'Smart Speaker', manufacturer: 'Apple HomePod', firmwareVersion: '18.3.1', currentAlgorithm: 'ECDSA-P256', keySize: 256, industry: 'smart-home', deviceClass: 'mid-range' },
  { id: 'mt-05', connectorId: 'matter-thread', ipAddress: '10.3.0.14', hostname: 'blinds-office-01', deviceType: 'Smart Blinds', manufacturer: 'Lutron', firmwareVersion: '1.9.0', currentAlgorithm: 'AES-128-PSK', keySize: 128, industry: 'smart-home', deviceClass: 'constrained' },
  { id: 'mt-06', connectorId: 'matter-thread', ipAddress: '10.3.0.15', hostname: 'smoke-det-hall', deviceType: 'Smoke Detector', manufacturer: 'Google Nest', firmwareVersion: '3.1.2', currentAlgorithm: 'ECDSA-P256', keySize: 256, industry: 'smart-home', deviceClass: 'constrained' },
  { id: 'mt-07', connectorId: 'matter-thread', ipAddress: '10.3.0.16', hostname: 'border-router-01', deviceType: 'Thread Border Router', manufacturer: 'Apple', firmwareVersion: '18.3.1', currentAlgorithm: 'ECDSA-P384', keySize: 384, industry: 'smart-home', deviceClass: 'mid-range' },

  // Custom REST API — automotive devices
  { id: 'cu-01', connectorId: 'custom-api', ipAddress: '10.4.0.50', hostname: 'ecu-engine-01', deviceType: 'Engine Control Unit', manufacturer: 'Bosch', firmwareVersion: '9.1.3', currentAlgorithm: 'ECDSA-P256', keySize: 256, industry: 'automotive', deviceClass: 'mid-range' },
  { id: 'cu-02', connectorId: 'custom-api', ipAddress: '10.4.0.51', hostname: 'v2x-module-03', deviceType: 'V2X Module', manufacturer: 'Qualcomm', firmwareVersion: '2.8.0', currentAlgorithm: 'ECDSA-P256', keySize: 256, industry: 'automotive', deviceClass: 'mid-range' },
  { id: 'cu-03', connectorId: 'custom-api', ipAddress: '10.4.0.52', hostname: 'telematics-unit', deviceType: 'Telematics Unit', manufacturer: 'Continental', firmwareVersion: '5.4.2', currentAlgorithm: 'RSA-2048', keySize: 2048, industry: 'automotive', deviceClass: 'powerful' },
  { id: 'cu-04', connectorId: 'custom-api', ipAddress: '10.4.0.53', hostname: 'obd-dongle-fleet', deviceType: 'OBD-II Dongle', manufacturer: 'Geotab', firmwareVersion: '1.2.0', currentAlgorithm: 'RSA-1024', keySize: 1024, industry: 'automotive', deviceClass: 'constrained' },
];

// Assessment data generated per device during TrustCore step
const assessmentPresets: Record<string, { recommendedPqc: string; riskScore: number; memoryKB: number; cpuMHz: number; firmwareUpdateCapable: boolean }> = {
  'constrained': { recommendedPqc: 'ML-DSA-44', riskScore: 78, memoryKB: 256, cpuMHz: 80, firmwareUpdateCapable: true },
  'mid-range': { recommendedPqc: 'ML-DSA-65', riskScore: 55, memoryKB: 2048, cpuMHz: 400, firmwareUpdateCapable: true },
  'powerful': { recommendedPqc: 'ML-DSA-87', riskScore: 30, memoryKB: 8192, cpuMHz: 1500, firmwareUpdateCapable: true },
  'server-class': { recommendedPqc: 'ML-DSA-87', riskScore: 15, memoryKB: 32768, cpuMHz: 3000, firmwareUpdateCapable: true },
};

// Risk overrides for specific crypto states
const cryptoRiskBonus: Record<string, number> = {
  'RSA-1024': 25,
  'AES-128-PSK': 10,
  'RSA-2048': 5,
  'ECDSA-P256': 0,
  'ECDSA-P384': -10,
};

export function generateAssessment(device: DiscoveredDevice) {
  const preset = assessmentPresets[device.deviceClass] ?? assessmentPresets['mid-range'];
  const bonus = cryptoRiskBonus[device.currentAlgorithm] ?? 0;
  const riskScore = Math.min(100, Math.max(0, preset.riskScore + bonus + Math.floor(Math.random() * 10 - 5)));
  const riskLevel: RiskLevel = riskLevelFromScore(riskScore);

  return {
    algorithmCompatibility: {
      'ML-DSA-44': device.deviceClass === 'constrained' ? 'compatible' as const : 'compatible' as const,
      'ML-DSA-65': device.deviceClass === 'constrained' ? 'partial' as const : 'compatible' as const,
      'ML-DSA-87': device.deviceClass === 'constrained' ? 'incompatible' as const : device.deviceClass === 'mid-range' ? 'partial' as const : 'compatible' as const,
    },
    firmwareUpdateCapable: device.currentAlgorithm !== 'RSA-1024',
    recommendedPqc: preset.recommendedPqc,
    riskScore,
    riskLevel,
    pqcStatus: 'not-ready' as const,
    memoryKB: preset.memoryKB + Math.floor(Math.random() * 128),
    cpuMHz: preset.cpuMHz + Math.floor(Math.random() * 50),
  };
}

/** Aggregate individual discovered devices into DeviceGroup entries for dashboard integration */
export function generateDeviceGroups(devices: DiscoveredDevice[]): DeviceGroup[] {
  const groups = new Map<string, { devices: DiscoveredDevice[]; industry: DiscoveredDevice['industry']; deviceClass: DiscoveredDevice['deviceClass'] }>();

  for (const d of devices) {
    const key = `${d.industry}-${d.deviceClass}`;
    if (!groups.has(key)) {
      groups.set(key, { devices: [], industry: d.industry, deviceClass: d.deviceClass });
    }
    groups.get(key)!.devices.push(d);
  }

  const result: DeviceGroup[] = [];
  for (const [key, group] of groups) {
    const count = group.devices.length;
    const avgRisk = group.devices.reduce((sum, d) => sum + (d.assessment?.riskScore ?? 60), 0) / count;
    const riskScore = Math.round(avgRisk);
    const hasDeployment = group.devices.some((d) => d.deployment?.status === 'verified');
    const allDeployed = group.devices.every((d) => d.deployment?.status === 'verified');

    result.push({
      id: `disc-${key}`,
      name: `Discovered ${group.deviceClass} (${group.industry})`,
      industry: group.industry,
      deviceClass: group.deviceClass,
      count,
      currentAlgorithm: group.devices[0].currentAlgorithm,
      keySize: group.devices[0].keySize,
      pqcStatus: allDeployed ? 'hybrid' : 'not-ready',
      riskLevel: riskLevelFromScore(riskScore),
      riskScore,
      firmwareUpdatable: group.devices.some((d) => d.assessment?.firmwareUpdateCapable ?? true),
      recommendedPqc: group.devices[0].assessment?.recommendedPqc ?? 'ML-DSA-65',
      migrationPhase: hasDeployment ? 'deploy-hybrid' : 'discover',
      certExpiryMonths: 6,
      dataAtRiskTB: Math.round(count * 2.5),
    });
  }

  return result;
}

/** Subnet strings for discovery log messages */
const subnets = ['10.0.1.0/24', '10.0.2.0/24', '10.1.0.0/24', '10.1.1.0/24', '10.2.0.0/24', '10.3.0.0/24', '10.4.0.0/24'];

export function getDiscoverySubnets(): string[] {
  return subnets;
}
