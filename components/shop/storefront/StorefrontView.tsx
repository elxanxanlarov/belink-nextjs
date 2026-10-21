"use client";

import React, { useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { getShopPalette } from "@/data/shopTemplates";
import type { ShopLayout, ShopPageData, ShopTemplate } from "@/types";
import { CartModal, LayoutProps } from "./parts";
import { useStorefront } from "./useStorefront";
import BoutiqueLayout from "./BoutiqueLayout";
import ShowcaseLayout from "./ShowcaseLayout";
import CatalogLayout from "./CatalogLayout";
import BentoLayout from "./BentoLayout";

const LAYOUTS: Record<Exclude<ShopLayout, "classic">, React.ComponentType<LayoutProps>> = {
  boutique: BoutiqueLayout,
  showcase: ShowcaseLayout,
  catalog: CatalogLayout,
  bento: BentoLayout,
};

export interface StorefrontViewProps {
  user: ShopPageData;
  template: ShopTemplate;
  paletteId?: string | null;
  /** live: mağazanın öz səhifəsi; preview: sahibin öz məhsulları ilə önbaxış; demo: nümunə mağaza. */
  mode?: "live" | "preview" | "demo";
}

export default function StorefrontView({ user, template, paletteId, mode = "live" }: StorefrontViewProps) {
  const [activePaletteId, setActivePaletteId] = useState(paletteId);
  const sf = useStorefront(user, mode === "demo", mode === "demo" ? `/templates/${template.id}` : undefined);

  const palette = getShopPalette(template, activePaletteId);
  const Layout = LAYOUTS[template.layout as Exclude<ShopLayout, "classic">] ?? BoutiqueLayout;

  const themeStyle = {
    "--sf-bg": palette.bg,
    "--sf-surface": palette.surface,
    "--sf-text": palette.text,
    "--sf-muted": palette.muted,
    "--sf-border": palette.border,
    "--sf-accent": palette.accent,
    "--sf-accent-text": palette.accentText,
    "--sf-radius": template.shape.radius,
    "--sf-btn-radius": template.shape.buttonRadius,
    "--sf-heading-font": template.shape.headingFont,
    "--sf-heading-transform": template.shape.headingTransform,
    "--sf-heading-spacing": template.shape.headingSpacing,
  } as CSSProperties;

  return (
    <div style={themeStyle} className="min-h-screen flex flex-col bg-[var(--sf-bg)] text-[var(--sf-text)]">
      {mode !== "live" && (
        <div className="bg-gray-900 text-white text-xs font-semibold px-4 py-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <span>
            {mode === "demo" ? "Nümunə mağaza" : "Önbaxış"}: “{template.name}” şablonu
          </span>

          <div className="flex items-center gap-2" role="group" aria-label="Rəng palitrası">
            {template.palettes.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePaletteId(p.id)}
                aria-pressed={p.id === palette.id}
                aria-label={`${p.name} rəngi`}
                title={p.name}
                className={`w-7 h-7 rounded-full border-2 cursor-pointer transition-transform duration-200 hover:scale-110 ${
                  p.id === palette.id ? "border-white" : "border-white/25"
                }`}
                style={{ background: `linear-gradient(135deg, ${p.accent} 50%, ${p.bg} 50%)` }}
              />
            ))}
          </div>

          <Link href={mode === "demo" ? "/#sablonlar" : `/${user.username}`} className="underline underline-offset-2">
            {mode === "demo" ? "Bütün şablonlar" : "Cari görünüşə qayıt"}
          </Link>
        </div>
      )}

      <Layout sf={sf} />
      <CartModal sf={sf} />
    </div>
  );
}
