'use client'

import { useTranslation } from 'react-i18next'
import { useAssetStore } from '@/store/asset-store'
import { STORE_ASSET_SPECS } from '@/data/asset-specs'
import { ASSET_TEMPLATES } from '@/data/asset-templates'
import type { AssetCategory } from '@/types/asset'

export function AssetControlPanel() {
  const { t } = useTranslation()
  const selectedSpecId = useAssetStore((s) => s.selectedSpecId)
  const selectedTemplateId = useAssetStore((s) => s.selectedTemplateId)
  const textOverrides = useAssetStore((s) => s.textOverrides)
  const set = useAssetStore((s) => s.set)
  const setTextOverride = useAssetStore((s) => s.setTextOverride)

  const selectedSpec = STORE_ASSET_SPECS.find((s) => s.id === selectedSpecId)
  const category: AssetCategory = selectedSpec?.category ?? 'marketing'
  const compatibleTemplates = ASSET_TEMPLATES.filter((t) =>
    t.compatibleCategories.includes(category),
  )
  const selectedTemplate = ASSET_TEMPLATES.find((t) => t.id === selectedTemplateId)

  // Group specs by platform
  const platforms = [...new Set(STORE_ASSET_SPECS.map((s) => s.platform))]

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Spec Selector */}
      <section>
        <h3 className="mb-2 text-sm font-semibold text-foreground">
          {t('asset.specSelector', 'Asset Type')}
        </h3>
        {platforms.map((platform) => (
          <div key={platform} className="mb-3">
            <p className="mb-1 text-xs font-medium text-muted-foreground uppercase">
              {platform === 'googlePlay' ? 'Google Play' : platform === 'appStore' ? 'App Store' : 'General'}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {STORE_ASSET_SPECS.filter((s) => s.platform === platform).map((spec) => (
                <button
                  key={spec.id}
                  onClick={() => {
                    set({ selectedSpecId: spec.id })
                    // Auto-select first compatible template if current isn't compatible
                    const newCategory = spec.category
                    const currentTemplate = ASSET_TEMPLATES.find((t) => t.id === selectedTemplateId)
                    if (!currentTemplate || !currentTemplate.compatibleCategories.includes(newCategory)) {
                      const first = ASSET_TEMPLATES.find((t) => t.compatibleCategories.includes(newCategory))
                      if (first) set({ selectedTemplateId: first.id })
                    }
                  }}
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

      {/* Template Selector */}
      <section>
        <h3 className="mb-2 text-sm font-semibold text-foreground">
          {t('asset.templateSelector', 'Template')}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {compatibleTemplates.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => set({ selectedTemplateId: tmpl.id })}
              className={`rounded-md border px-2.5 py-1.5 text-xs transition-colors ${
                selectedTemplateId === tmpl.id
                  ? 'border-primary bg-primary/10 text-primary font-medium'
                  : 'border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              {tmpl.name}
            </button>
          ))}
        </div>
      </section>

      {/* Text Overrides */}
      {selectedTemplate && (
        <section>
          <h3 className="mb-2 text-sm font-semibold text-foreground">
            {t('asset.textEditor', 'Text')}
          </h3>
          <div className="flex flex-col gap-2">
            {selectedTemplate.textBlocks.map((block) => (
              <div key={block.id}>
                <label className="mb-1 block text-xs text-muted-foreground capitalize">
                  {block.role}
                </label>
                <input
                  type="text"
                  value={textOverrides[block.id] ?? ''}
                  placeholder={block.defaultTextKey}
                  onChange={(e) => setTextOverride(block.id, e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
