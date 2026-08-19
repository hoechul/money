// 자가진단 입력값(CompanyProfile)을 관리자 화면에서 사람이 읽기 쉬운 라벨·값으로 변환한다.
// company-form.tsx의 각 Field/ToggleRow 라벨과 동일한 표현을 사용해 폼에서 본 것과 그대로 매칭되도록 한다.
import type { CompanyProfile } from "./types";
import { getIndustry } from "./reference-data";

function yesNo(v: boolean): string {
  return v ? "예" : "아니오";
}

function num(v: number | null, suffix = ""): string {
  if (v === null || v === undefined) return "미입력";
  return `${v.toLocaleString("ko-KR")}${suffix}`;
}

const COMPANY_TYPE_LABEL: Record<CompanyProfile["companyType"], string> = {
  corporation: "법인사업자",
  individual: "개인사업자",
  prospective: "예비창업자 (설립 전)",
};

const LISTED_STATUS_LABEL: Record<CompanyProfile["listedStatus"], string> = {
  none: "비상장",
  kosdaq_tech: "코스닥 기술특례상장",
  kosdaq: "코스닥 일반상장",
  kospi: "유가증권시장(코스피) 상장",
};

const TRISTATE_LABEL: Record<CompanyProfile["creditRatingBBBPlus"], string> = {
  unknown: "모름 / 평가받은 적 없음",
  yes: "BBB 이상",
  no: "BBB 미만",
};

const KOSMES_GRADE_LABEL: Record<CompanyProfile["kosmesRiskGrade"], string> = {
  unknown: "모름",
  top: "최상위 등급 (CR1)",
  middle: "중간 등급",
  lowest: "최하위 등급",
};

export interface ProfileDisplayRow {
  label: string;
  value: string;
}

export interface ProfileDisplaySection {
  title: string;
  rows: ProfileDisplayRow[];
}

export function toProfileDisplaySections(p: CompanyProfile): ProfileDisplaySection[] {
  return [
    {
      title: "기본 정보",
      rows: [
        { label: "사업 형태", value: COMPANY_TYPE_LABEL[p.companyType] },
        { label: "사업자등록번호", value: p.businessRegistrationNumber || "미입력" },
        { label: "설립일 / 사업개시일", value: p.foundedDate || "미입력" },
        { label: "업종", value: getIndustry(p.industry).label },
        { label: "상시근로자수", value: num(p.employees, "명") },
        { label: "대표자 만 나이", value: num(p.ceoAge, "세") },
        { label: "직전년도 매출액", value: num(p.lastYearRevenueMillion, "백만원") },
        { label: "융자제외 대상 업종(사행성·금융보험·부동산·전문서비스 등) 해당", value: yesNo(p.isExcludedIndustry) },
      ],
    },
    {
      title: "재무 · 신용 상태",
      rows: [
        { label: "자본총계", value: num(p.capitalEqBillion, "억원") },
        { label: "자산총계", value: num(p.totalAssetsBillion, "억원") },
        { label: "부채비율", value: num(p.debtRatioPct, "%") },
        { label: "상장 여부", value: LISTED_STATUS_LABEL[p.listedStatus] },
        { label: "기술특례상장 후 경과년수", value: num(p.kosdaqTechListedYearsAgo, "년") },
        { label: "신용평가사 등급 BBB 이상 여부", value: TRISTATE_LABEL[p.creditRatingBBBPlus] },
        { label: "중진공 신용위험등급", value: KOSMES_GRADE_LABEL[p.kosmesRiskGrade] },
        { label: "세금 체납 중", value: yesNo(p.taxDelinquent) },
        { label: "휴업 또는 폐업 중", value: yesNo(p.isClosedOrSuspended) },
        { label: "연체·대위변제·부도·회생·파산 등 신용정보 등록", value: yesNo(p.creditRegistryIssue) },
        { label: "부실징후기업 지정 / 워크아웃 / 회생절차 진행 중", value: yesNo(p.distressedSignFirm) },
        { label: "2년 연속 적자 + 자기자본 전액 잠식", value: yesNo(p.capitalImpairment2y) },
        { label: "3년 연속 이자보상배율 1.0 미만", value: yesNo(p.interestCoverageBelow1For3y) },
        { label: "간편장부대상 개인사업자 / 중소기업협동조합", value: yesNo(p.isSimplifiedBookkeeper || p.isCooperativeUnion) },
      ],
    },
    {
      title: "정책자금 이력 · 성과 지표",
      rows: [
        { label: "최근 5년 정책자금 지원 횟수", value: num(p.fundedCount5y, "회") },
        { label: "중진공 운전자금 누적 지원금액", value: num(p.cumulativeWorkingCapitalBillion, "억원") },
        { label: "정부·지자체 정책자금(융자+보증) 최근 5년 합계", value: num(p.govSupport5yBillion, "억원") },
        { label: "최근 1년 직·간접 수출실적", value: num(p.exportUSD1y, " USD") },
        { label: "최근 1년간 상시근로자 10인 이상 고용 창출", value: yesNo(p.employmentGrowth10In1y) },
        { label: "수출실적 전년 대비 20% 이상 증가", value: yesNo(p.exportGrowth20pctYoY) },
        { label: "직전연도 매출 30억 이상 & 최근 3년 연평균 매출 20% 이상 증가", value: yesNo(p.revenueGrowth20pct3y) },
        { label: "유형자산 증가율 동업종 2배 초과 또는 매출대비 R&D 1.5% 이상", value: yesNo(p.hasHighFacilityOrRnd) },
        { label: "최근 평가탈락 또는 융자 전액포기 후 6개월 미경과", value: yesNo(p.recentEvalFailOrWithdraw6mo) },
        { label: "최근 3년 내 정책자금 부당개입·목적외 사용 이력", value: yesNo(p.recentMisconductOrDiversion) },
        { label: "중대재해처벌법 위반·상습체불·횡령 등 사회적 물의", value: yesNo(p.seriousSocialIssue) },
        { label: "중기부 R&D 참여 후 최근 3년 제재처분(미완납)", value: yesNo(p.hasGovRnDRecentSanction) },
      ],
    },
    {
      title: "중점지원분야 · 특수 상황",
      rows: [
        { label: "혁신성장·초격차/신산업·지역주력산업·뿌리산업·소부장산업 해당", value: yesNo(p.isPriorityField) },
        { label: "그린분야·탄소중립 기술사업화·친환경 설비 도입", value: yesNo(p.isGreenOrNetZero) },
        { label: "스마트공장 지원사업 참여 또는 ICT 자동화 시설 도입", value: yesNo(p.isSmartFactoryOrAutomation) },
        { label: "특허·정부R&D·정부인증·기업부설연구소 등 기술사업화 요건 보유", value: yesNo(p.hasTechCommercializationBasis) },
        { label: "(예비)사회적기업·협동조합·마을기업·자활기업·소셜벤처", value: yesNo(p.isSocialEconomyEnterprise) },
        { label: "대표자가 여성", value: yesNo(p.isWomanCeo) },
        { label: "재해중소기업 확인증 보유", value: yesNo(p.isDisasterVictim) },
        { label: "티몬·위메프 등 플랫폼 판매대금 미정산 피해", value: yesNo(p.isPlatformSettlementVictim) },
        { label: "사업전환계획 승인 (5년 미만)", value: yesNo(p.hasBusinessConversionApproval) },
        { label: "사업재편계획 승인 (5년 미만, 기업활력법)", value: yesNo(p.hasBusinessRestructuringApproval) },
        { label: "통상변화대응지원기업 지정 (3년 미만)", value: yesNo(p.isTradeAdjustmentDesignated) },
        { label: "폐업 후 재창업 (성실경영평가 통과 가능)", value: yesNo(p.isReCreatedBusiness) },
        { label: "협동화실천계획(3개↑) / 협업사업계획(2개↑) 승인", value: yesNo(p.isJointCooperationApproved) },
        { label: "동반성장 협약 발주기업의 추천", value: yesNo(p.hasOrderingCompanyReferral) },
        { label: "구매기업과 1년 이상 거래 · 매출채권 보유", value: yesNo(p.hasTradeReceivables1y) },
        { label: "신용보증기금·기술보증기금 팩토링 이용 중", value: yesNo(p.usingOtherFactoring) },
      ],
    },
  ];
}
