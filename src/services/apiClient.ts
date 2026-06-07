const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok)
      throw new Error(`Network layer fault: ${response.statusText}`);
    return response.json();
  },

  async post<T, R>(endpoint: string, body: T): Promise<R> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok)
      throw new Error(`Write pipeline failure: ${response.statusText}`);
    return response.json();
  },
};
