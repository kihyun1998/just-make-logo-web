'use client'

import { useAssetStore } from '@/store/asset-store'
import { STORE_ASSET_SPECS } from '@/data/asset-specs'
import { ASSET_TEMPLATES } from '@/data/asset-templates'
import type { AssetCategory, AssetTemplate } from '@/types/asset'

function buildCssBackground(tmpl: AssetTemplate): string {
  if (tmpl.useGradient && tmpl.gradientStops.length >= 2) {
    const stops = tmpl.gradientStops.map((s) => `${s.color} ${s.position * 100}%`).join(', ')
    return `linear-gradient(135deg, ${stops})`
  }
  return tmpl.backgroundColor
}

export function TemplateSelectorPanel() {
  const selectedSpecId = useAssetStore((s) => s.selectedSpecId)
  const selectedTemplateId = useAssetStore((s) => s.selectedTemplateId)
  const applyTemplateDefaults = useAssetStore((s) => s.applyTemplateDefaults)

  const selectedSpec = STORE_ASSET_SPECS.find((s) => s.id === selectedSpecId)
  const category: AssetCategory = selectedSpec?.category ?? 'marketing'
  const compatibleTemplates = ASSET_TEMPLATES.filter((t) =>
    t.compatibleCategories.includes(category),
  )

  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Template
      </h3>
      <div className={`grid gap-2 ${category === 'marketing' ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {compatibleTemplates.map((tmpl) => {
          const isSelected = selectedTemplateId === tmpl.id
          const aspectRatio = category === 'marketing' ? '2/1' : '9/16'

          return (
            <button
              key={tmpl.id}
              onClick={() => applyTemplateDefaults(tmpl.id)}
              className={`group flex flex-col gap-1 rounded-lg border-2 p-1.5 transition-all ${
                isSelected
                  ? 'border-primary shadow-sm shadow-primary/20'
                  : 'border-border hover:border-muted-foreground/30'
              }`}
            >
              {/* Preview card */}
              <div
                className="relative w-full overflow-hidden rounded-md"
                style={{ aspectRatio, background: buildCssBackground(tmpl) }}
              >
                {/* Text block position indicators */}
                {tmpl.textBlocks.map((block) => (
                  <div
                    key={block.id}
                    className="absolute rounded-sm bg-white/20"
                    style={{
                      left: `${block.x * 100}%`,
                      top: `${block.y * 100}%`,
                      width: `${block.width * 100}%`,
                      height: `${block.height * 100}%`,
                    }}
                  >
                    <div className="h-full w-full flex items-center justify-center">
                      <div
                        className="rounded-full bg-white/40"
                        style={{
                          width: block.role === 'title' ? '60%' : '40%',
                          height: block.role === 'title' ? '30%' : '20%',
                          minHeight: 2,
                          minWidth: 4,
                        }}
                      />
                    </div>
                  </div>
                ))}
                {/* Image slot indicators */}
                {tmpl.imageSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="absolute flex items-center justify-center rounded-sm border border-dashed border-white/30 bg-white/10"
                    style={{
                      left: `${slot.x * 100}%`,
                      top: `${slot.y * 100}%`,
                      width: `${slot.width * 100}%`,
                      height: `${slot.height * 100}%`,
                    }}
                  >
                    <svg className="h-3 w-3 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                  </div>
                ))}
              </div>
              <span className={`text-center text-[10px] leading-tight ${
                isSelected ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}>
                {tmpl.name}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
