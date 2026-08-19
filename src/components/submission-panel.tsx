"use client";

import { useState, useTransition } from "react";
import type { CompanyProfile } from "@/lib/types";
import { submitEligibilityCheck } from "@/lib/submit-action";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-navy-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

export function SubmissionPanel({ profile }: { profile: CompanyProfile }) {
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (!consent) {
      setStatus("error");
      setErrorMsg("개인정보 수집·이용에 동의해주세요.");
      return;
    }
    setStatus("idle");
    startTransition(async () => {
      const res = await submitEligibilityCheck(profile, {
        companyName,
        contactName,
        contactPhone,
        contactEmail,
        consentAgreed: consent,
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(res.error ?? "저장에 실패했습니다.");
      }
    });
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-medium text-emerald-800">
        결과가 저장되었습니다. 담당자가 확인 후 남겨주신 연락처로 회신할 수 있습니다.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/[0.02]">
      <h3 className="text-sm font-bold text-navy-900">이 결과 저장하고 상담 요청하기</h3>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">
        지금까지 입력한 회사 조건과 진단 결과를 저장합니다. 연락처는 선택 입력이며, 남기지 않아도 저장은 가능합니다.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input
          placeholder="회사명 (선택)"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className={inputClass}
        />
        <input
          placeholder="담당자명 (선택)"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          className={inputClass}
        />
        <input
          placeholder="연락처 (선택)"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          className={inputClass}
        />
        <input
          placeholder="이메일 (선택)"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          className={inputClass}
        />
      </div>

      <label className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-slate-500">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-brand-600"
        />
        <span>
          <strong className="text-navy-800">[필수] 개인정보 수집·이용 동의</strong> — 위 입력값과 회사 조건 자가진단
          결과를 상담 응대 목적으로 수집·저장하며, 문의 처리 완료 후 1년간 보관 후 파기합니다. 동의를 거부할 권리가
          있으며, 동의하지 않으면 저장 없이 이 화면에서 결과만 확인할 수 있습니다.
        </span>
      </label>

      {status === "error" && <p className="mt-2 text-xs font-semibold text-red-600">{errorMsg}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending}
        className="mt-4 w-full rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-navy-800 disabled:opacity-60"
      >
        {isPending ? "저장 중..." : "결과 저장하기"}
      </button>
    </div>
  );
}
