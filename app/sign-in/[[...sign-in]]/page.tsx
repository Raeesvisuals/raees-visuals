import React from "react";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-dark to-dark" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark-lighter/20 to-dark pointer-events-none" />
      <div className="relative z-10">
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          afterSignInUrl="/account"
          appearance={{
            elements: {
              card: "bg-dark-lighter/80 border border-text-primary/10 shadow-xl",
              headerTitle: "text-text-primary",
              headerSubtitle: "text-text-primary/60",
              socialButtonsBlockButton: "border border-text-primary/20 text-text-primary",
              formButtonPrimary: "bg-primary text-dark hover:bg-primary/90",
              formFieldInput:
                "bg-dark/60 border border-text-primary/20 text-text-primary placeholder:text-text-primary/40",
              footerActionLink: "text-primary hover:text-primary/90",
            },
          }}
        />
      </div>
    </div>
  );
}
