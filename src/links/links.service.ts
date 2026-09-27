import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { LinksStore } from './links.store';
import { LinkRecord } from './interfaces/link-record.interface';
@Injectable()
export class LinksService {
  constructor(private readonly store: LinksStore) {}
  private validateUrl(raw: string): URL {
    let parsed: URL;

    try {
      parsed = new URL(raw);
    } catch {
      throw new BadRequestException(`"${raw}" yaroqli URL emas`);
    }

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new BadRequestException(
        'Faqat http va https manzillar qabul qilinadi',
      );
    }

    return parsed;
  }

  private generateCode(): string {
    const alphabet =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    return Array.from(randomBytes(7))
      .map((byte) => alphabet[byte % alphabet.length])
      .join('');
  }

  create(rawUrl: string): LinkRecord {
    const parsed = this.validateUrl(rawUrl);

    const normalized =
      parsed.toString().replace(/\/$/, '') || parsed.toString();

    const existing = this.store.findByUrl(normalized);

    if (existing) {
      return existing;
    }

    let code: string;

    do {
      code = this.generateCode();
    } while (this.store.findByCode(code));

    const record: LinkRecord = {
      code,
      url: normalized,
      hits: 0,
      createdAt: new Date(),
    };

    this.store.save(record);

    return record;
  }

  follow(code: string): string {
    const record = this.store.findByCode(code);

    if (!record) {
      throw new NotFoundException(`"${code}" kodi topilmadi`);
    }

    this.store.incrementHits(code);

    return record.url;
  }

  stats(code: string): LinkRecord {
    const record = this.store.findByCode(code);

    if (!record) {
      throw new NotFoundException(`"${code}" kodi topilmadi`);
    }

    return record;
  }

  _clearStore(): void {
    this.store.clear();
  }
}
