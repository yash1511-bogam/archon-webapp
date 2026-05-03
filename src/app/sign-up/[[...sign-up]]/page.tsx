import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <SignUp
        forceRedirectUrl="/dashboard"
        appearance={{
          baseTheme: dark,
          variables: { colorPrimary: "#10b981", colorBackground: "#0a0a0f", colorInputBackground: "#111118", colorInputText: "#fafafa", colorText: "#fafafa", colorTextSecondary: "#a1a1aa" },
        }}
      />
    </div>
  );
}
