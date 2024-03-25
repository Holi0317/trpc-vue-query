import { describe, it, expect, afterAll, vi, afterEach } from "vitest";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { z } from "zod";
import { initTRPC } from "@trpc/server";
import { createTRPCVue } from "../src/createTRPCVue";
import { withSetup } from "./testutil";
import { until } from "@vueuse/core";
import { httpLink } from "@trpc/client";
import getPort from "get-port";

describe("useMutation", async () => {
  const t = initTRPC.create();
  let spy = vi.fn();
  const proc = t.procedure.use(async (opts) => {
    spy({
      type: opts.type,
      path: opts.path,
      input: await opts.getRawInput(),
    });
    return opts.next();
  });
  afterEach(() => {
    spy = vi.fn();
  });

  const router = t.router({
    greet: proc.mutation(() => {
      return "hello";
    }),
    sub1: t.router({
      sub2: t.router({
        proc2: proc.query(() => 48),
      }),
      proc1: proc
        .input(
          z.object({
            deep: z.object({
              content: z.number(),
            }),
          }),
        )
        .query(({ input }) => input.deep.content),
    }),
  });

  type Router = typeof router;

  const port = await getPort();
  const server = createHTTPServer({
    router,
  }).listen(port);

  afterAll(() => {
    server.close();
  });

  const client = createTRPCVue<Router>({
    links: [
      httpLink({
        url: `http://127.0.0.1:${port}`,
      }),
    ],
  });

  it("should return mutation", async () => {
    const [m] = withSetup(() => {
      return client.greet.useMutation();
    });

    m.mutate();
    expect(m.status.value).toEqual("pending");

    await until(m.status).changed();
    expect(m.status.value).toEqual("success");
    expect(m.data.value).toEqual("hello");

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toBeCalledWith({
      type: "mutation",
      path: "greet",
      input: undefined,
    });
  });
});
