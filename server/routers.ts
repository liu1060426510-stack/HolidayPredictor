import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";

const mockCountyStatus = [
  { countyId: "taipei", countyName: "臺北市", region: "北部", officialStatus: "halted", probability: 88 },
  { countyId: "new-taipei", countyName: "新北市", region: "北部", officialStatus: "halted", probability: 84 },
  { countyId: "keelung", countyName: "基隆市", region: "北部", officialStatus: "halted", probability: 81 },
  { countyId: "taoyuan", countyName: "桃園市", region: "北部", officialStatus: "halted", probability: 78 },
  { countyId: "yilan", countyName: "宜蘭縣", region: "東部", officialStatus: "halted", probability: 75 },
];

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  holiday: router({
    countyStatuses: publicProcedure.query(() => ({
      mode: "simulation" as const,
      syncedAt: new Date().toISOString(),
      items: mockCountyStatus,
    })),
    submitReport: publicProcedure
      .input(z.object({ location: z.string().min(2), category: z.string().min(1), summary: z.string().min(4) }))
      .mutation(({ input }) => ({
        accepted: true,
        reportCode: `R-${Date.now().toString().slice(-4)}`,
        ...input,
        status: "pending_review" as const,
      })),
    adminOverview: adminProcedure.query(() => ({
      onlineUsers: 2481,
      haltedCount: mockCountyStatus.length,
      apiSuccessRate: 99.84,
      pendingReports: 8,
    })),
  }),
});

export type AppRouter = typeof appRouter;
