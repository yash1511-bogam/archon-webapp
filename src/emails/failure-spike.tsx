import { Heading, Text, Section, Button } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./layout";

export function FailureSpikeEmail({ name, failureRate, agent, window }: { name: string; failureRate: string; agent: string; window: string }) {
  return (
    <EmailLayout preview={`Failure spike detected: ${failureRate} on ${agent}`}>
      <Heading className="text-white text-xl font-bold mt-0">🔴 Failure rate spike detected</Heading>
      <Text className="text-[#a1a1aa] text-sm">Hi {name}, the regression detector flagged an anomaly.</Text>
      <Section className="bg-[#0a0a0f] border border-[#f43f5e]/20 rounded-lg p-4 my-4">
        <Text className="text-[#a1a1aa] text-xs m-0">AGENT</Text>
        <Text className="text-white text-sm font-mono mt-1 mb-3">{agent}</Text>
        <Text className="text-[#a1a1aa] text-xs m-0">FAILURE RATE</Text>
        <Text className="text-[#f43f5e] text-2xl font-bold font-mono mt-1 mb-3">{failureRate}</Text>
        <Text className="text-[#a1a1aa] text-xs m-0">WINDOW</Text>
        <Text className="text-white text-sm mt-1 mb-0">{window}</Text>
      </Section>
      <Button href="https://archon.yashbogam.me/dashboard/traces" className="bg-[#10b981] text-black font-semibold text-sm px-5 py-3 rounded-lg">
        View traces →
      </Button>
    </EmailLayout>
  );
}
export default FailureSpikeEmail;
