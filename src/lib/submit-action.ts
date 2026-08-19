"use server";

import { getDb } from "@/db";
import { submissions } from "@/db/schema";
import { evaluate } from "./eligibility";
import { matchExternalPrograms } from "./external-eligibility";
import type { CompanyProfile } from "./types";

export interface SubmitMeta {
  companyName: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  consentAgreed: boolean;
}

export interface SubmitResult {
  ok: boolean;
  error?: string;
}

// 브라우저에서 계산한 결과를 그대로 신뢰하지 않고, 저장 시점에 서버에서 프로필로부터 다시 계산한다.
export async function submitEligibilityCheck(profile: CompanyProfile, meta: SubmitMeta): Promise<SubmitResult> {
  if (!meta.consentAgreed) {
    return { ok: false, error: "개인정보 수집·이용에 동의해야 저장할 수 있습니다." };
  }

  let result: ReturnType<typeof evaluate>;
  try {
    result = evaluate(profile);
  } catch {
    return { ok: false, error: "입력값을 다시 확인해주세요." };
  }

  const external = matchExternalPrograms(profile, result.businessAge, result.isProspective, result.isSmallBusinessOwner);

  const eligiblePrograms = result.programs.filter((p) => p.match === "eligible").map((p) => p.name);
  const conditionalPrograms = result.programs.filter((p) => p.match === "conditional").map((p) => p.name);
  const watchExternalPrograms = external.filter((p) => p.relevance === "watch").map((p) => p.name);

  try {
    await getDb()
      .insert(submissions)
      .values({
        companyName: meta.companyName.trim() || null,
        contactName: meta.contactName.trim() || null,
        contactPhone: meta.contactPhone.trim() || null,
        contactEmail: meta.contactEmail.trim() || null,
        consentAgreed: true,
        profile,
        eligibleCount: eligiblePrograms.length,
        conditionalCount: conditionalPrograms.length,
        ineligibleCount: result.programs.length - eligiblePrograms.length - conditionalPrograms.length,
        eligiblePrograms,
        conditionalPrograms,
        watchExternalPrograms,
      });
  } catch (err) {
    console.error("submitEligibilityCheck insert failed", err);
    return { ok: false, error: "저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }

  return { ok: true };
}
