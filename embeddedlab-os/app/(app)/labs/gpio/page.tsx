import type { Metadata } from "next";
import { GPIOWorkspace } from "@/components/lab/gpio/gpio-workspace";

export const metadata: Metadata = {
  title: "GPIO Lab",
};

export default function GPIOLabPage() {
  return <GPIOWorkspace />;
}
