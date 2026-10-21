"use client";

import { ShoppingBag } from "lucide-react";
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
  SocialLinks,
  StorefrontFooter,
  sfBtnPrimary,
  sfFocus,
  sfHeading,
} from "./parts";

const tile = "rounded-[var(--sf-radius)] overflow-hidden";

/** Mozaika: üzən menyu, mozaika açılış, hər yeddinci məhsul geniş plitə, mobil alt səbət zolağı. */
export default function BentoLayout({ sf }: LayoutProps) {
  const { user, categories } = sf;
  const hasBanner = user.banners.length > 0;
  // Açılış mozaikasında banner varsa iki, yoxdursa üç məhsul plitəsi göstərilir.
  const heroProducts = user.products.slice(0, hasBanner ? 2 : 3);
  const heroCount = heroProducts.length;
  const introSpan = !hasBanner && heroCount === 0 ? "col-span-2 md:col-span-4" : "col-span-2 md:row-span-2";
  const bannerSpan = heroCount === 0 ? "col-span-2 md:row-span-2" : "col-span-2";
  // Sağdakı 2x2 sahə boş xana qalmadan dolsun deyə plitələrin eni məhsul sayına görə seçilir.
  const heroProductSpan = (index: number) => {
    if (hasBanner) return heroCount === 1 ? "col-span-2" : "";
    if (heroCount === 1) return "col-span-2 md:row-span-2";
    if (heroCount === 2) return "col-span-2";
    return index === 0 ? "col-span-2" : "";
  };

  // Hər yeddinci məhsul geniş plitədir; son sıra boş xana qalmasın deyə axırıncı plitələr də genişlənir.
  const products = sf.filteredProducts;
  const wide = new Set(products.length > 3 ? products.map((_, i) => i).filter((i) => i % 7 === 0) : []);
  const gap = (4 - ((products.length + wide.size) % 4)) % 4;
  for (let i = products.length - 1, left = gap; i >= 0 && left > 0 && products.length > 3; i--) {
    if (!wide.has(i)) {
      wide.add(i);
      left--;
    }
  }

  return (
    <>
      <header className="sticky top-3 z-30 px-3 sm:px-6">
        <div className="max-w-6xl mx-auto h-16 pl-3 pr-2 flex items-center justify-between gap-4 rounded-full bg-[var(--sf-surface)] border border-[var(--sf-border)] shadow-sm">
          <a href="#top" className={`flex items-center gap-2.5 min-w-0 ${sfFocus}`}>
            <ShopAvatar sf={sf} size={40} />
            <span className={`font-extrabold text-base truncate ${sfHeading}`}>{sf.shopTitle}</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[var(--sf-muted)]">
            <a href="#mehsullar" className="hover:text-[var(--sf-text)] transition-colors duration-200">Məhsullar</a>
            <a href="#haqqimizda" className="hover:text-[var(--sf-text)] transition-colors duration-200">Haqqımızda</a>
          </nav>
          <CartButton sf={sf} className="!border-transparent bg-[var(--sf-bg)]" />
        </div>
      </header>

      <main id="top" className="w-full max-w-6xl mx-auto px-3 sm:px-6 pt-6 sm:pt-8 pb-28 md:pb-16 flex flex-col gap-12 sm:gap-16">
        <section className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-3 sm:gap-4">
          <div
            className={`${tile} ${introSpan} p-7 sm:p-10 flex flex-col items-start justify-end gap-5 min-h-72 bg-[var(--sf-accent)] text-[var(--sf-accent-text)]`}
          >
            <h1 className={`text-4xl sm:text-5xl font-black leading-[1.02] break-words max-w-full ${sfHeading}`}>
              {sf.shopTitle}
            </h1>
            {user.bio && (
              <p className="text-base leading-relaxed line-clamp-4 whitespace-pre-line break-words max-w-[38ch] opacity-90">
                {user.bio}
              </p>
            )}
            <a
              href="#mehsullar"
              className={`inline-flex items-center justify-center min-h-11 px-6 rounded-full bg-[var(--sf-accent-text)] text-[var(--sf-accent)] text-sm font-bold whitespace-nowrap transition-transform duration-200 active:scale-[0.98] ${sfFocus}`}
            >
              Məhsullara bax
            </a>
          </div>

          {hasBanner && (
            <BannerSlider banners={user.banners} alt={sf.shopTitle} className={`${bannerSpan} aspect-[2/1] md:aspect-auto md:h-full md:min-h-56`} />
          )}

          {heroProducts.map((product, index) => {
            const span = heroProductSpan(index);
            return (
            <ProductLink
              key={product.id}
              sf={sf}
              product={product}
              className={`${tile} ${span} group relative block md:aspect-auto md:min-h-56 bg-[var(--sf-surface)] ${
                span ? "aspect-[2/1]" : "aspect-square"
              }`}
            >
              <ProductImage product={product} priority className="group-hover:scale-105 transition-transform duration-500" />
              <span className="absolute inset-x-0 bottom-0 p-4 pt-12 bg-gradient-to-t from-black/70 to-transparent text-white flex items-end justify-between gap-3">
                <span className="text-sm font-bold line-clamp-1">{product.title}</span>
                <span className="shrink-0 text-sm font-black">{product.price} AZN</span>
              </span>
            </ProductLink>
            );
          })}
        </section>

        <section id="mehsullar" className="scroll-mt-28 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className={`text-3xl font-black ${sfHeading}`}>Məhsullar</h2>
            {user.products.length > 0 && <SearchField sf={sf} className="w-full sm:w-72" />}
          </div>

          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {[{ id: null as string | null, name: "Hamısı" }, ...categories].map((cat) => (
                <button
                  key={cat.id ?? "all"}
                  onClick={() => sf.setActiveCategoryId(cat.id)}
                  aria-pressed={sf.activeCategoryId === cat.id}
                  className={`min-h-11 px-5 rounded-full text-sm font-bold transition-colors duration-200 cursor-pointer ${sfFocus} ${
                    sf.activeCategoryId === cat.id
                      ? "bg-[var(--sf-text)] text-[var(--sf-bg)]"
                      : "bg-[var(--sf-surface)] text-[var(--sf-text)] border border-[var(--sf-border)] hover:border-[var(--sf-accent)]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          <ProductsEmptyState sf={sf} />

          <div className="grid grid-cols-2 md:grid-cols-4 grid-flow-dense gap-3 sm:gap-4">
            {sf.filteredProducts.map((product, index) => {
              const isWide = wide.has(index);
              return (
                <article
                  key={product.id}
                  className={`${tile} group flex flex-col bg-[var(--sf-surface)] border border-[var(--sf-border)] min-w-0 ${
                    isWide ? "md:col-span-2" : ""
                  }`}
                >
                  <ProductLink
                    sf={sf}
                    product={product}
                    className={`relative block w-full overflow-hidden ${isWide ? "aspect-square md:aspect-[2/1]" : "aspect-square"}`}
                  >
                    <ProductImage product={product} className="group-hover:scale-105 transition-transform duration-500" />
                  </ProductLink>
                  <div className="flex flex-col gap-3 p-4 flex-1 min-w-0">
                    <div className="flex flex-col gap-1 min-w-0">
                      <h3 className="text-sm font-bold leading-snug line-clamp-2 break-words">{product.title}</h3>
                      <span className="text-base font-black text-[var(--sf-accent)]">{product.price} AZN</span>
                    </div>
                    <CartControl sf={sf} product={product} className="mt-auto w-full" />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="haqqimizda" className="scroll-mt-28 grid md:grid-cols-3 gap-3 sm:gap-4">
          <div className={`${tile} md:col-span-2 p-7 sm:p-10 flex flex-col items-start gap-4 bg-[var(--sf-surface)] border border-[var(--sf-border)]`}>
            <h2 className={`text-2xl font-black ${sfHeading}`}>Haqqımızda</h2>
            <p className="text-base text-[var(--sf-muted)] leading-relaxed whitespace-pre-line break-words max-w-[58ch]">
              {user.bio || "Sifariş və suallar üçün bizə WhatsApp ilə yazın."}
            </p>
            <SocialLinks sf={sf} />
          </div>
          <div className={`${tile} p-7 sm:p-10 flex flex-col items-start justify-between gap-6 bg-[var(--sf-text)] text-[var(--sf-bg)]`}>
            <p className={`text-2xl font-black leading-tight ${sfHeading}`}>Sualınız var? Bir mesaj kifayətdir.</p>
            <ContactButton
              sf={sf}
              label="WhatsApp-da yazın"
              className="inline-flex items-center justify-center gap-2 min-h-11 px-6 rounded-full bg-[var(--sf-bg)] text-[var(--sf-text)] text-sm font-bold whitespace-nowrap cursor-pointer"
            />
          </div>
        </section>
      </main>

      <StorefrontFooter sf={sf} />

      {sf.totalItemsCount > 0 && (
        <div className="md:hidden fixed bottom-3 inset-x-3 z-30">
          <button
            onClick={() => sf.setIsCartOpen(true)}
            className={`${sfBtnPrimary} ${sfFocus} w-full !justify-between !min-h-14 shadow-xl`}
          >
            <span className="inline-flex items-center gap-2">
              <ShoppingBag size={18} /> {sf.totalItemsCount} məhsul
            </span>
            <span>{sf.totalPrice.toFixed(2)} AZN</span>
          </button>
        </div>
      )}
    </>
  );
}
