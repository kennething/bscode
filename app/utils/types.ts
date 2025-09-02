export class Message {
  type: "log" | "warn" | "error";
  message: string;
  timestamp: Date;

  constructor(type: "log" | "warn" | "error", message: string) {
    this.type = type;
    this.message = message;
    this.timestamp = new Date();
  }
}

export type CodeFile = {
  name: string;
  code: string;
  lastSaved: number;
  lastOpened: number;
};
