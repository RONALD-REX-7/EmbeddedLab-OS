import type { Metadata } from "next";
import { ADCWorkspace } from "@/components/lab/adc/adc-workspace";

export const metadata: Metadata = {
  title: "ADC Lab",
};

export default function ADCLabPage() {
  return <ADCWorkspace />;
}
