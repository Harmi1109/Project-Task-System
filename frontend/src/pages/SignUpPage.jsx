import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(to_bottom,#fdfbf7,#f9f5eb)] p-4 selection:bg-amber-200/60">
      <div className="animate-fadeIn shadow-[0_20px_50px_-12px_rgba(65,40,15,0.15)] rounded-2xl overflow-hidden border border-amber-200/30">
        <SignUp 
          routing="path" 
          path="/sign-up" 
          signInUrl="/sign-in" 
          afterSignUpUrl="/" 
          appearance={{
            variables: {
              colorPrimary: "#451a03",       // Rich Charcoal Bronze (amber-950)
              colorText: "#451a03",          // Rich Charcoal Bronze
              colorTextSecondary: "#b45309", // Warm Muted Amber (amber-700)
              colorBackground: "#ffffff",    // Crisp Paper White
              colorInputBackground: "#fdfbf7", // Warm Studio Alabaster/Ivory Tint
              colorInputText: "#451a03",
              borderRadius: "12px",
            },
            elements: {
              card: "border-0 shadow-none bg-white/95",
              socialButtonsBlockButton: "border-amber-200/60 hover:bg-amber-50/50 text-amber-950 transition-all text-xs font-semibold uppercase tracking-wider",
              formButtonPrimary: "bg-amber-950 hover:bg-amber-900 text-white text-xs font-semibold uppercase tracking-widest shadow-sm transition-all py-2.5",
              formFieldInput: "border-amber-200/60 focus:border-amber-400 focus:ring-amber-200/40 focus:bg-white text-sm transition-all",
              footerActionLink: "text-amber-800 hover:text-amber-950 hover:underline font-semibold",
              headerTitle: "font-display font-light tracking-wide text-amber-950 text-xl",
              headerSubtitle: "text-amber-700/60 text-xs font-medium tracking-wide",
            }
          }}
        />
      </div>
    </div>
  );
}