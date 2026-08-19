// 자금별 기본 정보(한도·기간·금리 등)
// 근거: 「2026년도 중소기업 정책자금 융자계획(변경공고)」(중소벤처기업부 공고 제2026-464호)
// Ⅳ. 사업별 정책자금 융자계획 (p.15~37)
// 실제 지원 여부·금액은 기업평가 결과에 따라 달라지며, 아래 수치는 "한도" 기준이다.

export interface FundProgram {
  id: string;
  category: string; // 대분류 (혁신창업사업화자금 등)
  name: string; // 세부 사업명
  targetSummary: string; // 신청대상 요약
  loanLimit: string;
  loanPeriod: string;
  interestRate: string;
  method: string;
  pageRef: string; // 원문 페이지 참조 (문서1 기준)
}

export const FUND_PROGRAMS: FundProgram[] = [
  {
    id: "startup_general",
    category: "혁신창업사업화자금",
    name: "창업기반지원자금(일반)",
    targetSummary: "업력 7년 미만 창업자(예비창업자 포함) 또는 신산업 창업분야 업력 10년 이내 기업",
    loanLimit: "연간 60억원 이내 (운전자금 5억원 이내)",
    loanPeriod: "시설 10년(거치 담보 4년/신용 3년) · 운전 5년(거치 2년)",
    interestRate: "기준금리 △0.6%p (시설) / △0.3%p (운전)",
    method: "직접대출·대리대출·성장공유형대출·투자조건부융자",
    pageRef: "문서1 p.15, 17",
  },
  {
    id: "startup_youth",
    category: "혁신창업사업화자금",
    name: "창업기반지원자금(청년전용창업자금)",
    targetSummary: "대표자 만 39세 이하 & 업력 3년 미만 (사관학교·VC추천 등은 7년 미만까지 예외)",
    loanLimit: "최대 1억원 이내 (제조업·중점지원분야 영위기업 2억원 이내)",
    loanPeriod: "시설 10년(거치 담보 4년/신용 3년) · 운전 6년(거치 3년)",
    interestRate: "2.5% 고정금리",
    method: "직접대출 (심의위원회 평가)",
    pageRef: "문서1 p.18",
  },
  {
    id: "tech_commercialization",
    category: "혁신창업사업화자금",
    name: "개발기술사업화자금",
    targetSummary: "특허·정부R&D·정부인증기술 등 사업화 요건을 보유한 중소기업 (업력 무관)",
    loanLimit: "연간 30억원 이내(운전 5억원) — 혁신성장분야 일부 유형은 60억원(운전 10억원)",
    loanPeriod: "시설 10년(거치 담보 4년/신용 3년) · 운전 5년(거치 2년)",
    interestRate: "기준금리(변동)",
    method: "직접대출·성장공유형대출·투자조건부융자",
    pageRef: "문서1 p.19",
  },
  {
    id: "export_domestic_to_export",
    category: "신시장진출지원자금",
    name: "내수기업수출기업화",
    targetSummary: "최근 1년 수출실적 10만불 미만 (수출초보·수출지원사업참여·기술수출·해외법인지원 등)",
    loanLimit: "연간 10억원 이내 (해외법인지원자금 성장공유형은 50억원)",
    loanPeriod: "5년(거치 2년)",
    interestRate: "기준금리(변동) 또는 고정금리",
    method: "직접대출·성장공유형대출",
    pageRef: "문서1 p.20",
  },
  {
    id: "export_globalization",
    category: "신시장진출지원자금",
    name: "수출기업글로벌화",
    targetSummary: "최근 1년 수출실적 10만불 이상 (수출유망기업, 해외법인지원 포함)",
    loanLimit: "연간 30억원(운전 10억원) — 수출 고성장기업 60억원, 해외법인지원 성장공유형 50억원",
    loanPeriod: "시설 10년(거치 담보 4년/신용 3년) · 운전 5년(거치 2년)",
    interestRate: "기준금리(변동) / 이차보전 시 최대 3%p 보전",
    method: "직접대출·성장공유형대출·이차보전",
    pageRef: "문서1 p.21",
  },
  {
    id: "growth_general",
    category: "신성장기반자금",
    name: "혁신성장지원자금(일반)",
    targetSummary: "업력 7년 이상 (7년 미만 비창업자 포함) — 이차보전은 최근 3년 내 시설도입 기업",
    loanLimit: "연간 60억원 이내 (운전자금 5억원 이내)",
    loanPeriod: "시설 10년(거치 담보 4년/신용 3년) · 운전 5년(거치 2년)",
    interestRate: "기준금리+0.5%p (국가핵심기술 보유기업은 기준금리)",
    method: "직접대출·대리대출·성장공유형대출·이차보전",
    pageRef: "문서1 p.22",
  },
  {
    id: "growth_cooperative",
    category: "신성장기반자금",
    name: "혁신성장지원자금(협동화자금)",
    targetSummary: "3개 이상 협동화실천계획 승인 또는 2개 이상 협업사업계획 승인 (업력 제한 없음)",
    loanLimit: "연간 100억원 이내 (운전자금 15억원 이내)",
    loanPeriod: "시설 10년(거치 5년) · 운전 5년(거치 2년)",
    interestRate: "기준금리(변동)",
    method: "직접대출·대리대출",
    pageRef: "문서1 p.23",
  },
  {
    id: "growth_netzero",
    category: "신성장기반자금",
    name: "Net-Zero 유망기업 지원",
    targetSummary: "그린분야 영위·탄소중립 기술사업화·친환경 설비 도입 등 추진 기업",
    loanLimit: "연간 60억원 이내 (운전자금 5억원 이내)",
    loanPeriod: "시설 10년(거치 담보 4년/신용 3년) · 운전 5년(거치 2년)",
    interestRate: "기준금리+0.5%p / 이차보전 시 최대 3%p 보전",
    method: "직접대출·대리대출·이차보전",
    pageRef: "문서1 p.25",
  },
  {
    id: "growth_smart_factory",
    category: "신성장기반자금",
    name: "제조현장스마트화",
    targetSummary: "스마트공장 지원사업 참여 또는 ICT 기반 자동화 시설 도입 추진 기업",
    loanLimit: "연간 100억원 이내 (운전자금 10억원 이내)",
    loanPeriod: "시설 10년(거치 담보 4년/신용 3년) · 운전 5년(거치 2년)",
    interestRate: "기준금리(변동)",
    method: "직접대출·대리대출·이차보전",
    pageRef: "문서1 p.26",
  },
  {
    id: "reboot_conversion_general",
    category: "재도약지원자금",
    name: "사업전환자금(일반)",
    targetSummary: "사업전환촉진법상 사업전환계획·공동사업전환계획 승인 후 5년 미만 (상시근로자 5인 이상)",
    loanLimit: "연간 100억원 이내 (운전자금 5억원 이내)",
    loanPeriod: "시설 10년(거치 담보 5년/신용 4년) · 운전 6년(거치 3년)",
    interestRate: "기준금리(변동)",
    method: "직접대출·대리대출",
    pageRef: "문서1 p.27",
  },
  {
    id: "reboot_business_realignment",
    category: "재도약지원자금",
    name: "사업전환자금(사업재편)",
    targetSummary: "기업활력법상 사업재편계획 승인 후 5년 미만",
    loanLimit: "연간 100억원 이내 (운전자금 5억원 이내)",
    loanPeriod: "시설 10년(거치 담보 5년/신용 4년) · 운전 6년(거치 3년)",
    interestRate: "기준금리(변동)",
    method: "직접대출·대리대출",
    pageRef: "문서1 p.28",
  },
  {
    id: "reboot_trade_adjustment",
    category: "재도약지원자금",
    name: "사업전환자금(통상변화대응)",
    targetSummary: "통상환경변화 대응 및 지원법상 통상변화대응지원기업 지정 후 3년 미만",
    loanLimit: "연간 60억원 이내 (운전자금 5억원 이내)",
    loanPeriod: "시설 10년(거치 담보 5년/신용 4년) · 운전 6년(거치 3년)",
    interestRate: "2.0% 고정금리",
    method: "직접대출·대리대출",
    pageRef: "문서1 p.28",
  },
  {
    id: "reboot_restructuring",
    category: "재도약지원자금",
    name: "구조개선전용자금",
    targetSummary: "부실징후기업·워크아웃·회생절차 진행 중이거나 선제적 자율구조개선 프로그램 지원 결정 기업",
    loanLimit: "일반: 운전 3년간 10억원 / 선제적 자율구조개선: 시설 60억원, 운전 3년간 15억원(연 10억원)",
    loanPeriod: "시설 10년(거치 담보 4년/신용 3년) · 운전 5년(거치 2년)",
    interestRate: "기준금리(변동) 또는 2.5% 고정(선제적 자율구조개선)",
    method: "직접대출",
    pageRef: "문서1 p.29~30",
  },
  {
    id: "reboot_recreation",
    category: "재도약지원자금",
    name: "재창업자금",
    targetSummary:
      "폐업 후 재창업(또는 예비재창업) — 업력 7년 미만(신산업 10년 이내) & 자금조달 애로/신용회복정보 등록 & 성실경영평가 통과",
    loanLimit: "연간 60억원 이내 (운전자금 5억원, 성실경영 심층평가 통과 시 10억원)",
    loanPeriod: "시설 10년(거치 4년) · 운전 6년(거치 3년)",
    interestRate: "기준금리(변동), 성실경영 심층평가 통과 시 △0.3%p",
    method: "직접대출·대리대출",
    pageRef: "문서1 p.31~32",
  },
  {
    id: "emergency_disaster",
    category: "긴급경영안정자금",
    name: "긴급경영안정자금(재해중소기업지원)",
    targetSummary: "자연재난·사회재난으로 피해를 입어 「재해중소기업 확인증」을 발급받은 기업",
    loanLimit: "피해금액 이내 최대 10억원 (3년간 15억원 이내)",
    loanPeriod: "5년(거치 2년)",
    interestRate: "1.9% 고정금리",
    method: "직접대출",
    pageRef: "문서1 p.33",
  },
  {
    id: "emergency_hardship",
    category: "긴급경영안정자금",
    name: "긴급경영안정자금(일시적경영애로)",
    targetSummary:
      "대기업 구조조정·거래처 도산·기술유출·티몬/위메프/인터파크쇼핑/AK몰/알렛츠 정산지연 피해 등으로 매출·영업이익이 10% 이상 감소한 기업 (일부 사유는 감소 요건 면제)",
    loanLimit: "10억원 이내 (3년간 15억원 이내)",
    loanPeriod: "5년(거치 2년)",
    interestRate: "기준금리+0.5%p (홈플러스 피해기업은 기준금리)",
    method: "직접대출",
    pageRef: "문서1 p.34~35",
  },
  {
    id: "valuechain_network_loan",
    category: "밸류체인안정화자금",
    name: "동반성장 네트워크론",
    targetSummary: "중진공과 협약된 발주기업이 추천하는 수주 중소기업 (최근 3개년 결산 재무제표, 발주기업과 최근 1년 내 거래실적)",
    loanLimit: "발주서 기반 생산자금 (한도는 발주 규모에 따라 산정)",
    loanPeriod: "발주~납품 주기 기준 단기",
    interestRate: "정책자금 기준금리 체계 적용",
    method: "발주서 기반 대출 → 채권양수도 → 발주기업 대금 회수",
    pageRef: "문서1 p.36",
  },
  {
    id: "valuechain_factoring",
    category: "밸류체인안정화자금",
    name: "매출채권팩토링",
    targetSummary: "최근 3개년 결산 재무제표 보유, 구매기업과 1년 이상 거래실적 보유 (신용보증기금·기술보증기금 팩토링 이용 중이면 제외)",
    loanLimit: "보유 매출채권 한도 내",
    loanPeriod: "매출채권 만기 기준 단기",
    interestRate: "정책자금 기준금리 체계 적용",
    method: "중진공이 매출채권을 상환청구권 없이 인수",
    pageRef: "문서1 p.37",
  },
];

export function getProgram(id: string): FundProgram {
  const found = FUND_PROGRAMS.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown fund program id: ${id}`);
  return found;
}
