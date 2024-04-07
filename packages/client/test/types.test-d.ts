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

  const client = createTRPCVue<Router>();

  it("should infer useQuery properly", () => {
    const q = client.greet.useQuery();

    assertType<UseQueryReturnType<string, unknown>>(q);
    assertType<string | undefined>(q.data.value);
    assertType<{ path: string }>(q.trpc);
  });

  it("should only have `useQuery` in query type", () => {
    const proc = client.greet;

    type k = keyof typeof proc;
    const v: k = null as any;
    assertType<"useQuery">(v);
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

  it("should infer select properly", () => {
    const q = client.greet.useQuery(undefined, {
      select(data) {
        assertType<string>(data);
        return { my: data };
      },
    });

    assertType<{ my: string } | undefined>(q.data.value);
  });

  it("should only have `useMutation` in mutation type", () => {
    const proc = client.greetMut;

    type k = keyof typeof proc;
    const v: k = null as any;
    assertType<"useMutation">(v);
  });

  it("should infer mutation properly", () => {
    const mut = client.greetMut.useMutation();

    assertType<(input: { name: string }) => void>(mut.mutate);
  });
});

it("should reject overlap naming on root", () => {
  const t = initTRPC.create();
  const proc = t.procedure;

  const router = t.router({
    queryKeyFactory: proc.query(() => {
      return "hello";
    }),
  });

  type Router = typeof router;

  const client = createTRPCVue<Router>();
  assertType<"The property 'queryKeyFactory' in your router collides with a built-in method, rename this router or procedure on your backend.">(
    client,
  );
});
