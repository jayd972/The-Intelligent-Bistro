import { MenuItem, AssistantRequest, AssistantResponse } from "@/types";

const API_BASE = "http://localhost:3000/api";

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.error || `Request failed (${res.status})`);
  }

  return res.json();
}

export async function fetchMenu(
  category?: string
): Promise<{ items: MenuItem[]; total: number }> {
  const query = category ? `?category=${category}` : "";
  return request(`/menu${query}`);
}

export async function sendMessage(
  message: string
): Promise<AssistantResponse> {
  const body: AssistantRequest = { message };
  return request("/assistant", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function checkHealth(): Promise<{
  status: string;
  service: string;
  timestamp: string;
}> {
  return request("/health");
}
