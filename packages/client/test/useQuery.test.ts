import { describe, it, expect, afterAll, vi, afterEach } from "vitest";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { z } from "zod";
import { initTRPC } from "@trpc/server";
import { createTRPCVue } from "../src/createTRPCVue";
import { withSetup } from "./testutil";
import { until } from "@vueuse/core";
import getPort from "get-port";
import { nextTick, ref } from "vue";
import { useQueryClient } from "@tanstack/vue-query";

describe("useQuery", async () => {
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

  const port = await getPort();
  const server = createHTTPServer({
    router,
  }).listen(port);

  const client = createTRPCVue<Router>();

  afterAll(() => {
    server.close();
  });

  it("should return `useQuery` for queries", async () => {
    const [q] = withSetup(client, port, () => {
      return client.greet.useQuery();
    });

    expect(q.trpc.path).toEqual("greet");
    expect(q.status.value).toEqual("pending");

    await until(q.status).changed();
    expect(q.error.value).toEqual(null);
    expect(q.status.value).toEqual("success");

    expect(q.data.value).toEqual("hello");
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toBeCalledWith({
      type: "query",
      path: "greet",
      input: undefined,
    });
  });

  it("should handle `initialData` properly", async () => {
    const [q] = withSetup(client, port, () => {
      return client.greet.useQuery(undefined, {
        initialData: "asdf",
      });
    });

    expect(q.trpc.path).toEqual("greet");
    expect(q.data.value).toEqual("asdf");
    expect(q.status.value).toEqual("success");
    expect(q.isFetching.value).toEqual(true);

    await until(q.isFetching).changed();
    expect(q.error.value).toEqual(null);
    expect(q.status.value).toEqual("success");

    expect(q.data.value).toEqual("hello");
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toBeCalledWith({
      type: "query",
      path: "greet",
      input: undefined,
    });
  });

  it("should work with deep query", async () => {
    const [q] = withSetup(client, port, () => {
      return client.sub1.sub2.proc2.useQuery();
    });

    expect(q.trpc.path).toEqual("sub1.sub2.proc2");

    await until(q.isFetching).toBe(false);
    expect(q.error.value).toEqual(null);
    expect(q.status.value).toEqual("success");

    expect(q.data.value).toEqual(48);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toBeCalledWith({
      type: "query",
      path: "sub1.sub2.proc2",
      input: undefined,
    });
  });

  it("should work with query parameters", async () => {
    const [q] = withSetup(client, port, () => {
      return client.sub1.proc1.useQuery({ deep: { content: 123 } });
    });

    expect(q.trpc.path).toEqual("sub1.proc1");

    await until(q.isFetching).toBe(false);
    expect(q.error.value).toEqual(null);
    expect(q.status.value).toEqual("success");

    expect(q.data.value).toEqual(123);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toBeCalledWith({
      type: "query",
      path: "sub1.proc1",
      input: { deep: { content: 123 } },
    });
  });

  it("should unref query parameter", async () => {
    const [q] = withSetup(client, port, () => {
      return client.sub1.proc1.useQuery(ref({ deep: { content: 123 } }));
    });

    expect(q.trpc.path).toEqual("sub1.proc1");

    await until(q.isFetching).toBe(false);
    expect(q.error.value).toEqual(null);
    expect(q.status.value).toEqual("success");

    expect(q.data.value).toEqual(123);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toBeCalledWith({
      type: "query",
      path: "sub1.proc1",
      input: { deep: { content: 123 } },
    });
  });

  it("should deep unref query parameters", async () => {
    const [q] = withSetup(client, port, () => {
      return client.sub1.proc1.useQuery({ deep: ref({ content: 123 }) });
    });

    expect(q.trpc.path).toEqual("sub1.proc1");

    await until(q.isFetching).toBe(false);
    expect(q.error.value).toEqual(null);
    expect(q.status.value).toEqual("success");

    expect(q.data.value).toEqual(123);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toBeCalledWith({
      type: "query",
      path: "sub1.proc1",
      input: { deep: { content: 123 } },
    });
  });

  it("should trigger refetch if input has changed", async () => {
    const [{ content, q }] = withSetup(client, port, () => {
      const content = ref(123);
      const q = client.sub1.proc1.useQuery({ deep: { content } });

      return { content, q };
    });

    expect(q.trpc.path).toEqual("sub1.proc1");

    await until(q.isFetching).toBe(false);
    expect(q.error.value).toEqual(null);
    expect(q.status.value).toEqual("success");
    expect(q.data.value).toEqual(123);
    expect(spy).toBeCalledWith({
      type: "query",
      path: "sub1.proc1",
      input: { deep: { content: 123 } },
    });

    content.value = 456;
    expect(q.data.value).toEqual(123);
    await nextTick();
    expect(q.isFetching.value).toBe(true);
    await until(q.isFetching).toBe(false);
    expect(q.error.value).toEqual(null);
    expect(q.status.value).toEqual("success");
    expect(q.data.value).toEqual(456);

    expect(spy).toBeCalledTimes(2);
    expect(spy).toBeCalledWith({
      type: "query",
      path: "sub1.proc1",
      input: { deep: { content: 456 } },
    });
  });

  it("should use provided query key", async () => {
    const [{ q, queryClient }] = withSetup(client, port, () => {
      const queryClient = useQueryClient();
      const q = client.greet.useQuery(undefined, {
        queryKey: ["mykey"],
      });
      return { q, queryClient };
    });

    expect(q.trpc.path).toEqual("greet");
    expect(q.status.value).toEqual("pending");
    expect(queryClient.getQueryState(["mykey"])).toBeDefined();

    // Make sure we wait for the request to complete
    await until(q.status).changed();
  });

  it("should work with select remapping", async () => {
    const [{ q1, q2 }] = withSetup(client, port, () => {
      const q1 = client.greet.useQuery(undefined, {
        select(data) {
          return { my: data };
        },
      });

      const q2 = client.greet.useQuery();

      return { q1, q2 };
    });

    expect(q1.trpc.path).toEqual("greet");
    expect(q1.status.value).toEqual("pending");

    await until(q1.status).changed();
    expect(q1.data.value).toEqual({ my: "hello" });
    expect(q2.data.value).toEqual("hello");

    // Assert query is de-duplicating calls
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toBeCalledWith({
      type: "query",
      path: "greet",
      input: undefined,
    });
  });
});
