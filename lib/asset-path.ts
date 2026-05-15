const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function prefixAssetPath(src: string): string {
  if (src.startsWith("/") && basePath) {
    return `${basePath}${src}`;
  }

  return src;
}