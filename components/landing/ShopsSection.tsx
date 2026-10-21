import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AvatarImage } from "@/components/ui/AvatarImage";
import type { FeaturedShop } from "@/types";

const SLIDER_MIN_SHOPS = 5;
const SLIDER_MIN_CARDS = 8;
const SECONDS_PER_CARD = 5;

function ShopCard({
  shop,
  className = "",
  hidden = false,
}: {
  shop: FeaturedShop;
  className?: string;
  hidden?: boolean;
}) {
  const title = shop.shopName || shop.name || `@${shop.username}`;

  return (
    <Link
      href={`/${shop.username}`}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      className={`group bg-white rounded-2xl p-4 sm:p-6 flex flex-col items-center text-center gap-3 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200 min-w-0 ${className}`}
    >
      <AvatarImage
        src={shop.image}
        alt={title}
        size={64}
        fallbackInitials={title.replace(/^@/, "")[0]?.toUpperCase()}
        className="border-2 border-emerald-100 shadow-sm"
      />
      <div className="flex flex-col gap-0.5 min-w-0 max-w-full">
        <h3 className="font-bold text-gray-900 text-sm truncate">{title}</h3>
        <span className="text-xs font-semibold text-[#1a7a4a] truncate">@{shop.username}</span>
      </div>
      {shop.bio && (
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 break-words max-w-full">
          {shop.bio}
        </p>
      )}
      <span className="text-[11px] font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
        {shop.productCount} məhsul
      </span>
      <span className="mt-auto flex items-center gap-1 text-xs font-bold text-[#1a7a4a] group-hover:gap-2 transition-all">
        Mağazaya bax <ArrowRight size={14} />
      </span>
    </Link>
  );
}

export default function ShopsSection({ shops }: { shops: FeaturedShop[] }) {
  if (shops.length === 0) return null;

  const isSlider = shops.length >= SLIDER_MIN_SHOPS;
  // Lent iki eyni yarıdan ibarətdir; -50% sürüşəndə ikinci yarı birincinin yerinə düşür.
  const repeats = Math.ceil(SLIDER_MIN_CARDS / shops.length);
  const half = Array.from({ length: repeats }, () => shops).flat();
  const track = [...half, ...half];

  return (
    <section id="magazalar" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[#1a7a4a] text-sm font-semibold uppercase tracking-widest">
            Mağazalar
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3">
            Belink-dəki mağazalar
          </h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto text-base">
            Seçilmiş mağazalara baxın və bəyəndiyiniz məhsulu birbaşa sifariş edin.
          </p>
        </div>

        {isSlider ? (
          <div className="shops-marquee overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
            <div
              className="shops-marquee-track flex w-max"
              style={{ "--shops-marquee-duration": `${half.length * SECONDS_PER_CARD}s` } as CSSProperties}
            >
              {track.map((shop, index) => (
                <ShopCard
                  key={`${shop.id}-${index}`}
                  shop={shop}
                  hidden={index >= shops.length}
                  className={`shrink-0 w-44 sm:w-60 mr-4 sm:mr-6 ${
                    index >= shops.length ? "shops-marquee-clone" : ""
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {shops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
