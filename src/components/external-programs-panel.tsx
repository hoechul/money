"use client";

import { useState } from "react";
import type { ExternalProgramMatch, Relevance } from "@/lib/external-eligibility";
import { REFERENCE_PORTALS } from "@/lib/external-programs-data";

const RELEVANCE_STYLE: Record<Relevance, { badge: string; label: string; card: string }> = {
  watch: { badge: "bg-emerald-100 text-emerald-700", label: "확인 추천", card: "border-emerald-200" },
  info: { badge: "bg-slate-100 text-slate-500", label: "일반 참고", card: "border-slate-200" },
};

function ExternalProgramCard({ program }: { program: ExternalProgramMatch }) {
  const style = RELEVANCE_STYLE[program.relevance];
  return (
    <div className={`rounded-xl border bg-white p-4 shadow-sm shadow-slate-900/[0.02] ${style.card}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-brand-600">{program.agencyGroup}</p>
          <h3 className="text-base font-bold text-navy-900">{program.name}</h3>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${style.badge}`}>{style.label}</span>
      </div>

      <p className="mt-2 text-sm text-slate-600">
        <span className="text-xs text-slate-400">대상 </span>
        {program.targetSummary}
      </p>
      <p className="mt-1.5 text-sm text-slate-600">
        <span className="text-xs text-slate-400">지원내용 </span>
        {program.supportSummary}
      </p>
      <p className="mt-1.5 text-sm text-slate-600">
        <span className="text-xs text-slate-400">기간 </span>
        {program.periodSummary}
      </p>

      {program.relevanceReasons.length > 0 && (
        <ul className="mt-3 space-y-1 border-t border-slate-100 pt-3 text-sm text-slate-600">
          {program.relevanceReasons.map((r, i) => (
            <li key={i} className="flex gap-1.5">
              <span className="text-slate-300">·</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      )}

      {program.dataConfidence === "check_notice" && (
        <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs text-amber-800">
          ⚠ 정확한 한도·비율은 회차·트랙별로 달라 공고 원문에서 최종 확인이 필요합니다.
        </p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <p className="text-[11px] text-slate-400">출처: {program.sourceRef}</p>
        <a
          href={program.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-lg bg-navy-900 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-navy-800"
        >
          바로가기 →
        </a>
      </div>
    </div>
  );
}

export function ExternalProgramsPanel({ programs }: { programs: ExternalProgramMatch[] }) {
  const [showInfo, setShowInfo] = useState(false);
  const watch = programs.filter((p) => p.relevance === "watch");
  const info = programs.filter((p) => p.relevance === "info");

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/[0.02]">
        <h3 className="text-sm font-bold text-navy-900">중진공(KOSME) 외 다른 기관 지원사업</h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          K-Startup, 소상공인마당, 여성기업종합정보포털(WBIZ), 스마트공장 지원포털, KEIT 산업기술R&D 등 9개 기관을 조사한
          참고 정보입니다. 아래 &ldquo;확인 추천&rdquo; 표시는 정식 자격심사가 아니라, 입력하신 조건을 바탕으로 살펴볼 가치가
          있는 사업을 걸러준 것입니다. 최종 자격·한도는 반드시 원문 공고에서 확인하세요.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {watch.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
            입력하신 조건으로는 &ldquo;확인 추천&rdquo;으로 분류된 사업이 없습니다. 아래 전체 목록에서 직접 확인해보세요.
          </p>
        )}
        {watch.map((p) => (
          <ExternalProgramCard key={p.id} program={p} />
        ))}
      </div>

      {info.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowInfo((v) => !v)}
            className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-100"
          >
            일반 참고로 분류된 사업 {info.length}건 {showInfo ? "숨기기" : "보기"}
          </button>
          {showInfo && (
            <div className="mt-3 flex flex-col gap-3">
              {info.map((p) => (
                <ExternalProgramCard key={p.id} program={p} />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/[0.02]">
        <h3 className="text-sm font-bold text-navy-900">통합 검색 포털 — 여기서도 직접 찾아보세요</h3>
        <div className="mt-3 flex flex-col gap-3">
          {REFERENCE_PORTALS.map((portal) => (
            <div key={portal.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-navy-900">{portal.name}</h4>
                <a
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-brand-700"
                >
                  바로가기 →
                </a>
              </div>
              <p className="mt-1 text-xs text-slate-400">{portal.operator}</p>
              <p className="mt-2 text-sm text-slate-600">{portal.role}</p>
              <p className="mt-1.5 text-sm text-slate-500">
                <span className="text-xs text-slate-400">이용 방법 </span>
                {portal.howToUse}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
