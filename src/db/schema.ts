import { pgTable, serial, timestamp, text, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import type { CompanyProfile } from "../lib/types";

// 정책자금 자가진단 제출 기록.
// 고객이 "결과 저장" 버튼을 눌렀을 때만 생성되며, 화면에서 값을 바꿔보는 동안에는 저장되지 않는다.
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),

  // 제출자가 선택적으로 남기는 연락처 (관리자가 문의를 식별·회신하기 위한 용도)
  companyName: text("company_name"),
  contactName: text("contact_name"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),

  // 개인정보 수집·이용 동의 여부/시각 (필수 동의 없이는 서버 액션에서 저장 자체를 거부한다)
  consentAgreed: boolean("consent_agreed").notNull(),

  // 자가진단에 입력한 전체 프로필 스냅샷 — 서버에서 재계산에도 사용
  profile: jsonb("profile").$type<CompanyProfile>().notNull(),

  // 서버에서 재계산한 결과 요약 (목록 화면에서 매번 재계산하지 않도록 캐시)
  eligibleCount: integer("eligible_count").notNull(),
  conditionalCount: integer("conditional_count").notNull(),
  ineligibleCount: integer("ineligible_count").notNull(),
  eligiblePrograms: jsonb("eligible_programs").$type<string[]>().notNull(),
  conditionalPrograms: jsonb("conditional_programs").$type<string[]>().notNull(),
  watchExternalPrograms: jsonb("watch_external_programs").$type<string[]>().notNull(),
});

export type SubmissionRow = typeof submissions.$inferSelect;
export type NewSubmissionRow = typeof submissions.$inferInsert;
