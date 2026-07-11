import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProcessingResponse, ProcessingStatus } from "@/lib/types";
import { processMeeting, UsageLimitError, getUsage } from "@/lib/api";

export function useMeetingProcessor() {
  const router = useRouter();
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [result, setResult] = useState<ProcessingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchUsage = async () => {
      try {
        const usage = await getUsage();
        if (mounted) {
          setLimitReached(usage.used >= usage.limit);
        }
      } catch (err) {
        console.error("Failed to fetch usage:", err);
      }
    };
    
    fetchUsage();
    
    const handleUsageUpdated = () => fetchUsage();
    window.addEventListener("usage-updated", handleUsageUpdated);
    
    return () => {
      mounted = false;
      window.removeEventListener("usage-updated", handleUsageUpdated);
    };
  }, []);

  const handleUpload = useCallback(async (file: File, outputLanguage: string) => {
    setError(null);
    setResult(null);
    setStatus("uploading");

    try {
      setStatus("transcribing");
      const data = await processMeeting(file, outputLanguage);
      
      setStatus("summarizing");
      setResult(data);
      setStatus("complete");
      
      window.dispatchEvent(new Event("usage-updated"));
      router.refresh();
    } catch (err) {
      if (err instanceof UsageLimitError) {
        window.dispatchEvent(new Event("open-upgrade-modal"));
        setStatus("idle");
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setStatus("error");
      }
    }
  }, [router]);

  const handleReset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setError(null);
  }, []);

  return {
    status,
    result,
    error,
    limitReached,
    handleUpload,
    handleReset,
  };
}
