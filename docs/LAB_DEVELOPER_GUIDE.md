# EmbeddedLab-OS — Virtual Lab Architecture & Developer Guide

**Architecture:** Browser-Based Microcontroller Peripheral Simulation Engine  
**Runtime:** TypeScript / Next.js / React  
**Testing Framework:** Vitest (169+ Automated Assertions)  
**Status Lifecycle:** Stage 3 (`Software tested`)

---

## 1. Simulation Engine Architecture

EmbeddedLab-OS models microcontroller peripherals in pure, deterministic TypeScript without requiring heavy WebAssembly binaries or physical silicon emulators. All simulations execute entirely within the client's browser.

```
+-------------------------------------------------------------------------------+
|                             Client Browser Window                             |
+-------------------------------------------------------------------------------+
|  React UI Layer (Workspace, Waveforms, Logic Analyzer, Challenge Panel)       |
+---------------------------------------+---------------------------------------+
                                        | Dispatches User Stimulus & Code
                                        v
+-------------------------------------------------------------------------------+
|                     Peripheral Simulation Kernel (Pure TS)                    |
|  - GPIO Engine (DDRx, PORTx, PINx register states & pull-up emulation)        |
|  - ADC Engine (Successive approximation, voltage dividers & sampling noise)   |
|  - PWM Engine (Timer prescalers, fast PWM, phase-correct PWM, OCRnx bounds)   |
|  - UART Engine (Baud rate divisor, framing error detection, parity generator) |
+---------------------------------------+---------------------------------------+
                                        | Evaluates Milestone Assertions
                                        v
+-------------------------------------------------------------------------------+
|                   Challenge & Learning Analytics Evaluator                    |
+-------------------------------------------------------------------------------+
```

---

## 2. Register Emulation Model (ATmega328P Style)

Peripherals follow standard 8-bit memory-mapped register semantics:

### 2.1 GPIO Direction & State Rules
1. **DDRx (`Data Direction Register`)**:
   - `0`: Pin configured as **INPUT**.
   - `1`: Pin configured as **OUTPUT**.
2. **PORTx (`Data Register`)**:
   - When `DDRx = 0`: `PORTx = 1` enables internal **PULL-UP** resistor; `PORTx = 0` leaves pin in **HIGH-Z (Floating)** state.
   - When `DDRx = 1`: `PORTx = 1` sets pin **HIGH (5.0V)**; `PORTx = 0` sets pin **LOW (0.0V)**.
3. **PINx (`Input Pins Address`)**:
   - Reflects the synchronized physical logic level present on the external pin boundary.
   - External stimulus cannot override active output pins (`DDRx = 1`), preventing simulated electrical bus contention.

---

## 3. Creating a New Peripheral Lab

To introduce a new virtual laboratory exercise (e.g. I2C Bus Protocol or SPI Shift Register):

### Step 1: Implement the Simulation Kernel
Create `embeddedlab-os/lib/simulator/<peripheral>.ts`. Export pure state-transition functions that take an immutable peripheral state object and return the updated state.

### Step 2: Write Automated Vitest Assertions
Create `embeddedlab-os/__tests__/simulator/<peripheral>.test.ts`. Cover:
- Default power-on reset (POR) state.
- Register bitwise manipulation.
- Out-of-bounds parameter clamping.
- Error detection (e.g. bus collisions, parity faults, timeout states).

Run tests locally:
```bash
npm test
```

### Step 3: Build the Interactive React Workspace
Create `embeddedlab-os/components/lab/<peripheral>/<peripheral>-workspace.tsx` incorporating:
- Live virtual schematic breadboard.
- Interactive stimulus buttons/sliders.
- Signal waveform canvas or digital logic timing visualizer.
- Step-by-step student challenge card with automated verification checks.

---

## 4. Verification & Testing Standards

All code contributions must maintain zero test regressions and adhere to TypeScript strict mode:

```bash
# 1. Static typecheck
npm run build

# 2. Automated test suite (all tests must pass)
npm test
```
