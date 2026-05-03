import { Heading, Text, Section } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./layout";

export function BudgetAlertEmail({ name, percent, spent, limit, scope }: { name: string; percent: number; spent: string; limit: string; scope: string }) {
  return (
    <EmailLayout preview={`Budget ${percent}% used (${scope})`}>
      <Heading className="text-white text-xl font-bold mt-0">⚠️ Budget alert — {percent}% used</Heading>
      <Text className="text-[#a1a1aa] text-sm">Hi {name}, your {scope} budget is approaching its limit.</Text>
      <Section className="bg-[#0a0a0f] border border-[#1f1f2a] rounded-lg p-4 my-4">
        <Text className="text-[#a1a1aa] text-xs m-0">SPENT</Text>
        <Text className="text-white text-2xl font-bold font-mono mt-1 mb-3">{spent} <span className="text-[#71717a] text-sm">/ {limit}</span></Text>
        <Text className="text-[#a1a1aa] text-xs m-0">SCOPE</Text>
        <Text className="text-white text-sm mt-1 mb-0">{scope}</Text>
      </Section>
      <Text className="text-[#f59e0b] text-sm">The router will automatically downgrade to cheaper models as the budget gets tighter. When exceeded, agents stop and return partial results.</Text>
    </EmailLayout>
  );
}
export default BudgetAlertEmail;
