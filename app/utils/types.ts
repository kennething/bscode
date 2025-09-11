export class Message {
  type: "log" | "warn" | "error";
  /** Array of message strings, split at each newline */
  message: string[];
  timestamp: Date;
  wasCopied: boolean;

  constructor(type: "log" | "warn" | "error", message: string[]) {
    this.type = type;
    this.message = message;
    this.timestamp = new Date();
    this.wasCopied = false;
  }
}

export const languages = {
  JavaScript: "js",
  TypeScript: "ts",
} as const satisfies Record<string, string>;
export type Language = keyof typeof languages;

export type CodeFile = {
  uuid: string;
  name: string;
  language: Language;
  code: string;
  /** Unix timestamp, in milliseconds */
  lastSaved: number;
  /** Unix timestamp, in milliseconds */
  readonly createdAt: number;
};
