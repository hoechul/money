import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { ADMIN_SESSION_COOKIE, isValidSessionValue } from "@/lib/session-token";
import { getDb } from "@/db";
import { submissions } from "@/db/schema";
import { logout } from "./actions";

export const metadata = {
  title: "제출 내역 | 중소기업 정책자금 자가진단",
};

export const dynamic = "force-dynamic";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(d);
}

export default async function AdminPage() {
  // proxy.ts가 1차로 막지만, 문서 권장대로 데이터를 실제로 읽는 지점에서도 세션을 다시 검증한다.
  const store = await cookies();
  if (!isValidSessionValue(store.get(ADMIN_SESSION_COOKIE)?.value)) {
    redirect("/admin/login");
  }

  const rows = await getDb().select().from(submissions).orderBy(desc(submissions.createdAt)).limit(200);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-brand-600">관리자</p>
          <h1 className="mt-1 text-2xl font-black text-navy-900">자가진단 제출 내역</h1>
          <p className="mt-1 text-sm text-slate-500">최근 {rows.length}건 (최대 200건 표시)</p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            로그아웃
          </button>
        </form>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {rows.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
            아직 저장된 제출 내역이 없습니다.
          </p>
        )}

        {rows.map((row) => (
          <details key={row.id} className="group rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.02]">
            <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="text-xs text-slate-400">{formatDate(row.createdAt)}</p>
                <p className="text-base font-bold text-navy-900">{row.companyName || "회사명 미기재"}</p>
                <p className="text-sm text-slate-500">
                  {row.contactName || "담당자 미기재"}
                  {row.contactPhone ? ` · ${row.contactPhone}` : ""}
                  {row.contactEmail ? ` · ${row.contactEmail}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2 text-xs font-bold">
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-700">가능성 높음 {row.eligibleCount}</span>
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-amber-700">조건부 {row.conditionalCount}</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-500">해당없음 {row.ineligibleCount}</span>
              </div>
            </summary>

            <div className="border-t border-slate-100 px-5 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-slate-400">신청 가능성 높음</p>
                  <p className="mt-1 text-sm text-navy-800">
                    {row.eligiblePrograms.length > 0 ? row.eligiblePrograms.join(", ") : "없음"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400">조건부 확인 필요</p>
                  <p className="mt-1 text-sm text-navy-800">
                    {row.conditionalPrograms.length > 0 ? row.conditionalPrograms.join(", ") : "없음"}
                  </p>
                </div>
                {row.watchExternalPrograms.length > 0 && (
                  <div className="sm:col-span-2">
                    <p className="text-xs font-semibold text-slate-400">중진공 외 확인 추천 사업</p>
                    <p className="mt-1 text-sm text-navy-800">{row.watchExternalPrograms.join(", ")}</p>
                  </div>
                )}
              </div>

              <details className="mt-4">
                <summary className="cursor-pointer text-xs font-semibold text-brand-600">입력한 회사 조건 전체 보기</summary>
                <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-600">
                  {JSON.stringify(row.profile, null, 2)}
                </pre>
              </details>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
