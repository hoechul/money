import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PolicyFundChecker } from "@/components/policy-fund-checker";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">
        <PolicyFundChecker />
      </main>
      <SiteFooter />
    </div>
  );
}
