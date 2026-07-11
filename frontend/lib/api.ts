import { ProcessingResponse } from "./types";
import { createClient } from "./supabase";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return {};
  return { Authorization: `Bearer ${session.access_token}` };
}

export class UsageLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UsageLimitError";
  }
}

export async function processMeeting(file: File, outputLanguage: string = "English"): Promise<ProcessingResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("output_language", outputLanguage);

  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE}/process-meeting`, {
    method: "POST",
    headers, // Fetch will automatically set multipart/form-data boundary when body is FormData
    body: formData,
  });

  if (!response.ok) {
    let error: any = {};
    const clonedResponse = response.clone();
    try {
      error = await response.json();
    } catch {
      const rawText = await clonedResponse.text().catch(() => "");
      throw new Error(rawText ? `Server Error: ${rawText.substring(0, 100)}` : `Server Error: ${response.status}`);
    }
    if (error.upgradeRequired) {
      throw new UsageLimitError(error.error || "Free plan limit reached");
    }
    throw new Error(error.detail || `Server error: ${response.status}`);
  }

  return response.json();
}

export async function getUsage() {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/usage?t=${Date.now()}`, { headers, cache: "no-store" });
  if (!response.ok) return { plan: "Free", used: 0, limit: 3, remaining: 3 };
  return response.json();
}

export async function askQuestion(
  meetingId: string,
  question: string,
  transcript: string,
  summary: string
): Promise<{ answer: string }> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ meeting_id: meetingId, question, transcript, summary }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Chat failed" }));
    throw new Error(error.detail || `Server error: ${response.status}`);
  }

  return response.json();
}

export async function translateTranscript(
  transcript: string,
  sourceLanguage: string,
  targetLanguage: string = "English"
): Promise<{ translated_transcript: string }> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/translate-transcript`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      transcript,
      source_language: sourceLanguage,
      target_language: targetLanguage,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Translation failed" }));
    throw new Error(error.detail || `Server error: ${response.status}`);
  }

  return response.json();
}

export async function getMeetings(signal?: AbortSignal) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/meetings?t=${Date.now()}`, { 
    headers,
    cache: "no-store",
    signal
  });
  if (!response.ok) throw new Error("Failed to fetch meetings");
  return response.json();
}

export async function getMeeting(id: string) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/meetings/${id}?t=${Date.now()}`, { 
    headers,
    cache: "no-store" 
  });
  if (!response.ok) {
    if (response.status === 404) throw new Error("Meeting not found");
    throw new Error("Failed to fetch meeting");
  }
  return response.json();
}

export async function deleteMeetingApi(id: string) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/meetings/${id}`, { method: "DELETE", headers });
  if (!response.ok) throw new Error("Failed to delete meeting");
  return response.json();
}

export async function deleteAllMeetingsApi() {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/meetings`, { method: "DELETE", headers });
  if (!response.ok) throw new Error("Failed to delete all meetings");
  return response.json();
}

export async function getActions(signal?: AbortSignal) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/actions?t=${Date.now()}`, { 
    headers,
    cache: "no-store",
    signal
  });
  if (!response.ok) throw new Error("Failed to fetch actions");
  return response.json();
}

export async function toggleActionStatusApi(id: string, status: string) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/actions/${id}/status`, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  if (!response.ok) throw new Error("Failed to update status");
  return response.json();
}

export async function getDecisions(signal?: AbortSignal) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/decisions?t=${Date.now()}`, { 
    headers,
    cache: "no-store",
    signal
  });
  if (!response.ok) throw new Error("Failed to fetch decisions");
  return response.json();
}

export async function createOrder() {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/payments/create-order`, { method: "POST", headers });
  if (!response.ok) throw new Error("Failed to create order");
  return response.json();
}

export async function verifyPayment(paymentData: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/payments/verify`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(paymentData),
  });
  if (!response.ok) throw new Error("Failed to verify payment");
  return response.json();
}
