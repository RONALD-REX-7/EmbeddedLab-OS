/**
 * EmbeddedLab OS — Core Simulator Type System
 *
 * These types define the data models for the deterministic simulation engine.
 * This file must remain free of React, Next.js, and UI dependencies.
 * All simulator modules and UI components reference these shared types.
 */

// ---------------------------------------------------------------------------
// Primitive enumerations
// ---------------------------------------------------------------------------

export type PinMode = "INPUT" | "OUTPUT" | "INPUT_PULLUP" | "INPUT_PULLDOWN";

export type LogicLevel = "HIGH" | "LOW" | "FLOATING";

export type Parity = "NONE" | "EVEN" | "ODD" | "MARK" | "SPACE";

export type StopBits = 1 | 1.5 | 2;

export type ADCResolution = 8 | 10 | 12 | 16;

export type LabId = "gpio" | "pwm" | "adc" | "uart";

export type SimulationStatus = "IDLE" | "RUNNING" | "PAUSED" | "ERROR" | "COMPLETE";

export type EventSeverity = "INFO" | "WARNING" | "ERROR" | "SUCCESS";

// ---------------------------------------------------------------------------
// GPIO
// ---------------------------------------------------------------------------

export interface DigitalPin {
  /** Pin number on the virtual microcontroller (0-based index) */
  id: number;
  /** Human-readable label, e.g. "PA0", "D13" */
  label: string;
  mode: PinMode;
  /** Current logical level on the pin */
  level: LogicLevel;
  /** Whether this pin is currently involved in the active challenge */
  isActive: boolean;
}

export interface GPIOState {
  pins: DigitalPin[];
}

// ---------------------------------------------------------------------------
// PWM
// ---------------------------------------------------------------------------

export interface PWMChannel {
  /** Channel index */
  id: number;
  label: string;
  /** Frequency in Hz (1 – 1,000,000) */
  frequencyHz: number;
  /** Duty cycle as a percentage (0.0 – 100.0) */
  dutyCyclePercent: number;
  /** Whether the channel is actively outputting */
  enabled: boolean;
}

/** Derived values calculated by the simulator — never stored, always recomputed */
export interface PWMDerivedValues {
  /** Period in milliseconds */
  periodMs: number;
  /** High time in milliseconds */
  highTimeMs: number;
  /** Low time in milliseconds */
  lowTimeMs: number;
}

export interface PWMState {
  channels: PWMChannel[];
}

// ---------------------------------------------------------------------------
// ADC
// ---------------------------------------------------------------------------

export interface AnalogChannel {
  /** Channel index */
  id: number;
  label: string;
  /** Input voltage in volts */
  inputVoltage: number;
  /** Reference voltage in volts */
  referenceVoltage: number;
  /** ADC resolution in bits */
  resolution: ADCResolution;
  /** Whether the channel is enabled */
  enabled: boolean;
}

/** Derived values calculated by the ADC formula: ADC = (Vin / Vref) × (2^N - 1) */
export interface ADCDerivedValues {
  /** Raw digital output value */
  digitalValue: number;
  /** Maximum possible digital value at this resolution */
  maxDigitalValue: number;
  /** Voltage step per LSB in millivolts */
  lsbMillivolts: number;
  /** Quantization error as a percentage */
  quantizationErrorPercent: number;
}

export interface ADCState {
  channels: AnalogChannel[];
}

// ---------------------------------------------------------------------------
// UART
// ---------------------------------------------------------------------------

export interface UARTConfig {
  /** Baud rate (e.g., 9600, 115200) */
  baudRate: number;
  /** Data bits (5, 6, 7, or 8) */
  dataBits: 5 | 6 | 7 | 8;
  parity: Parity;
  stopBits: StopBits;
  /** Whether flow control (RTS/CTS) is enabled */
  flowControl: boolean;
}

export interface UARTDerivedValues {
  /** Total bits per frame (start + data + parity + stop) */
  bitsPerFrame: number;
  /** Bit duration in microseconds */
  bitDurationMicros: number;
  /** Frame duration in microseconds */
  frameDurationMicros: number;
  /** Maximum throughput in bytes per second */
  maxBytesPerSecond: number;
}

export interface UARTState {
  transmitter: UARTConfig;
  receiver: UARTConfig;
  /** Whether transmitter and receiver configs are compatible */
  compatible: boolean;
  /** Human-readable description of any compatibility issue */
  compatibilityNote: string;
  /** Sent message history buffer */
  txBuffer: string[];
  /** Received message history buffer */
  rxBuffer: string[];
}

// ---------------------------------------------------------------------------
// Simulation events (event log)
// ---------------------------------------------------------------------------

export interface SimulationEvent {
  id: string;
  timestamp: number; // Unix ms
  severity: EventSeverity;
  labId: LabId;
  /** Short machine-friendly key, e.g. "pin_mode_changed" */
  type: string;
  /** Human-readable message */
  message: string;
  /** Optional structured payload for debugging */
  payload?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Microcontroller state (top-level simulation state)
// ---------------------------------------------------------------------------

export interface SystemClock {
  /** Clock frequency in Hz (e.g. 16,000,000 for 16MHz) */
  frequencyHz: number;
  /** Simulation uptime in milliseconds */
  uptimeMs: number;
}

export interface MicrocontrollerState {
  gpio: GPIOState;
  pwm: PWMState;
  adc: ADCState;
  uart: UARTState;
  clock: SystemClock;
}

/**
 * Top-level SimulationState container
 */
export interface SimulationState {
  digitalPins: DigitalPin[];
  analogChannels: AnalogChannel[];
  pwmChannels: PWMChannel[];
  uart: UARTState;
  clock: SystemClock;
  eventLog: SimulationEvent[];
}

// ---------------------------------------------------------------------------
// Lab state (combines simulator state + challenge state + event log)
// ---------------------------------------------------------------------------

export interface LabState {
  labId: LabId;
  status: SimulationStatus;
  microcontroller: MicrocontrollerState;
  events: SimulationEvent[];
  activeChallenge: ChallengeState | null;
}

// ---------------------------------------------------------------------------
// Challenge system
// ---------------------------------------------------------------------------

export type ChallengeStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "PASSED"
  | "FAILED";

export type ChallengeDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface ChallengeHint {
  order: number;
  text: string;
}

export interface ChallengeScoringRules {
  baseScore: number;
  hintPenalty: number;
  attemptPenalty: number;
  minScore: number;
}

export interface ChallengeAttempt {
  timestamp: number;
  passed: boolean;
  /** Snapshot of the microcontroller state at time of validation */
  stateSnapshot: Partial<MicrocontrollerState>;
}

export interface ChallengeState {
  challengeId: string;
  labId: LabId;
  status: ChallengeStatus;
  /** Number of validation attempts made */
  attempts: number;
  /** Score 0–100 (decreases with hints/attempts) */
  score: number;
  /** Index of the next hint to reveal (0-based) */
  hintsRevealed: number;
  /** Timestamp when challenge was successfully passed */
  completedAt?: number | null;
  attempts_log: ChallengeAttempt[];
}

/**
 * A challenge definition — what the student must achieve.
 * Evaluated entirely by the simulation engine, never by the UI or AI.
 */
export interface ChallengeDefinition {
  id: string;
  labId: LabId;
  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  objectives: string[];
  /** Ordered list of progressive hints */
  hints: ChallengeHint[];
  successMessage: string;
  scoringRules: ChallengeScoringRules;
  /**
   * Validation function key.
   * Implementations live in lib/challenges/, registered in lib/challenges/index.ts.
   */
  validatorKey: string;
}

// ---------------------------------------------------------------------------
// Validation result
// ---------------------------------------------------------------------------

export interface ValidationResult {
  passed: boolean;
  score: number;
  /** Feedback to display to the student */
  feedback: string;
  /** Which specific conditions passed/failed */
  conditions: ValidationCondition[];
}

export interface ValidationCondition {
  label: string;
  passed: boolean;
  detail?: string;
}

// ---------------------------------------------------------------------------
// AI context (scoped, minimal — only relevant state sent to AI)
// ---------------------------------------------------------------------------

export interface AIContext {
  labId: LabId;
  challengeId: string | null;
  /** Sanitized, minimal snapshot of current relevant state */
  stateSnapshot: Record<string, unknown>;
  /** Recent event log entries */
  recentEvents: Pick<SimulationEvent, "type" | "message" | "severity">[];
}
