'use client'

import { useAssetStore } from '@/store/asset-store'
import { STORE_ASSET_SPECS } from '@/data/asset-specs'

const PLATFORM_LABELS: Record<string, string> = {
  googlePlay: 'Google Play',
  appStore: 'App Store',
  general: 'General',
}

const platforms = [...new Set(STORE_ASSET_SPECS.map((s) => s.platform))]

export function SpecSelectorPanel() {
  const selectedSpecId = useAssetStore((s) => s.selectedSpecId)
  const selectSpec = useAssetStore((s) => s.selectSpec)

  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Asset Type
      </h3>
      {platforms.map((platform) => (
        <div key={platform} className="mb-3">
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            {PLATFORM_LABELS[platform] ?? platform}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {STORE_ASSET_SPECS.filter((s) => s.platform === platform).map((spec) => (
              <button
                key={spec.id}
                onClick={() => selectSpec(spec.id)}
                title={spec.description}
                aria-pressed={selectedSpecId === spec.id}
                className={`rounded-md border px-2.5 py-1.5 text-xs transition-colors ${
                  selectedSpecId === spec.id
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                {spec.name}
                <span className="ml-1 text-[10px] opacity-60">
                  {spec.width}x{spec.height}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
