/**
 * Simulated network layer.
 * All service functions return Promises and add a small artificial latency
 * so loading / skeleton / error states are exercised.
 */
import type { ApiResponse, ISODate } from "../../types/domain";

const baseLatency = (min = 80, max = 220) =>
  new Promise<void>((r) => setTimeout(r, min + Math.random() * (max - min)));

export const net = {
  async get<T>(data: T, latency = baseLatency): Promise<ApiResponse<T>> {
    await latency();
    return { data };
  },
  async post<T, _B = unknown>(data: T, latency = baseLatency): Promise<ApiResponse<T>> {
    await latency();
    return { data };
  },
  iso: (d: Date = new Date("2026-08-26")) => d.toISOString().slice(0, 10) as ISODate,
};
