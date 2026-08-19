"use client";

import { useState } from "react";
import type { CompanyProfile } from "@/lib/types";
import { INDUSTRY_OPTIONS, EXCLUDED_INDUSTRY_EXAMPLES } from "@/lib/reference-data";
import {
  Accordion,
  Field,
  NullableNumberInput,
  NumberInput,
  Section,
  SelectInput,
  TextInput,
  ToggleRow,
} from "@/components/form-controls";
import { SubmissionPanel } from "@/components/submission-panel";

export function CompanyForm({
  profile,
  onChange,
}: {
  profile: CompanyProfile;
  onChange: (next: CompanyProfile) => void;
}) {
  const [openHistory, setOpenHistory] = useState(false);
  const [openSpecial, setOpenSpecial] = useState(false);

  function set<K extends keyof CompanyProfile>(key: K, value: CompanyProfile[K]) {
    onChange({ ...profile, [key]: value });
  }

  return (
    <div className="flex flex-col gap-5">
      <Section step={1} title="기본 정보" description="사업 형태와 업종을 알려주세요.">
        <Field label="사업 형태">
          <SelectInput
            value={profile.companyType}
            onChange={(v) => set("companyType", v)}
            options={[
              { value: "corporation", label: "법인사업자" },
              { value: "individual", label: "개인사업자" },
              { value: "prospective", label: "예비창업자 (설립 전)" },
            ]}
          />
        </Field>
        <Field label="설립일 / 사업개시일" hint="예비창업자는 비워두세요.">
          <TextInput
            type="date"
            value={profile.foundedDate}
            onChange={(e) => set("foundedDate", e.target.value)}
            disabled={profile.companyType === "prospective"}
          />
        </Field>
        <Field label="업종">
          <SelectInput
            value={profile.industry}
            onChange={(v) => set("industry", v)}
            options={INDUSTRY_OPTIONS.map((i) => ({ value: i.value, label: i.label }))}
          />
        </Field>
        <Field label="상시근로자수" hint="특수고용직·일용직 등은 제외한 상시근로자 수 기준입니다.">
          <NumberInput value={profile.employees} min={0} onChange={(v) => set("employees", v)} suffix="명" />
        </Field>
        <Field label="대표자 만 나이" hint="청년전용창업자금(만 39세 이하) 판정에 사용됩니다.">
          <NullableNumberInput value={profile.ceoAge} onChange={(v) => set("ceoAge", v)} suffix="세" />
        </Field>
        <Field label="직전년도 매출액">
          <NumberInput
            value={profile.lastYearRevenueMillion}
            min={0}
            onChange={(v) => set("lastYearRevenueMillion", v)}
            suffix="백만원"
          />
        </Field>
        <ToggleRow
          label="사행성·유흥향락업, 금융·보험업, 부동산업, 법무·회계·세무 등 전문서비스업을 영위합니다"
          hint={`융자제외 대상 업종(별표1) 예시: ${EXCLUDED_INDUSTRY_EXAMPLES.join(" · ")}`}
          checked={profile.isExcludedIndustry}
          onChange={(v) => set("isExcludedIndustry", v)}
        />
      </Section>

      <Section step={2} title="재무 · 신용 상태" description="정확할수록 결과 신뢰도가 높아집니다. 모르면 비워두세요.">
        <Field label="자본총계" hint="법인 재무제표 기준. 우량기업(200억 초과) 판정에 사용됩니다.">
          <NullableNumberInput value={profile.capitalEqBillion} onChange={(v) => set("capitalEqBillion", v)} suffix="억원" />
        </Field>
        <Field label="자산총계" hint="700억 초과 시 우량기업으로 분류될 수 있습니다.">
          <NullableNumberInput value={profile.totalAssetsBillion} onChange={(v) => set("totalAssetsBillion", v)} suffix="억원" />
        </Field>
        <Field label="부채비율" hint="부채총계÷자본총계×100. 업종별 제한 기준과 비교합니다.">
          <NullableNumberInput value={profile.debtRatioPct} onChange={(v) => set("debtRatioPct", v)} suffix="%" />
        </Field>
        <Field label="상장 여부">
          <SelectInput
            value={profile.listedStatus}
            onChange={(v) => set("listedStatus", v)}
            options={[
              { value: "none", label: "비상장" },
              { value: "kosdaq_tech", label: "코스닥 기술특례상장" },
              { value: "kosdaq", label: "코스닥 일반상장" },
              { value: "kospi", label: "유가증권시장(코스피) 상장" },
            ]}
          />
        </Field>
        {profile.listedStatus === "kosdaq_tech" && (
          <Field label="기술특례상장 후 경과년수" hint="상장 후 3년까지는 우량기업 판정에서 예외입니다.">
            <NullableNumberInput
              value={profile.kosdaqTechListedYearsAgo}
              onChange={(v) => set("kosdaqTechListedYearsAgo", v)}
              suffix="년"
            />
          </Field>
        )}
        <Field label="신용평가사 등급 BBB 이상 여부">
          <SelectInput
            value={profile.creditRatingBBBPlus}
            onChange={(v) => set("creditRatingBBBPlus", v)}
            options={[
              { value: "unknown", label: "모름 / 평가받은 적 없음" },
              { value: "yes", label: "BBB 이상" },
              { value: "no", label: "BBB 미만" },
            ]}
          />
        </Field>
        <Field label="중진공 신용위험등급" hint="이전 정책자금 이용 시 안내받은 등급이 있다면 선택하세요.">
          <SelectInput
            value={profile.kosmesRiskGrade}
            onChange={(v) => set("kosmesRiskGrade", v)}
            options={[
              { value: "unknown", label: "모름" },
              { value: "top", label: "최상위 등급 (CR1)" },
              { value: "middle", label: "중간 등급" },
              { value: "lowest", label: "최하위 등급" },
            ]}
          />
        </Field>
        <ToggleRow
          label="세금을 체납 중입니다"
          checked={profile.taxDelinquent}
          onChange={(v) => set("taxDelinquent", v)}
        />
        <ToggleRow
          label="휴업 또는 폐업 중입니다"
          checked={profile.isClosedOrSuspended}
          onChange={(v) => set("isClosedOrSuspended", v)}
        />
        <ToggleRow
          label="연체·대위변제·부도·회생·파산 등 신용정보가 등록되어 있습니다"
          hint="한국신용정보원 일반신용정보관리규약 기준"
          checked={profile.creditRegistryIssue}
          onChange={(v) => set("creditRegistryIssue", v)}
        />
        <ToggleRow
          label="부실징후기업 지정, 워크아웃 또는 회생절차가 진행 중입니다"
          checked={profile.distressedSignFirm}
          onChange={(v) => set("distressedSignFirm", v)}
        />
        <ToggleRow
          label="2년 연속 적자이며 자기자본이 전액 잠식되었습니다"
          checked={profile.capitalImpairment2y}
          onChange={(v) => set("capitalImpairment2y", v)}
        />
        <ToggleRow
          label="3년 연속 이자보상배율이 1.0 미만입니다"
          hint="영업손실이 발생했다면 금융비용이 없어도 1.0 미만으로 간주됩니다."
          checked={profile.interestCoverageBelow1For3y}
          onChange={(v) => set("interestCoverageBelow1For3y", v)}
        />
        <ToggleRow
          label="간편장부대상 개인사업자 / 중소기업협동조합입니다"
          hint="부채비율 제한 적용 예외 사유입니다."
          checked={profile.isSimplifiedBookkeeper || profile.isCooperativeUnion}
          onChange={(v) => {
            set("isSimplifiedBookkeeper", v);
            set("isCooperativeUnion", v);
          }}
        />
      </Section>

      <SubmissionPanel profile={profile} />

      <Accordion
        title="정책자금 이력 · 성과 지표"
        subtitle="선택 입력 — 우대금리·한도 예외 판정에 사용됩니다"
        open={openHistory}
        onToggle={() => setOpenHistory((v) => !v)}
      >
        <Field label="최근 5년 정책자금 지원 횟수">
          <NumberInput value={profile.fundedCount5y} min={0} onChange={(v) => set("fundedCount5y", v)} suffix="회" />
        </Field>
        <Field label="중진공 운전자금 누적 지원금액" hint="2018.1.2일 이후 신청분 기준">
          <NumberInput
            value={profile.cumulativeWorkingCapitalBillion}
            min={0}
            onChange={(v) => set("cumulativeWorkingCapitalBillion", v)}
            suffix="억원"
          />
        </Field>
        <Field label="정부·지자체 정책자금(융자+보증) 최근 5년 합계">
          <NumberInput
            value={profile.govSupport5yBillion}
            min={0}
            onChange={(v) => set("govSupport5yBillion", v)}
            suffix="억원"
          />
        </Field>
        <Field label="최근 1년 직·간접 수출실적">
          <NumberInput value={profile.exportUSD1y} min={0} onChange={(v) => set("exportUSD1y", v)} suffix="USD" />
        </Field>
        <ToggleRow
          label="최근 1년간 상시근로자 10인 이상 고용을 창출했습니다"
          checked={profile.employmentGrowth10In1y}
          onChange={(v) => set("employmentGrowth10In1y", v)}
        />
        <ToggleRow
          label="수출실적이 전년 대비 20% 이상 증가했습니다"
          checked={profile.exportGrowth20pctYoY}
          onChange={(v) => set("exportGrowth20pctYoY", v)}
        />
        <ToggleRow
          label="직전연도 매출 30억원 이상 & 최근 3년 연평균 매출 20% 이상 증가했습니다"
          checked={profile.revenueGrowth20pct3y}
          onChange={(v) => set("revenueGrowth20pct3y", v)}
        />
        <ToggleRow
          label="유형자산 증가율이 동업종 평균의 2배를 초과하거나, 매출 대비 R&D 투자비율이 1.5% 이상입니다"
          checked={profile.hasHighFacilityOrRnd}
          onChange={(v) => set("hasHighFacilityOrRnd", v)}
        />
        <ToggleRow
          label="최근 평가 탈락 또는 융자 결정 후 전액 포기한 지 6개월이 지나지 않았습니다"
          checked={profile.recentEvalFailOrWithdraw6mo}
          onChange={(v) => set("recentEvalFailOrWithdraw6mo", v)}
        />
        <ToggleRow
          label="최근 3년 내 정책자금 부당개입·목적외 사용 이력이 있습니다"
          checked={profile.recentMisconductOrDiversion}
          onChange={(v) => set("recentMisconductOrDiversion", v)}
        />
        <ToggleRow
          label="중대재해처벌법 위반·상습체불·임직원 횡령 등으로 사회적 물의를 일으켰습니다"
          checked={profile.seriousSocialIssue}
          onChange={(v) => set("seriousSocialIssue", v)}
        />
        <ToggleRow
          label="중기부 R&D 참여 후 최근 3년 내 제재처분(제재부가금·환수금 미완납)을 받았습니다"
          checked={profile.hasGovRnDRecentSanction}
          onChange={(v) => set("hasGovRnDRecentSanction", v)}
        />
      </Accordion>

      <Accordion
        title="중점지원분야 · 특수 상황"
        subtitle="해당 사항이 있으면 체크하세요 — 전용 자금 매칭에 사용됩니다"
        open={openSpecial}
        onToggle={() => setOpenSpecial((v) => !v)}
      >
        <ToggleRow
          label="혁신성장분야 · 초격차/신산업분야 · 지역주력산업 · 뿌리산업 · 소재부품장비산업 중 하나에 해당합니다"
          hint="참고자료 1~4의 세부 품목을 기준으로 확인하세요. (우대금리·한도 우대·소상공인 예외에 사용)"
          checked={profile.isPriorityField}
          onChange={(v) => set("isPriorityField", v)}
        />
        <ToggleRow
          label="그린분야 영위·탄소중립 기술사업화·친환경 설비 도입을 추진 중입니다"
          checked={profile.isGreenOrNetZero}
          onChange={(v) => set("isGreenOrNetZero", v)}
        />
        <ToggleRow
          label="스마트공장 지원사업 참여 또는 ICT 기반 자동화 시설 도입을 추진 중입니다"
          checked={profile.isSmartFactoryOrAutomation}
          onChange={(v) => set("isSmartFactoryOrAutomation", v)}
        />
        <ToggleRow
          label="특허·정부 R&D·정부인증·기업부설연구소 개발기술 등 기술사업화 요건을 보유하고 있습니다"
          checked={profile.hasTechCommercializationBasis}
          onChange={(v) => set("hasTechCommercializationBasis", v)}
        />
        <ToggleRow
          label="(예비)사회적기업·협동조합·마을기업·자활기업·소셜벤처입니다"
          checked={profile.isSocialEconomyEnterprise}
          onChange={(v) => set("isSocialEconomyEnterprise", v)}
        />
        <ToggleRow
          label="대표자가 여성입니다 (법인은 최대주주 겸 실경영자 기준)"
          hint="여성기업 확인서·여성기업 육성사업(WBIZ) 매칭에 사용됩니다."
          checked={profile.isWomanCeo}
          onChange={(v) => set("isWomanCeo", v)}
        />
        <ToggleRow
          label="자연재난·사회재난으로 「재해중소기업 확인증」을 발급받았습니다"
          checked={profile.isDisasterVictim}
          onChange={(v) => set("isDisasterVictim", v)}
        />
        <ToggleRow
          label="티몬·위메프·인터파크쇼핑·AK몰·알렛츠 판매대금 미정산 피해를 입었습니다"
          checked={profile.isPlatformSettlementVictim}
          onChange={(v) => set("isPlatformSettlementVictim", v)}
        />
        <ToggleRow
          label="사업전환계획(또는 공동사업전환계획) 승인을 받았습니다 (5년 미만)"
          checked={profile.hasBusinessConversionApproval}
          onChange={(v) => set("hasBusinessConversionApproval", v)}
        />
        <ToggleRow
          label="기업활력법상 사업재편계획 승인을 받았습니다 (5년 미만)"
          checked={profile.hasBusinessRestructuringApproval}
          onChange={(v) => set("hasBusinessRestructuringApproval", v)}
        />
        <ToggleRow
          label="통상변화대응지원기업으로 지정되었습니다 (3년 미만)"
          checked={profile.isTradeAdjustmentDesignated}
          onChange={(v) => set("isTradeAdjustmentDesignated", v)}
        />
        <ToggleRow
          label="폐업 후 재창업(또는 재창업 예정)이며 성실경영평가를 통과할 수 있습니다"
          checked={profile.isReCreatedBusiness}
          onChange={(v) => set("isReCreatedBusiness", v)}
        />
        <ToggleRow
          label="3개 이상 협동화실천계획 또는 2개 이상 협업사업계획 승인을 받았습니다"
          checked={profile.isJointCooperationApproved}
          onChange={(v) => set("isJointCooperationApproved", v)}
        />
        <ToggleRow
          label="중진공과 동반성장 협약을 맺은 발주기업의 추천을 받았습니다"
          checked={profile.hasOrderingCompanyReferral}
          onChange={(v) => set("hasOrderingCompanyReferral", v)}
        />
        <ToggleRow
          label="구매기업과 1년 이상 거래하며 매출채권을 보유하고 있습니다"
          checked={profile.hasTradeReceivables1y}
          onChange={(v) => set("hasTradeReceivables1y", v)}
        />
        <ToggleRow
          label="신용보증기금 또는 기술보증기금의 팩토링 제도를 이용 중입니다"
          checked={profile.usingOtherFactoring}
          onChange={(v) => set("usingOtherFactoring", v)}
        />
      </Accordion>
    </div>
  );
}
