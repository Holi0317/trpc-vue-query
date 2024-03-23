import { describe, it, expect, vi, afterEach } from "vitest";
import { z } from "zod";
import { initTRPC } from "@trpc/server";
import { createTRPCVue } from "../src/createTRPCVue";

describe("root", () => {
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
    greet: proc.query(() => {
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

  const client = createTRPCVue<Router>({
    links: [],
  });

  it("queryKeyFactory should use result of default factory", () => {
    const actual = client.queryKeyFactory("greet", undefined);
    expect(actual).toEqual([
      { input: undefined, path: "greet", subsystem: "trpc" },
    ]);
  });

  it("should use provided query factory");

  it("queryKey should work on procedure", () => {
    const actual = client.queryKey(client.sub1.sub2.proc2, undefined);
    expect(actual).toEqual([
      { input: undefined, path: "sub1.sub2.proc2", subsystem: "trpc" },
    ]);
  });
});
