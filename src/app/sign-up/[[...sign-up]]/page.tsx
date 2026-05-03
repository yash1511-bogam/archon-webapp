import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <SignUp
        forceRedirectUrl="/dashboard"
        appearance={{
          baseTheme: dark,
          variables: { colorPrimary: "#10b981", colorBackground: "#ffffff", colorInputBackground: "#f4f4f5", colorInputText: "#09090b", colorText: "#09090b", colorTextSecondary: "#71717a" },
          elements: { card: "shadow-2xl border border-zinc-200" },
        }}
      />
    </div>
  );
}
