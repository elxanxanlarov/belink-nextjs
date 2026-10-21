"use client";

import {
  BannerSlider,
  CartControl,
  ContactButton,
  LayoutProps,
  ProductImage,
  ProductLink,
  ProductsEmptyState,
  SearchField,
  SocialLinks,
  sfFocus,
  sfHeading,
} from "./parts";
import Link from "next/link";

/** Minimal: yalnız mətnli böyük başlıq, yapışqan yan panel, çərçivəsiz sıx şəbəkə. */
export default function CatalogLayout({ sf }: LayoutProps) {
  const { user, categories } = sf;
  const categoryItems = [
    { id: null as string | null, name: "Bütün məhsullar", count: user.products.length },
    ...categories,
  ];

  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--sf-bg)] border-b border-[var(--sf-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-6">
          <a href="#top" className={`text-lg font-black truncate ${sfHeading} ${sfFocus}`}>
            {sf.shopTitle}
          </a>
          {user.products.length > 0 && <SearchField sf={sf} className="hidden md:block flex-1 max-w-sm" />}
          <button
            onClick={() => sf.setIsCartOpen(true)}
            className={`shrink-0 min-h-11 text-sm font-bold underline-offset-4 hover:underline cursor-pointer ${sfFocus}`}
          >
            Səbət ({sf.totalItemsCount})
          </button>
        </div>
      </header>

      <main id="top" className="w-full max-w-7xl mx-auto px-4 sm:px-8 flex flex-col">
        <section className="py-10 sm:py-16 flex flex-col gap-6 border-b border-[var(--sf-border)]">
          <h1 className={`text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.95] break-words ${sfHeading}`}>
            {sf.shopTitle}
          </h1>
          {user.bio && (
            <p className="text-base sm:text-lg text-[var(--sf-muted)] leading-relaxed line-clamp-4 whitespace-pre-line break-words max-w-[52ch]">
              {user.bio}
            </p>
          )}
        </section>

        {user.banners.length > 0 && (
          <div className="pt-8">
            <BannerSlider banners={user.banners} alt={sf.shopTitle} className="aspect-[16/9] md:aspect-[3/1]" />
          </div>
        )}

        <div id="mehsullar" className="scroll-mt-20 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-8 lg:gap-12">
          <aside className="lg:sticky lg:top-24 lg:self-start flex flex-col gap-6 min-w-0">
            {user.products.length > 0 && <SearchField sf={sf} className="md:hidden" />}

            <nav aria-label="Kateqoriyalar" className="flex lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0">
              {categoryItems.map((cat) => {
                const isActive = sf.activeCategoryId === cat.id;
                return (
                  <button
                    key={cat.id ?? "all"}
                    onClick={() => sf.setActiveCategoryId(cat.id)}
                    aria-pressed={isActive}
                    className={`shrink-0 min-h-11 flex items-center justify-between gap-3 px-3 lg:px-0 text-sm text-left transition-colors duration-200 cursor-pointer ${sfFocus} ${
                      isActive
                        ? "font-black text-[var(--sf-accent)]"
                        : "font-medium text-[var(--sf-muted)] hover:text-[var(--sf-text)]"
                    }`}
                  >
                    <span className="whitespace-nowrap">{cat.name}</span>
                    <span className="text-xs tabular-nums">{cat.count}</span>
                  </button>
                );
              })}
            </nav>

            <div id="haqqimizda" className="hidden lg:flex flex-col items-start gap-4 pt-6 border-t border-[var(--sf-border)]">
              <p className="text-sm text-[var(--sf-muted)] leading-relaxed">
                Ölçü, rəng və çatdırılma barədə suallar üçün bizə yazın.
              </p>
              <ContactButton
                sf={sf}
                label="WhatsApp"
                className="inline-flex items-center gap-2 min-h-11 text-sm font-bold underline underline-offset-4 cursor-pointer"
              />
            </div>
          </aside>

          <div className="flex flex-col gap-8 min-w-0">
            <ProductsEmptyState sf={sf} />

            <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-10">
              {sf.filteredProducts.map((product) => (
                <article key={product.id} className="group flex flex-col gap-3 min-w-0">
                  <ProductLink
                    sf={sf}
                    product={product}
                    className="relative block w-full aspect-square overflow-hidden bg-[var(--sf-surface)]"
                  >
                    <ProductImage product={product} className="group-hover:opacity-90 transition-opacity duration-300" />
                  </ProductLink>
                  <div className="flex items-start justify-between gap-3 min-w-0">
                    <h3 className="text-sm font-semibold leading-snug line-clamp-2 break-words">{product.title}</h3>
                    <span className="shrink-0 text-sm font-black tabular-nums">{product.price} AZN</span>
                  </div>
                  <CartControl sf={sf} product={product} label="Səbətə" className="mt-auto w-full" />
                </article>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer id="elaqe" className="scroll-mt-20 mt-auto border-t border-[var(--sf-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <SocialLinks sf={sf} />
          <p className="text-xs text-[var(--sf-muted)]">
            © {new Date().getFullYear()} {sf.shopTitle} ·{" "}
            <Link href="/" className={`font-bold hover:text-[var(--sf-text)] transition-colors duration-200 ${sfFocus}`}>
              Belink ilə hazırlanıb
            </Link>
          </p>
        </div>
      </footer>
    </>
  );
}
