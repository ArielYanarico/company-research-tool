declare module 'jsonframe-cheerio' {
  import type { CheerioAPI } from 'cheerio';

  export default function jsonframe(instance: CheerioAPI): void;
}
