Write two Python scripts using paho-mqtt to simulate our IoT fleet:

Script 1: legacy_device.py

Connects to the Proxy on Port 1884.

Publishes a JSON payload {"temp": 24.5, "status": "OK"} every second.

Standard behavior.

Script 2: pqc_device.py

Connects to the Proxy on Port 8883.

Simulation Feature: Implement a simulate_hardware(device_type) function.

If device_type == "Cortex-M0", sleep for 1.5 seconds before connecting (simulating heavy PQC math).

If device_type == "Cortex-M7", sleep for 0.2 seconds.

Send the simulated CPU load in the MQTT payload: {"temp": 24.5, "cpu_load": "95%", "algo": "Kyber-768"}.

Ensure both scripts handle connection errors gracefully and print their status to the console.