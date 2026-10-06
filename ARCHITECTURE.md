# System Architecture — EmbeddedLab OS

## 1. Architectural Philosophy & Simulation Boundaries

**EmbeddedLab OS** is designed as a browser-based, deterministic educational simulation of microcontroller peripherals.

### Simulation Boundary Declarations
- **Educational Peripheral Modeling**: Emulates GPIO pin states, internal pull resistors, PWM duty/frequency equations, ADC quantization formulas, and UART serial frame construction.
- **NOT an MCU CPU Core Emulation**: EmbeddedLab OS does not emulate ARM Cortex-M or Xtensa instruction sets (such as QEMU). Code is not compiled into binary machine code.
- **NOT a SPICE Electrical Circuit Simulator**: It models digital logic states ($HIGH$, $LOW$, $FLOATING$) and discrete voltage equations, not transistor-level analog dynamics or Kirchoff circuit laws.
- **NOT Physical Hardware**: The system operates 100% client-side in the browser, requiring no physical USB drivers, debugger probes, or silicon hardware.

---

## 2. High-Level System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Next.js 16 App Router UI                        │
│          Landing  •  Dashboard  •  Labs Directory  •  Lab Workspaces    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                       Custom React Hooks Layer                         │
│           useGPIOState  •  usePWMState  •  useADCState  •  useUARTState│
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                      Zustand Global State Stores                       │
│             simulator-store.ts        challenge-store.ts               │
└───────────────────┬─────────────────────────────────┬──────────────────┘
                    │                                 │
┌───────────────────▼──────────────┐   ┌──────────────▼──────────────────┐
│       Deterministic Engine       │   │     Pure State Validators       │
│  GPIO  •  PWM  •  ADC  •  UART   │   │    12 Peripheral Challenges     │
└───────────────────┬──────────────┘   └──────────────┬──────────────────┘
                    │                                 │
┌───────────────────▼─────────────────────────────────▼──────────────────┐
│                      Contextual AI & Offline Engine                    │
│      Google Gemini 2.5 Flash  •  Deterministic Offline Fallbacks       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Peripheral Engines

### GPIO Engine (`lib/simulator/gpio.ts`)
- **Pin States**: `HIGH` (3.3V), `LOW` (0.0V), `FLOATING`.
- **Modes**: `INPUT`, `OUTPUT`, `INPUT_PULLUP` (weak $\sim 40\text{ k}\Omega$ internal pull-up), `INPUT_PULLDOWN`.
- **Logic**: Resolves output driving capabilities, floating bus transitions, and button switch stimulus.

### PWM Engine (`lib/simulator/pwm.ts`)
- **Parameters**: Carrier frequency ($100\text{ Hz} - 10,000\text{ Hz}$), duty cycle ($0\% - 100\%$).
- **Equations**: Period $T = 1/f$, pulse width $t_{\text{high}} = T \times D$, average voltage $V_{\text{avg}} = 3.3\text{ V} \times D$.
- **Oscilloscope**: Dynamic SVG waveform rendering with frequency-scaled cycle rendering.

### ADC Engine (`lib/simulator/adc.ts`)
- **Quantization**: $\text{ADC}_{\text{raw}} = \text{round}\left(\frac{\min(V_{\text{in}}, V_{\text{ref}})}{V_{\text{ref}}} \times (2^N - 1)\right)$.
- **Resolution**: $8, 10, 12, 16\text{-bit}$ resolution levels with selectable $1.8\text{V}, 3.3\text{V}, 5.0\text{V}$ reference.
- **LSB**: $\text{LSB} = V_{\text{ref}} / (2^N - 1)$.

### UART Engine (`lib/simulator/uart.ts`)
- **Baud Rates**: 9600, 19200, 38400, 57600, 115200 bps.
- **Frame Construction**: 1 Start bit, 8 Data bits, Optional Parity (None/Even/Odd), 1 or 2 Stop bits.
- **Buffer**: Bi-directional TX/RX circular string buffer with frame alignment checks.

---

## 4. Challenge Verification Architecture

Each laboratory features 3 structured challenges (12 total):
- Challenges are validated by pure mathematical functions (`runChallengeValidator`).
- Validators evaluate the immutable snapshot `MicrocontrollerState`.
- Zero side-effects; 100% testable without DOM rendering.

---

## 5. Security & Data Minimization

- **No Secrets Client-Side**: No sensitive API keys are bundled into client JavaScript.
- **AI Route Protection**: `/api/ai` applies strict rate limiting, schema validation, and payload pruning.
- **Offline Resiliency**: In the absence of an AI API key or network connection, deterministic offline explanation generators provide instant pedagogical feedback.
