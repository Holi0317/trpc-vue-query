import { h3RequestHandler } from "@trpc-vue-query/h3-adapter";
import { appRouter, type AppRouter } from "../../trpc/routers";

export default h3RequestHandler<AppRouter>({
  router: appRouter,
});
