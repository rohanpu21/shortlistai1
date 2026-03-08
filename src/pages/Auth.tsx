import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Loader2 } from "lucide-react";
import { lovable } from "@/integrations/lovable";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in or when auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate("/analyze", { replace: true });
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/analyze", { replace: true });
    });

    return () => subscription.unsubscribe();
  }, [navigate]);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    mobile: "",
    college: "",
    year: "",
    branch: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Client-side validation for signup
    if (!isLogin) {
      if (form.name.trim().length < 2 || form.name.trim().length > 100) {
        toast({ title: "Invalid name", description: "Name must be 2-100 characters.", variant: "destructive" });
        setLoading(false);
        return;
      }
      if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) {
        toast({ title: "Invalid mobile", description: "Enter a valid 10-digit Indian mobile number.", variant: "destructive" });
        setLoading(false);
        return;
      }
      if (form.college.trim().length < 2) {
        toast({ title: "Invalid college", description: "Please enter your college name.", variant: "destructive" });
        setLoading(false);
        return;
      }
      if (!form.year) {
        toast({ title: "Select year", description: "Please select your academic year.", variant: "destructive" });
        setLoading(false);
        return;
      }
      if (form.branch.trim().length < 2) {
        toast({ title: "Invalid branch", description: "Please enter your branch.", variant: "destructive" });
        setLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        navigate("/analyze");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;

        if (data.user) {
          const { error: profileError } = await supabase.from("profiles").insert({
            user_id: data.user.id,
            name: form.name,
            mobile: form.mobile,
            college: form.college,
            year: form.year,
            branch: form.branch,
            email: form.email,
          });
          if (profileError) throw profileError;
        }

        toast({
          title: "Account created!",
          description: "You can now start analyzing your resume.",
        });
        navigate("/analyze");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-extrabold text-primary tracking-tight">
            ShortlistAI
          </a>
          <h1 className="text-2xl font-bold text-foreground mt-4">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isLogin ? "Sign in to continue analyzing resumes" : "Sign up to start your ATS analysis"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-card border border-border rounded-2xl p-6 shadow-sm">
          {!isLogin && (
            <>
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="Ankit Sharma" />
              </div>
              <div>
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input id="mobile" name="mobile" value={form.mobile} onChange={handleChange} required placeholder="9337709699" />
              </div>
              <div>
                <Label htmlFor="college">College Name</Label>
                <Input id="college" name="college" value={form.college} onChange={handleChange} required placeholder="VIT Vellore" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Year</Label>
                  <select
                    id="year"
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Graduated">Graduated</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="branch">Branch</Label>
                  <Input id="branch" name="branch" value={form.branch} onChange={handleChange} required placeholder="CSE" />
                </div>
              </div>
            </>
          )}

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="ankit@email.com" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required placeholder="••••••••" minLength={6} />
          </div>

          <Button type="submit" className="w-full rounded-full font-semibold gap-2" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isLogin ? "Sign In" : "Create Account"} <ArrowRight className="h-4 w-4" />
          </Button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or</span></div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full rounded-full font-semibold gap-2"
            onClick={async () => {
              const { error } = await lovable.auth.signInWithOAuth("google", {
                redirect_uri: window.location.origin,
              });
              if (error) {
                toast({ title: "Google Sign-In failed", description: error.message, variant: "destructive" });
              }
            }}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-primary font-semibold hover:underline">
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;
