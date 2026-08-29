/**
 * EmbeddedLab OS — lib/education/content.ts
 *
 * Structured educational content registry for GPIO, PWM, ADC, and UART laboratories.
 * ECE undergraduate-level learning objectives, core principles, equations, and experiment steps.
 */
import type { LabId } from "@/types/simulator";

export interface EducationalSection {
  title: string;
  content: string[];
}

export interface LabEducationalContent {
  labId: LabId;
  title: string;
  subtitle: string;
  learningObjectives: string[];
  sections: EducationalSection[];
  experimentSteps: string[];
  keyTakeaway: string;
}

export const LAB_EDUCATIONAL_CONTENT: Record<LabId, LabEducationalContent> = {
  gpio: {
    labId: "gpio",
    title: "GPIO — General Purpose Input / Output",
    subtitle: "Digital Logic, Pin Modes, and Pull-up/Pull-down Resistors",
    learningObjectives: [
      "Understand digital logic states (HIGH = 3.3V, LOW = 0.0V).",
      "Configure pin direction registers between INPUT and OUTPUT modes.",
      "Analyze internal PULL_UP and PULL_DOWN resistor configurations for floating inputs.",
      "Safely interface digital peripherals including LEDs and push buttons.",
    ],
    sections: [
      {
        title: "1. Digital Logic States & Electrical Levels",
        content: [
          "Microcontrollers process signals digitally using two binary states: HIGH (1) and LOW (0).",
          "On typical 3.3V CMOS microcontrollers (e.g., STM32, ARM Cortex-M), LOGIC HIGH corresponds to ~3.3V and LOGIC LOW corresponds to 0V (GND).",
          "Voltage inputs between V_IL (max low voltage) and V_IH (min high voltage) are undefined and must be avoided using defined pull logic.",
        ],
      },
      {
        title: "2. Input vs Output Direction Registers",
        content: [
          "OUTPUT Mode: The pin's internal driver actively connects to VCC (HIGH) or GND (LOW) to source or sink current to external devices (e.g. driving an LED).",
          "INPUT Mode: High-impedance state where the pin senses external voltage without drawing significant current.",
        ],
      },
      {
        title: "3. Internal Pull-Up & Pull-Down Resistors",
        content: [
          "Floating Inputs: Unconnected input pins pick up environmental electromagnetic noise, causing unpredictable HIGH/LOW toggling.",
          "PULL_UP Resistor: Connects an internal ~40kΩ resistor to 3.3V, holding the pin HIGH by default when a button is open.",
          "PULL_DOWN Resistor: Connects an internal ~40kΩ resistor to GND, holding the pin LOW by default when a button is open.",
        ],
      },
    ],
    experimentSteps: [
      "Select Pin PA5 in the GPIO Matrix and set Mode to OUTPUT.",
      "Toggle output state between HIGH (3.3V) and LOW (0V) to observe Virtual LED illumination.",
      "Select Pin PA0 and configure Mode to INPUT_PULLUP.",
      "Press the Virtual Button to pull PA0 LOW and observe the logic level change in the Inspector Panel.",
    ],
    keyTakeaway:
      "Pin direction defines whether the MCU drives or senses current. Always configure PULL_UP or PULL_DOWN on mechanical switch inputs to prevent floating states.",
  },

  pwm: {
    labId: "pwm",
    title: "PWM — Pulse-Width Modulation",
    subtitle: "Duty Cycle, Carrier Frequency, and Average Voltage Control",
    learningObjectives: [
      "Understand Pulse-Width Modulation principles for analog-like power control using digital outputs.",
      "Calculate period T = 1 / f from carrier frequency f.",
      "Relate duty cycle D = (t_high / T) * 100% to average output voltage V_avg = V_max * D.",
      "Observe LED dimming and waveform variations on a virtual oscilloscope.",
    ],
    sections: [
      {
        title: "1. Pulse-Width Modulation Concept",
        content: [
          "PWM is a technique for generating analog-like continuous voltage levels from pure digital HIGH/LOW outputs by switching rapidly.",
          "Because the switching frequency is faster than mechanical or optical response times (e.g., LED response or motor inertia), the load responds to the average voltage V_avg.",
        ],
      },
      {
        title: "2. Frequency & Period Equations",
        content: [
          "Carrier Frequency (f): Number of complete HIGH/LOW cycles per second (Hz).",
          "Period (T): Duration of one complete cycle in seconds: T = 1 / f.",
          "High Time (t_high): Duration the signal remains HIGH during period T.",
          "Low Time (t_low): Duration the signal remains LOW during period T: t_low = T - t_high.",
        ],
      },
      {
        title: "3. Duty Cycle & Average Voltage",
        content: [
          "Duty Cycle (D): D = (t_high / T) * 100%.",
          "Effective Voltage: V_avg = V_max * (D / 100). At 3.3V and D = 50%, V_avg = 1.65V.",
          "0% Duty Cycle = Permanently LOW (0V). 100% Duty Cycle = Permanently HIGH (3.3V).",
        ],
      },
    ],
    experimentSteps: [
      "Set Carrier Frequency to 1,000 Hz (1 kHz) and calculate period T = 1.00 ms.",
      "Adjust Duty Cycle slider from 0% to 100% and observe waveform pulse width on the Oscilloscope.",
      "Observe how LED relative brightness matches the configured Duty Cycle percentage.",
    ],
    keyTakeaway:
      "PWM controls average power delivery without heat dissipation typical of linear regulators by varying the pulse width ratio D = t_high / T.",
  },

  adc: {
    labId: "adc",
    title: "ADC — Analog-to-Digital Converter",
    subtitle: "Analog Sampling, Quantization, Vref Scaling, and LSB Resolution",
    learningObjectives: [
      "Distinguish between continuous analog signals and quantized digital representations.",
      "Understand ADC resolution N bits (2^N digital levels).",
      "Calculate Least Significant Bit (LSB) voltage step size V_LSB = Vref / (2^N - 1).",
      "Compute raw ADC values using ADC_raw = round((Vin / Vref) * (2^N - 1)).",
    ],
    sections: [
      {
        title: "1. Analog vs Digital Representation",
        content: [
          "Physical sensors (temperature, pressure, potentiometers) output continuous analog voltages Vin.",
          "Microcontrollers are digital devices that require an ADC to convert continuous Vin into discrete binary integers.",
        ],
      },
      {
        title: "2. Resolution & Quantization Levels",
        content: [
          "Resolution (N bits): Determines the number of discrete steps: 2^N levels.",
          "8-bit ADC: 2^8 = 256 levels (0 to 255).",
          "10-bit ADC: 2^10 = 1,024 levels (0 to 1023).",
          "12-bit ADC: 2^12 = 4,096 levels (0 to 4095).",
          "16-bit ADC: 2^16 = 65,536 levels (0 to 65535).",
        ],
      },
      {
        title: "3. Reference Voltage & Conversion Formula",
        content: [
          "Reference Voltage (Vref): The full-scale maximum measurable input voltage (e.g. 3.3V). Inputs > Vref saturate at full-scale.",
          "Conversion Formula: ADC_raw = round((Vin / Vref) * (2^N - 1)).",
          "LSB Voltage Step: V_LSB = Vref / (2^N - 1). Higher resolution N reduces quantization error.",
        ],
      },
    ],
    experimentSteps: [
      "Set Reference Voltage Vref = 3.3V and Resolution = 12-bit (4,096 levels).",
      "Move the Potentiometer slider to Vin = 1.65V (exactly 50% of Vref).",
      "Verify that raw ADC output evaluates to round((1.65 / 3.3) * 4095) = 2048.",
      "Change resolution to 8-bit and observe how the raw output scales down to 128.",
    ],
    keyTakeaway:
      "ADC raw integers represent the ratio of input voltage Vin relative to Vref scaled by resolution 2^N - 1.",
  },

  uart: {
    labId: "uart",
    title: "UART — Universal Asynchronous Receiver-Transmitter",
    subtitle: "Asynchronous Frame Format, Baud Rate Matching, and Serial Terminals",
    learningObjectives: [
      "Understand asynchronous point-to-point serial communication without a shared clock.",
      "Identify the 4 components of a UART frame: Start Bit, Data Bits (5-8), Parity Bit, Stop Bits.",
      "Equalize Baud Rate (bits per second) between Transmitter (TX) and Receiver (RX).",
      "Diagnose framing errors and parity mismatches on interactive serial terminals.",
    ],
    sections: [
      {
        title: "1. Asynchronous Serial Communication",
        content: [
          "UART transmits data sequentially bit-by-bit over two dedicated signals: TX (Transmit) and RX (Receive).",
          "Unlike synchronous protocols (SPI, I2C), UART does NOT transmit a clock line. Synchronization relies entirely on matching configured baud rates.",
        ],
      },
      {
        title: "2. UART Frame Structure",
        content: [
          "Idle State: Line remains HIGH (3.3V).",
          "Start Bit: Line drops LOW (0V) for 1 bit period to signal the start of a frame.",
          "Data Bits: 5, 6, 7, or 8 payload bits transmitted Least Significant Bit (LSB) first.",
          "Parity Bit: Optional error checking bit (NONE, EVEN, ODD).",
          "Stop Bit(s): Line returns HIGH for 1, 1.5, or 2 bit periods to allow line reset.",
        ],
      },
      {
        title: "3. Baud Rate & Configuration Mismatch",
        content: [
          "Baud Rate: Bit transmission speed per second (e.g. 9,600 or 115,200 baud). Bit duration t_bit = 1 / Baud.",
          "Mismatch Error: If TX baud = 9600 and RX baud = 115200, the receiver samples data at wrong timing intervals, causing framing errors and garbled text.",
          "Protocol vs Electrical Signaling: UART defines software frame parameters. Physical transceivers (RS-232, RS-485, USB-UART) handle voltage translation.",
        ],
      },
    ],
    experimentSteps: [
      "Configure TX Baud Rate = 9600, Data Bits = 8, Parity = NONE, Stop Bits = 1.",
      "Configure RX Baud Rate = 9600 to establish compatible communication.",
      "Type a test message 'HELLO' in the TX Terminal and click Transmit.",
      "Mismatched Test: Change RX Baud Rate to 115200 and transmit again to observe the Framing Mismatch Error banner.",
    ],
    keyTakeaway:
      "Because UART is asynchronous, both ends MUST share identical Baud Rate, Data Bits, Parity, and Stop Bit configurations for error-free serial communication.",
  },
};
