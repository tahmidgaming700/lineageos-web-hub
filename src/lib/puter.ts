/**
 * Puter.js integration wrapper.
 * Provides authentication, KV storage, and AI features with graceful fallback.
 */

import { UserPreferences } from '../types';

declare global {
  interface Window {
    puter?: {
      auth: {
        signIn: (options?: Record<string, unknown>) => Promise<any>;
        signOut: () => Promise<void>;
        isSignedIn: () => boolean;
        getUser: () => Promise<{
          username: string;
          uuid?: string;
          email?: string;
        } | null>;
      };
      kv: {
        get: (key: string) => Promise<any>;
        set: (key: string, value: any) => Promise<any>;
        del: (key: string) => Promise<any>;
        list: () => Promise<string[]>;
      };
      ai: {
        chat: (prompt: string, options?: { model?: string }) => Promise<any>;
      };
      print?: (data: any) => void;
    };
  }
}

const STORAGE_KEY = 'lineage_web_hub_user_prefs';

const defaultPreferences: UserPreferences = {
  theme: 'system',
  savedDevices: ['akita', 'alioth', 'aston', 'bramble'],
  bookmarkedBuilds: [],
  personalNotes: {},
};

export class PuterService {
  private static instance: PuterService;
  private currentUser: { username: string; email?: string } | null = null;
  private isLoaded = false;

  private constructor() {
    this.checkPuterAvailability();
  }

  public static getInstance(): PuterService {
    if (!PuterService.instance) {
      PuterService.instance = new PuterService();
    }
    return PuterService.instance;
  }

  public checkPuterAvailability(): boolean {
    if (typeof window !== 'undefined' && window.puter) {
      this.isLoaded = true;
      return true;
    }
    return false;
  }

  public async initUser(): Promise<{ username: string; email?: string } | null> {
    if (!this.checkPuterAvailability()) {
      return null;
    }
    try {
      if (window.puter?.auth.isSignedIn()) {
        const user = await window.puter.auth.getUser();
        if (user) {
          this.currentUser = { username: user.username, email: user.email };
          return this.currentUser;
        }
      }
    } catch (err) {
      console.warn('Puter user lookup error:', err);
    }
    return null;
  }

  public async signIn(): Promise<{ username: string; email?: string } | null> {
    if (!this.checkPuterAvailability()) {
      throw new Error('Puter SDK is not available in this environment.');
    }
    try {
      const res = await window.puter!.auth.signIn();
      const user = await window.puter!.auth.getUser();
      if (user) {
        this.currentUser = { username: user.username, email: user.email };
        return this.currentUser;
      }
      return null;
    } catch (err) {
      console.error('Puter sign in failed:', err);
      throw err;
    }
  }

  public async signOut(): Promise<void> {
    if (this.checkPuterAvailability()) {
      try {
        await window.puter!.auth.signOut();
      } catch (err) {
        console.warn('Puter sign out error:', err);
      }
    }
    this.currentUser = null;
  }

  public getCurrentUser(): { username: string; email?: string } | null {
    return this.currentUser;
  }

  public isSignedIn(): boolean {
    if (this.checkPuterAvailability() && window.puter?.auth.isSignedIn()) {
      return true;
    }
    return !!this.currentUser;
  }

  // --- Key-Value Storage with Puter & localStorage Fallback ---

  public async loadPreferences(): Promise<UserPreferences> {
    // Try Puter KV if signed in
    if (this.isSignedIn() && window.puter?.kv) {
      try {
        const remoteData = await window.puter.kv.get(STORAGE_KEY);
        if (remoteData) {
          const parsed = typeof remoteData === 'string' ? JSON.parse(remoteData) : remoteData;
          return { ...defaultPreferences, ...parsed };
        }
      } catch (err) {
        console.warn('Could not read from Puter KV, checking localStorage:', err);
      }
    }

    // Fallback to localStorage
    try {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) {
        return { ...defaultPreferences, ...JSON.parse(local) };
      }
    } catch (err) {
      console.warn('Error reading localStorage:', err);
    }

    return defaultPreferences;
  }

  public async savePreferences(prefs: UserPreferences): Promise<void> {
    // Save to localStorage immediately
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (err) {
      console.warn('Failed saving to localStorage:', err);
    }

    // If Puter signed in, sync to Puter KV
    if (this.isSignedIn() && window.puter?.kv) {
      try {
        await window.puter.kv.set(STORAGE_KEY, JSON.stringify(prefs));
      } catch (err) {
        console.warn('Failed saving to Puter KV:', err);
      }
    }
  }

  // --- AI ROM Assistant ---
  public async askAssistant(prompt: string, context?: string): Promise<string> {
    const fullPrompt = `You are ROM Assistant, an expert technical assistant for LineageOS Web Hub.
You provide accurate, safety-oriented, real information about Android ROMs, LineageOS builds, Generic System Images (GSI), recovery environments, Treble requirements, checksums, and flashing safety.
Rules:
- Never fabricate firmware versions, checksums, or compatibility promises.
- Architecture matching (e.g. ARM64) alone does NOT guarantee a GSI will boot without vendor interface support.
- Warn users that unlocking bootloaders and flashing partitions wipes data and carries brick risks.
- Keep responses concise, structured, and helpful.

${context ? `Context about current device/build:\n${context}\n` : ''}
User inquiry: ${prompt}`;

    // 1. Try Puter AI if available
    if (this.checkPuterAvailability() && window.puter?.ai?.chat) {
      try {
        const res = await window.puter.ai.chat(fullPrompt);
        if (typeof res === 'string') return res;
        if (res && res.message && res.message.content) return res.message.content;
        if (res && res.text) return res.text;
      } catch (puterErr) {
        console.warn('Puter AI error, falling back to server-side assistant:', puterErr);
      }
    }

    // 2. Fallback to server-side endpoint
    try {
      const resp = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, context }),
      });
      if (resp.ok) {
        const data = await resp.json();
        return data.reply;
      }
    } catch (backendErr) {
      console.error('Server assistant error:', backendErr);
    }

    return "ROM Assistant is currently offline. You can refer to the official LineageOS Wiki (wiki.lineageos.org) and installation guides in the documentation tab for verified instructions.";
  }
}

export const puterService = PuterService.getInstance();
