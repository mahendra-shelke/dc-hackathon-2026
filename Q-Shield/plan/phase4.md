Create a React component (using recharts and lucide-react for icons) for the Q-Shield Dashboard.

Features needed:

1. WebSocket Connection: Connect to ws://localhost:8080 to receive live metrics.

2. Live Charts:

A Line Chart showing "Latency" (Legacy vs. PQC) over time.

A Bar Chart showing "Bandwidth Overhead" (Legacy vs. PQC).

3. Attack Control:

A large "Simulate Quantum Attack" button.

When clicked, call the POST /toggle-attack endpoint on the proxy.

Change the UI state to "CRITICAL ALERT" if the attack is active.

4. Packet Inspector:

A visual representation (like two boxes side-by-side).

Legacy Box: Small, Blue ("64 Bytes").

PQC Box: Large, Green ("2400 Bytes").

5. Layout: Use a dark, cyberpunk/hacker theme suitable for a security demo.