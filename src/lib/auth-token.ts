let accessTokenRef: string | null = null;

export function setAccessToken(token: string | null) {
  accessTokenRef = token;
}

export function getAccessToken(): string | null {
  return accessTokenRef;
}