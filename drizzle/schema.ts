import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const countyStatuses = mysqlTable("county_statuses", {
  id: int("id").autoincrement().primaryKey(),
  countyId: varchar("countyId", { length: 40 }).notNull().unique(),
  countyName: varchar("countyName", { length: 40 }).notNull(),
  region: varchar("region", { length: 20 }).notNull(),
  officialStatus: mysqlEnum("officialStatus", ["halted", "normal", "pending"]).default("pending").notNull(),
  probability: int("probability").notNull().default(0),
  gust: decimal("gust", { precision: 4, scale: 1 }).notNull().default("0.0"),
  averageWind: decimal("averageWind", { precision: 4, scale: 1 }).notNull().default("0.0"),
  rainfall24h: int("rainfall24h").notNull().default(0),
  isOverridden: int("isOverridden").notNull().default(0),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const liveStreams = mysqlTable("live_streams", {
  id: int("id").autoincrement().primaryKey(),
  streamKey: varchar("streamKey", { length: 64 }).notNull().unique(),
  city: varchar("city", { length: 40 }).notNull(),
  region: varchar("region", { length: 20 }).notNull(),
  title: varchar("title", { length: 120 }).notNull(),
  subtitle: varchar("subtitle", { length: 180 }),
  youtubeVideoId: varchar("youtubeVideoId", { length: 32 }),
  isActive: int("isActive").notNull().default(1),
  sortOrder: int("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const disasterReports = mysqlTable("disaster_reports", {
  id: int("id").autoincrement().primaryKey(),
  reportCode: varchar("reportCode", { length: 32 }).notNull().unique(),
  location: varchar("location", { length: 160 }).notNull(),
  category: varchar("category", { length: 40 }).notNull(),
  summary: text("summary").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  reviewedAt: timestamp("reviewedAt"),
  reviewedBy: int("reviewedBy"),
});

export const announcements = mysqlTable("announcements", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 120 }).notNull(),
  message: text("message").notNull(),
  severity: mysqlEnum("severity", ["info", "warning", "critical"]).default("info").notNull(),
  isActive: int("isActive").notNull().default(1),
  publishedBy: int("publishedBy"),
  publishedAt: timestamp("publishedAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
});

export const weatherLogs = mysqlTable("weather_logs", {
  id: int("id").autoincrement().primaryKey(),
  source: varchar("source", { length: 40 }).notNull(),
  endpoint: varchar("endpoint", { length: 180 }).notNull(),
  statusCode: int("statusCode").notNull(),
  responseMs: int("responseMs").notNull(),
  payloadHash: varchar("payloadHash", { length: 128 }),
  fetchedAt: timestamp("fetchedAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type CountyStatus = typeof countyStatuses.$inferSelect;
export type LiveStream = typeof liveStreams.$inferSelect;
export type DisasterReport = typeof disasterReports.$inferSelect;
export type Announcement = typeof announcements.$inferSelect;
export type WeatherLog = typeof weatherLogs.$inferSelect;
