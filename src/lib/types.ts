// 회사 조건 입력값 타입 정의
// 근거: 「2026년도 중소기업 정책자금 융자계획(변경공고)」 및 참고자료(중소벤처기업진흥공단)

export type CompanyType = "corporation" | "individual" | "prospective";

export type ListedStatus = "none" | "kosdaq_tech" | "kosdaq" | "kospi";

export type Tristate = "unknown" | "yes" | "no";

export interface CompanyProfile {
  // --- 기본 정보 ---
  companyType: CompanyType;
  businessRegistrationNumber: string; // 사업자등록번호 (000-00-00000), 예비창업자는 빈 문자열
  foundedDate: string; // yyyy-mm-dd, 예비창업자는 빈 문자열
  industry: string; // IndustryOption value
  isExcludedIndustry: boolean; // 융자제외 대상 업종(별표1) 영위 여부
  employees: number;

  // --- 재무 ---
  lastYearRevenueMillion: number; // 직전년도 매출액 (백만원)
  capitalEqBillion: number | null; // 자본총계 (억원)
  totalAssetsBillion: number | null; // 자산총계 (억원)
  debtRatioPct: number | null; // 부채비율 (%)
  isSimplifiedBookkeeper: boolean; // 간편장부대상 개인사업자
  hasHighFacilityOrRnd: boolean; // 유형자산 증가율(동업종 2배 초과) 또는 매출대비 R&D 1.5%↑

  // --- 신용/등급 ---
  listedStatus: ListedStatus;
  kosdaqTechListedYearsAgo: number | null; // 코스닥 기술특례상장 후 경과년수
  creditRatingBBBPlus: Tristate; // 신용평가사 BBB등급 이상 여부
  kosmesRiskGrade: "unknown" | "top" | "lowest" | "middle"; // 중진공 신용위험등급

  // --- 제한 사유 ---
  taxDelinquent: boolean; // 세금 체납 중
  creditRegistryIssue: boolean; // 연체·부도·회생파산 등 신용정보 등록
  isClosedOrSuspended: boolean; // 휴·폐업 중
  distressedSignFirm: boolean; // 정책금융기관 지정 부실징후기업 / 워크아웃 / 회생절차
  capitalImpairment2y: boolean; // 2년 연속 적자 + 자기자본 전액 잠식
  interestCoverageBelow1For3y: boolean; // 3년 연속 이자보상배율 1.0 미만
  recentEvalFailOrWithdraw6mo: boolean; // 최근 평가탈락/융자포기 후 6개월 미경과
  recentMisconductOrDiversion: boolean; // 최근 3년 부당개입·자금 목적외 사용 등
  seriousSocialIssue: boolean; // 중대재해처벌·상습체불·횡령 등 사회적 물의

  // --- 소상공인 관련 ---
  isSocialEconomyEnterprise: boolean; // (예비)사회적기업/협동조합/마을기업/자활기업/소셜벤처
  isCooperativeUnion: boolean; // 중소기업협동조합법상 협동조합

  // --- 정책자금 이력 ---
  fundedCount5y: number; // 최근 5년 정책자금 지원 횟수
  cumulativeWorkingCapitalBillion: number; // 중진공 운전자금 누적 지원금액 (억원, 2018.1.2 이후)
  govSupport5yBillion: number; // 정부·지자체 정책자금 융자+보증 최근 5년 합계 (억원)

  // --- 성과 지표 (우대/예외 판정용) ---
  employmentGrowth10In1y: boolean; // 최근 1년 10인 이상 고용 창출
  exportUSD1y: number; // 최근 1년 직·간접 수출실적 (미화 달러)
  exportGrowth20pctYoY: boolean; // 수출실적 전년 대비 20%↑ 증가
  revenueGrowth20pct3y: boolean; // 최근 3년 연평균 매출액 20%↑ 증가 (직전연도 매출 30억↑ 전제)

  // --- 중점지원분야 ---
  isPriorityField: boolean; // 혁신성장/초격차·신산업/지역주력산업/뿌리산업/소부장산업 해당
  isGreenOrNetZero: boolean; // 그린분야 영위·탄소중립 기술사업화·친환경 설비 도입 등
  isSmartFactoryOrAutomation: boolean; // 스마트공장 지원사업 참여 또는 ICT 기반 자동화 시설 도입

  // --- 특수 상황 ---
  isWomanCeo: boolean; // 대표자가 여성 (여성기업 확인서 대상 판단용)
  isDisasterVictim: boolean; // 재해중소기업 확인증 보유
  isPlatformSettlementVictim: boolean; // 티몬/위메프/인터파크쇼핑/AK몰/알렛츠 판매대금 미정산 피해
  hasBusinessConversionApproval: boolean; // 사업전환계획 승인 (5년 미만)
  hasBusinessRestructuringApproval: boolean; // 사업재편계획 승인 (5년 미만, 기업활력법)
  isTradeAdjustmentDesignated: boolean; // 통상변화대응지원기업 지정 (3년 미만)
  isReCreatedBusiness: boolean; // 폐업 후 재창업 (성실경영평가 통과 전제)
  isJointCooperationApproved: boolean; // 협동화실천계획(3개↑) / 협업사업계획(2개↑) 승인
  ceoAge: number | null; // 대표자 만 나이
  hasTechCommercializationBasis: boolean; // 개발기술사업화 요건(특허/정부R&D/인증 등) 보유
  hasGovRnDRecentSanction: boolean; // 중기부 R&D 참여 후 최근 3년 제재처분(미완납)

  // --- 밸류체인안정화자금 ---
  hasOrderingCompanyReferral: boolean; // 협약 발주기업의 추천 (동반성장 네트워크론)
  hasTradeReceivables1y: boolean; // 구매기업과 1년 이상 거래·매출채권 보유 (매출채권팩토링)
  usingOtherFactoring: boolean; // 신용보증기금·기술보증기금 팩토링 이용 중
}

export const DEFAULT_PROFILE: CompanyProfile = {
  companyType: "corporation",
  businessRegistrationNumber: "",
  foundedDate: "",
  industry: "manufacturing",
  isExcludedIndustry: false,
  employees: 5,

  lastYearRevenueMillion: 0,
  capitalEqBillion: null,
  totalAssetsBillion: null,
  debtRatioPct: null,
  isSimplifiedBookkeeper: false,
  hasHighFacilityOrRnd: false,

  listedStatus: "none",
  kosdaqTechListedYearsAgo: null,
  creditRatingBBBPlus: "unknown",
  kosmesRiskGrade: "unknown",

  taxDelinquent: false,
  creditRegistryIssue: false,
  isClosedOrSuspended: false,
  distressedSignFirm: false,
  capitalImpairment2y: false,
  interestCoverageBelow1For3y: false,
  recentEvalFailOrWithdraw6mo: false,
  recentMisconductOrDiversion: false,
  seriousSocialIssue: false,

  isSocialEconomyEnterprise: false,
  isCooperativeUnion: false,

  fundedCount5y: 0,
  cumulativeWorkingCapitalBillion: 0,
  govSupport5yBillion: 0,

  employmentGrowth10In1y: false,
  exportUSD1y: 0,
  exportGrowth20pctYoY: false,
  revenueGrowth20pct3y: false,

  isPriorityField: false,
  isGreenOrNetZero: false,
  isSmartFactoryOrAutomation: false,

  isWomanCeo: false,
  isDisasterVictim: false,
  isPlatformSettlementVictim: false,
  hasBusinessConversionApproval: false,
  hasBusinessRestructuringApproval: false,
  isTradeAdjustmentDesignated: false,
  isReCreatedBusiness: false,
  isJointCooperationApproved: false,
  ceoAge: null,
  hasTechCommercializationBasis: false,
  hasGovRnDRecentSanction: false,

  hasOrderingCompanyReferral: false,
  hasTradeReceivables1y: false,
  usingOtherFactoring: false,
};

export type Severity = "block" | "warn" | "info";

export interface RestrictionFinding {
  id: string;
  title: string;
  severity: Severity;
  detail: string;
  sourceRef: string;
}

export interface ProgramMatch {
  id: string;
  category: string;
  name: string;
  match: "eligible" | "conditional" | "ineligible";
  reasons: string[]; // 충족 근거 또는 미충족 사유
  cautions: string[]; // 확인 필요 사항
  loanLimit: string;
  loanPeriod: string;
  interestRate: string;
  method: string;
  sourceRef: string;
}

export interface EligibilityResult {
  businessAge: number | null;
  isProspective: boolean; // 예비창업자로 확인됨 (사업 형태 = 예비창업자)
  businessAgeUnknown: boolean; // 예비창업자는 아니지만 설립일 미입력으로 업력을 알 수 없음
  isSmallBusinessOwner: boolean; // 소상공인 해당 여부 (업종별 상시근로자 기준)
  smallBusinessException: boolean; // 소상공인이지만 예외로 지원 가능
  debtRatioLimit: number | null;
  debtRatioExceeded: boolean;
  restrictions: RestrictionFinding[];
  programs: ProgramMatch[];
}
