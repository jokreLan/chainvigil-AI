import {
  isBasicAuthEnabled,
  verifyBasicAuth,
  type BasicAuthConfig,
  type BasicAuthResult,
} from "@chainvigil/config";

export type AdminAuthConfig = BasicAuthConfig;
export type AdminAuthResult = BasicAuthResult;

export function isAdminAuthEnabled(config: AdminAuthConfig): boolean {
  return isBasicAuthEnabled(config);
}

export function verifyAdminBasicAuth(
  authorization: string | null,
  config: AdminAuthConfig,
  decodeBase64: (value: string) => string,
): AdminAuthResult {
  return verifyBasicAuth(authorization, config, decodeBase64);
}
