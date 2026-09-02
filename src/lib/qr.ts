// QR Token Generation & Verification

export interface RoomQRInfo {
  roomNumber: string;
  token: string;
  url: string;
}

// Deterministic token generation based on room number and secret salt
export function generateRoomToken(roomNumber: string): string {
  const salt = 'mapple_inn_jaipur_sec_2026';
  let hash = 0;
  const num = parseInt(roomNumber, 10) || 101;
  const str = `${roomNumber}_${salt}_${num * 31}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `mi_tok_${roomNumber}_${hex}`;
}

export function buildRoomOrderUrl(roomNumber: string, token: string, baseUrl?: string): string {
  const base = baseUrl || window.location.origin;
  return `${base}/order?room=${encodeURIComponent(roomNumber)}&token=${encodeURIComponent(token)}`;
}

export const buildGuestRoomUrl = buildRoomOrderUrl;

export function validateRoomToken(roomNumber: string, token: string, registeredTokens: Record<string, string>): boolean {
  if (!roomNumber || !token) return false;
  
  // Check if token matches the registered token for this room
  if (registeredTokens[roomNumber]) {
    return registeredTokens[roomNumber] === token;
  }
  
  // Fallback to deterministic token validator
  return generateRoomToken(roomNumber) === token;
}
