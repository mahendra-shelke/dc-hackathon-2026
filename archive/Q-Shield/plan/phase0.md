Project Context:
I am building "Q-Shield," a hackathon project for DigiCert. It is a Post-Quantum Cryptography (PQC) Orchestrator for IoT.

The Architecture:

Legacy MQTT Broker: A standard Mosquitto instance (Port 1883) that knows nothing about PQC.

Smart Proxy (Go): A "Sidecar" that sits in front of the broker.

Listener A (Port 8883): Accepts PQC-secured connections (simulating Kyber/Dilithium).

Listener B (Port 1884): Accepts Legacy ECDSA connections.

Function: It terminates these connections, measures metrics (latency, bandwidth), and forwards the plain traffic to the Legacy Broker (Port 1883).

IoT Fleet (Python): Scripts that simulate devices (Cortex M7 vs M0+) by adding artificial delays.

Dashboard (React): Visualizes the metrics and allows me to trigger a "Quantum Attack" simulation.

Key Goal: Demonstrate how legacy systems can become Quantum-Safe instantly using this proxy, while visualizing the hardware cost (battery/CPU) of PQC.