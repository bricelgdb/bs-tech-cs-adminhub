import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginLogo from "@/assets/login-logo.png";

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
        <img src={loginLogo} alt="TECH Creative Solutions Admin Hub" className="h-14 w-auto" />
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
