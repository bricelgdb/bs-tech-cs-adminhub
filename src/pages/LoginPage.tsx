import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "@/hooks/use-toast";
import bsLogo from "@/assets/bestseller-logo.png";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate("/dashboard", { replace: true });
  }, [session, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/dashboard", { replace: true });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { name },
          },
        });
        if (error) throw error;
        toast({ title: "Check your email", description: "Confirm your address to finish signing up." });
      }
    } catch (err: any) {
      toast({ title: "Authentication failed", description: err.message ?? "Try again.", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      toast({ title: "Google sign-in failed", description: String(result.error), variant: "destructive" });
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-sidebar">
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <img src={bsLogo} alt="BESTSELLER" className="h-[120px] w-auto mb-6" />
        <p className="text-[#e1fe66] text-sm font-semibold tracking-widest uppercase mb-10">
          TECH Creative Solutions Admin Hub
        </p>
        <div className="w-full max-w-sm space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                required
                className="h-12 w-full rounded-md border border-sidebar-border bg-sidebar-accent px-4 text-sm text-sidebar-foreground placeholder:text-sidebar-foreground/40 focus:outline-none focus:border-sidebar-foreground/30"
              />
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@bestseller.com"
              required
              className="h-12 w-full rounded-md border border-sidebar-border bg-sidebar-accent px-4 text-sm text-sidebar-foreground placeholder:text-sidebar-foreground/40 focus:outline-none focus:border-sidebar-foreground/30"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              minLength={8}
              className="h-12 w-full rounded-md border border-sidebar-border bg-sidebar-accent px-4 text-sm text-sidebar-foreground placeholder:text-sidebar-foreground/40 focus:outline-none focus:border-sidebar-foreground/30"
            />
            <button
              type="submit"
              disabled={busy}
              className="h-12 w-full rounded-md bg-sidebar-foreground font-semibold tracking-wide text-sm text-sidebar-background hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {busy ? "..." : mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
            </button>
          </form>

          <div className="flex items-center gap-3 text-xs text-sidebar-foreground/40">
            <div className="h-px flex-1 bg-sidebar-border" /> or <div className="h-px flex-1 bg-sidebar-border" />
          </div>

          <button
            onClick={handleGoogle}
            disabled={busy}
            className="h-12 w-full rounded-md border border-sidebar-border bg-sidebar-accent text-sm font-medium text-sidebar-foreground hover:opacity-90 disabled:opacity-50"
          >
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="w-full text-center text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground"
          >
            {mode === "signin" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>

      <div className="p-6">
        <p className="text-xs text-sidebar-foreground/40">© 2026 BESTSELLER A/S</p>
      </div>
    </div>
  );
}
