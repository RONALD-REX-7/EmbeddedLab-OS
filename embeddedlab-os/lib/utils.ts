/**
 * EmbeddedLab OS — lib/utils.ts
 * Shared utility functions (className merging, number formatting, etc.)
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names with conflict resolution. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a number with a fixed number of decimal places,
 * stripping trailing zeros.
 */
export function formatNumber(value: number, decimals = 2): string {
  return parseFloat(value.toFixed(decimals)).toString();
}

/**
 * Clamp a value between min and max (inclusive).
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generate a unique event ID for the simulation event log.
 */
export function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
