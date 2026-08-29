import type { Metadata } from "next";
import { UARTWorkspace } from "@/components/lab/uart/uart-workspace";

export const metadata: Metadata = {
  title: "UART Lab",
};

export default function UARTLabPage() {
  return <UARTWorkspace />;
}
