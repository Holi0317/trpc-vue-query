import { h3RequestHandler } from "@tnq/h3-adapter";
import { appRouter, type AppRouter } from "../../trpc/routers";

export default h3RequestHandler<AppRouter>({
  router: appRouter,
});
