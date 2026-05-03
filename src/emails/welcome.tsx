import { Button, Heading, Text, Section, CodeInline } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./layout";

export function WelcomeEmail({ name }: { name: string }) {
  return (
    <EmailLayout preview={`Welcome to Archon, ${name}!`}>
      <Heading className="text-white text-2xl font-bold mt-0">Welcome to Archon, {name}!</Heading>
      <Text className="text-[#a1a1aa] text-sm leading-6">
        You now have access to the production harness for AI agents — cost control, security, observability, memory, eval, and governance built in.
      </Text>
      <Section className="bg-[#0a0a0f] border border-[#1f1f2a] rounded-lg p-4 my-4">
        <Text className="text-white text-sm font-semibold mt-0 mb-2">Get started in 3 steps:</Text>
        <Text className="text-[#a1a1aa] text-sm m-0">1. Generate an API key in the dashboard</Text>
        <Text className="text-[#a1a1aa] text-sm m-0">2. Install the SDK: <CodeInline className="text-[#10b981] bg-[#1f1f2a] px-1 rounded">pip install archon-framework</CodeInline></Text>
        <Text className="text-[#a1a1aa] text-sm m-0">3. Set <CodeInline className="text-[#10b981] bg-[#1f1f2a] px-1 rounded">ARCHON_API_KEY</CodeInline> and run your first agent</Text>
      </Section>
      <Button href="https://archon.dev/dashboard/api-keys" className="bg-[#10b981] text-black font-semibold text-sm px-5 py-3 rounded-lg">
        Create your first API key →
      </Button>
    </EmailLayout>
  );
}
export default WelcomeEmail;
