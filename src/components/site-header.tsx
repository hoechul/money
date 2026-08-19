export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-600">
          2026년도 중소기업 정책자금 융자계획 기준
        </p>
        <h1 className="text-2xl font-black leading-snug text-navy-900 sm:text-3xl">중소기업 정책자금 자가진단</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
          업력·매출·신용상태 등 우리 회사 조건을 입력하면, 중소벤처기업진흥공단(KOSME)이 공고한 6대 정책자금 18개
          세부사업의 신청 요건과 대조해 신청 가능성을 보여드립니다. 모든 판단 기준은 공식 공고문·참고자료에 근거합니다.
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
          <a
            href="https://www.kosmes.or.kr/nsh/SH/SBI/SHSBI001M0.do"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-600 underline underline-offset-2 hover:text-brand-500"
          >
            중진공 정책자금 온라인 신청 바로가기 ↗
          </a>
          <span>정책자금 전담 콜센터 1811-3655</span>
          <span>중소기업 통합콜센터 국번없이 1357</span>
        </div>
      </div>
    </header>
  );
}
