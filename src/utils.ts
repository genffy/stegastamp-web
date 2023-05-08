import { type BinaryLike, createHash } from 'crypto'

export async function fetchWithTimeout(url: string, options: any): Promise<Response> {
  if (options === undefined) options = {}

  const { timeout = 600000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(url, {
    ...options,
    signal: controller.signal
  });
  clearTimeout(id);

  return response;
}

export function getMd5(str: BinaryLike) {
  const hash = createHash("md5").update(str).digest("hex")
  return hash;
}
