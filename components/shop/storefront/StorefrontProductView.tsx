"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, MessageCircle, Minus, Plus, Share2, ShoppingBag } from "lucide-react";
import { getShopTitle } from "@/lib/shopTitle";
import { AvatarImage } from "@/components/ui/AvatarImage";
import { getShopPalette } from "@/data/shopTemplates";
import { useShopCart } from "@/lib/useShopCart";
import { buildSingleOrderUrl } from "@/lib/shopOrder";
import { showToast } from "@/lib/swal";
import type { ShopProduct, ShopSummary, ShopTemplate } from "@/types";
import { sfBtnOutline, sfBtnPrimary, sfFocus, sfHeading, storefrontThemeStyle } from "./parts";

export interface StorefrontProductViewProps {
  shop: ShopSummary;
  product: ShopProduct;
  otherProducts: ShopProduct[];
  template: ShopTemplate;
  paletteId?: string | null;
  /** Mağaza səhifəsinin yolu (məhsul yolları da bunun altındadır); nümunə mağazada şablon səhifəsi. */
  shopPath: string;
  /** Nümunə mağaza: sifariş göndərilmir, seçilmiş rəng linklərdə saxlanılır. */
  isDemo?: boolean;
}

interface VariantProps extends Omit<StorefrontProductViewProps, "shopPath"> {
  page: ProductPage;
  shopHref: string;
  productHref: (product: ShopProduct) => string;
}

/** Bütün dizayn variantlarının paylaşdığı vəziyyət və əməliyyatlar. */
function useProductPage({ shop, product, isDemo }: StorefrontProductViewProps) {
  const { cart, totalItemsCount, addToCart, updateQuantity } = useShopCart(shop.username);
  const [activeIdx, setActiveIdx] = useState(0);

  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];
  const shopTitle = getShopTitle(shop);

  const order = () => {
    if (isDemo) {
      showToast("Bu nümunə mağazadır, sifariş göndərilmir", "info");
      return;
    }
    window.open(buildSingleOrderUrl(product, shop.username, shop.whatsappPhone), "_blank");
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.title, text: `${product.title} — ${product.price} AZN`, url });
      } catch {
        // İstifadəçi paylaşımı ləğv etdi.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link kopyalandı", "success");
    } catch {
      showToast("Linki kopyalamaq mümkün olmadı", "error");
    }
  };

  return {
    images,
    activeIdx,
    setActiveIdx,
    shopTitle,
    totalItemsCount,
    cartQuantity: cart[product.id]?.quantity ?? 0,
    addToCart: () => addToCart(product),
    updateQuantity: (delta: number) => updateQuantity(product.id, delta),
    order,
    share,
  };
}

type ProductPage = ReturnType<typeof useProductPage>;

/* ---------- Ortaq hissələr ---------- */

function Gallery({
  page,
  product,
  aspect = "aspect-square",
  thumbs = "row",
  fit = "object-cover",
}: {
  page: ProductPage;
  product: ShopProduct;
  aspect?: string;
  thumbs?: "row" | "column";
  fit?: string;
}) {
  const { images, activeIdx, setActiveIdx } = page;
  const count = images.length;
  const step = (delta: number) => setActiveIdx((activeIdx + delta + count) % count);

  const thumbList = count > 1 && (
    <div
      className={
        thumbs === "column" ? "hidden md:flex flex-col gap-2.5 w-20 shrink-0" : "flex gap-2.5 overflow-x-auto pb-1"
      }
    >
      {images.map((img, i) => (
        <button
          key={img + i}
          onClick={() => setActiveIdx(i)}
          aria-label={`Şəkil ${i + 1}`}
          aria-current={i === activeIdx}
          className={`relative shrink-0 w-20 h-20 overflow-hidden rounded-[var(--sf-radius)] border-2 transition-colors duration-200 cursor-pointer ${sfFocus} ${
            i === activeIdx ? "border-[var(--sf-accent)]" : "border-transparent opacity-70 hover:opacity-100"
          }`}
        >
          <Image src={img} alt="" fill unoptimized className="object-cover" />
        </button>
      ))}
    </div>
  );

  return (
    <div className={`flex gap-3 min-w-0 ${thumbs === "column" ? "flex-row" : "flex-col"}`}>
      {thumbs === "column" && thumbList}
      <div className={`relative w-full ${aspect} overflow-hidden rounded-[var(--sf-radius)] bg-[var(--sf-surface)]`}>
        <Image src={images[activeIdx]} alt={product.title} fill unoptimized priority className={fit} />
        {count > 1 && (
          <>
            <button
              onClick={() => step(-1)}
              aria-label="Əvvəlki şəkil"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors duration-200 cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => step(1)}
              aria-label="Növbəti şəkil"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors duration-200 cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
      {thumbs === "row" && thumbList}
    </div>
  );
}

function CartControl({ page, className = "" }: { page: ProductPage; className?: string }) {
  if (page.cartQuantity > 0) {
    return (
      <div
        className={`flex items-center justify-between min-h-12 px-1 rounded-[var(--sf-btn-radius)] border border-[var(--sf-accent)] ${className}`}
      >
        <button
          onClick={() => page.updateQuantity(-1)}
          aria-label="Azalt"
          className={`w-11 h-11 flex items-center justify-center text-[var(--sf-accent)] cursor-pointer ${sfFocus}`}
        >
          <Minus size={16} strokeWidth={2.5} />
        </button>
        <span className="text-sm font-bold">Səbətdə: {page.cartQuantity}</span>
        <button
          onClick={() => page.updateQuantity(1)}
          aria-label="Artır"
          className={`w-11 h-11 flex items-center justify-center text-[var(--sf-accent)] cursor-pointer ${sfFocus}`}
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </div>
    );
  }
  return (
    <button onClick={page.addToCart} className={`${sfBtnOutline} ${sfFocus} min-h-12 ${className}`}>
      <Plus size={16} strokeWidth={2.5} /> Səbətə at
    </button>
  );
}

function Actions({ page, stacked = true }: { page: ProductPage; stacked?: boolean }) {
  return (
    <div className={`flex gap-2.5 ${stacked ? "flex-col" : "flex-col sm:flex-row sm:flex-wrap"}`}>
      <button onClick={page.order} className={`${sfBtnPrimary} ${sfFocus} min-h-12 ${stacked ? "w-full" : "flex-1"}`}>
        <MessageCircle size={18} /> WhatsApp ilə sifariş et
      </button>
      <CartControl page={page} className={stacked ? "w-full" : "flex-1"} />
      <button onClick={page.share} className={`${sfBtnOutline} ${sfFocus} min-h-12 ${stacked ? "w-full" : ""}`}>
        <Share2 size={16} /> Paylaş
      </button>
    </div>
  );
}

function Description({ product, className = "" }: { product: ShopProduct; className?: string }) {
  return product.description ? (
    <p className={`text-sm sm:text-base leading-relaxed whitespace-pre-line break-words text-[var(--sf-muted)] ${className}`}>
      {product.description}
    </p>
  ) : (
    <p className={`text-sm italic text-[var(--sf-muted)] ${className}`}>Ətraflı məlumat yoxdur.</p>
  );
}

function CartLink({ page, shopHref, className = "" }: { page: ProductPage; shopHref: string; className?: string }) {
  return (
    <Link
      href={shopHref}
      aria-label={`Səbət, ${page.totalItemsCount} məhsul`}
      className={`relative shrink-0 inline-flex items-center gap-2 min-h-11 px-4 text-sm font-bold rounded-[var(--sf-btn-radius)] border border-[var(--sf-border)] hover:border-[var(--sf-accent)] transition-colors duration-200 ${sfFocus} ${className}`}
    >
      <ShoppingBag size={17} />
      <span className="hidden sm:inline">Səbət</span>
      {page.totalItemsCount > 0 && (
        <span className="min-w-5 h-5 px-1 rounded-full bg-[var(--sf-accent)] text-[var(--sf-accent-text)] text-[11px] font-black flex items-center justify-center">
          {page.totalItemsCount}
        </span>
      )}
    </Link>
  );
}

function BackLink({ shopHref, label = "Mağazaya qayıt" }: { shopHref: string; label?: string }) {
  return (
    <Link
      href={shopHref}
      className={`self-start inline-flex items-center gap-1.5 text-sm font-bold text-[var(--sf-muted)] hover:text-[var(--sf-text)] transition-colors duration-200 ${sfFocus}`}
    >
      <ArrowLeft size={16} /> {label}
    </Link>
  );
}

function OtherProductCard({
  item,
  href,
  aspect = "aspect-square",
  className = "",
}: {
  item: ShopProduct;
  href: string;
  aspect?: string;
  className?: string;
}) {
  return (
    <Link href={href} className={`group flex flex-col gap-3 min-w-0 ${sfFocus} ${className}`}>
      <div className={`relative w-full ${aspect} overflow-hidden rounded-[var(--sf-radius)] bg-[var(--sf-surface)]`}>
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <h3 className="text-sm font-bold line-clamp-2 break-words">{item.title}</h3>
        <span className="text-sm font-bold text-[var(--sf-accent)]">{item.price} AZN</span>
      </div>
    </Link>
  );
}

function PoweredBy() {
  return (
    <footer className="mt-auto border-t border-[var(--sf-border)]">
      <p className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-center text-xs text-[var(--sf-muted)]">
        <Link href="/" className={`font-bold hover:text-[var(--sf-text)] transition-colors duration-200 ${sfFocus}`}>
          Belink ilə hazırlanıb
        </Link>
      </p>
    </footer>
  );
}

/* ---------- Butik: incə başlıq, yan miniatürlər, zərif tipoqrafiya ---------- */

function BoutiqueProduct({ page, product, otherProducts, shop, shopHref, productHref }: VariantProps) {
  return (
    <>
      <header className="border-b border-[var(--sf-border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          <Link href={shopHref} className={`flex items-center gap-3 min-w-0 ${sfFocus}`}>
            <AvatarImage
              src={shop.image}
              alt={page.shopTitle}
              size={40}
              fallbackInitials={page.shopTitle.replace(/^@/, "")[0]?.toUpperCase()}
            />
            <span className={`text-lg sm:text-xl font-bold truncate ${sfHeading}`}>{page.shopTitle}</span>
          </Link>
          <CartLink page={page} shopHref={shopHref} />
        </div>
      </header>

      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-10 sm:gap-16">
        <BackLink shopHref={shopHref} />
        <section className="grid md:grid-cols-[1.1fr_1fr] gap-8 md:gap-14 items-start">
          <Gallery page={page} product={product} aspect="aspect-[4/5]" thumbs="column" />
          <div className="flex flex-col gap-6 md:sticky md:top-8">
            {product.category && (
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--sf-accent)]">
                {product.category.name}
              </span>
            )}
            <h1 className={`text-3xl sm:text-4xl leading-tight break-words ${sfHeading}`}>{product.title}</h1>
            <span className="text-2xl font-bold">{product.price} AZN</span>
            <div className="h-px bg-[var(--sf-border)]" />
            <Description product={product} />
            <Actions page={page} />
          </div>
        </section>

        {otherProducts.length > 0 && (
          <section className="flex flex-col gap-6">
            <h2 className={`text-2xl text-center ${sfHeading}`}>Bunları da bəyənə bilərsiniz</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {otherProducts.slice(0, 4).map((item) => (
                <OtherProductCard key={item.id} item={item} href={productHref(item)} aspect="aspect-[4/5]" />
              ))}
            </div>
          </section>
        )}
      </main>
      <PoweredBy />
    </>
  );
}

/* ---------- Noir (vitrin): mərkəzdə mağaza adı, iri şəkil, üfüqi kolleksiya lenti ---------- */

function ShowcaseProduct({ page, product, otherProducts, shopHref, productHref }: VariantProps) {
  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--sf-bg)]/95 backdrop-blur-md border-b border-[var(--sf-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-[72px] grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <Link
            href={shopHref}
            aria-label="Kolleksiyaya qayıt"
            className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--sf-muted)] hover:text-[var(--sf-text)] transition-colors duration-200 ${sfFocus}`}
          >
            <ArrowLeft size={16} /> <span className="hidden sm:inline">Kolleksiya</span>
          </Link>
          <Link href={shopHref} className={`text-xl sm:text-2xl truncate ${sfHeading} ${sfFocus}`}>
            {page.shopTitle}
          </Link>
          <div className="flex justify-end">
            <CartLink page={page} shopHref={shopHref} />
          </div>
        </div>
      </header>

      <main className="w-full flex flex-col gap-20 sm:gap-28 pb-20">
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-8 pt-6 sm:pt-10 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <Gallery page={page} product={product} aspect="aspect-[4/5]" />
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-7">
            {product.category && (
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--sf-muted)]">
                {product.category.name}
              </span>
            )}
            <h1 className={`text-4xl sm:text-5xl leading-[1.05] break-words max-w-full ${sfHeading}`}>
              {product.title}
            </h1>
            <span className="text-xl tracking-[0.12em] text-[var(--sf-accent)]">{product.price} AZN</span>
            <Description product={product} className="max-w-[46ch]" />
            <div className="w-full max-w-md">
              <Actions page={page} />
            </div>
          </div>
        </section>

        {otherProducts.length > 0 && (
          <section className="flex flex-col gap-8">
            <h2 className={`max-w-7xl mx-auto w-full px-4 sm:px-8 text-2xl sm:text-3xl ${sfHeading}`}>Kolleksiyadan</h2>
            <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory px-4 sm:px-8 pb-2 max-w-7xl mx-auto w-full">
              {otherProducts.map((item) => (
                <OtherProductCard
                  key={item.id}
                  item={item}
                  href={productHref(item)}
                  aspect="aspect-[3/4]"
                  className="w-56 sm:w-64 shrink-0 snap-start"
                />
              ))}
            </div>
          </section>
        )}
      </main>
      <PoweredBy />
    </>
  );
}

/* ---------- Minimal (kataloq): yol xətti, xüsusiyyət cədvəli, siyahı şəklində digər məhsullar ---------- */

function CatalogProduct({ page, product, otherProducts, shopHref, productHref }: VariantProps) {
  const specs: [string, string][] = [
    ["Qiymət", `${product.price} AZN`],
    ...(product.category ? [["Kateqoriya", product.category.name] as [string, string]] : []),
    ["Mağaza", page.shopTitle],
  ];

  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--sf-bg)] border-b border-[var(--sf-border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href={shopHref} className={`text-base font-black truncate ${sfHeading} ${sfFocus}`}>
            {page.shopTitle}
          </Link>
          <CartLink page={page} shopHref={shopHref} />
        </div>
      </header>

      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-12">
        <nav aria-label="Yol" className="flex items-center gap-2 text-xs font-semibold text-[var(--sf-muted)] min-w-0">
          <Link href={shopHref} className={`shrink-0 hover:text-[var(--sf-text)] transition-colors duration-200 ${sfFocus}`}>
            Kataloq
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <span className="truncate">{product.category.name}</span>
            </>
          )}
          <span>/</span>
          <span className="text-[var(--sf-text)] truncate">{product.title}</span>
        </nav>

        <section className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          <div className="border border-[var(--sf-border)] rounded-[var(--sf-radius)] p-3">
            <Gallery page={page} product={product} fit="object-contain" />
          </div>
          <div className="flex flex-col gap-6">
            <h1 className={`text-2xl sm:text-3xl font-black leading-tight break-words ${sfHeading}`}>{product.title}</h1>
            <span className="text-3xl font-black">{product.price} AZN</span>
            <Actions page={page} stacked={false} />
            <dl className="border-t border-[var(--sf-border)] text-sm">
              {specs.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 py-3 border-b border-[var(--sf-border)]">
                  <dt className="text-[var(--sf-muted)]">{label}</dt>
                  <dd className="font-semibold text-right break-words min-w-0">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-col gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--sf-muted)]">Təsvir</h2>
              <Description product={product} />
            </div>
          </div>
        </section>

        {otherProducts.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className={`text-lg font-black ${sfHeading}`}>Digər məhsullar</h2>
            <ul className="border-t border-[var(--sf-border)]">
              {otherProducts.map((item) => (
                <li key={item.id} className="border-b border-[var(--sf-border)]">
                  <Link
                    href={productHref(item)}
                    className={`flex items-center gap-4 py-3 hover:bg-[var(--sf-surface)] transition-colors duration-200 ${sfFocus}`}
                  >
                    <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded-[var(--sf-radius)] bg-[var(--sf-surface)]">
                      <Image src={item.imageUrl} alt={item.title} fill unoptimized className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold truncate">{item.title}</h3>
                      {item.category && <p className="text-xs text-[var(--sf-muted)] truncate">{item.category.name}</p>}
                    </div>
                    <span className="text-sm font-black shrink-0">{item.price} AZN</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <PoweredBy />
    </>
  );
}

/* ---------- Mozaika (bento): üzən menyu, plitələrdən qurulmuş məhsul səhifəsi ---------- */

const tile = "rounded-[var(--sf-radius)] overflow-hidden";

function BentoProduct({ page, product, otherProducts, shop, shopHref, productHref }: VariantProps) {
  return (
    <>
      <header className="sticky top-3 z-30 px-3 sm:px-6">
        <div className="max-w-6xl mx-auto h-16 pl-3 pr-2 flex items-center justify-between gap-4 rounded-full bg-[var(--sf-surface)] border border-[var(--sf-border)] shadow-sm">
          <Link href={shopHref} className={`flex items-center gap-2.5 min-w-0 ${sfFocus}`}>
            <AvatarImage
              src={shop.image}
              alt={page.shopTitle}
              size={40}
              fallbackInitials={page.shopTitle.replace(/^@/, "")[0]?.toUpperCase()}
            />
            <span className={`font-extrabold text-base truncate ${sfHeading}`}>{page.shopTitle}</span>
          </Link>
          <CartLink page={page} shopHref={shopHref} className="!border-transparent bg-[var(--sf-bg)]" />
        </div>
      </header>

      <main className="w-full max-w-6xl mx-auto px-3 sm:px-6 pt-6 sm:pt-8 pb-16 flex flex-col gap-10">
        <section className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
          <div className={`${tile} md:col-span-2 md:row-span-3 bg-[var(--sf-surface)] p-3`}>
            <Gallery page={page} product={product} />
          </div>

          <div className={`${tile} md:col-span-2 p-7 sm:p-9 flex flex-col gap-4 bg-[var(--sf-accent)] text-[var(--sf-accent-text)]`}>
            {product.category && (
              <span className="self-start text-xs font-bold px-3 py-1 rounded-full border border-current opacity-90">
                {product.category.name}
              </span>
            )}
            <h1 className={`text-3xl sm:text-4xl font-black leading-[1.05] break-words ${sfHeading}`}>{product.title}</h1>
            <span className="text-2xl font-black">{product.price} AZN</span>
          </div>

          <div className={`${tile} md:col-span-2 p-6 sm:p-7 bg-[var(--sf-surface)] border border-[var(--sf-border)] flex flex-col gap-2`}>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--sf-muted)]">Məhsul haqqında</h2>
            <Description product={product} />
          </div>

          <div className={`${tile} md:col-span-2 p-4 sm:p-5 bg-[var(--sf-surface)] border border-[var(--sf-border)]`}>
            <Actions page={page} />
          </div>
        </section>

        <BackLink shopHref={shopHref} label="Bütün məhsullar" />

        {otherProducts.length > 0 && (
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {otherProducts.slice(0, 7).map((item, i) => (
              <Link
                key={item.id}
                href={productHref(item)}
                className={`${tile} group relative aspect-square bg-[var(--sf-surface)] ${i === 0 ? "col-span-2 md:row-span-2" : ""} ${sfFocus}`}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                  <h3 className="text-sm font-bold line-clamp-1">{item.title}</h3>
                  <span className="text-xs font-bold opacity-90">{item.price} AZN</span>
                </div>
              </Link>
            ))}
          </section>
        )}
      </main>
      <PoweredBy />
    </>
  );
}

const VARIANTS: Record<string, React.ComponentType<VariantProps>> = {
  boutique: BoutiqueProduct,
  showcase: ShowcaseProduct,
  catalog: CatalogProduct,
  bento: BentoProduct,
};

/** Premium şablonlarda məhsul səhifəsi: hər dizaynın öz düzülüşü və rəng palitrası var. */
export default function StorefrontProductView(props: StorefrontProductViewProps) {
  const { shopPath, ...rest } = props;
  const page = useProductPage(props);
  const palette = getShopPalette(props.template, props.paletteId);
  const Variant = VARIANTS[props.template.layout] ?? BoutiqueProduct;

  const query = props.isDemo ? `?palette=${palette.id}` : "";
  const shopHref = `${shopPath}${query}`;
  const productHref = (item: ShopProduct) => `${shopPath}/${item.id}${query}`;

  return (
    <div
      style={storefrontThemeStyle(props.template, palette)}
      className="min-h-screen flex flex-col bg-[var(--sf-bg)] text-[var(--sf-text)]"
    >
      <Variant {...rest} page={page} shopHref={shopHref} productHref={productHref} />
    </div>
  );
}
