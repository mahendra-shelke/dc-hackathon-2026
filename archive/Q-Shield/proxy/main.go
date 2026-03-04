package main

import (
	cryptorand "crypto/rand"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math/rand"
	"net"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

// ---------------------------------------------------------------------------
// Metrics
// ---------------------------------------------------------------------------

type Metrics struct {
	mu             sync.RWMutex
	PQCLatency     int64 `json:"pqc_latency"`
	LegacyLatency  int64 `json:"legacy_latency"`
	PQCBandwidth      int64 `json:"pqc_bandwidth"`
	LegBandwidth      int64 `json:"legacy_bandwidth"`
	AttackActive      bool  `json:"attack_active"`
	PQCAlgorithms     map[string]interface{}
	LastPQCPayload    string `json:"last_pqc_payload"`
	LastLegacyPayload string `json:"last_legacy_payload"`

	pqcBytes       int64
	legBytes       int64
	pqcHandshakeNs int64
	legHandshakeNs int64
}

var metrics = &Metrics{}

func (m *Metrics) snapshot() map[string]interface{} {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return map[string]interface{}{
		"pqc_latency":      m.PQCLatency,
		"legacy_latency":   m.LegacyLatency,
		"pqc_bandwidth":    m.PQCBandwidth,
		"legacy_bandwidth": m.LegBandwidth,
		"attack_active":    m.AttackActive,
		"pqc_packets":         m.pqcBytes,
		"legacy_packets":      m.legBytes,
		"algorithms":          m.PQCAlgorithms,
		"last_pqc_payload":    m.LastPQCPayload,
		"last_legacy_payload": m.LastLegacyPayload,
	}
}

// ---------------------------------------------------------------------------
// Attack state
// ---------------------------------------------------------------------------

var (
	attackMu      sync.RWMutex
	isUnderAttack bool
)

func getAttack() bool {
	attackMu.RLock()
	defer attackMu.RUnlock()
	return isUnderAttack
}

func toggleAttack() bool {
	attackMu.Lock()
	defer attackMu.Unlock()
	isUnderAttack = !isUnderAttack
	metrics.mu.Lock()
	metrics.AttackActive = isUnderAttack
	metrics.mu.Unlock()
	log.Printf("⚡ Attack toggled → %v", isUnderAttack)
	return isUnderAttack
}

// ---------------------------------------------------------------------------
// WebSocket hub — broadcasts metrics to all connected dashboards
// ---------------------------------------------------------------------------

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

type wsHub struct {
	mu      sync.Mutex
	clients map[*websocket.Conn]bool
}

var hub = &wsHub{clients: make(map[*websocket.Conn]bool)}

func (h *wsHub) add(c *websocket.Conn) {
	h.mu.Lock()
	h.clients[c] = true
	h.mu.Unlock()
}

func (h *wsHub) remove(c *websocket.Conn) {
	h.mu.Lock()
	delete(h.clients, c)
	h.mu.Unlock()
}

func (h *wsHub) broadcast(msg []byte) {
	h.mu.Lock()
	defer h.mu.Unlock()
	for c := range h.clients {
		if err := c.WriteMessage(websocket.TextMessage, msg); err != nil {
			c.Close()
			delete(h.clients, c)
		}
	}
}

// simulateMetrics generates realistic, randomized metric values every tick.
// This ensures the dashboard always sees dynamic, changing data.
func simulateMetrics() {
	// Base values for simulation
	basePQCLatency := int64(38)   // ~38ms PQC handshake
	baseLegLatency := int64(8)    // ~8ms legacy handshake
	basePQCBW := int64(2400)      // ~2.4KB PQC packets
	baseLegBW := int64(64)        // ~64B legacy packets

	metrics.mu.Lock()
	metrics.PQCLatency = basePQCLatency
	metrics.LegacyLatency = baseLegLatency
	metrics.PQCBandwidth = basePQCBW
	metrics.LegBandwidth = baseLegBW
	metrics.mu.Unlock()

	ticker := time.NewTicker(1 * time.Second)
	go func() {
		for range ticker.C {
			metrics.mu.Lock()

			isAttack := metrics.AttackActive

			// PQC latency: 30-55ms, stable
			metrics.PQCLatency = basePQCLatency + int64(rand.Intn(18)) - 4

			if isAttack {
				// Under attack: legacy latency spikes 200-800ms
				metrics.LegacyLatency = 200 + int64(rand.Intn(600))
			} else {
				// Normal: legacy latency 5-18ms
				metrics.LegacyLatency = baseLegLatency + int64(rand.Intn(11)) - 3
			}

			// PQC bandwidth: 2200-2800 bytes
			metrics.PQCBandwidth = basePQCBW + int64(rand.Intn(600)) - 200

			if isAttack {
				// Under attack: legacy bandwidth erratic (0-30 bytes, corrupted)
				metrics.LegBandwidth = int64(rand.Intn(30))
			} else {
				// Normal: 48-96 bytes
				metrics.LegBandwidth = baseLegBW + int64(rand.Intn(48)) - 16
			}

			// Simulate packet counts climbing
			metrics.pqcBytes += int64(rand.Intn(3)) + 1
			metrics.legBytes += int64(rand.Intn(3)) + 1

			metrics.mu.Unlock()
		}
	}()
}

func startBroadcaster() {
	ticker := time.NewTicker(1 * time.Second)
	go func() {
		for range ticker.C {
			data, _ := json.Marshal(metrics.snapshot())
			hub.broadcast(data)
		}
	}()
}

// ---------------------------------------------------------------------------
// TCP proxy logic
// ---------------------------------------------------------------------------

func brokerAddr() string {
	if addr := os.Getenv("MQTT_BROKER"); addr != "" {
		return addr
	}
	return "localhost:1883"
}

// proxyConn handles a single client connection.
// isPQC distinguishes the port so we can apply PQC overhead & attack logic.
func proxyConn(client net.Conn, isPQC bool) {
	defer client.Close()

	tag := "LEGACY"
	if isPQC {
		tag = "PQC"
	}
	log.Printf("[%s] New connection from %s", tag, client.RemoteAddr())

	broker, err := net.DialTimeout("tcp", brokerAddr(), 5*time.Second)
	if err != nil {
		log.Printf("[%s] Cannot reach broker: %v", tag, err)
		return
	}
	defer broker.Close()

	start := time.Now()
	var once sync.Once
	recordHandshake := func(n int64) {
		once.Do(func() {
			if n >= 500 {
				elapsed := time.Since(start).Milliseconds()
				metrics.mu.Lock()
				if isPQC {
					// Simulate PQC handshake overhead (+30-50ms)
					metrics.pqcHandshakeNs = elapsed + 35
					metrics.PQCLatency = metrics.pqcHandshakeNs
				} else {
					metrics.legHandshakeNs = elapsed
					metrics.LegacyLatency = metrics.legHandshakeNs
				}
				metrics.mu.Unlock()
			}
		})
	}

	var wg sync.WaitGroup
	wg.Add(2)

	// client → broker
	go func() {
		defer wg.Done()
		buf := make([]byte, 4096)
		var total int64
		for {
			n, err := client.Read(buf)
			if n > 0 {
				data := buf[:n]

				// Attack simulation: corrupt legacy traffic
				if !isPQC && getAttack() {
					garbage := make([]byte, n)
					cryptorand.Read(garbage)
					data = garbage
				}

				broker.Write(data)
				total += int64(n)
				recordHandshake(total)

				// Update bandwidth metrics
				metrics.mu.Lock()
				if isPQC {
					metrics.pqcBytes += int64(n)
					metrics.PQCBandwidth = int64(n) + 2400 // +2.4KB PQC overhead
				} else {
					metrics.legBytes += int64(n)
					metrics.LegBandwidth = int64(n)
				}
				metrics.mu.Unlock()
			}
			if err != nil {
				break
			}
		}
	}()

	// broker → client
	go func() {
		defer wg.Done()
		io.Copy(client, broker)
	}()

	wg.Wait()
	log.Printf("[%s] Connection closed: %s", tag, client.RemoteAddr())
}

func startListener(addr string, isPQC bool) {
	ln, err := net.Listen("tcp", addr)
	if err != nil {
		log.Fatalf("Failed to listen on %s: %v", addr, err)
	}
	tag := "LEGACY"
	if isPQC {
		tag = "PQC"
	}
	log.Printf("🔌 [%s] Listening on %s", tag, addr)
	for {
		conn, err := ln.Accept()
		if err != nil {
			log.Printf("[%s] Accept error: %v", tag, err)
			continue
		}
		go proxyConn(conn, isPQC)
	}
}

// ---------------------------------------------------------------------------
// HTTP + WebSocket server
// ---------------------------------------------------------------------------

func startHTTP() {
	mux := http.NewServeMux()

	// WebSocket endpoint for dashboard
	mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Printf("WebSocket upgrade error: %v", err)
			return
		}
		hub.add(conn)
		defer hub.remove(conn)
		log.Println("📊 Dashboard connected")
		// keep connection alive — read loop (just discard)
		for {
			if _, _, err := conn.ReadMessage(); err != nil {
				break
			}
		}
	})

	// Root WebSocket endpoint (fallback for clients connecting to ws://host:8080)
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if websocket.IsWebSocketUpgrade(r) {
			conn, err := upgrader.Upgrade(w, r, nil)
			if err != nil {
				log.Printf("WebSocket upgrade error: %v", err)
				return
			}
			hub.add(conn)
			defer hub.remove(conn)
			log.Println("📊 Dashboard connected (root)")
			for {
				if _, _, err := conn.ReadMessage(); err != nil {
					break
				}
			}
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"service": "q-shield-proxy", "status": "running"})
	})

	// Toggle attack endpoint
	mux.HandleFunc("/toggle-attack", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		state := toggleAttack()
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]bool{"attack_active": state})
	})
	// Report metrics endpoint
	mux.HandleFunc("/report-metrics", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}
		var payload struct {
			Algorithms map[string]interface{} `json:"algorithms"`
		}
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			http.Error(w, "Bad request", http.StatusBadRequest)
			return
		}

		metrics.mu.Lock()
		if metrics.PQCAlgorithms == nil {
			metrics.PQCAlgorithms = make(map[string]interface{})
		}
		// Merge reported algorithms
		for k, v := range payload.Algorithms {
			metrics.PQCAlgorithms[k] = v
		}
		metrics.mu.Unlock()

		w.WriteHeader(http.StatusOK)
	})

	// Report payload endpoint
	mux.HandleFunc("/report-payload", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}
		var req struct {
			Type    string `json:"type"`
			Payload string `json:"payload"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Bad request", http.StatusBadRequest)
			return
		}

		metrics.mu.Lock()
		if req.Type == "legacy" {
			metrics.LastLegacyPayload = req.Payload
		} else {
			metrics.LastPQCPayload = req.Payload
		}
		metrics.mu.Unlock()

		w.WriteHeader(http.StatusOK)
	})

	// Health check
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "healthy"})
	})

	log.Println("🌐 HTTP/WebSocket server on :8080")
	if err := http.ListenAndServe(":8080", mux); err != nil {
		log.Fatalf("HTTP server error: %v", err)
	}
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

func main() {
	fmt.Println(`
   ██████╗       ███████╗██╗  ██╗██╗███████╗██╗     ██████╗ 
  ██╔═══██╗      ██╔════╝██║  ██║██║██╔════╝██║     ██╔══██╗
  ██║   ██║█████╗███████╗███████║██║█████╗  ██║     ██║  ██║
  ██║▄▄ ██║╚════╝╚════██║██╔══██║██║██╔══╝  ██║     ██║  ██║
  ╚██████╔╝      ███████║██║  ██║██║███████╗███████╗██████╔╝
   ╚══▀▀═╝       ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚═════╝
  PQC Proxy for IoT — Hackathon 2026
	`)

	log.Println("Starting Q-Shield Proxy...")
	log.Printf("Backend MQTT broker: %s", brokerAddr())

	// Start metrics simulation + broadcaster
	simulateMetrics()
	startBroadcaster()

	// Start TCP listeners
	go startListener(":1884", false) // Legacy
	go startListener(":8883", true)  // PQC

	// Start HTTP/WebSocket server (blocks)
	startHTTP()
}
