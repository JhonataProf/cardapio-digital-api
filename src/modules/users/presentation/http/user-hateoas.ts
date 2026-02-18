import { Links } from "@/core/http/http-resource";

const API_PREFIX = "/api";

export const userLinks = (id?: number): Links => ({
  self: {
    href: `${API_PREFIX}/usuarios/${id}`,
    method: "GET",
  },
  update: {
    href: `${API_PREFIX}/usuarios/${id}`,
    method: "PUT",
  },
  delete: {
    href: `${API_PREFIX}/usuarios/${id}`,
    method: "DELETE",
  },
  list: {
    href: `${API_PREFIX}/usuarios`,
    method: "GET",
  },
});

export const usersCollectionLinks = (): Links => ({
  self: {
    href: `${API_PREFIX}/usuarios`,
    method: "GET",
  },
  create: {
    href: `${API_PREFIX}/usuarios`,
    method: "POST",
  },
});