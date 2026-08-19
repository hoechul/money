// 중진공(KOSME) 정책자금 외 — 창업·소상공인·여성기업·스마트공장·산업기술R&D 분야
// 주요 10개 지원기관 포털을 조사해 정리한 대표 지원사업 정보.
//
// ⚠️ 아래 금액·비율 중 일부는 공고 원문 PDF가 아닌 기업마당(bizinfo.go.kr) 게재본·기관 홈페이지를
// 기준으로 조사되었다. dataConfidence가 "check_notice"인 항목은 세부 자금 한도·자기부담률이
// 공고별로 갈리므로, 반드시 applyUrl에서 최신 공고 원문을 확인해야 한다.

export type DataConfidence = "verified" | "check_notice";

export interface ExternalProgram {
  id: string;
  agencyGroup: string; // 운영기관 · 포털명
  category: string;
  name: string;
  targetSummary: string;
  supportSummary: string;
  periodSummary: string;
  applyUrl: string;
  sourceRef: string;
  dataConfidence: DataConfidence;
}

export const EXTERNAL_PROGRAMS: ExternalProgram[] = [
  // ── 창업진흥원(KISED) · K-Startup ──────────────────────────
  {
    id: "kstartup_pre",
    agencyGroup: "창업진흥원(KISED) · K-Startup",
    category: "예비창업 지원",
    name: "예비창업패키지",
    targetSummary: "예비창업자 (공고일 기준 사업자등록·법인 대표이력이 없는 자)",
    supportSummary:
      "사업화자금 평균 4~5천만원, 최대 1억원 (정부 100% 지원, 자기부담 없음) — 1단계 2천만원 고정 지급 후 중간평가 통과자에 한해 2단계 추가 지급",
    periodSummary: "협약기간 약 10개월 (2026년 공고는 3~4월 접수, 매년 일정 변동)",
    applyUrl: "https://www.k-startup.go.kr",
    sourceRef: "중소벤처기업부 2026년도 예비창업패키지 모집(수정)공고 — bizinfo.go.kr 게재",
    dataConfidence: "verified",
  },
  {
    id: "kstartup_early",
    agencyGroup: "창업진흥원(KISED) · K-Startup",
    category: "초기창업 지원",
    name: "초기창업패키지",
    targetSummary: "창업 3년 이내 대표자 (중소기업기본법상 중소기업)",
    supportSummary:
      "사업화자금 평균 5천만원, 최대 1억원 — 일반형/딥테크 특화형/투자연계형 중 하나를 선택해 수행 (복수 지원은 가능하나 실행은 1개만)",
    periodSummary: "협약기간 10개월 이내",
    applyUrl: "https://www.k-startup.go.kr",
    sourceRef: "중소벤처기업부 공고 제2026-38호 — bizinfo.go.kr 게재",
    dataConfidence: "verified",
  },
  {
    id: "kstartup_leap",
    agencyGroup: "창업진흥원(KISED) · K-Startup",
    category: "도약기 창업 지원",
    name: "창업도약패키지",
    targetSummary: "창업 3년 초과 ~ 7년 이내 도약기 기업 (딥테크 분야는 별도 기준 적용 가능)",
    supportSummary:
      "트랙별(일반형/투자병행형/딥테크 특화형/제조 특화형 등) 최대 2억원 사업화자금 + 투자연계 — 자기부담률은 트랙·회차별로 달라 공고 원문 확인이 꼭 필요",
    periodSummary: "협약기간 10개월 내외",
    applyUrl: "https://www.k-startup.go.kr",
    sourceRef: "bizinfo.go.kr 게재 공고(자기부담률 등 세부 조건 미검증 — 원문 대조 필요)",
    dataConfidence: "check_notice",
  },
  {
    id: "kstartup_youth_academy",
    agencyGroup: "창업진흥원(KISED) · K-Startup",
    category: "청년 창업사관학교",
    name: "청년창업사관학교",
    targetSummary: "만 39세 이하 & 창업 3년 이내 대표자 (재도전 '경험창업자'는 7년 이내까지 예외)",
    supportSummary:
      "사업화자금 평균 7천만원, 최대 1억원 (정부 최대 70% + 자기부담 30% 이상) + 창업공간·코칭·기술지원·글로벌 진출 지원",
    periodSummary: "기본과정 약 1년 (사관학교 캠퍼스 상주형 프로그램)",
    applyUrl: "https://www.k-startup.go.kr",
    sourceRef: "중소벤처기업부 공고 제2026-60호 — bizinfo.go.kr 게재",
    dataConfidence: "verified",
  },

  // ── 소상공인시장진흥공단(SEMAS) · 소상공인마당 ──────────────
  {
    id: "semas_direct_loan",
    agencyGroup: "소상공인시장진흥공단(SEMAS) · 소상공인마당",
    category: "소상공인 정책자금",
    name: "소상공인 정책자금(직접대출)",
    targetSummary: "「소상공인기본법」상 소상공인 (업종별 상시근로자 5~10인 미만)",
    supportSummary:
      "일반·특별·긴급경영안정자금, 신용취약자금, 대환대출, 재도전특별자금, 청년고용연계자금, 소공인특화자금 등 13개 세부자금 — 자금별 한도·금리는 세부 공고에서 결정",
    periodSummary: "5년 내외(2년 거치 등, 세부자금별 상이) · 예산 소진 시 조기 마감",
    applyUrl: "https://ols.semas.or.kr",
    sourceRef: "중소벤처기업부 공고 제2025-656호(2025.12.30, 2026년 시행) — 세부 한도·금리는 원문 대조 필요",
    dataConfidence: "check_notice",
  },
  {
    id: "semas_hope_return",
    agencyGroup: "소상공인시장진흥공단(SEMAS) · 소상공인마당",
    category: "폐업·재도전 지원",
    name: "희망리턴패키지",
    targetSummary: "폐업(예정) 또는 경영위기 소상공인 — 재창업/업종전환/창업도약(재취업) 트랙",
    supportSummary:
      "점포철거비(최대 약 600만원), 재창업 사업화자금(최대 약 2천만원), 재창업 진단·교육·멘토링, 전직장려수당 등 — 트랙별 금액은 연도 공고에 따라 변동",
    periodSummary: "재기사업화 모집은 통상 1~2월, 점포철거비는 예산 범위 내 상시접수",
    applyUrl: "https://hope.sbiz.or.kr",
    sourceRef: "2026년 희망리턴패키지 재기사업화 모집공고 — bizinfo.go.kr 게재",
    dataConfidence: "check_notice",
  },

  // ── 한국여성경제인협회 · 여성기업종합정보포털(WBIZ) ─────────
  {
    id: "wbiz_certificate",
    agencyGroup: "한국여성경제인협회 · 여성기업종합정보포털(WBIZ)",
    category: "여성기업 인증",
    name: "여성기업 확인서 발급",
    targetSummary: "대표자(개인사업자) 또는 최대주주 겸 실경영자(법인)가 여성인 사업자",
    supportSummary:
      "인증 취득 시 공공기관 물품·용역 구매의 5%(공사 3%) 여성기업 우선구매 대상 포함, 정책자금·보증 우대 프로그램과 연계 — 인증 자체는 무료",
    periodSummary: "유효기간 3년 (만료 전 갱신 필요)",
    applyUrl: "https://www.wbiz.or.kr",
    sourceRef: "「여성기업지원에 관한 법률」 시행령 제8조, WBIZ 기업확인서 신청 안내",
    dataConfidence: "verified",
  },
  {
    id: "wbiz_fostering",
    agencyGroup: "한국여성경제인협회 · 여성기업종합정보포털(WBIZ)",
    category: "여성기업 육성",
    name: "여성기업 육성사업 통합공고 (펨테크·창업보육 등)",
    targetSummary: "여성(예비)창업자 및 여성기업",
    supportSummary:
      "펨테크(FemTech) 사업화자금 최대 8천만원(기술선도형)/3천만원(기초응용형), 전국 18개 여성창업보육센터 입주·컨설팅, 여성창업경진대회, 판로·인력 지원 등 11개 세부사업(2026년 총예산 약 117.4억원)",
    periodSummary: "세부사업별 별도 공고로 연중 순차 시행",
    applyUrl: "https://www.wbiz.or.kr",
    sourceRef: "중소벤처기업부 2026년 여성기업 육성사업 통합공고(2026.2.4)",
    dataConfidence: "verified",
  },

  // ── 스마트제조혁신추진단(TIPA) · 스마트공장 지원포털 ────────
  {
    id: "smartfactory_gov",
    agencyGroup: "스마트제조혁신추진단(TIPA) · 스마트공장 지원포털",
    category: "스마트공장 구축",
    name: "스마트공장 구축지원사업(정부형)",
    targetSummary: "중소·중견 제조기업 (스마트공장 수준확인서 보유 또는 신청 예정)",
    supportSummary:
      "구축비 최대 2억원 지원(동일수준 고도화는 2회에 걸쳐 최대 2.5억원) — 기업 규모·단계(기초/고도화1/고도화2)별 정부 지원비율은 공고 원문 확인 필요",
    periodSummary: "지원기간 최대 9개월",
    applyUrl: "https://www.smart-factory.kr",
    sourceRef: "중소벤처기업부 2026년 스마트 제조혁신 지원사업 통합공고(2025.10.31, 공고 제2025-574호)",
    dataConfidence: "check_notice",
  },
  {
    id: "smartfactory_samsung",
    agencyGroup: "스마트제조혁신추진단(TIPA) · 스마트공장 지원포털",
    category: "스마트공장 구축(대·중소상생)",
    name: "대·중소상생형 스마트공장 구축지원 (삼성전자 협력)",
    targetSummary: "중소·중견 제조기업 (동일 사업 중복 지원 제한)",
    supportSummary:
      "정부:삼성전자:기업 = 3:3:4 매칭으로 총사업비 60% 지원, 동일수준 고도화 최대 6천만원(단계 상향 시 최대 1.5억원) — 일부 지자체 추가 매칭 있음",
    periodSummary: "지원기간 최대 9개월(연장 가능)",
    applyUrl: "https://www.smart-factory.kr",
    sourceRef: "bizinfo.go.kr 게재 2026년 대·중소상생형 스마트공장 구축지원사업 공고",
    dataConfidence: "check_notice",
  },

  // ── 한국산업기술기획평가원(KEIT) · 산업기술R&D포털 ─────────
  {
    id: "keit_ai_commercialization",
    agencyGroup: "한국산업기술기획평가원(KEIT) · 산업기술R&D포털",
    category: "산업기술 R&D",
    name: "AI 응용제품 신속 상용화 지원사업",
    targetSummary: "국내 중소·중견기업 (수요기업+공급기업 컨소시엄 구성 필요)",
    supportSummary:
      "AI모델 활용 H/W·S/W 도입, 실증·양산검증, 인증·판로 지원 등 실비 지원 — 과제별 지원금액은 공모 결과에 따라 상이",
    periodSummary: "과제 수행기간 별도 (2026년 2차 공고 접수 8.11~9.3)",
    applyUrl: "https://srome.keit.re.kr",
    sourceRef: "KEIT 2026년도 산업기술혁신사업 통합시행계획",
    dataConfidence: "check_notice",
  },
  {
    id: "keit_materials_parts",
    agencyGroup: "한국산업기술기획평가원(KEIT) · 산업기술R&D포털",
    category: "소재부품장비 R&D",
    name: "소재부품장비 양산성능평가 지원사업",
    targetSummary: "중소·중견·대기업, 연구기관·대학 (수요기업 참여 필수)",
    supportSummary:
      "과제당 총 3.5억원 이내(1차년도 1.5억원, 2차년도 2억원) — 중견기업 정부지원비율 50% 이내, 기관부담금 13% 이상",
    periodSummary: "2년 과제",
    applyUrl: "https://srome.keit.re.kr",
    sourceRef: "KEIT 2026년도 산업기술혁신사업 통합시행계획",
    dataConfidence: "check_notice",
  },
];

export function getExternalProgram(id: string): ExternalProgram {
  const found = EXTERNAL_PROGRAMS.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown external program id: ${id}`);
  return found;
}

// ── 참고용 통합 포털 (특정 사업이 아니라 여러 사업을 모아 보여주는 창구) ──
export interface ReferencePortal {
  id: string;
  name: string;
  operator: string;
  role: string;
  howToUse: string;
  url: string;
}

export const REFERENCE_PORTALS: ReferencePortal[] = [
  {
    id: "bizinfo",
    name: "기업마당",
    operator: "중소벤처기업부 · 중소기업기술정보진흥원(TIPA)",
    role:
      "중앙부처·지자체의 중소기업 지원사업 공고를 한곳에 모아 보여주는 통합 검색 포털 (실제 신청은 각 사업 원문 페이지로 연결됨)",
    howToUse: "정책정보 > 지원사업공고 메뉴에서 지역·분야(금융/기술/인력/수출/내수/창업/경영)로 필터링 후 마감일순 정렬로 확인",
    url: "https://www.bizinfo.go.kr",
  },
  {
    id: "subsidy24",
    name: "보조금24",
    operator: "행정안전부 (정부24 내 서비스)",
    role:
      "로그인한 개인·사업자의 행정정보를 바탕으로 받을 수 있는 보조금을 자동 매칭해 '바로 신청 가능/확인 필요/이미 수령 중'으로 분류해주는 개인화 추천 서비스",
    howToUse:
      "정부24 로그인(사업자는 공동인증서 필요, 간편인증 불가) 후 [보조금24] 메뉴에서 일회성 정보연계 동의 → 매칭 결과 확인. 개인·복지성 혜택 매칭이 강하고, 기업 전용 매칭은 기업마당·K-Startup 대비 제한적",
    url: "https://www.gov.kr/portal/rcvfvrSvc/main",
  },
  {
    id: "ccei",
    name: "창조경제혁신센터 통합포털",
    operator: "창업진흥원(KISED) 산하 전국 19개 지역센터 네트워크",
    role: "자체 지원사업이 아니라, 지역별 창업 인프라(입주공간·멘토링·투자연계)와 지역 특화 프로그램을 안내하는 지역 허브 포털",
    howToUse: "사이트에서 소재 지역 센터를 선택해 입주공간 신청, 지역 챌린지 프로그램, 투자연계 등을 확인",
    url: "https://ccei.creativekorea.or.kr",
  },
];
