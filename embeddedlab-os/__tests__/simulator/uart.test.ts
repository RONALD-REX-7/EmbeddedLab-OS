/**
 * EmbeddedLab OS — UART Simulator Unit Tests
 */
import { describe, it, expect } from "vitest";
import {
  calculateUARTDerivedValues,
  checkUARTCompatibility,
  createDefaultUARTState,
  setTransmitterConfig,
  setReceiverConfig,
} from "@/lib/simulator/uart";
import type { UARTConfig } from "@/types/simulator";

const BASE_CONFIG: UARTConfig = {
  baudRate: 9600,
  dataBits: 8,
  parity: "NONE",
  stopBits: 1,
  flowControl: false,
};

describe("calculateUARTDerivedValues", () => {
  it("9600 baud, 8N1 → 10 bits/frame", () => {
    // 1 start + 8 data + 0 parity + 1 stop = 10
    const result = calculateUARTDerivedValues(BASE_CONFIG);
    expect(result.bitsPerFrame).toBe(10);
  });

  it("9600 baud, 8E1 → 11 bits/frame (parity adds 1 bit)", () => {
    const result = calculateUARTDerivedValues({ ...BASE_CONFIG, parity: "EVEN" });
    expect(result.bitsPerFrame).toBe(11);
  });

  it("9600 baud, 8N2 → 11 bits/frame (2 stop bits)", () => {
    const result = calculateUARTDerivedValues({ ...BASE_CONFIG, stopBits: 2 });
    expect(result.bitsPerFrame).toBe(11);
  });

  it("9600 baud → bit duration ≈ 104.167 µs", () => {
    const result = calculateUARTDerivedValues(BASE_CONFIG);
    expect(result.bitDurationMicros).toBeCloseTo(104.167, 1);
  });

  it("115200 baud → bit duration ≈ 8.681 µs", () => {
    const result = calculateUARTDerivedValues({ ...BASE_CONFIG, baudRate: 115200 });
    expect(result.bitDurationMicros).toBeCloseTo(8.681, 1);
  });

  it("frame duration = bits per frame × bit duration", () => {
    const config = { ...BASE_CONFIG, baudRate: 9600 };
    const result = calculateUARTDerivedValues(config);
    expect(result.frameDurationMicros).toBeCloseTo(
      result.bitsPerFrame * result.bitDurationMicros,
      5
    );
  });
});

describe("checkUARTCompatibility", () => {
  it("identical configs are compatible", () => {
    const { compatible } = checkUARTCompatibility(BASE_CONFIG, BASE_CONFIG);
    expect(compatible).toBe(true);
  });

  it("detects baud rate mismatch", () => {
    const rx = { ...BASE_CONFIG, baudRate: 115200 };
    const { compatible, note } = checkUARTCompatibility(BASE_CONFIG, rx);
    expect(compatible).toBe(false);
    expect(note).toContain("Baud rate mismatch");
  });

  it("detects parity mismatch", () => {
    const rx = { ...BASE_CONFIG, parity: "EVEN" as const };
    const { compatible, note } = checkUARTCompatibility(BASE_CONFIG, rx);
    expect(compatible).toBe(false);
    expect(note).toContain("Parity mismatch");
  });

  it("detects stop bits mismatch", () => {
    const rx = { ...BASE_CONFIG, stopBits: 2 as const };
    const { compatible, note } = checkUARTCompatibility(BASE_CONFIG, rx);
    expect(compatible).toBe(false);
    expect(note).toContain("Stop bits mismatch");
  });

  it("detects multiple mismatches and includes all in note", () => {
    const rx = { ...BASE_CONFIG, baudRate: 115200, parity: "ODD" as const };
    const { compatible, note } = checkUARTCompatibility(BASE_CONFIG, rx);
    expect(compatible).toBe(false);
    expect(note).toContain("Baud rate mismatch");
    expect(note).toContain("Parity mismatch");
  });
});

describe("UART state transitions", () => {
  it("default state is compatible (both sides at 9600 8N1)", () => {
    const state = createDefaultUARTState();
    expect(state.compatible).toBe(true);
  });

  it("changing TX baud rate creates incompatibility", () => {
    const state = createDefaultUARTState();
    const { state: newState } = setTransmitterConfig(state, { baudRate: 115200 });
    expect(newState.compatible).toBe(false);
    expect(newState.transmitter.baudRate).toBe(115200);
  });

  it("matching TX and RX restores compatibility", () => {
    let state = createDefaultUARTState();
    ({ state } = setTransmitterConfig(state, { baudRate: 115200 }));
    const { state: newState } = setReceiverConfig(state, { baudRate: 115200 });
    expect(newState.compatible).toBe(true);
  });

  it("incompatible state produces WARNING severity event", () => {
    const state = createDefaultUARTState();
    const { event } = setTransmitterConfig(state, { baudRate: 115200 });
    expect(event.severity).toBe("WARNING");
  });

  it("compatible state produces INFO severity event", () => {
    const state = createDefaultUARTState();
    const { event } = setTransmitterConfig(state, { baudRate: 9600 });
    expect(event.severity).toBe("INFO");
  });
});
