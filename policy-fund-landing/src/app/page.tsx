import { DiagnosisProvider } from "@/components/diagnosis/diagnosis-context";
import { ConsultModal } from "@/components/diagnosis/consult-modal";
import { ResultSection } from "@/components/diagnosis/result-section";
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { WhyNow } from "@/components/sections/why-now";
import { InsuranceStrategy } from "@/components/sections/insurance-strategy";
import { ProcessSteps } from "@/components/sections/process-steps";
import { FAQ } from "@/components/sections/faq";
import { FinalCTA } from "@/components/sections/final-cta";
import { Footer } from "@/components/sections/footer";
import { StickyCTA } from "@/components/layout/sticky-cta";

export default function Home() {
  return (
    <DiagnosisProvider>
      <Header />
      <main className="flex-1">
        {/* 1. 히어로 + 입력 폼 */}
        <Hero />
        {/* 2. 왜 지금 정책자금 진단이 필요한지 */}
        <WhyNow />
        {/* 3. 법인보험 기반 자금전략의 장점 */}
        <InsuranceStrategy />
        {/* 4. 맞춤 진단 결과 미리보기 (예시 → 제출 후 실제 결과로 전환) */}
        <ResultSection />
        {/* 5. 진행 절차 */}
        <ProcessSteps />
        {/* 6. FAQ */}
        <FAQ />
        {/* 7. 반복 CTA */}
        <FinalCTA />
      </main>
      <Footer />
      <StickyCTA />
      <ConsultModal />
    </DiagnosisProvider>
  );
}
