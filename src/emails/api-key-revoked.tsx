import { Heading, Text, Section } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./layout";

export function ApiKeyRevokedEmail({ name, keyName, prefix }: { name: string; keyName: string; prefix: string }) {
  return (
    <EmailLayout preview={`API key "${keyName}" revoked`}>
      <Heading className="text-white text-xl font-bold mt-0">API key revoked</Heading>
      <Text className="text-[#a1a1aa] text-sm">Hi {name}, an API key was revoked on your account. Any requests using this key will now fail.</Text>
      <Section className="bg-[#0a0a0f] border border-[#1f1f2a] rounded-lg p-4 my-4">
        <Text className="text-[#a1a1aa] text-xs m-0">KEY</Text>
        <Text className="text-white text-sm font-mono mt-1 mb-0">{keyName} ({prefix}••••)</Text>
      </Section>
      <Text className="text-[#71717a] text-xs">If this was not you, secure your account immediately.</Text>
    </EmailLayout>
  );
}
export default ApiKeyRevokedEmail;
