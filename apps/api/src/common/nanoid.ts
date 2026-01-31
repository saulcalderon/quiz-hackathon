let nanoidFn: (size?: number) => string;

const ALPHANUMERIC = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export async function getNanoid(): Promise<(size?: number) => string> {
  if (!nanoidFn) {
    const { customAlphabet } = await import('nanoid');
    nanoidFn = customAlphabet(ALPHANUMERIC, 6);
  }
  return nanoidFn;
}
