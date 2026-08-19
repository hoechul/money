import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50/60 pb-20 pt-10 lg:pb-10">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="text-xs leading-relaxed text-slate-400">
          본 서비스에서 제공하는 진단 결과는 입력하신 정보와 공개된 정책자금 기준을 바탕으로 한 사전 참고용
          안내이며, 실제 정책자금의 한도·금리·승인 여부는 취급 금융기관 및 관련 기관의 심사 결과에 따라
          달라질 수 있습니다. 본 진단 및 상담 신청은 정책자금 승인이나 법인보험 가입을 보장하지 않습니다.
        </p>

        <div className="mt-6 flex flex-col gap-1.5 text-xs text-slate-400 sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-1.5">
          <span className="font-bold text-slate-500">{siteConfig.name}</span>
          <span>대표 {siteConfig.ceoName}</span>
          <span>사업자등록번호 {siteConfig.bizRegNo}</span>
          <span>{siteConfig.address}</span>
          <span>개인정보관리책임자 {siteConfig.privacyOfficer}</span>
        </div>

        <p className="mt-4 text-xs text-slate-300">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
