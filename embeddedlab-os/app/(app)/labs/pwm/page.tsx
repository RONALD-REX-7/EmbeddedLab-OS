import type { Metadata } from "next";
import { PWMWorkspace } from "@/components/lab/pwm/pwm-workspace";

export const metadata: Metadata = {
  title: "PWM Lab",
};

export default function PWMLabPage() {
  return <PWMWorkspace />;
}
