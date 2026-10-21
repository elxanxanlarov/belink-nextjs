import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PREMIUM_SHOP_TEMPLATES } from "@/data/shopTemplates";
import { getShopDemo, getShopDemoCover } from "@/data/shopDemos";

/** Premium şablonların vitrini: hər kart həmin şablonun nümunə mağazasına aparır. */
export default function TemplatesSection() {
  const templates = PREMIUM_SHOP_TEMPLATES.flatMap((template) => {
    const demo = getShopDemo(template.id);
    const cover = getShopDemoCover(template.id);
    return demo && cover ? [{ template, demo, cover }] : [];
  });
  if (templates.length === 0) return null;

  return (
    <section id="sablonlar" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Mağazanız əsl sayt kimi görünsün
          </h2>
          <p className="text-gray-500 mt-3 text-base leading-relaxed">
            Premium şablonların hər birinin öz quruluşu və rəng seçimləri var. Nümunə mağazaları açın, rəngləri
            dəyişin, sizə uyğun olanı seçin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {templates.map(({ template, demo, cover }, index) => {
            // 2+1 / 1+2 ritmi: hər dördlüyün ilk və son kartı genişdir.
            const isWide = index % 4 === 0 || index % 4 === 3;
            return (
            <Link
              key={template.id}
              href={`/templates/${template.id}`}
              className={`group flex flex-col gap-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1a7a4a] ${
                isWide ? "lg:col-span-2" : ""
              }`}
            >
              <div
                className={`relative w-full overflow-hidden rounded-2xl bg-gray-100 ${
                  isWide ? "aspect-[16/9] lg:aspect-[2/1]" : "aspect-[16/9] lg:aspect-[1/1]"
                }`}
              >
                <Image
                  src={cover}
                  alt={`${demo.shopName} nümunə mağazası`}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-extrabold text-gray-900 text-lg">{template.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">{template.description}</p>
                </div>
                <span className="shrink-0 w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 group-hover:bg-[#1a7a4a] group-hover:border-[#1a7a4a] group-hover:text-white transition-colors duration-200">
                  <ArrowUpRight size={18} />
                </span>
              </div>

              <div className="flex items-center gap-1.5" aria-label={`${template.palettes.length} rəng seçimi`}>
                {template.palettes.map((p) => (
                  <span
                    key={p.id}
                    title={p.name}
                    className="w-5 h-5 rounded-full border border-gray-200"
                    style={{ background: p.accent }}
                  />
                ))}
                <span className="text-xs font-semibold text-gray-500 ml-1.5">Nümunə: {demo.shopName}</span>
              </div>
            </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
