import { LinkRecord } from "./interfaces/link-record.interface";
import { Injectable } from "@nestjs/common";
@Injectable()
export class LinksStore {
  private readonly byCode = new Map<string, LinkRecord>();
  private readonly byUrl = new Map<string, string>();

  findByCode(code: string): LinkRecord | undefined {
    return this.byCode.get(code);
  }

  findByUrl(url: string): LinkRecord | undefined {
    const code = this.byUrl.get(url);

    if (!code) {
      return undefined;
    }

    return this.byCode.get(code);
  }

  save(record: LinkRecord): void {
    this.byCode.set(record.code, record);
    this.byUrl.set(record.url, record.code);
  }

  incrementHits(code: string): void {
    const record = this.byCode.get(code);

    if (record) {
      record.hits += 1;
    }
  }

  clear(): void {
    this.byCode.clear();
    this.byUrl.clear();
  }
}