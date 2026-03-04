Write a docker-compose.yml file for the Q-Shield project with the following services:

mosquitto: Use the official Eclipse Mosquitto image. Expose port 1883 (internal use only) and mount a default mosquitto.conf that allows anonymous access for now.

proxy: A placeholder Go service (build from ./proxy directory). Expose ports 8883 (PQC), 1884 (Legacy), and 8080 (WebSockets for Dashboard).

dashboard: A placeholder Node/Vite service (build from ./dashboard). Expose port 3000.

Also, provide the mosquitto.conf file content allowing access on port 1883.