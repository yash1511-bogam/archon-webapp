import { Heading, Text, Section } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./layout";

export function ApiKeyCreatedEmail({ name, keyName, prefix, scopes }: { name: string; keyName: string; prefix: string; scopes: string[] }) {
  return (
    <EmailLayout preview={`New API key "${keyName}" created`}>
      <Heading className="text-white text-xl font-bold mt-0">New API key created</Heading>
      <Text className="text-[#a1a1aa] text-sm">Hi {name}, a new API key was just created on your account.</Text>
      <Section className="bg-[#0a0a0f] border border-[#1f1f2a] rounded-lg p-4 my-4">
        <Text className="text-[#a1a1aa] text-xs m-0">NAME</Text>
        <Text className="text-white text-sm font-medium mt-1 mb-3">{keyName}</Text>
        <Text className="text-[#a1a1aa] text-xs m-0">PREFIX</Text>
        <Text className="text-white text-sm font-mono mt-1 mb-3">{prefix}••••••••</Text>
        <Text className="text-[#a1a1aa] text-xs m-0">SCOPES</Text>
        <Text className="text-[#10b981] text-sm font-mono mt-1 mb-0">{scopes.join(", ")}</Text>
      </Section>
      <Text className="text-[#71717a] text-xs">If you did not create this key, revoke it immediately in the dashboard.</Text>
    </EmailLayout>
  );
}
export default ApiKeyCreatedEmail;
