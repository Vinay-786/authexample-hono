import { hc } from "hono/client";
import { type ApiRoute } from "@server/index";
import { queryOptions } from "@tanstack/react-query";

const client = hc<ApiRoute>("/");
export const api = client.api;

async function getCurrentUser() {
  try {
    const res = await api.authenticate.me.$get();
    if (!res.ok) {
      throw new Error("server error");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    return null;
  }
}

export const userQueryOptions = queryOptions({
  queryKey: ["get-current-user"],
  queryFn: getCurrentUser,
  staleTime: Infinity,
});
