// KOSME(중진공) 외 9개 기관 지원사업에 대한 참고용 관심도 판정.
//
// ⚠️ 이 판정은 각 기관의 공식 심사 기준을 전부 규칙화한 것이 아니라, 입력된 프로필을 근거로
// "확인해볼 가치가 있는지"를 대략적으로 걸러주는 참고용 필터다. 실제 자격 요건은
// external-programs-data.ts의 applyUrl에서 반드시 원문을 확인해야 한다.

import type { CompanyProfile } from "./types";
import { EXTERNAL_PROGRAMS, getExternalProgram, type ExternalProgram } from "./external-programs-data";

export type Relevance = "watch" | "info";

export interface ExternalProgramMatch extends ExternalProgram {
  relevance: Relevance; // watch: 입력 조건상 해당 가능성이 있음 / info: 참고용 일반 안내
  relevanceReasons: string[];
}

export function matchExternalPrograms(
  p: CompanyProfile,
  businessAge: number | null,
  isProspective: boolean,
  isSmallBusinessOwner: boolean,
): ExternalProgramMatch[] {
  function build(id: string, relevance: Relevance, relevanceReasons: string[]): ExternalProgramMatch {
    return { ...getExternalProgram(id), relevance, relevanceReasons };
  }

  const isManufacturing = p.industry === "manufacturing";
  const ageUnder = (years: number) => businessAge !== null && businessAge < years;
  const ageBetween = (min: number, max: number) => businessAge !== null && businessAge > min && businessAge <= max;

  const results: ExternalProgramMatch[] = [];

  // 예비창업패키지
  results.push(
    isProspective
      ? build("kstartup_pre", "watch", ["예비창업자로 확인되어 대상에 해당합니다."])
      : build("kstartup_pre", "info", ["예비창업자 전용 사업입니다. 참고용으로 안내합니다."]),
  );

  // 초기창업패키지
  results.push(
    !isProspective && ageUnder(3)
      ? build("kstartup_early", "watch", [`업력 ${businessAge?.toFixed(1)}년으로 창업 3년 이내 요건에 해당할 수 있습니다.`])
      : build("kstartup_early", "info", ["창업 3년 이내 기업 전용 사업입니다."]),
  );

  // 창업도약패키지
  results.push(
    ageBetween(3, 7)
      ? build("kstartup_leap", "watch", [`업력 ${businessAge?.toFixed(1)}년으로 도약기(3~7년) 구간에 해당할 수 있습니다.`])
      : build("kstartup_leap", "info", ["창업 3년 초과~7년 이내 도약기 기업 전용 사업입니다."]),
  );

  // 청년창업사관학교
  {
    const ageOk = p.ceoAge !== null && p.ceoAge <= 39;
    const yearOk = ageUnder(3) || (p.isReCreatedBusiness && ageUnder(7));
    results.push(
      ageOk && yearOk
        ? build("kstartup_youth_academy", "watch", ["대표자 만 39세 이하 & 업력 요건에 해당할 수 있습니다."])
        : build("kstartup_youth_academy", "info", ["만 39세 이하 대표자의 초기 창업기업 전용 사업입니다."]),
    );
  }

  // 소상공인 정책자금(직접대출)
  results.push(
    isSmallBusinessOwner
      ? build("semas_direct_loan", "watch", ["소상공인 기준(업종별 상시근로자 기준 미만)에 해당합니다."])
      : build("semas_direct_loan", "info", ["소상공인 전용 자금입니다. 상시근로자 수 기준을 초과하면 대상이 아닙니다."]),
  );

  // 희망리턴패키지
  results.push(
    p.isClosedOrSuspended || p.isReCreatedBusiness
      ? build("semas_hope_return", "watch", ["휴·폐업 또는 재창업 관련 상황으로 확인해볼 가치가 있습니다."])
      : build("semas_hope_return", "info", ["폐업(예정)·경영위기 소상공인의 재도전을 위한 사업입니다."]),
  );

  // 여성기업 확인서
  results.push(
    p.isWomanCeo
      ? build("wbiz_certificate", "watch", ["대표자가 여성으로 확인되어 신청 대상입니다."])
      : build("wbiz_certificate", "info", ["대표자가 여성인 사업자를 위한 인증 제도입니다."]),
  );

  // 여성기업 육성사업
  results.push(
    p.isWomanCeo
      ? build("wbiz_fostering", "watch", ["여성기업 전용 세부사업(펨테크·창업보육 등) 확인을 권장합니다."])
      : build("wbiz_fostering", "info", ["여성(예비)창업자·여성기업 전용 육성사업입니다."]),
  );

  // 스마트공장 구축지원(정부형)
  results.push(
    p.isSmartFactoryOrAutomation && isManufacturing
      ? build("smartfactory_gov", "watch", ["제조업 영위 & 스마트공장·자동화 추진 의사가 확인됩니다."])
      : build("smartfactory_gov", "info", ["제조 중소·중견기업의 스마트공장 구축을 지원하는 사업입니다."]),
  );

  // 대·중소상생형 스마트공장
  results.push(
    p.isSmartFactoryOrAutomation && isManufacturing
      ? build("smartfactory_samsung", "watch", ["제조업 영위 & 스마트공장·자동화 추진 의사가 확인됩니다."])
      : build("smartfactory_samsung", "info", ["삼성전자와 협력해 스마트공장 구축을 지원하는 사업입니다."]),
  );

  // KEIT AI 응용제품 신속 상용화
  results.push(
    p.industry === "ict" || p.hasTechCommercializationBasis
      ? build("keit_ai_commercialization", "watch", ["ICT 업종이거나 기술사업화 요건을 보유해 확인해볼 가치가 있습니다."])
      : build("keit_ai_commercialization", "info", ["AI 활용 제품의 신속 상용화를 지원하는 산업기술 R&D 사업입니다."]),
  );

  // KEIT 소재부품장비 양산성능평가
  results.push(
    (isManufacturing && p.hasTechCommercializationBasis) || p.isPriorityField
      ? build("keit_materials_parts", "watch", ["제조·기술사업화 또는 중점지원분야(소부장 등) 요건과 관련이 있을 수 있습니다."])
      : build("keit_materials_parts", "info", ["소재·부품·장비 분야 양산성능평가를 지원하는 산업기술 R&D 사업입니다."]),
  );

  const RANK: Record<Relevance, number> = { watch: 1, info: 0 };
  results.sort((a, b) => RANK[b.relevance] - RANK[a.relevance]);

  return results;
}

export { EXTERNAL_PROGRAMS };
