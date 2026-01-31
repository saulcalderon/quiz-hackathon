let nanoidFn: (size?: number) => string;

export async function getNanoid(): Promise<(size?: number) => string> {
  if (!nanoidFn) {
    const { nanoid } = await import('nanoid');
    nanoidFn = nanoid;
  }
  return nanoidFn;
}
