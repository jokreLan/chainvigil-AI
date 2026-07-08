interface ApiErrorBody {
  error?: {
    message?: unknown;
  };
}

export async function readApiErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const body = (await response.json()) as ApiErrorBody;

    if (typeof body.error?.message === "string" && body.error.message.trim().length > 0) {
      return body.error.message;
    }
  } catch {
    // Keep the UI on a human fallback when the API returns non-JSON errors.
  }

  return fallback;
}
