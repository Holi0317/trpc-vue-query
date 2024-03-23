import { describe, it, assertType, expect } from "vitest";
import { z } from "zod";
import { initTRPC } from "@trpc/server";
import { createTRPCVue } from "../src/createTRPCVue";
import type { UseQueryReturnType } from "@tanstack/vue-query";

describe("Simple server", () => {
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

  type Router = typeof router;

  const client = createTRPCVue<Router>({
    links: [],
  });

  it("should infer useQuery properly", () => {
    const q = client.greet.useQuery();

    assertType<UseQueryReturnType<string, unknown>>(q);
    assertType<string | undefined>(q.data.value);
    assertType<{ path: string }>(q.trpc);
  });

  it("should infer initialData properly", () => {
    const q = client.greet.useQuery(undefined, {
      initialData: "asdf",
    });

    assertType<string>(q.data.value);
    // Catch case where typeof `q.data.value` is literal "asdf"
    expect(q.data.value === "1234").toEqual(true);
  });

  it("should reject `initialData` call with incompatible data", () => {
    client.greet.useQuery(undefined, {
      // @ts-expect-error No overload matches this call
      initialData: 48,
    });
  });

  it("should infer mutation properly");

  it("should infer nested query");
});

it("should reject overlap naming on root");
