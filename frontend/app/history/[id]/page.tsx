"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HistoryMeetingRedirect() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (params.id) {
      router.replace(`/meeting/${params.id}`);
    }
  }, [params.id, router]);

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground" />
    </div>
  );
}
