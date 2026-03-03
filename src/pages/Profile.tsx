import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, LogOut, User } from "lucide-react";

interface Resume {
  id: string;
  file_name: string;
  ats_score: number | null;
  created_at: string;
  analysis: any;
}

interface ProfileData {
  name: string;
  mobile: string;
  college: string;
  year: string;
  branch: string;
  email: string;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [{ data: profileData }, { data: resumeData }] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("resumes").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      if (profileData) setProfile(profileData);
      if (resumeData) setResumes(resumeData);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const getScoreColor = (score: number | null) => {
    if (!score) return "text-muted-foreground";
    if (score < 40) return "text-destructive";
    if (score < 70) return "text-primary";
    return "text-accent";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a href="/" className="text-xl font-extrabold text-primary tracking-tight">ShortlistAI</a>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/analyze")} className="gap-2">
              Analyze Resume
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }} className="gap-2 text-destructive">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <Button variant="ghost" onClick={() => navigate("/analyze")} className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Analyzer
        </Button>

        {/* Profile info */}
        {profile && (
          <div className="bg-card rounded-2xl border border-border p-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
                <p className="text-sm text-muted-foreground">{profile.college} • {profile.branch} • {profile.year}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Email:</span>
                <span className="ml-2 text-foreground">{profile.email}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Mobile:</span>
                <span className="ml-2 text-foreground">{profile.mobile}</span>
              </div>
            </div>
          </div>
        )}

        {/* Resume history */}
        <h2 className="text-2xl font-bold text-foreground mb-4">My Resumes</h2>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : resumes.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-10 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No resumes analyzed yet.</p>
            <Button onClick={() => navigate("/analyze")} className="mt-4 rounded-full">
              Analyze Your First Resume
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {resumes.map((r) => (
              <div
                key={r.id}
                className="bg-card rounded-xl border border-border p-4 flex items-center justify-between hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => navigate(`/analyze?report=${r.id}`)}
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground text-sm">{r.file_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                {r.ats_score !== null && (
                  <span className={`text-2xl font-extrabold ${getScoreColor(r.ats_score)}`}>
                    {r.ats_score}%
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
