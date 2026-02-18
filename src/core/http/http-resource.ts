// src/shared/http/http-resource.ts
import { HttpResponse } from "@/core/protocols/http";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface Link {
  href: string;
  method: HttpMethod;
}

export interface Links {
  [rel: string]: Link;
}

export interface Resource<T> {
  data: T;
  links: Links;
  meta?: Record<string, any>;
}

export interface CollectionResource<T> {
  data: Array<T>;
  links: Links;
  meta?: Record<string, any>;
}

export const resource = <T>(
  data: T,
  links: Links,
  meta?: Record<string, any>
): Resource<T> => ({
  data,
  links,
  meta,
});

export const collection = <T>(
  data: Array<T>,
  links: Links,
  meta?: Record<string, any>
): CollectionResource<T> => ({
  data,
  links,
  meta,
});

export const ok = <T>(
  body: Resource<T> | CollectionResource<T>
): HttpResponse => ({
  statusCode: 200,
  body,
});

export const created = <T>(body: Resource<T>): HttpResponse => ({
  statusCode: 201,
  body,
});

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: null,
});