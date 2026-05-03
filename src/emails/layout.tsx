import { Body, Container, Head, Hr, Html, Img, Preview, Section, Tailwind, Text } from "@react-email/components";
import * as React from "react";

export function EmailLayout({ preview, children }: { preview: string; children: React.ReactNode }) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="bg-[#09090b] font-sans">
          <Container className="mx-auto max-w-[560px] px-4 py-8">
            <Text className="text-[#10b981] text-xl font-bold mb-0">⚡ Archon</Text>
            <Hr className="border-[#1f1f2a] my-4" />
            {children}
            <Hr className="border-[#1f1f2a] my-6" />
            <Text className="text-[#71717a] text-xs">
              Archon — The production harness for AI agents.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
