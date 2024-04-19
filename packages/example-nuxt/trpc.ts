import type { AppRouter } from "./server/trpc/routers";
import { createTRPCVue } from "@trpc-vue-query/client";

export const trpc = createTRPCVue<AppRouter>({
  // Set serverPrefetch to true for nuxt. This hint nuxt to fetch during SSR
  serverPrefetch: true,
});
