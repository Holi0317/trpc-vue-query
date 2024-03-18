import { describe, it, onTestFinished, expect, vi } from "vitest";
import { createServer } from "node:http";
import getPort from "get-port";
import { z } from "zod";
import { initTRPC } from "@trpc/server";
import { h3RequestHandler } from "../src";
import {
  createApp,
  createRouter,
  defineEventHandler,
  toNodeListener,
} from "h3";
import {
  createTRPCProxyClient,
  httpLink,
  httpBatchLink,
  unstable_httpBatchStreamLink,
  type TRPCLink,
} from "@trpc/client";

type LinkFactory = (opt: { url: string }) => TRPCLink<any>;

describe("E2E test with h3+nodejs adapter", () => {
  async function test(
    linkFactory: LinkFactory,
    path: string,
    routeParam?: string,
  ) {
    const spy = vi.fn();

    const t = initTRPC.create();
    const proc = t.procedure;

    const router = t.router({
      greet: proc.query(() => {
        return "hello";
      }),
      greetMut: proc
        .input(z.object({ name: z.string() }))
        .mutation(({ input }) => {
          return `hello ${input.name}`;
        }),
    });

    const r = createRouter();
    r.use(
      path,
      h3RequestHandler({
        router,
        routeParam,
      }),
    );
    const app = createApp();
    app.use(
      defineEventHandler(() => {
        spy();
      }),
    );
    app.use(r);

    const server = createServer(toNodeListener(app));
    onTestFinished(() => {
      server.close();
    });
    const port = await getPort();
    server.listen(port);

    const trpc = createTRPCProxyClient<typeof router>({
      links: [
        linkFactory({
          url: `http://localhost:${port}/trpc`,
        }),
      ],
    });

    // Using Promise.all here for batch link
    const [q, _, m] = await Promise.all([
      trpc.greet.query(),
      trpc.greet.query(),
      trpc.greetMut.mutate({ name: "123" }),
    ]);

    expect(q).toEqual("hello");
    expect(m).toEqual("hello 123");

    return {
      spy,
    };
  }

  it("should work with default path name (:trpc)", async () => {
    const { spy } = await test(httpLink, "/trpc/:trpc");
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it("should work with custom path name", async () => {
    await test(httpLink, "/trpc/:asdf", "asdf");
  });

  it("should work with wildcard matcher (*)", async () => {
    await test(httpLink, "/trpc/*", "_0");
    // ------------------------------^ This is different from h3 docs. They
    // said this wildcard should get mapped into `_` but my testing suggest this
    // wildcard will get bound to `_0`
  });

  it("should work with deep wildcard matcher (**)", async () => {
    await test(httpLink, "/trpc/**", "_");
  });

  it("should work with batch link", async () => {
    const { spy } = await test(httpBatchLink, "/trpc/:trpc");
    expect(spy).toHaveBeenCalledTimes(2); // one for mutation, one for query batch
  });

  it("should work with batch stream link", async () => {
    const { spy } = await test(unstable_httpBatchStreamLink, "/trpc/:trpc");
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
