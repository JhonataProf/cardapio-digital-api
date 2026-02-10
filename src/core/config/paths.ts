// src/config/paths.ts
import path from 'node:path';
import fs from 'node:fs';

export const isProd = __dirname.includes(path.sep + 'dist' + path.sep);

export function resolveRuntimePath(relativeFromSrc: string) {
  // tenta dist primeiro (quando compilado)
  const fromDist = path.resolve(__dirname, '..', relativeFromSrc); // relativo a dist/
  if (fs.existsSync(fromDist)) return fromDist;

  // fallback: caminho durante dev (ts-node)
  const fromSrc = path.resolve(process.cwd(), 'src', relativeFromSrc);
  if (fs.existsSync(fromSrc)) return fromSrc;

  // último recurso: raiz
  const fromRoot = path.resolve(process.cwd(), relativeFromSrc);
  return fromRoot;
}
