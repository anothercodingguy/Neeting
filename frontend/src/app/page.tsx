"use client";
import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import MeetingCard from "@/components/meetings/MeetingCard";
import UploadForm from "@/components/meetings/UploadForm";
import ChatBox from "@/components/chat/ChatBox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import api from "@/services/api";

interface Meeting {
  id: number;
  title: string;
  transcript_length?: number;
  estimated_duration_minutes?: number;
  speaker_count?: number;
  created_at?: string;
}

export default function DashboardPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const pageSize = 9;

  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/meetings/", {
        params: { skip: page * pageSize, limit: pageSize, search: search || undefined },
      });
      setMeetings(res.data);
    } catch {
      // API error
    }
    setLoading(false);
  }, [page, search]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchMeetings();
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
            <p className="text-zinc-400 mt-1">Manage and generate AI insights</p>
          </div>
          <Button onClick={() => setShowUpload(!showUpload)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Meeting
          </Button>
        </div>

        {/* Upload Form */}
        {showUpload && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Upload Meeting Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <UploadForm
                onSuccess={() => {
                  setShowUpload(false);
                  fetchMeetings();
                }}
              />
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search meetings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>

        {/* Meetings Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          </div>
        ) : meetings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <p className="text-lg">No meetings found</p>
            <p className="text-sm mt-1">Upload a transcript to get started</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {meetings.map((meeting) => (
                <MeetingCard key={meeting.id} {...meeting} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-zinc-400">Page {page + 1}</span>
              <Button
                variant="outline"
                size="sm"
                disabled={meetings.length < pageSize}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}

        {/* Chat Section */}
        <div className="mt-12">
          <ChatBox />
        </div>
      </main>
    </div>
  );
}
