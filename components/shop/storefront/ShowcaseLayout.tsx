"use client";

import Image from "next/image";
import {
  CartButton,
  CartControl,
  ContactButton,
  LayoutProps,
  ProductImage,
  ProductLink,
  ProductsEmptyState,
  SearchField,
  StorefrontFooter,
  sfBtnPrimary,
  sfFocus,
  sfHeading,
} from "./parts";

const FEATURED_COUNT = 5;

/** Noir: iki sütunlu açılış, üfüqi seçilmişlər lenti, altdan xətli kateqoriyalar. */
export default function ShowcaseLayout({ sf }: LayoutProps) {
  const { user, categories } = sf;
  const heroImage = user.banners[0] ?? user.products[0]?.imageUrl;
  const featured = user.products.slice(0, FEATURED_COUNT);

  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--sf-bg)]/95 backdrop-blur-md border-b border-[var(--sf-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-[72px] grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--sf-muted)]">
            <a href="#mehsullar" className="hover:text-[var(--sf-text)] transition-colors duration-200">Kolleksiya</a>
            <a href="#haqqimizda" className="hover:text-[var(--sf-text)] transition-colors duration-200">Ev haqqında</a>
          </nav>
          <a href="#top" className={`col-start-1 md:col-start-2 text-xl sm:text-2xl truncate ${sfHeading} ${sfFocus}`}>
            {sf.shopTitle}
          </a>
          <div className="col-start-3 flex justify-end">
            <CartButton sf={sf} />
          </div>
        </div>
      </header>

      <main id="top" className="w-full flex flex-col gap-20 sm:gap-28 pb-20">
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-8 pt-6 sm:pt-10 grid md:grid-cols-2 gap-8 md:gap-14 items-center">
          <div className="order-2 md:order-1 flex flex-col items-start gap-6">
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl leading-[1.05] break-words max-w-full ${sfHeading}`}>
              {sf.shopTitle}
            </h1>
            {user.bio && (
              <p className="text-base text-[var(--sf-muted)] leading-relaxed line-clamp-4 whitespace-pre-line break-words max-w-[46ch]">
                {user.bio}
              </p>
            )}
            <a href="#mehsullar" className={`${sfBtnPrimary} ${sfFocus}`}>
              Kolleksiyaya bax
            </a>
          </div>
          {heroImage && (
            <div className="order-1 md:order-2 relative w-full aspect-[4/3] md:aspect-[4/5] overflow-hidden rounded-[var(--sf-radius)] bg-[var(--sf-surface)]">
              <Image src={heroImage} alt={sf.shopTitle} fill unoptimized priority className="object-cover" />
            </div>
          )}
        </section>

        {featured.length > 1 && (
          <section aria-labelledby="sf-featured" className="flex flex-col gap-8">
            <h2 id="sf-featured" className={`max-w-7xl mx-auto w-full px-4 sm:px-8 text-2xl sm:text-3xl ${sfHeading}`}>
              Seçilmişlər
            </h2>
            <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory px-4 sm:px-8 pb-4 scroll-px-4 sm:scroll-px-8">
              {featured.map((product) => (
                <ProductLink
                  key={product.id}
                  sf={sf}
                  product={product}
                  className="group snap-start shrink-0 w-[70vw] sm:w-80 flex flex-col gap-4"
                >
                  <div className="relative w-full aspect-[3/4] overflow-hidden rounded-[var(--sf-radius)] bg-[var(--sf-surface)]">
                    <ProductImage product={product} className="group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className={`text-lg leading-snug line-clamp-1 ${sfHeading}`}>{product.title}</h3>
                    <span className="shrink-0 text-sm font-bold text-[var(--sf-accent)]">{product.price} AZN</span>
                  </div>
                </ProductLink>
              ))}
            </div>
          </section>
        )}

        <section id="mehsullar" className="scroll-mt-28 max-w-7xl mx-auto w-full px-4 sm:px-8 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-[var(--sf-border)]">
            <div className="flex items-end gap-6 overflow-x-auto -mb-px min-w-0">
              {[{ id: null as string | null, name: "Hamısı" }, ...(categories.length > 1 ? categories : [])].map((cat) => (
                <button
                  key={cat.id ?? "all"}
                  onClick={() => sf.setActiveCategoryId(cat.id)}
                  aria-pressed={sf.activeCategoryId === cat.id}
                  className={`shrink-0 min-h-11 pb-3 text-sm font-semibold border-b-2 transition-colors duration-200 cursor-pointer ${sfFocus} ${
                    sf.activeCategoryId === cat.id
                      ? "border-[var(--sf-accent)] text-[var(--sf-text)]"
                      : "border-transparent text-[var(--sf-muted)] hover:text-[var(--sf-text)]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            {user.products.length > 0 && <SearchField sf={sf} className="w-full md:w-64 mb-3" />}
          </div>

          <ProductsEmptyState sf={sf} />

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-10 sm:gap-y-14">
            {sf.filteredProducts.map((product) => (
              <article key={product.id} className="group flex flex-col gap-4 min-w-0">
                <ProductLink
                  sf={sf}
                  product={product}
                  className="relative block w-full aspect-[4/5] overflow-hidden rounded-[var(--sf-radius)] bg-[var(--sf-surface)]"
                >
                  <ProductImage product={product} className="group-hover:scale-105 transition-transform duration-700" />
                </ProductLink>
                <div className="flex flex-col gap-1.5 min-w-0">
                  <h3 className={`text-base sm:text-lg leading-snug line-clamp-2 break-words ${sfHeading}`}>
                    {product.title}
                  </h3>
                  <span className="text-sm font-bold text-[var(--sf-accent)]">{product.price} AZN</span>
                </div>
                <CartControl sf={sf} product={product} className="mt-auto w-full" />
              </article>
            ))}
          </div>
        </section>

        <section id="haqqimizda" className="scroll-mt-28 max-w-7xl mx-auto w-full px-4 sm:px-8">
          <div className="border-l-2 border-[var(--sf-accent)] pl-6 sm:pl-10 py-2 flex flex-col items-start gap-6 max-w-3xl">
            <p className={`text-2xl sm:text-3xl leading-snug whitespace-pre-line break-words ${sfHeading}`}>
              {user.bio || "Hər məmulat sifarişlə hazırlanır."}
            </p>
            <ContactButton sf={sf} label="Fərdi sifariş üçün yazın" />
          </div>
        </section>
      </main>

      <StorefrontFooter sf={sf} align="left" />
    </>
  );
}
