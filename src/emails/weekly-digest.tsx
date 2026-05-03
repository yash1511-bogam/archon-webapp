import { Heading, Text, Section, Button, Row, Column } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./layout";

export function WeeklyDigestEmail({ name, totalRuns, totalCost, totalTokens, topModel, period }: { name: string; totalRuns: number; totalCost: string; totalTokens: string; topModel: string; period: string }) {
  return (
    <EmailLayout preview={`Your Archon weekly digest — ${period}`}>
      <Heading className="text-white text-xl font-bold mt-0">Weekly digest — {period}</Heading>
      <Text className="text-[#a1a1aa] text-sm">Hi {name}, here's your agent activity summary.</Text>
      <Section className="my-4">
        <Row>
          <Column className="bg-[#0a0a0f] border border-[#1f1f2a] rounded-lg p-4 text-center">
            <Text className="text-[#a1a1aa] text-xs m-0">RUNS</Text>
            <Text className="text-white text-2xl font-bold font-mono mt-1 mb-0">{totalRuns.toLocaleString()}</Text>
          </Column>
          <Column className="w-3" />
          <Column className="bg-[#0a0a0f] border border-[#1f1f2a] rounded-lg p-4 text-center">
            <Text className="text-[#a1a1aa] text-xs m-0">COST</Text>
            <Text className="text-[#10b981] text-2xl font-bold font-mono mt-1 mb-0">{totalCost}</Text>
          </Column>
          <Column className="w-3" />
          <Column className="bg-[#0a0a0f] border border-[#1f1f2a] rounded-lg p-4 text-center">
            <Text className="text-[#a1a1aa] text-xs m-0">TOKENS</Text>
            <Text className="text-white text-2xl font-bold font-mono mt-1 mb-0">{totalTokens}</Text>
          </Column>
        </Row>
      </Section>
      <Section className="bg-[#0a0a0f] border border-[#1f1f2a] rounded-lg p-4 my-4">
        <Text className="text-[#a1a1aa] text-xs m-0">TOP MODEL</Text>
        <Text className="text-white text-sm font-mono mt-1 mb-0">{topModel}</Text>
      </Section>
      <Button href="https://archon.yashbogam.me/dashboard/analytics" className="bg-[#10b981] text-black font-semibold text-sm px-5 py-3 rounded-lg">
        View full analytics →
      </Button>
    </EmailLayout>
  );
}
export default WeeklyDigestEmail;
