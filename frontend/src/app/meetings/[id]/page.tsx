"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import SummaryPanel from "@/components/meetings/SummaryPanel";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, Trash2, Clock, Users, FileText, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import api from "@/services/api";

interface Meeting {
  id: number;
  title: string;
  transcript: string;
  transcript_length?: number;
  estimated_duration_minutes?: number;
  speaker_count?: number;
  created_at?: string;
}

export default function MeetingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const meetingId = Number(params.id);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api
      .get(`/meetings/${meetingId}`)
      .then((res) => setMeeting(res.data))
      .catch(() => router.push("/"))
      .finally(() => setLoading(false));
  }, [meetingId, router]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this meeting?")) return;
    setDeleting(true);
    try {
      await api.delete(`/meetings/${meetingId}`);
      router.push("/");
    } catch {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        </div>
      </div>
    );
  }

  if (!meeting) return null;

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Back & Actions */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => router.push("/")} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </Button>
        </div>

        {/* Meeting Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">{meeting.title}</CardTitle>
            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400 mt-2">
              {meeting.created_at && (
                <span>
                  {formatDistanceToNow(new Date(meeting.created_at), { addSuffix: true })}
                </span>
              )}
              <span className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                {meeting.transcript_length ?? 0} words
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {meeting.estimated_duration_minutes?.toFixed(1) ?? 0} min
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {meeting.speaker_count ?? 1} speakers
              </span>
            </div>
          </CardHeader>
        </Card>

        {/* AI Insights */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <SummaryPanel meetingId={meeting.id} />
          </CardContent>
        </Card>

        {/* Transcript */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 max-h-[500px] overflow-y-auto">
              <pre className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed font-mono">
                {meeting.transcript}
              </pre>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
