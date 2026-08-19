import { AdminLoginForm } from "@/components/admin-login-form";

export const metadata = {
  title: "관리자 로그인 | 중소기업 정책자금 자가진단",
};

export default function AdminLoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/[0.02]">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-600">관리자</p>
        <h1 className="mt-1 text-xl font-black text-navy-900">제출 내역 로그인</h1>
        <p className="mt-1.5 text-sm text-slate-500">고객이 저장한 자가진단 제출 내역을 확인하려면 로그인하세요.</p>
        <div className="mt-5">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
