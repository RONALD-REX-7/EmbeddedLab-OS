/**
 * EmbeddedLab OS — lib/ai/fallback.ts
 *
 * Deterministic offline AI fallback responses for Explain, Hint, and Debug actions.
 * Ensures the lab operates smoothly without crashing even when AI services are offline or API key is absent.
 */
import type { SanitizedAIContext } from "./sanitizer";

export type AIActionType = "explain" | "hint" | "debug";

export interface AIResponsePayload {
  action: AIActionType;
  content: string;
  isFallback: boolean;
}

export function generateOfflineFallback(
  action: AIActionType,
  context: SanitizedAIContext
): AIResponsePayload {
  const { labId, relevantState } = context;

  if (action === "explain") {
    switch (labId) {
      case "gpio":
        return {
          action: "explain",
          isFallback: true,
          content: `### 💡 Concept Explanation: General Purpose Input / Output (GPIO)
* **Digital Modes**: **OUTPUT** mode allows the microcontroller to drive pins HIGH (3.3V) or LOW (0V) to control LEDs or relays. **INPUT** mode reads external signals (push buttons, logic high/low).
* **Pull Resistors**: **INPUT_PULLUP** holds the pin HIGH by default until pulled to GND (0V) by a button press. **INPUT_PULLDOWN** holds the pin LOW (0V) until pulled to VCC (3.3V).
* **Open-Drain vs Push-Pull**: Push-pull actively drives both HIGH and LOW. Open-drain can only pull down to GND; external resistors are needed to pull up to VCC.`,
        };
      case "pwm":
        return {
          action: "explain",
          isFallback: true,
          content: `### 💡 Concept Explanation: Pulse-Width Modulation (PWM)
* **Carrier Frequency ($f$)**: The rate at which the signal alternates between HIGH and LOW states per second ($Hz$). Period $T = \\frac{1}{f}$.
* **Duty Cycle ($D$)**: The percentage of time the waveform remains HIGH during one period ($D = \\frac{T_{on}}{T} \\times 100\\%$).
* **Effective Average Voltage**: $V_{avg} = V_{max} \\times D$. At 50% duty cycle on 3.3V, average voltage is 1.65V, dimming LEDs or controlling motor speeds smoothly.`,
        };
      case "adc":
        return {
          action: "explain",
          isFallback: true,
          content: `### 💡 Concept Explanation: Analog-to-Digital Conversion (ADC)
* **Reference Voltage ($V_{ref}$)**: The maximum input voltage scale (e.g., 3.3V). Inputs exceeding $V_{ref}$ will saturate to maximum raw digital value.
* **Resolution ($N$ bits)**: Number of quantization levels ($2^N$). A 12-bit ADC provides $2^{12} = 4096$ levels (values 0 to 4095).
* **Quantization Formula**: $\\text{ADC}_{raw} = \\text{round}\\left(\\frac{V_{in}}{V_{ref}} \\times (2^N - 1)\\right)$.`,
        };
      case "uart":
        return {
          action: "explain",
          isFallback: true,
          content: `### 💡 Concept Explanation: Universal Asynchronous Receiver-Transmitter (UART)
* **Asynchronous Communication**: Uses dedicated TX (transmit) and RX (receive) lines without a shared clock signal.
* **Baud Rate**: The clock speed in bits per second (e.g., 9600 or 115200 baud). Both TX and RX MUST agree on baud rate.
* **Frame Structure**: Consists of 1 Start Bit, Data Bits (8), Parity Bit (NONE/EVEN/ODD), and Stop Bits (1 or 2).`,
        };
    }
  }

  if (action === "hint") {
    return {
      action: "hint",
      isFallback: true,
      content: `### 🔍 Progressive Hint
1. **Review Challenge Objectives**: Check the active challenge panel checklist to confirm target values.
2. **Inspect Parameter Values**: Verify that all configured parameters match required frequencies, pin modes, or baud rates.
3. **Check Signal Dependencies**: Ensure input lines are correctly enabled and connected to the virtual microcontroller.`,
    };
  }

  // Debug action fallback
  if (action === "debug") {
    let debugNotes = "";

    if (labId === "gpio") {
      const outputPins = (relevantState.digitalPins as { mode: string; level: string }[])?.filter(
        (p) => p.mode === "OUTPUT"
      );
      debugNotes = `* Analyzed ${outputPins?.length || 0} OUTPUT pins. Ensure target LED pins are set to **OUTPUT** mode and set **HIGH** to drive current.`;
    } else if (labId === "pwm") {
      const pwmChannels = relevantState.pwmChannels as { enabled: boolean; dutyCyclePercent: number; frequencyHz: number }[];
      const pwm = pwmChannels?.[0];
      if (pwm && !pwm.enabled) {
        debugNotes = `* **Issue Detected**: PWM Channel is currently **DISABLED**. Enable the PWM generator toggle.`;
      } else if (pwm && pwm.dutyCyclePercent === 0) {
        debugNotes = `* **Issue Detected**: PWM Duty Cycle is **0%** (waveform output is permanently LOW). Increase duty cycle above 0%.`;
      } else {
        debugNotes = `* Current PWM Configuration: Frequency = ${pwm?.frequencyHz || 0} Hz, Duty Cycle = ${pwm?.dutyCyclePercent || 0}%.`;
      }
    } else if (labId === "adc") {
      const analogChannels = relevantState.analogChannels as { inputVoltage: number; referenceVoltage: number }[];
      const adc = analogChannels?.[0];
      if (adc && adc.inputVoltage > adc.referenceVoltage) {
        debugNotes = `* **Issue Detected**: Input voltage ($V_{in} = ${adc.inputVoltage}V$) exceeds reference voltage ($V_{ref} = ${adc.referenceVoltage}V$). The ADC is saturated to max full-scale reading.`;
      } else {
        debugNotes = `* Current ADC State: $V_{in} = ${adc?.inputVoltage || 0}V$, $V_{ref} = ${adc?.referenceVoltage || 3.3}V$.`;
      }
    } else if (labId === "uart") {
      const uart = relevantState.uart as {
        transmitter?: { baudRate: number };
        receiver?: { baudRate: number };
      };
      const txBaud = uart?.transmitter?.baudRate;
      const rxBaud = uart?.receiver?.baudRate;

      if (txBaud && rxBaud && txBaud !== rxBaud) {
        debugNotes = `* **Framing Mismatch Detected**: Transmitter is set to **${txBaud} baud** while Receiver is set to **${rxBaud} baud**. Serial communication will fail. Equalize baud rates.`;
      } else {
        debugNotes = `* UART TX/RX parameters appear compatible (${txBaud || 9600} baud).`;
      }
    }

    return {
      action: "debug",
      isFallback: true,
      content: `### 🛠️ Hardware State Debug Analysis
${debugNotes}
* *System Note*: Offline heuristic state inspection active.`,
    };
  }

  return {
    action,
    isFallback: true,
    content: "AI guidance service is currently operating in local offline mode.",
  };
}
