import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginLogo from "@/assets/login-logo.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col bg-sidebar">
      <div className="flex flex-1 flex-col items-center justify-center">
        <img src={loginLogo} alt="TECH Creative Solutions Admin Hub" className="h-[240px] w-auto mb-10" />
        <div className="w-full max-w-sm">
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@bestseller.com"
              className="h-12 w-full rounded-md border border-sidebar-border bg-sidebar-accent px-4 text-sm text-sidebar-foreground placeholder:text-sidebar-foreground/40 focus:outline-none focus:border-sidebar-foreground/30"
            />
            <button
              type="submit"
              className="h-12 w-full rounded-md bg-sidebar-foreground font-semibold tracking-wide text-sm text-sidebar-background hover:opacity-90 transition-opacity"
            >
              SSO LOGIN
            </button>
          </form>
        </div>
      </div>

      <div className="p-6">
        <p className="text-xs text-sidebar-foreground/40">© 2026 BESTSELLER A/S</p>
      </div>
    </div>
  );
}
