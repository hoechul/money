// 근거: 「2026년도 중소기업 정책자금 융자계획(변경공고)」 별표5(업종별 융자제한 부채비율, p.46~47)
// 및 Ⅲ. 유의사항 ⑨항(소상공인 기준, p.11)
//
// 별표5는 KSIC 41개 세분류이지만, 자가진단 입력 편의를 위해 대표 업종군으로
// 단순화했다. 제한부채비율은 원문의 가중평균 부채비율 값을 그대로 사용했다.

export interface IndustryOption {
  value: string;
  label: string;
  debtRatioLimit: number; // 업종별 융자제한 부채비율 (%) — 별표5
  smallBusinessThreshold: 5 | 10; // 소상공인 판정 상시근로자수 기준 (미만)
}

export const INDUSTRY_OPTIONS: IndustryOption[] = [
  { value: "agriculture", label: "농업·임업·어업", debtRatioLimit: 500, smallBusinessThreshold: 5 },
  { value: "mining", label: "광업", debtRatioLimit: 500, smallBusinessThreshold: 10 },
  { value: "manufacturing", label: "제조업", debtRatioLimit: 340.2, smallBusinessThreshold: 10 },
  { value: "construction", label: "건설업", debtRatioLimit: 329.1, smallBusinessThreshold: 10 },
  { value: "wholesale_retail", label: "도매 및 소매업", debtRatioLimit: 393.0, smallBusinessThreshold: 5 },
  { value: "transport", label: "운수 및 창고업", debtRatioLimit: 500, smallBusinessThreshold: 10 },
  { value: "accommodation_food", label: "숙박 및 음식점업", debtRatioLimit: 500, smallBusinessThreshold: 5 },
  { value: "ict", label: "정보통신업", debtRatioLimit: 425.7, smallBusinessThreshold: 5 },
  { value: "realestate", label: "부동산업", debtRatioLimit: 500, smallBusinessThreshold: 5 },
  {
    value: "professional_scitech",
    label: "전문·과학 및 기술 서비스업 (연구개발, 엔지니어링, 디자인 등)",
    debtRatioLimit: 427.8,
    smallBusinessThreshold: 5,
  },
  { value: "business_support", label: "사업시설관리·사업지원 및 임대서비스업", debtRatioLimit: 500, smallBusinessThreshold: 5 },
  { value: "education", label: "교육 서비스업", debtRatioLimit: 456.9, smallBusinessThreshold: 5 },
  { value: "arts_sports_leisure", label: "예술·스포츠 및 여가관련 서비스업", debtRatioLimit: 500, smallBusinessThreshold: 5 },
  { value: "other", label: "기타 서비스업", debtRatioLimit: 500, smallBusinessThreshold: 5 },
];

export function getIndustry(value: string): IndustryOption {
  return INDUSTRY_OPTIONS.find((i) => i.value === value) ?? INDUSTRY_OPTIONS[2];
}

// Ⅲ. 유의사항 ⑤항 · 별표1 융자제외 대상 업종 (p.10, p.40~41) — 대표 예시 요약
export const EXCLUDED_INDUSTRY_EXAMPLES = [
  "사행산업(도박·경마·경륜 등), 유흥주점업, 무도장 운영업 등 사행성·향락 업종",
  "금융 및 보험업 (단, 핀테크 성격의 일부 서비스업은 지원 가능)",
  "부동산업",
  "법무·회계·세무 등 전문서비스업, 수의업",
  "철도·항만·공항 등 공공부문 직·간접 운영업",
  "일반 교과 입시 교육 등 초·중·고 교육기관",
];
