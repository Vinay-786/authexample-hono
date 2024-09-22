import { hc } from "hono/client";
import { type ApiRoute } from "@server/index";

const client = hc<ApiRoute>("/");
export const api = client.api;
