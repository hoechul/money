"use client";

import { useState } from "react";
import type { EligibilityResult, ProgramMatch, RestrictionFinding, Severity } from "@/lib/types";

const SEVERITY_STYLE: Record<Severity, string> = {
  block: "border-red-200 bg-red-50 text-red-700",
  warn: "border-amber-200 bg-amber-50 text-amber-800",
  info: "border-sky-200 bg-sky-50 text-sky-700",
};

const SEVERITY_LABEL: Record<Severity, string> = {
  block: "제한",
  warn: "확인 필요",
  info: "참고",
};

const MATCH_STYLE: Record<ProgramMatch["match"], { badge: string; label: string; card: string }> = {
  eligible: { badge: "bg-emerald-100 text-emerald-700", label: "신청 가능성 높음", card: "border-emerald-200" },
  conditional: { badge: "bg-amber-100 text-amber-700", label: "조건부 · 확인 필요", card: "border-amber-200" },
  ineligible: { badge: "bg-slate-100 text-slate-500", label: "해당 없음", card: "border-slate-200" },
};

function RestrictionItem({ item }: { item: RestrictionFinding }) {
  return (
    <li className={`rounded-lg border px-3 py-2.5 text-sm ${SEVERITY_STYLE[item.severity]}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold">{item.title}</span>
        <span className="shrink-0 rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-bold">
          {SEVERITY_LABEL[item.severity]}
        </span>
      </div>
      <p className="mt-1 leading-relaxed opacity-90">{item.detail}</p>
      <p className="mt-1 text-[11px] opacity-60">근거: {item.sourceRef}</p>
    </li>
  );
}

function ProgramCard({ program }: { program: ProgramMatch }) {
  const style = MATCH_STYLE[program.match];
  return (
    <div className={`rounded-xl border bg-white p-4 shadow-sm shadow-slate-900/[0.02] ${style.card}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-brand-600">{program.category}</p>
          <h3 className="text-base font-bold text-navy-900">{program.name}</h3>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${style.badge}`}>{style.label}</span>
      </div>

      <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1.5 text-sm text-slate-600 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-slate-400">대출한도</dt>
          <dd className="font-medium text-navy-800">{program.loanLimit}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400">대출기간</dt>
          <dd className="font-medium text-navy-800">{program.loanPeriod}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400">금리</dt>
          <dd className="font-medium text-navy-800">{program.interestRate}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400">방식</dt>
          <dd className="font-medium text-navy-800">{program.method}</dd>
        </div>
      </dl>

      {program.reasons.length > 0 && (
        <ul className="mt-3 space-y-1 border-t border-slate-100 pt-3 text-sm text-slate-600">
          {program.reasons.map((r, i) => (
            <li key={i} className="flex gap-1.5">
              <span className="text-slate-300">·</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      )}
      {program.cautions.length > 0 && (
        <ul className="mt-2 space-y-1 text-sm text-amber-700">
          {program.cautions.map((c, i) => (
            <li key={i} className="flex gap-1.5">
              <span className="text-amber-300">⚠</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-[11px] text-slate-400">근거: {program.sourceRef}</p>
    </div>
  );
}

export function ResultsPanel({ result }: { result: EligibilityResult }) {
  const [showIneligible, setShowIneligible] = useState(false);
  const eligible = result.programs.filter((p) => p.match === "eligible");
  const conditional = result.programs.filter((p) => p.match === "conditional");
  const ineligible = result.programs.filter((p) => p.match === "ineligible");

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-navy-800 bg-navy-900 p-5 text-white shadow-lg shadow-navy-900/20">
        <p className="text-xs font-semibold text-brand-400">진단 요약</p>
        <div className="mt-2 grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-2xl font-black">{eligible.length}</p>
            <p className="mt-0.5 text-[11px] text-slate-300">신청 가능성 높음</p>
          </div>
          <div>
            <p className="text-2xl font-black text-amber-300">{conditional.length}</p>
            <p className="mt-0.5 text-[11px] text-slate-300">조건부 확인 필요</p>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-400">{ineligible.length}</p>
            <p className="mt-0.5 text-[11px] text-slate-300">해당 없음</p>
          </div>
        </div>
        <dl className="mt-4 space-y-1 border-t border-white/10 pt-3 text-xs text-slate-300">
          <div className="flex justify-between">
            <dt>업력</dt>
            <dd className="font-semibold text-white">
              {result.isProspective
                ? "예비창업자"
                : result.businessAgeUnknown
                  ? "설립일 미입력"
                  : `${result.businessAge?.toFixed(1)}년`}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>소상공인 해당</dt>
            <dd className="font-semibold text-white">
              {result.isSmallBusinessOwner
                ? result.smallBusinessException
                  ? "해당 (예외 적용 가능)"
                  : "해당 (중진공 자금 원칙적 제외)"
                : "미해당"}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>업종별 제한 부채비율</dt>
            <dd className="font-semibold text-white">
              {result.debtRatioLimit}% {result.debtRatioExceeded ? "· 초과" : ""}
            </dd>
          </div>
        </dl>
      </div>

      {result.restrictions.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/[0.02]">
          <h3 className="text-sm font-bold text-navy-900">유의사항 (융자제한기업 해당 여부)</h3>
          <ul className="mt-3 flex flex-col gap-2">
            {result.restrictions.map((r) => (
              <RestrictionItem key={r.id} item={r} />
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {eligible.length === 0 && conditional.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
            입력하신 조건으로는 신청 가능성이 높은 자금이 확인되지 않았습니다. 특수 상황(재해·사업전환·재창업 등) 섹션을
            확인하거나, 정책자금 전담 콜센터(1811-3655)로 문의해보세요.
          </p>
        )}
        {eligible.map((p) => (
          <ProgramCard key={p.id} program={p} />
        ))}
        {conditional.map((p) => (
          <ProgramCard key={p.id} program={p} />
        ))}
      </div>

      {ineligible.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowIneligible((v) => !v)}
            className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-100"
          >
            해당 없음으로 분류된 자금 {ineligible.length}건 {showIneligible ? "숨기기" : "보기"}
          </button>
          {showIneligible && (
            <div className="mt-3 flex flex-col gap-3">
              {ineligible.map((p) => (
                <ProgramCard key={p.id} program={p} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
