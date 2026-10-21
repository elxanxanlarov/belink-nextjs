"use client";

import Image from "next/image";
import {
  BannerSlider,
  CartButton,
  CartControl,
  ContactButton,
  LayoutProps,
  ProductImage,
  ProductLink,
  ProductsEmptyState,
  SearchField,
  ShopAvatar,
  StorefrontFooter,
  sfBtnPrimary,
  sfFocus,
  sfHeading,
} from "./parts";

/** Butik: mərkəzləşmiş, yumşaq künclü; banner slayderi, dairəvi kateqoriyalar, kartlı şəbəkə. */
export default function BoutiqueLayout({ sf }: LayoutProps) {
  const { user, categories } = sf;

  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--sf-bg)]/90 backdrop-blur-md border-b border-[var(--sf-border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <a href="#top" className={`flex items-center gap-2.5 min-w-0 ${sfFocus}`}>
            <ShopAvatar sf={sf} size={36} />
            <span className={`font-extrabold text-base truncate ${sfHeading}`}>{sf.shopTitle}</span>
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-[var(--sf-muted)]">
            <a href="#mehsullar" className="hover:text-[var(--sf-text)] transition-colors duration-200">Məhsullar</a>
            <a href="#haqqimizda" className="hover:text-[var(--sf-text)] transition-colors duration-200">Haqqımızda</a>
            <a href="#elaqe" className="hover:text-[var(--sf-text)] transition-colors duration-200">Əlaqə</a>
          </nav>
          <CartButton sf={sf} />
        </div>
      </header>

      <main id="top" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-14 sm:gap-20">
        <section className="flex flex-col gap-8">
          <BannerSlider banners={user.banners} alt={sf.shopTitle} />
          <div className="flex flex-col items-center text-center gap-4 max-w-xl mx-auto">
            <h1 className={`text-3xl sm:text-5xl font-black leading-[1.05] break-words max-w-full ${sfHeading}`}>
              {sf.shopTitle}
            </h1>
            {user.bio && (
              <p className="text-base text-[var(--sf-muted)] leading-relaxed line-clamp-4 whitespace-pre-line break-words max-w-full">
                {user.bio}
              </p>
            )}
            <a href="#mehsullar" className={`${sfBtnPrimary} ${sfFocus}`}>
              Məhsullara bax
            </a>
          </div>
        </section>

        {categories.length > 1 && (
          <section aria-label="Kateqoriyalar" className="flex gap-5 sm:gap-8 overflow-x-auto pb-2 sm:justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => sf.selectCategory(cat.id)}
                className={`group shrink-0 w-24 sm:w-28 flex flex-col items-center gap-2.5 cursor-pointer ${sfFocus}`}
              >
                <span className="relative block w-24 h-24 sm:w-28 sm:h-28 overflow-hidden rounded-full border-2 border-[var(--sf-border)] group-hover:border-[var(--sf-accent)] transition-colors duration-200">
                  <Image src={cat.cover} alt="" fill unoptimized className="object-cover" />
                </span>
                <span className="text-sm font-bold text-center leading-tight">{cat.name}</span>
              </button>
            ))}
          </section>
        )}

        <section id="mehsullar" className="scroll-mt-24 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className={`text-2xl font-extrabold ${sfHeading}`}>Məhsullar</h2>
            {user.products.length > 0 && <SearchField sf={sf} className="w-full sm:w-72" />}
          </div>

          {categories.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[{ id: null as string | null, name: "Hamısı" }, ...categories].map((cat) => (
                <button
                  key={cat.id ?? "all"}
                  onClick={() => sf.setActiveCategoryId(cat.id)}
                  aria-pressed={sf.activeCategoryId === cat.id}
                  className={`shrink-0 min-h-11 px-5 rounded-full text-sm font-bold border transition-colors duration-200 cursor-pointer ${sfFocus} ${
                    sf.activeCategoryId === cat.id
                      ? "bg-[var(--sf-accent)] text-[var(--sf-accent-text)] border-[var(--sf-accent)]"
                      : "bg-[var(--sf-surface)] text-[var(--sf-muted)] border-[var(--sf-border)] hover:text-[var(--sf-text)]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          <ProductsEmptyState sf={sf} />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {sf.filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group flex flex-col gap-3 p-3 rounded-[var(--sf-radius)] bg-[var(--sf-surface)] border border-[var(--sf-border)] min-w-0"
              >
                <ProductLink
                  sf={sf}
                  product={product}
                  className="relative block w-full aspect-square overflow-hidden rounded-[calc(var(--sf-radius)-8px)]"
                >
                  <ProductImage product={product} className="group-hover:scale-105 transition-transform duration-500" />
                </ProductLink>
                <div className="flex flex-col gap-1 px-1 min-w-0">
                  <h3 className="text-sm font-bold leading-snug line-clamp-2 break-words">{product.title}</h3>
                  <span className="text-base font-black text-[var(--sf-accent)]">{product.price} AZN</span>
                </div>
                <CartControl sf={sf} product={product} className="mt-auto w-full" />
              </article>
            ))}
          </div>
        </section>

        <section
          id="haqqimizda"
          className="scroll-mt-24 rounded-[var(--sf-radius)] bg-[var(--sf-surface)] border border-[var(--sf-border)] p-6 sm:p-12 flex flex-col items-center text-center gap-5"
        >
          <ShopAvatar sf={sf} size={72} />
          <h2 className={`text-2xl font-extrabold ${sfHeading}`}>Haqqımızda</h2>
          <p className="text-base text-[var(--sf-muted)] leading-relaxed whitespace-pre-line break-words max-w-[60ch]">
            {user.bio || "Sifariş və suallar üçün bizə WhatsApp ilə yazın."}
          </p>
          <ContactButton sf={sf} label="Bizə yazın" />
        </section>
      </main>

      <StorefrontFooter sf={sf} />
    </>
  );
}
