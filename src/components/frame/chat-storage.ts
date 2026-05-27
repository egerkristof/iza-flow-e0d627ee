import type { TileId, TileStatus } from "./frame-data";

export interface StoredMessage {
  id: string;
  author: string;
  initials: string;
  role: "user" | "ai" | "teammate";
  text: string;
  ts: string;
}

export interface StoredChat {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: StoredMessage[];
  tileStatus: Partial<Record<TileId, TileStatus>>;
  tokenCount: number;
  dismissedSignalIds: string[];
  savedSignalIds: string[];
  sanctioned?: { at: number; visibility: Visibility; score: number };
}

export type Visibility = "private" | "team" | "org";

export interface SanctionedWorkflow {
  id: string;
  chatId: string;
  title: string;
  frameScore: number;
  visibility: Visibility;
  sanctionedAt: number;
}

const CHATS_KEY = "framed.chats.v1";
const SANCTIONED_KEY = "framed.sanctioned.v1";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function listChats(): StoredChat[] {
  if (typeof window === "undefined") return [];
  const arr = safeParse<StoredChat[]>(localStorage.getItem(CHATS_KEY), []);
  return arr.sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getChat(id: string): StoredChat | null {
  return listChats().find((c) => c.id === id) ?? null;
}

export function saveChat(chat: StoredChat): void {
  if (typeof window === "undefined") return;
  const arr = safeParse<StoredChat[]>(localStorage.getItem(CHATS_KEY), []);
  const idx = arr.findIndex((c) => c.id === chat.id);
  if (idx >= 0) arr[idx] = chat;
  else arr.push(chat);
  localStorage.setItem(CHATS_KEY, JSON.stringify(arr));
}

export function deleteChat(id: string): void {
  if (typeof window === "undefined") return;
  const arr = safeParse<StoredChat[]>(localStorage.getItem(CHATS_KEY), []);
  localStorage.setItem(CHATS_KEY, JSON.stringify(arr.filter((c) => c.id !== id)));
}

export function newChat(): StoredChat {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    title: "New chat",
    createdAt: now,
    updatedAt: now,
    messages: [],
    tileStatus: {},
    tokenCount: 0,
    dismissedSignalIds: [],
    savedSignalIds: [],
  };
}

export function deriveTitle(messages: StoredMessage[]): string {
  const first = messages.find((m) => m.role === "user");
  if (!first) return "New chat";
  const t = first.text.trim().replace(/\s+/g, " ");
  return t.length > 48 ? t.slice(0, 48) + "…" : t;
}

export function listSanctioned(): SanctionedWorkflow[] {
  if (typeof window === "undefined") return [];
  return safeParse<SanctionedWorkflow[]>(localStorage.getItem(SANCTIONED_KEY), []).sort(
    (a, b) => b.sanctionedAt - a.sanctionedAt,
  );
}

export function addSanctioned(w: SanctionedWorkflow): void {
  if (typeof window === "undefined") return;
  const arr = safeParse<SanctionedWorkflow[]>(localStorage.getItem(SANCTIONED_KEY), []);
  arr.push(w);
  localStorage.setItem(SANCTIONED_KEY, JSON.stringify(arr));
}