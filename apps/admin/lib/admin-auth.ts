export interface AdminAuthConfig {
  username?: string | undefined;
  password?: string | undefined;
}

export interface AdminAuthResult {
  enabled: boolean;
  ok: boolean;
}

export function isAdminAuthEnabled(config: AdminAuthConfig): boolean {
  return Boolean(config.password?.trim());
}

export function verifyAdminBasicAuth(
  authorization: string | null,
  config: AdminAuthConfig,
  decodeBase64: (value: string) => string,
): AdminAuthResult {
  if (!isAdminAuthEnabled(config)) {
    return { enabled: false, ok: true };
  }

  if (!authorization?.startsWith("Basic ")) {
    return { enabled: true, ok: false };
  }

  try {
    const encoded = authorization.slice("Basic ".length);
    const decoded = decodeBase64(encoded);
    const splitAt = decoded.indexOf(":");

    if (splitAt < 0) {
      return { enabled: true, ok: false };
    }

    const username = decoded.slice(0, splitAt);
    const password = decoded.slice(splitAt + 1);
    const expectedUsername = config.username?.trim() || "admin";

    return {
      enabled: true,
      ok: username === expectedUsername && password === config.password,
    };
  } catch {
    return { enabled: true, ok: false };
  }
}
