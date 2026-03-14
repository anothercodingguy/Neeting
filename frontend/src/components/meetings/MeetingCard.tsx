"use client";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Clock, Users, FileText } from "lucide-react";

interface MeetingCardProps {
  id: number;
  title: string;
  transcript_length?: number;
  estimated_duration_minutes?: number;
  speaker_count?: number;
  created_at?: string;
}

export default function MeetingCard({
  id,
  title,
  transcript_length,
  estimated_duration_minutes,
  speaker_count,
  created_at,
}: MeetingCardProps) {
  return (
    <Link href={`/meetings/${id}`}>
      <Card className="hover:border-zinc-600 hover:shadow-xl transition-all duration-300 cursor-pointer group">
        <CardHeader>
          <CardTitle className="group-hover:text-white transition-colors truncate">
            {title}
          </CardTitle>
          <CardDescription>
            {created_at
              ? formatDistanceToNow(new Date(created_at), { addSuffix: true })
              : "Unknown date"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" />
              {transcript_length ?? 0} words
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {estimated_duration_minutes?.toFixed(1) ?? 0} min
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {speaker_count ?? 1}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
