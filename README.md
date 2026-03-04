# DigiCert PQC Fleet Migration Platform

**Hackathon 2027 — Post-Quantum Cryptography Migration for Brownfield IoT**

A prototype executive-facing platform that discovers, assesses, and guides the migration of IoT device fleets to NIST-approved post-quantum cryptography standards, ahead of the CNSA 2.0 deadline (January 1, 2027).

---

## The Problem

Most enterprises have thousands of connected devices — industrial PLCs, medical sensors, automotive ECUs, smart-home hubs — running on cryptography (RSA, ECDSA) that will be broken by quantum computers. NIST has finalized the post-quantum standards. NSA's CNSA 2.0 disallows classical algorithms for new systems in 2026 and sunsets them entirely by 2030.

Three things companies don't know today:
1. **Which devices have weak or missing certificates** — including brownfield hardware with zero cryptographic identity
2. **Which algorithm to migrate to** — not every device can run the same PQC algorithm; a Cortex-M0+ sensor has 16KB RAM, not 4MB
3. **Whether they'll make the deadline** — no ordered migration blueprint, no readiness projection

---

## The Solution

A three-pillar platform:

### 1. Discovery (reach every device)
- **TrustEdge Agent** — full-capability, manages the cert lifecycle on powerful/server-class devices
- **Kernel Module** — lightweight agent (>=8KB RAM) for brownfield devices that cannot run TrustEdge; telemetry-only (cert status, memory, CPU, firmware hash), phones home in chunks
- **Multi-language SDK** (Python, C, Go) — embedded into existing firmware for integration without agent installation

### 2. Algorithm Intelligence
- Deprecation timeline for every classical algorithm (RSA, ECDSA, DH, AES-128) with CNSA 2.0 sunset dates
- Device Advisor: maps device class (RAM/CPU constraints) to the correct NIST-approved PQC algorithm
- Real PQC operations via liboqs (ML-KEM/Kyber, ML-DSA/Dilithium) in the Q-Shield backend demo

### 3. Readiness Blueprint
- Ordered 6-step migration plan based on device capabilities
- "Will you make it?" projection — fleet size vs migration velocity vs CNSA deadline
- Two-agent strategy visualization — TrustEdge for capable devices, Kernel Module for constrained brownfield

---

## Running the Demo

```bash
npm install
npm run dev
```

Open **http://localhost:5173** (or the next available port shown in terminal).

---

## Demo Flow

The app has **4 main pages** — intentionally minimal for an executive audience.

| Page | URL | What it shows |
|---|---|---|
| Overview | `/` | Executive landing — the 3 problems, fleet stats, readiness meter, guided tour CTA |
| Discovery | `/discovery` | Agent coverage panel (TrustEdge + Kernel Module), connector pipeline, no-cert device alerts |
| Readiness Blueprint | `/blueprint` | Ordered migration steps, deadline projection, two-agent strategy |
| Algorithm Intel | `/algorithms` | 3 tabs: Algorithm Matrix, Deprecation Timeline, Device Advisor |

> The technical pages (HNDL Risk, Fleet Heatmap, Certificate Impact, Migration Sequencer) still exist at their URLs but are removed from the main nav for a cleaner executive presentation. Access them directly: `/hndl`, `/fleet`, `/certificates`, `/migration`.

---

## Guided Tour (Story Mode)

Click **"Start Guided Tour"** on the Overview page, or the **Story Mode** button at the bottom of the sidebar.

A right-side panel opens with 6 narrative chapters. Use **Next** to progress:

| # | Title | Page | What it demonstrates |
|---|---|---|---|
| 1 | The Unknown Fleet | Overview | You have thousands of devices. Most are cryptographic blind spots. |
| 2 | Discovering the Truth | Discovery | Kernel Module reaches devices TrustEdge cannot. Finds no-cert devices. |
| 3 | The Clock Is Ticking | Algorithm Intel (Deprecation tab) | RSA/ECDSA have expiry dates. Here is the countdown. |
| 4 | Your Readiness Blueprint | Blueprint | Ordered plan. Will you make Jan 1, 2027? |
| 5 | Pick the Right Algorithm | Algorithm Intel (Device Advisor tab) | Per-device-class PQC algorithm recommendations. |
| 6 | Prove It Works | Discovery / Certificates | Hybrid certs bridge the transition. Q-Shield live demo available. |

> Chapters 3 and 5 both navigate to Algorithm Intel — but the correct tab auto-activates based on story context.

---

## Migration Simulation

Click **"Simulate Migration"** in the sidebar to animate fleet readiness from 15% to 100%. All dashboard metrics update in real time. Click **Reset** to return to baseline.

---

## Q-Shield Live Demo (optional backend)

The `Q-Shield/` directory contains a Docker stack showing real PQC operations side-by-side with legacy traffic under simulated quantum attack.

```bash
cd Q-Shield
docker-compose up
```

- Dashboard: http://localhost:3000
- Toggle "Quantum Attack" in the dashboard to show real-time impact on legacy vs PQC connections
- Uses **liboqs** for actual ML-KEM (Kyber) and ML-DSA (Dilithium) crypto operations

---

## Project Structure

```
src/
├── pages/
│   ├── LandingPage.tsx           # Executive overview — primary entry point
│   ├── DiscoveryPage.tsx         # Agent coverage + connector pipeline
│   ├── BlueprintPage.tsx         # Readiness blueprint + ordered migration steps
│   └── AlgorithmPage.tsx         # Algorithm matrix / deprecation / advisor (3 tabs)
├── components/
│   ├── story/StoryPanel.tsx      # Guided tour right-side panel (6 chapters)
│   └── discovery/
│       └── KernelAgentPanel.tsx  # Agent table with TrustEdge + Kernel Module + heartbeats
├── hooks/
│   ├── useStory.tsx              # Story mode state — chapter navigation, tab hints
│   ├── useSimulation.tsx         # Migration simulation engine
│   └── useDiscovery.tsx          # Device discovery pipeline state
├── data/
│   ├── devices.ts                # 50+ device groups across 5 industries + no-cert devices
│   ├── algorithms.ts             # NIST PQC algorithms (ML-DSA, ML-KEM, SLH-DSA, FN-DSA)
│   ├── deprecations.ts           # Classical algo deprecation dates + CNSA 2.0 milestones
│   └── blueprint.ts              # 6-step migration blueprint + kernel agent mock telemetry
└── types/index.ts                # All TypeScript interfaces

Q-Shield/
├── proxy/main.go                 # Go proxy — dual listener (PQC + legacy) + WebSocket metrics
├── iot-fleet/pqc_device.py       # Python IoT simulator using real liboqs PQC
└── dashboard/src/App.jsx         # Real-time WebSocket metrics dashboard
```

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| Kernel Module instead of full agent | TrustEdge cannot install on constrained brownfield hardware (<=64KB RAM, no OS). A read-only telemetry module solves discovery without requiring firmware updates. |
| Algorithm recommendation by device class | Not every device can run ML-DSA-87. A Cortex-M0+ needs ML-KEM-512 + FN-DSA-512. The Device Advisor maps RAM constraints to the right NIST algo. |
| Hybrid certs during transition | Classical + PQC signatures in one cert maintains backward compatibility while proving quantum-safe capability. No hard cutover required. |
| CNSA 2.0 as deadline anchor | NSA's Jan 1, 2027 mandate provides a concrete, defensible regulatory deadline for the urgency narrative. |
| 4-page nav for exec demo | Technical pages still exist but are hidden from nav. Keeps the executive demo clean and story-focused. |

---

## Stack

**Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4, Recharts, Framer Motion, Lucide
**Q-Shield Backend:** Go, Python + liboqs, Eclipse Mosquitto (MQTT), Docker
**PQC Algorithms (via liboqs):** ML-KEM-512/768/1024, ML-DSA-44/65/87, SLH-DSA-128s/f, FN-DSA-512
