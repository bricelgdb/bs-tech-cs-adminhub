import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top-left branding */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="TECH Creative Solutions" className="h-8 w-auto" />
          <div>
            <span className="text-sm font-bold tracking-[0.15em] text-foreground">BESTSELLER</span>
            <span className="ml-2 text-sm font-bold tracking-[0.08em] text-accent">TECH</span>
          </div>
        </div>
        <p className="mt-1 ml-11 text-xs text-muted-foreground">Creative Solutions Admin Hub</p>
      </div>

      {/* Centered login form */}
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-sm">
          <p className="mb-6 text-sm text-muted-foreground">
            Sign in to access your BESTSELLER TECH Creative Solutions workspace
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@bestseller.com"
              className="h-12 w-full rounded-md border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="h-12 w-full rounded-md bg-accent font-semibold tracking-wide text-sm text-accent-foreground hover:opacity-90 transition-opacity"
            >
              SSO LOGIN
            </button>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Request access{" "}
            <a href="#" className="font-medium text-accent hover:underline">
              HERE
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6">
        <p className="text-xs text-muted-foreground">© 2026 BESTSELLER A/S</p>
      </div>
    </div>
  );
}
