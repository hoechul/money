"use client";

import { useMemo, useState } from "react";
import { DEFAULT_PROFILE } from "@/lib/types";
import { evaluate } from "@/lib/eligibility";
import { matchExternalPrograms } from "@/lib/external-eligibility";
import { CompanyForm } from "@/components/company-form";
import { ResultsPanel } from "@/components/results-panel";
import { ExternalProgramsPanel } from "@/components/external-programs-panel";

export function PolicyFundChecker() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const result = useMemo(() => evaluate(profile), [profile]);
  const externalPrograms = useMemo(
    () => matchExternalPrograms(profile, result.businessAge, result.isProspective, result.isSmallBusinessOwner),
    [profile, result.businessAge, result.isProspective, result.isSmallBusinessOwner],
  );

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start lg:gap-8 lg:px-8">
      <CompanyForm profile={profile} onChange={setProfile} />
      <aside className="flex flex-col gap-6 lg:sticky lg:top-6">
        <ResultsPanel result={result} />
        <ExternalProgramsPanel programs={externalPrograms} />
      </aside>
    </div>
  );
}
