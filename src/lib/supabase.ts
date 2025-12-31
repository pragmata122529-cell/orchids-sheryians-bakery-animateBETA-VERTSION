import { createClient } from "@supabase/supabase-js";

// Mock Supabase client for frontend-only demo
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

// Helper to create mock responses
const createMockResponse = (data: any) => ({
  data,
  error: null,
  count: null,
  status: 200,
  statusText: "OK",
});

export const supabase = {
  auth: {
    getUser: async () => createMockResponse({ user: { id: "mock-user", email: "demo@example.com" } }),
    signInWithPassword: async () => createMockResponse({ user: { id: "mock-user" }, session: {} }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: (callback: any) => {
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
  },
    from: (table: string) => {
      const queryBuilder = {
        select: () => queryBuilder,
        eq: () => queryBuilder,
        neq: () => queryBuilder,
        lt: () => queryBuilder,
        lte: () => queryBuilder,
        gt: () => queryBuilder,
        gte: () => queryBuilder,
        like: () => queryBuilder,
        ilike: () => queryBuilder,
        is: () => queryBuilder,
        in: () => queryBuilder,
        contains: () => queryBuilder,
        order: () => queryBuilder,
        limit: () => queryBuilder,
        range: () => queryBuilder,
        single: async () => createMockResponse(table === "orders" ? { id: "mock-order-1", total_amount: 45, status: "preparing", created_at: new Date().toISOString() } : {}),
        maybeSingle: async () => createMockResponse({}),
        execute: async () => createMockResponse([]),
        then: (onfulfilled: any) => Promise.resolve(createMockResponse([])).then(onfulfilled),
      } as any;
      return queryBuilder;
    },
  channel: () => ({
    on: () => ({
      subscribe: () => ({}),
    }),
  }),
  removeChannel: () => {},
} as any;
