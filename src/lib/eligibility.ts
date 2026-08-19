// 정책자금 자가진단 엔진
//
// 근거 문서:
//  [문서1] 2026년도 중소기업 정책자금 융자계획 변경공고 (중소벤처기업부 공고 제2026-464호)
//  [문서3] 2026년도 정책자금 융자공고 참고자료
//  [매뉴얼] 정책자금 온라인 신청 사용자 매뉴얼
//
// ⚠️ 본 엔진은 공고문에 명시된 신청대상·유의사항(융자제한기업)을 규칙화한 "참고용 사전 점검"이며,
// 실제 지원 여부·한도는 중진공의 기업평가(기술성·사업성·신용위험 등 종합심사)를 통해 최종 결정됩니다.

import type { CompanyProfile, EligibilityResult, ProgramMatch, RestrictionFinding, Severity } from "./types";
import { getIndustry } from "./reference-data";
import { getProgram } from "./funds-data";

function yearsSince(dateStr: string): number | null {
  if (!dateStr) return null;
  const start = new Date(dateStr).getTime();
  if (Number.isNaN(start)) return null;
  const now = Date.now();
  const years = (now - start) / (365.25 * 24 * 60 * 60 * 1000);
  return Math.max(0, years);
}

const RANK: Record<ProgramMatch["match"], number> = { ineligible: 0, conditional: 1, eligible: 2 };

function downgrade(current: ProgramMatch["match"], to: ProgramMatch["match"]): ProgramMatch["match"] {
  return RANK[to] < RANK[current] ? to : current;
}

// 세금체납·휴폐업 등 하드블록 항목 중, 원문에 "압류·매각의 유예" 등 예외가 명시된 자금
const TAX_DELINQUENT_SOFT = new Set(["reboot_business_realignment", "reboot_restructuring", "emergency_disaster", "reboot_recreation"]);
const CLOSED_SOFT = new Set(["emergency_disaster"]);
// 재창업자금·구조개선전용자금은 신용회복정보 등록 자체가 신청요건 성격이라 예외 처리
const CREDIT_REGISTRY_EXEMPT = new Set(["reboot_recreation", "reboot_restructuring"]);
// 정부·지자체 지원 200억 초과 제한의 신규지원 예외 자금 (문서1 p.12 ⑬항)
const GOV_SUPPORT_CAP_EXEMPT = new Set([
  "reboot_conversion_general",
  "reboot_business_realignment",
  "reboot_trade_adjustment",
  "reboot_restructuring",
  "reboot_recreation",
  "emergency_disaster",
  "emergency_hardship",
  "valuechain_factoring",
  "valuechain_network_loan",
]);
// 최근 5년 3회 이상 지원 제한의 예외 자금 (문서1 p.13 ⑮항, 일부 요약)
const FUNDED_COUNT_CAP_EXEMPT = new Set([
  "reboot_conversion_general",
  "reboot_business_realignment",
  "reboot_trade_adjustment",
  "reboot_restructuring",
  "reboot_recreation",
  "emergency_disaster",
  "emergency_hardship",
  "valuechain_factoring",
  "valuechain_network_loan",
]);
// 부채비율 제한 적용 제외 자금
const DEBT_RATIO_EXEMPT = new Set([
  "growth_cooperative",
  "reboot_business_realignment",
  "reboot_trade_adjustment",
  "reboot_restructuring",
  "emergency_disaster",
  "emergency_hardship",
]);
// 한계기업(⑪) 제한 적용 제외/전제 자금
const MARGINAL_FIRM_EXEMPT = new Set(["reboot_recreation", "reboot_restructuring"]);

export function evaluate(p: CompanyProfile): EligibilityResult {
  const isProspective = p.companyType === "prospective";
  const rawAge = yearsSince(p.foundedDate);
  // 설립일이 없으면 "예비창업자 취급"과 동일한 완화된 판정을 적용하되(창업 프로그램은 예비창업자를 포함하므로),
  // 실제로는 설립일 미입력일 뿐인지(businessAgeUnknown) 구분해 화면 표기와 일부 판정에서 오해를 줄인다.
  const businessAge = isProspective ? null : rawAge;
  const businessAgeUnknown = !isProspective && rawAge === null;
  const industry = getIndustry(p.industry);

  // ---------- 소상공인 판정 (Ⅲ-⑨) ----------
  const isSmallBusinessOwner = p.employees < industry.smallBusinessThreshold;
  const smallBusinessException = industry.value === "manufacturing" || p.isPriorityField || p.isSocialEconomyEnterprise;

  // ---------- 부채비율 판정 (Ⅲ-⑩) ----------
  const debtRatioLimit = industry.debtRatioLimit;
  const debtRatioBaseExceeded = p.debtRatioPct !== null && p.debtRatioPct > debtRatioLimit;
  const debtRatioHasException =
    (businessAge !== null && businessAge < 7) || p.isSimplifiedBookkeeper || p.isCooperativeUnion || p.hasHighFacilityOrRnd;
  const debtRatioExceeded = debtRatioBaseExceeded && !debtRatioHasException;

  // ---------- 우량기업 판정 (Ⅲ-①) ----------
  const isQualifiedTechListing = p.listedStatus === "kosdaq_tech" && p.kosdaqTechListedYearsAgo !== null && p.kosdaqTechListedYearsAgo <= 3;
  const isListedBlock = (p.listedStatus === "kospi" || p.listedStatus === "kosdaq" || (p.listedStatus === "kosdaq_tech" && !isQualifiedTechListing));
  const isRiskGradeTopBlock =
    p.kosmesRiskGrade === "top" && !(businessAge !== null && businessAge < 3) && !p.isCooperativeUnion;
  const isPrimeCompanyFlag =
    isListedBlock ||
    p.creditRatingBBBPlus === "yes" ||
    (p.capitalEqBillion !== null && p.capitalEqBillion > 200) ||
    (p.totalAssetsBillion !== null && p.totalAssetsBillion > 700) ||
    isRiskGradeTopBlock;

  // ---------- 한계기업 판정 (Ⅲ-⑪) ----------
  const isMarginalFirm =
    p.distressedSignFirm ||
    (businessAge !== null &&
      businessAge > 5 &&
      (p.capitalImpairment2y || p.interestCoverageBelow1For3y || p.kosmesRiskGrade === "lowest"));

  // ---------- 융자한도 캡 여부 ----------
  const hasPerformance = p.employmentGrowth10In1y || p.exportGrowth20pctYoY || p.revenueGrowth20pct3y;
  const govSupportCapHit = p.govSupport5yBillion > 200;
  const workingCapitalCapHit = p.cumulativeWorkingCapitalBillion > 25;
  const fundedCountCapHit = p.fundedCount5y >= 3;

  // ---------- 유의사항(융자제한기업) findings ----------
  const restrictions: RestrictionFinding[] = [];

  if (p.isExcludedIndustry) {
    restrictions.push({
      id: "excluded_industry",
      title: "융자제외 대상 업종 영위",
      severity: "block",
      detail: "사행성·향락업, 금융·보험업, 부동산업, 전문서비스업(법무·회계·세무) 등 융자제외 업종은 원칙적으로 모든 정책자금 신청이 제한됩니다.",
      sourceRef: "문서1 p.10, 40~41 (Ⅲ-⑤, 별표1)",
    });
  }
  if (isSmallBusinessOwner && !smallBusinessException) {
    restrictions.push({
      id: "small_business",
      title: "소상공인 해당 (원칙적 지원 제외)",
      severity: "warn",
      detail: `${industry.label} 기준 상시근로자 ${industry.smallBusinessThreshold}인 미만은 「소상공인기본법」상 소상공인으로 분류되어, 신시장진출지원자금을 제외한 중진공 정책자금은 원칙적으로 소상공인시장진흥공단(SEMAS) 자금 대상입니다.`,
      sourceRef: "문서1 p.11 (Ⅲ-⑨)",
    });
  }
  if (p.isClosedOrSuspended) {
    restrictions.push({
      id: "closed",
      title: "휴·폐업 중",
      severity: "block",
      detail: "휴·폐업 중인 기업은 원칙적으로 정책자금 신청 대상이 아닙니다. (재해로 인한 휴업, 재창업 목적의 폐업 등은 별도 판단)",
      sourceRef: "문서1 p.10 (Ⅲ-②)",
    });
  }
  if (p.taxDelinquent) {
    restrictions.push({
      id: "tax_delinquent",
      title: "세금 체납 중",
      severity: "block",
      detail: "세금 체납 중인 기업은 원칙적으로 신청이 제한됩니다. 일부 자금(사업재편·구조개선전용·재해지원·재창업)은 압류·매각 유예 시 예외가 있습니다.",
      sourceRef: "문서1 p.10 (Ⅲ-③)",
    });
  }
  if (p.creditRegistryIssue) {
    restrictions.push({
      id: "credit_registry",
      title: "신용정보 등록 (연체·부도·회생·파산 등)",
      severity: "block",
      detail: "한국신용정보원 일반신용정보관리규약상 연체·대위변제·부도·회생·파산 등 등록 정보가 있으면 대부분 자금이 제한됩니다. 다만 재창업자금·구조개선전용자금은 이러한 상태 자체가 지원 취지에 해당해 예외입니다.",
      sourceRef: "문서1 p.10 (Ⅲ-④)",
    });
  }
  if (isPrimeCompanyFlag) {
    restrictions.push({
      id: "prime_company",
      title: "민간 금융기관 이용 가능한 우량기업 요건 해당",
      severity: "warn",
      detail: "상장기업·BBB등급 이상·자본총계 200억(또는 자산총계 700억) 초과·중진공 신용위험 최상위 등급 중 하나 이상에 해당합니다. 소부장 강소기업100·스타트업100 등 추천기업이거나 이차보전으로 신청하는 경우는 예외가 적용될 수 있습니다.",
      sourceRef: "문서1 p.10 (Ⅲ-①)",
    });
  }
  if (debtRatioExceeded) {
    restrictions.push({
      id: "debt_ratio",
      title: `업종별 융자제한 부채비율 초과 (기준 ${debtRatioLimit}%)`,
      severity: "warn",
      detail: `입력하신 부채비율이 ${industry.label}의 제한 기준(${debtRatioLimit}%)을 초과합니다. 업력 7년 미만, 간편장부대상자, 협동조합 등은 이 제한이 적용되지 않습니다.`,
      sourceRef: "문서1 p.11, 46~47 (Ⅲ-⑩, 별표5)",
    });
  }
  if (isMarginalFirm) {
    restrictions.push({
      id: "marginal_firm",
      title: "한계기업 해당 가능성",
      severity: "warn",
      detail: "부실징후기업 지정, 2년 연속 적자·자본잠식, 3년 연속 이자보상배율 1.0 미만, 신용위험 최하위 등급 중 하나 이상에 해당합니다. 재창업자금·구조개선전용자금은 오히려 이러한 상태를 전제로 하는 자금입니다.",
      sourceRef: "문서1 p.12 (Ⅲ-⑪)",
    });
  }
  if (p.recentEvalFailOrWithdraw6mo) {
    restrictions.push({
      id: "recent_fail",
      title: "최근 평가탈락·융자포기 후 6개월 미경과",
      severity: "warn",
      detail: "같은 자금으로는 6개월 내 재신청이 제한됩니다. 신청연도가 다르거나 재도약지원·긴급경영안정자금으로 신청하는 경우 등은 예외입니다.",
      sourceRef: "문서1 p.12 (Ⅲ-⑫)",
    });
  }
  if (govSupportCapHit) {
    restrictions.push({
      id: "gov_support_cap",
      title: "정부·지자체 정책자금(융자+보증) 최근 5년 합계 200억원 초과",
      severity: "warn",
      detail: "재도약지원·긴급경영안정·매출채권팩토링·동반성장네트워크론·이차보전 등은 이 한도 산정에서 제외됩니다.",
      sourceRef: "문서1 p.12 (Ⅲ-⑬)",
    });
  }
  if (workingCapitalCapHit) {
    restrictions.push({
      id: "working_capital_cap",
      title: "중진공 정책자금 누적 운전자금 25억원 초과",
      severity: "info",
      detail: "신규 운전자금 지원은 제한될 수 있으나 시설자금은 영향이 없습니다. 고용·수출·매출 성과 창출 기업 등은 예외입니다.",
      sourceRef: "문서1 p.13 (Ⅲ-⑭)",
    });
  }
  if (fundedCountCapHit) {
    restrictions.push({
      id: "funded_count_cap",
      title: "최근 5년 내 정책자금 3회 이상 지원",
      severity: "warn",
      detail: "신규 지원 시 횟수 제한이 적용될 수 있습니다. 재도약지원·긴급경영안정·매출채권팩토링 등은 산정에서 제외되며, 시설자금·성과창출기업 등은 1~2회 추가 지원이 가능할 수 있습니다.",
      sourceRef: "문서1 p.13~14 (Ⅲ-⑮)",
    });
  }
  if (p.recentMisconductOrDiversion) {
    restrictions.push({
      id: "misconduct",
      title: "최근 3년 내 부당개입·자금 목적외 사용 이력",
      severity: "block",
      detail: "허위·부정한 방법의 융자신청, 운전자금 목적외 사용, 경영이행약정 위반 등에 해당하면 신청이 제한됩니다.",
      sourceRef: "문서1 p.11 (Ⅲ-⑥)",
    });
  }
  if (p.seriousSocialIssue) {
    restrictions.push({
      id: "social_issue",
      title: "중대재해처벌법 위반·상습체불·횡령 등 사회적 물의",
      severity: "block",
      detail: "기업 경영과 관련해 사회적 물의를 일으킨 경우 신청이 제한됩니다.",
      sourceRef: "문서1 p.11 (Ⅲ-⑦)",
    });
  }
  if (p.hasGovRnDRecentSanction) {
    restrictions.push({
      id: "rnd_sanction",
      title: "중기부 R&D 참여 후 최근 3년 제재처분",
      severity: "warn",
      detail: "제재부가금·환수금 납부를 완료하고 참여제한이 종료된 경우는 예외로 신청이 가능합니다.",
      sourceRef: "문서1 p.11 (Ⅲ-⑧)",
    });
  }

  // ---------- 프로그램별 매칭 ----------
  function applyUniversalOverlay(id: string, base: { match: ProgramMatch["match"]; reasons: string[]; cautions: string[] }) {
    let { match } = base;
    const reasons = [...base.reasons];
    const cautions = [...base.cautions];

    if (p.isExcludedIndustry) {
      match = "ineligible";
      reasons.push("융자제외 대상 업종에 해당하여 신청이 제한됩니다.");
    }
    if (p.recentMisconductOrDiversion || p.seriousSocialIssue) {
      match = "ineligible";
      reasons.push("최근 부당개입·자금목적외사용 또는 사회적 물의 이력으로 신청이 제한됩니다.");
    }
    if (p.taxDelinquent) {
      if (TAX_DELINQUENT_SOFT.has(id)) {
        match = downgrade(match, "conditional");
        cautions.push("세금 체납 중이라도 압류·매각이 유예된 경우 예외적으로 신청 가능할 수 있습니다.");
      } else {
        match = "ineligible";
        reasons.push("세금 체납 중으로 신청이 제한됩니다.");
      }
    }
    if (p.isClosedOrSuspended) {
      if (CLOSED_SOFT.has(id)) {
        match = downgrade(match, "conditional");
        cautions.push("재해가 직접적인 원인인 휴업은 예외로 인정될 수 있습니다.");
      } else {
        match = "ineligible";
        reasons.push("휴·폐업 중으로 신청이 제한됩니다.");
      }
    }
    if (p.creditRegistryIssue && !CREDIT_REGISTRY_EXEMPT.has(id)) {
      match = "ineligible";
      reasons.push("연체·부도·회생·파산 등 신용정보 등록으로 신청이 제한됩니다.");
    }

    if (isSmallBusinessOwner && !smallBusinessException) {
      const universallyOpen = id === "export_domestic_to_export" || id === "export_globalization";
      if (!universallyOpen) {
        match = "ineligible";
        reasons.push("소상공인 기준(상시근로자수)에 해당하여 원칙적으로 지원 대상이 아닙니다.");
      } else {
        cautions.push("소상공인이지만 신시장진출지원자금은 예외적으로 전체 소상공인이 신청 가능합니다.");
      }
    } else if (isSmallBusinessOwner && smallBusinessException) {
      cautions.push("소상공인 규모이나 업종·중점지원분야 예외로 신청 가능성이 있습니다. 최종 확인이 필요합니다.");
    }

    if (isPrimeCompanyFlag) {
      match = downgrade(match, "conditional");
      cautions.push("우량기업 요건에 해당해 원칙적으로 민간 금융기관 이용이 우선되나, 예외 사유가 있으면 신청이 가능할 수 있습니다.");
    }

    if (debtRatioExceeded && !DEBT_RATIO_EXEMPT.has(id)) {
      match = downgrade(match, "conditional");
      cautions.push(`업종별 제한 부채비율(${debtRatioLimit}%)을 초과해 추가 확인이 필요합니다.`);
    }

    if (isMarginalFirm && !MARGINAL_FIRM_EXEMPT.has(id)) {
      match = downgrade(match, "conditional");
      cautions.push("한계기업 판정 요건에 해당해 별도 심사 기준(한계기업 지원 가능 여부)이 적용될 수 있습니다.");
    }

    if (govSupportCapHit && !GOV_SUPPORT_CAP_EXEMPT.has(id)) {
      match = downgrade(match, "conditional");
      cautions.push("정부·지자체 정책자금 최근 5년 합계 200억원 초과로 신규 지원이 제한될 수 있습니다.");
    }

    if (fundedCountCapHit && !FUNDED_COUNT_CAP_EXEMPT.has(id)) {
      match = downgrade(match, "conditional");
      cautions.push("최근 5년 내 3회 이상 지원 이력으로 추가 지원 여부 확인이 필요합니다.");
    }

    if (workingCapitalCapHit && !GOV_SUPPORT_CAP_EXEMPT.has(id) && !hasPerformance) {
      cautions.push("중진공 운전자금 누적 25억원 초과로 운전자금 신청은 제한될 수 있습니다(시설자금은 영향 없음, 고용·수출·매출 성과 창출 기업은 예외).");
    }

    return { match, reasons, cautions };
  }

  function build(id: string, base: { match: ProgramMatch["match"]; reasons: string[]; cautions: string[] }): ProgramMatch {
    const overlaid = applyUniversalOverlay(id, base);
    const info = getProgram(id);
    return {
      id,
      category: info.category,
      name: info.name,
      match: overlaid.match,
      reasons: overlaid.reasons,
      cautions: overlaid.cautions,
      loanLimit: info.loanLimit,
      loanPeriod: info.loanPeriod,
      interestRate: info.interestRate,
      method: info.method,
      sourceRef: info.pageRef,
    };
  }

  const programs: ProgramMatch[] = [];

  // 1) 창업기반지원자금(일반)
  {
    const reasons: string[] = [];
    const cautions: string[] = [];
    let match: ProgramMatch["match"] = "eligible";
    if (businessAge === null) {
      reasons.push("예비창업자로 창업기반지원자금(일반) 대상에 포함됩니다.");
    } else if (businessAge < 7) {
      reasons.push(`업력 ${businessAge.toFixed(1)}년으로 업력 7년 미만 요건을 충족합니다.`);
    } else if (p.isPriorityField && businessAge < 10) {
      match = "conditional";
      reasons.push("신산업 창업분야 해당 시 업력 10년 이내까지 가능할 수 있습니다.");
      cautions.push("신산업 창업분야(참고자료 1-1)에 정확히 해당하는지 별도 확인이 필요합니다.");
    } else {
      match = "ineligible";
      reasons.push(`업력 ${businessAge.toFixed(1)}년으로 업력 7년(신산업 10년) 요건을 초과합니다.`);
    }
    programs.push(build("startup_general", { match, reasons, cautions }));
  }

  // 2) 청년전용창업자금
  {
    const reasons: string[] = [];
    const cautions: string[] = [];
    let match: ProgramMatch["match"] = "eligible";
    const ageOk = p.ceoAge !== null && p.ceoAge <= 39;
    const ageUnknown = p.ceoAge === null;
    const under3 = businessAge === null || businessAge < 3;
    const under7 = businessAge !== null && businessAge < 7;

    if (ageUnknown) {
      match = "conditional";
      cautions.push("대표자 만 나이를 입력하면 더 정확히 판정됩니다.");
    } else if (!ageOk) {
      match = "ineligible";
      reasons.push("대표자가 만 39세를 초과하여 대상이 아닙니다.");
    }
    if (match !== "ineligible") {
      if (under3) {
        reasons.push("대표자 만 39세 이하 & 업력 3년 미만(또는 예비창업자) 요건을 충족합니다.");
      } else if (under7) {
        match = "conditional";
        reasons.push("업력 3년은 초과했으나, 창업사관학교·청년창업기업보증·VC 투자유치 등 특례 대상이면 업력 7년 미만까지 가능합니다.");
        cautions.push("특례 인정 기관의 추천 여부를 별도로 확인해야 합니다.");
      } else {
        match = "ineligible";
        reasons.push("업력 7년을 초과하여 대상이 아닙니다.");
      }
    }
    programs.push(build("startup_youth", { match, reasons, cautions }));
  }

  // 3) 개발기술사업화자금
  {
    const reasons: string[] = [];
    const cautions: string[] = [];
    let match: ProgramMatch["match"] = "eligible";
    if (p.hasTechCommercializationBasis) {
      reasons.push("특허·정부R&D·기술인증 등 기술사업화 요건을 보유하고 있습니다. (업력 무관)");
      cautions.push("제품 양산 후 3년(초격차 분야는 5년) 경과 기술은 제외됩니다.");
    } else {
      match = "ineligible";
      reasons.push("특허·실용신안·정부 R&D·기술인증·기업부설연구소 개발기술 등 사업화 요건이 확인되지 않습니다.");
    }
    programs.push(build("tech_commercialization", { match, reasons, cautions }));
  }

  // 4) 내수기업수출기업화
  {
    const reasons: string[] = [];
    const cautions: string[] = [];
    let match: ProgramMatch["match"] = "eligible";
    if (p.exportUSD1y < 100000) {
      reasons.push("최근 1년 수출실적이 10만불 미만으로 요건을 충족합니다.");
    } else {
      match = "ineligible";
      reasons.push("최근 1년 수출실적이 10만불 이상으로 수출기업글로벌화 자금 대상입니다.");
    }
    programs.push(build("export_domestic_to_export", { match, reasons, cautions }));
  }

  // 5) 수출기업글로벌화
  {
    const reasons: string[] = [];
    const cautions: string[] = [];
    let match: ProgramMatch["match"] = "eligible";
    if (p.exportUSD1y >= 100000) {
      reasons.push("최근 1년 수출실적이 10만불 이상으로 요건을 충족합니다.");
      if (p.exportGrowth20pctYoY) reasons.push("수출 증가(전년 대비 20%↑) 실적으로 우대 요건에도 해당합니다.");
    } else {
      match = "ineligible";
      reasons.push("최근 1년 수출실적이 10만불 미만으로 내수기업수출기업화 자금 대상입니다.");
    }
    programs.push(build("export_globalization", { match, reasons, cautions }));
  }

  // 6) 혁신성장지원자금(일반)
  {
    const reasons: string[] = [];
    const cautions: string[] = [];
    let match: ProgramMatch["match"] = "eligible";
    if (isProspective) {
      match = "ineligible";
      reasons.push("예비창업자는 대상이 아닙니다.");
    } else if (businessAgeUnknown) {
      match = "conditional";
      reasons.push("설립일을 입력하면 업력 7년 이상 요건 충족 여부를 정확히 판정할 수 있습니다.");
    } else if (businessAge !== null && businessAge >= 7) {
      reasons.push(`업력 ${businessAge.toFixed(1)}년으로 업력 7년 이상 요건을 충족합니다.`);
    } else {
      match = "conditional";
      reasons.push("업력 7년 미만이라도 창업자에 해당하지 않는 경우(합병·법인전환 등)는 예외적으로 신청 가능할 수 있습니다.");
      cautions.push("일반 창업기업이라면 창업기반지원자금(일반)이 더 적합할 수 있습니다.");
    }
    programs.push(build("growth_general", { match, reasons, cautions }));
  }

  // 7) 협동화자금
  {
    const reasons: string[] = [];
    const cautions: string[] = [];
    let match: ProgramMatch["match"] = "eligible";
    if (p.isJointCooperationApproved) {
      reasons.push("협동화실천계획(3개사 이상) 또는 협업사업계획(2개사 이상) 승인 요건을 충족합니다. 업력 제한이 없습니다.");
    } else {
      match = "ineligible";
      reasons.push("협동화실천계획 또는 협업사업계획 승인 실적이 확인되지 않습니다.");
    }
    programs.push(build("growth_cooperative", { match, reasons, cautions }));
  }

  // 8) Net-Zero 유망기업 지원
  {
    const reasons: string[] = [];
    const cautions: string[] = [];
    let match: ProgramMatch["match"] = "eligible";
    if (p.isGreenOrNetZero) {
      reasons.push("그린분야 영위·탄소중립 기술사업화·친환경 설비 도입 등 요건에 해당합니다.");
    } else {
      match = "ineligible";
      reasons.push("그린분야·탄소중립 관련 사업 요건이 확인되지 않습니다.");
    }
    programs.push(build("growth_netzero", { match, reasons, cautions }));
  }

  // 9) 제조현장스마트화
  {
    const reasons: string[] = [];
    const cautions: string[] = [];
    let match: ProgramMatch["match"] = "eligible";
    if (p.isSmartFactoryOrAutomation) {
      reasons.push("스마트공장 지원사업 참여 또는 ICT 기반 자동화 시설 도입 요건에 해당합니다.");
    } else {
      match = "ineligible";
      reasons.push("스마트공장·자동화 시설 도입 관련 요건이 확인되지 않습니다.");
    }
    programs.push(build("growth_smart_factory", { match, reasons, cautions }));
  }

  // 10) 사업전환자금(일반)
  {
    const reasons: string[] = [];
    const cautions: string[] = [];
    let match: ProgramMatch["match"] = "eligible";
    if (p.hasBusinessConversionApproval) {
      reasons.push("사업전환촉진법상 사업전환계획(또는 공동사업전환계획) 승인 요건에 해당합니다.");
      cautions.push("승인일로부터 5년 미만이어야 하며, 상시근로자 5인 이상 요건도 확인하세요.");
    } else {
      match = "ineligible";
      reasons.push("사업전환계획 승인 실적이 확인되지 않습니다.");
    }
    programs.push(build("reboot_conversion_general", { match, reasons, cautions }));
  }

  // 11) 사업전환자금(사업재편)
  {
    const reasons: string[] = [];
    const cautions: string[] = [];
    let match: ProgramMatch["match"] = "eligible";
    if (p.hasBusinessRestructuringApproval) {
      reasons.push("기업활력제고를 위한 특별법상 사업재편계획 승인 요건에 해당합니다.");
      cautions.push("승인일로부터 5년 미만이어야 합니다. 이 자금은 세금체납·부채비율 제한의 예외가 적용됩니다.");
    } else {
      match = "ineligible";
      reasons.push("사업재편계획 승인 실적이 확인되지 않습니다.");
    }
    programs.push(build("reboot_business_realignment", { match, reasons, cautions }));
  }

  // 12) 사업전환자금(통상변화대응)
  {
    const reasons: string[] = [];
    const cautions: string[] = [];
    let match: ProgramMatch["match"] = "eligible";
    if (p.isTradeAdjustmentDesignated) {
      reasons.push("통상환경변화 대응 및 지원법상 통상변화대응지원기업 지정 요건에 해당합니다.");
      cautions.push("지정일로부터 3년 미만이어야 합니다.");
    } else {
      match = "ineligible";
      reasons.push("통상변화대응지원기업 지정 실적이 확인되지 않습니다.");
    }
    programs.push(build("reboot_trade_adjustment", { match, reasons, cautions }));
  }

  // 13) 구조개선전용자금
  {
    const reasons: string[] = [];
    const cautions: string[] = [];
    let match: ProgramMatch["match"] = "eligible";
    if (p.distressedSignFirm) {
      reasons.push("부실징후기업 지정·워크아웃·회생절차 진행 등 지원 취지에 부합합니다.");
      cautions.push("진로제시컨설팅을 통한 '구조개선' 판정, 캠코 협업 추천, 선제적 자율구조개선 프로그램 지원결정 중 하나가 실제로 필요합니다.");
    } else {
      match = "ineligible";
      reasons.push("부실징후기업 지정·워크아웃·회생절차 등 요건이 확인되지 않습니다.");
    }
    programs.push(build("reboot_restructuring", { match, reasons, cautions }));
  }

  // 14) 재창업자금
  {
    const reasons: string[] = [];
    const cautions: string[] = [];
    let match: ProgramMatch["match"] = "eligible";
    if (p.isReCreatedBusiness) {
      if (businessAge !== null && businessAge >= (p.isPriorityField ? 10 : 7)) {
        match = "ineligible";
        reasons.push("재창업기업의 업력이 7년(신산업 10년)을 초과합니다.");
      } else {
        reasons.push("폐업 후 재창업 요건에 해당합니다. (성실경영평가 통과가 전제조건입니다)");
        cautions.push("자금조달 애로 또는 신용회복정보 등록, 성실경영평가 통과 요건을 실제로 충족하는지 중진공 상담을 통해 확인하세요.");
      }
    } else {
      match = "ineligible";
      reasons.push("폐업 후 재창업(또는 예비재창업) 요건이 확인되지 않습니다.");
    }
    programs.push(build("reboot_recreation", { match, reasons, cautions }));
  }

  // 15) 긴급경영안정자금(재해중소기업지원)
  {
    const reasons: string[] = [];
    const cautions: string[] = [];
    let match: ProgramMatch["match"] = "eligible";
    if (p.isDisasterVictim) {
      reasons.push("재해중소기업 확인증 보유 요건에 해당합니다.");
    } else {
      match = "ineligible";
      reasons.push("재해중소기업 확인증(자연재난·사회재난 피해 확인)이 확인되지 않습니다.");
    }
    programs.push(build("emergency_disaster", { match, reasons, cautions }));
  }

  // 16) 긴급경영안정자금(일시적경영애로) — 티몬/위메프 등 포함
  {
    const reasons: string[] = [];
    const cautions: string[] = [];
    let match: ProgramMatch["match"] = "eligible";
    if (p.isPlatformSettlementVictim) {
      reasons.push("티몬·위메프·인터파크쇼핑·AK몰·알렛츠 판매대금 미정산 피해 기업으로 경영애로 사유에 해당합니다.");
      cautions.push("매출 또는 영업이익이 10% 이상 감소했는지 확인이 필요합니다 (해당 사유는 감소요건이 면제되지 않는 일반 유형입니다).");
    } else {
      match = "ineligible";
      reasons.push("재해·대기업구조조정·거래처도산·플랫폼 정산지연 피해 등 경영애로 사유가 확인되지 않습니다.");
    }
    programs.push(build("emergency_hardship", { match, reasons, cautions }));
  }

  // 17) 동반성장 네트워크론
  {
    const reasons: string[] = [];
    const cautions: string[] = [];
    let match: ProgramMatch["match"] = "eligible";
    if (p.hasOrderingCompanyReferral) {
      reasons.push("중진공과 동반성장 협약을 체결한 발주기업의 추천 요건에 해당합니다.");
      cautions.push("최근 3개년 결산 재무제표 보유 및 발주기업과 최근 1년 내 거래실적이 실제로 있는지 확인하세요.");
    } else {
      match = "ineligible";
      reasons.push("협약 발주기업의 추천 실적이 확인되지 않습니다.");
    }
    programs.push(build("valuechain_network_loan", { match, reasons, cautions }));
  }

  // 18) 매출채권팩토링
  {
    const reasons: string[] = [];
    const cautions: string[] = [];
    let match: ProgramMatch["match"] = "eligible";
    if (p.usingOtherFactoring) {
      match = "ineligible";
      reasons.push("신용보증기금·기술보증기금 팩토링을 이용 중인 경우 신청 대상에서 제외됩니다.");
    } else if (p.hasTradeReceivables1y) {
      reasons.push("최근 3개년 결산 재무제표 보유 및 구매기업과 1년 이상 거래·매출채권 보유 요건에 해당합니다.");
    } else {
      match = "ineligible";
      reasons.push("구매기업과 1년 이상 거래·매출채권 보유 요건이 확인되지 않습니다.");
    }
    programs.push(build("valuechain_factoring", { match, reasons, cautions }));
  }

  programs.sort((a, b) => RANK[b.match] - RANK[a.match]);

  return {
    businessAge,
    isProspective,
    businessAgeUnknown,
    isSmallBusinessOwner,
    smallBusinessException,
    debtRatioLimit,
    debtRatioExceeded,
    restrictions,
    programs,
  };
}

export type { Severity };
