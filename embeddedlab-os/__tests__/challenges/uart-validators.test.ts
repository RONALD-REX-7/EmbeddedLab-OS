import { describe, it, expect, beforeEach } from "vitest";
import { SimulationEngine } from "@/lib/simulator/engine";
import { checkUARTCompatibility } from "@/lib/simulator/uart";
import {
  validateUARTChallenge1,
  validateUARTChallenge2,
  validateUARTChallenge3,
} from "@/lib/challenges/uart-validators";

describe("UART Protocol Compatibility & Challenge Invariants", () => {
  let engine: SimulationEngine;

  beforeEach(() => {
    engine = new SimulationEngine();
  });

  it("should flag framing mismatches when TX and RX baud rates differ (e.g. 9600 vs 115200)", () => {
    const tx = { baudRate: 9600, dataBits: 8, parity: "NONE", stopBits: 1, flowControl: false } as const;
    const rx = { baudRate: 115200, dataBits: 8, parity: "NONE", stopBits: 1, flowControl: false } as const;

    const result = checkUARTCompatibility(tx, rx);
    expect(result.compatible).toBe(false);
    expect(result.note).toContain("Baud rate mismatch");
  });

  it("should flag parity mismatches (e.g. NONE vs EVEN)", () => {
    const tx = { baudRate: 9600, dataBits: 8, parity: "NONE", stopBits: 1, flowControl: false } as const;
    const rx = { baudRate: 9600, dataBits: 8, parity: "EVEN", stopBits: 1, flowControl: false } as const;

    const result = checkUARTCompatibility(tx, rx);
    expect(result.compatible).toBe(false);
    expect(result.note).toContain("Parity mismatch");
  });

  it("validateUARTChallenge1 — should validate message transmission when compatible", () => {
    let result = validateUARTChallenge1(engine.state);
    expect(result.passed).toBe(false);

    // Transmit a message
    engine.uartTransmit("HELLO WORLD");

    result = validateUARTChallenge1(engine.state);
    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
  });

  it("validateUARTChallenge2 — should validate 115200-8-E-1 spec configuration", () => {
    let result = validateUARTChallenge2(engine.state);
    expect(result.passed).toBe(false);

    engine.uartSetTransmitterConfig({ baudRate: 115200, parity: "EVEN" });
    engine.uartSetReceiverConfig({ baudRate: 115200, parity: "EVEN" });

    result = validateUARTChallenge2(engine.state);
    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
  });

  it("validateUARTChallenge3 — should validate resolving 9600 vs 115200 mismatch", () => {
    engine.uartSetTransmitterConfig({ baudRate: 9600 });
    engine.uartSetReceiverConfig({ baudRate: 115200 });

    let result = validateUARTChallenge3(engine.state);
    expect(result.passed).toBe(false);

    engine.uartSetReceiverConfig({ baudRate: 9600 });

    result = validateUARTChallenge3(engine.state);
    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
  });
});
