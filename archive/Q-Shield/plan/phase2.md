Create the Go (Golang) code for the proxy service. I need a main.go that does the following:

1. Setup: Import github.com/eclipse/paho.mqtt.golang and github.com/gorilla/websocket.

2. Listeners: Start two TCP listeners:

:1884 for "Legacy" traffic.

:8883 for "PQC" traffic.

3. Proxy Logic:

Accept incoming connections.

Connect to the backend Mosquitto broker at mosquitto:1883.

Pipe data between the client and the broker.

4. Metrics Engine (Crucial):

Measure the time taken for the first 500 bytes (simulating a handshake).

Count the total bytes transferred.

Calculate "Overhead": If it came from Port 8883, add a multiplier to simulate PQC packet bloat (e.g., +2.4KB overhead).

5. Dashboard Stream:

Start a WebSocket server on :8080.

Broadcast a JSON object every second containing: { "pqc_latency": int, "legacy_latency": int, "pqc_bandwidth": int, "legacy_bandwidth": int, "attack_active": bool }.

6. Attack Simulation:

Add a variable isUnderAttack.

If isUnderAttack is true, corrupt the bytes flowing through the Legacy (1884) listener (replace them with random garbage) before sending to the broker. Keep the PQC (8883) listener clean.

Add an HTTP endpoint /toggle-attack to switch this variable.