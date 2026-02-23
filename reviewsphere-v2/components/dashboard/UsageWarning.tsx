"use client";

import React from "react";
import Button from "@/components/ui/Button";

export default function UsageWarning({ onUpgrade }: { onUpgrade?: () => void }) {
  return (
    <div className="rounded-md p-4 bg-amber-50 border border-amber-100 text-amber-800">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="font-semibold">You have reached your plan limit.</div>
          <div className="text-sm text-amber-700">Upgrade to continue generating replies.</div>
        </div>
        <div>
          <Button onClick={() => (onUpgrade ? onUpgrade() : window.location.assign('/upgrade'))}>Upgrade Plan</Button>
        </div>
      </div>
    </div>
  );
}
