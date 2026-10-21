import type { ShopCategory, ShopPageData, ShopProduct } from "@/types";

// Şablon önbaxışlarında göstərilən nümunə mağazalar. Şəkillər public/demo qovluğundadır.

function demoShop(
  templateId: string,
  shop: Pick<ShopPageData, "shopName" | "bio" | "banners"> & { instagram: string },
  categories: string[],
  products: [title: string, price: number, image: string, categoryIndex: number, description: string][]
): ShopPageData {
  const cats: ShopCategory[] = categories.map((name, i) => ({ id: `${templateId}-cat-${i}`, name }));
  const items: ShopProduct[] = products.map(([title, price, image, categoryIndex, description], i) => ({
    id: `${templateId}-product-${i}`,
    title,
    price,
    imageUrl: `/demo/${image}.jpg`,
    images: [`/demo/${image}.jpg`],
    description,
    categoryId: cats[categoryIndex].id,
    category: cats[categoryIndex],
  }));

  return {
    id: `demo-${templateId}`,
    username: `demo-${templateId}`,
    name: shop.shopName,
    shopName: shop.shopName,
    bio: shop.bio,
    image: null,
    whatsappPhone: null,
    instagram: shop.instagram,
    banners: shop.banners.map((b) => `/demo/${b}.jpg`),
    products: items,
  };
}

const SHOP_DEMOS: Record<string, ShopPageData> = {
  boutique: demoShop(
    "boutique",
    {
      shopName: "Nar Atelye",
      bio: "Şəkidə əl ilə hazırlanan keramika, soya şamları və hədiyyə dəstləri. Bakı daxilində 24 saata çatdırılma.",
      banners: ["nar-banner", "nar-banner-2"],
      instagram: "nar.atelye",
    },
    ["Keramika", "Şamlar", "Hədiyyə dəstləri"],
    [
      ["Əl işi fincan dəsti", 46.5, "nar-fincan", 0, "Dörd ədəd şirlənmiş gil fincan. Hər biri fərqli naxışla bişirilir."],
      ["Dəniz mavisi boşqablar", 72, "nar-boshqab", 0, "Altı nəfərlik boşqab dəsti, qabyuyan maşına davamlıdır."],
      ["Tutqun gil vaza", 38, "nar-vaza", 0, "Quru çiçəklər üçün dar boğazlı, 24 sm hündürlükdə vaza."],
      ["Vanil və sidr şamı", 19.9, "nar-sham", 1, "Soya mumu, pambıq fitil, təxminən 40 saat yanma müddəti."],
      ["Darçınlı qış şamı", 21.5, "nar-sham-2", 1, "Şüşə qabda, taxta qapaqla. Darçın və portağal qabığı ətri."],
      ["Bayram hədiyyə qutusu", 64, "nar-hediyye", 2, "Fincan, şam və əl ilə yazılmış təbrik kartı bir qutuda."],
    ]
  ),
  noir: demoShop(
    "noir",
    {
      shopName: "Zərif Zərgərlik",
      bio: "Sifarişlə hazırlanan üzüklər, mirvari boyunbağılar və saatlar. Hər məmulat sertifikatla təqdim olunur.",
      banners: ["zer-banner"],
      instagram: "zerif.zergerlik",
    },
    ["Üzüklər", "Boyunbağılar", "Sırğa və qolbaqlar", "Saatlar"],
    [
      ["Brilyant qaşlı üzük", 1840, "zer-uzuk", 0, "0.7 karat mərkəzi daş, ağ qızıl çərçivə. Ölçü sifarişə görə uyğunlaşdırılır."],
      ["Təbii mirvari boyunbağı", 615, "zer-mirvari", 1, "7 mm şirin su mirvarisi, gümüş qıfıl. Uzunluq 45 sm."],
      ["Sapfir sırğalar", 428, "zer-sirga", 2, "Damla formalı mavi daşlar, əl ilə düzülmüş kristal çərçivə."],
      ["Qızılı hörmə qolbaq", 372, "zer-qolbaq", 2, "Çəhrayı qızıl örtük, tənzimlənən qıfıl."],
      ["Ağ keramik saat", 289, "zer-saat", 3, "Kvars mexanizm, sapfir şüşə, silikon kəmər."],
    ]
  ),
  minimal: demoShop(
    "minimal",
    {
      shopName: "Sadə",
      bio: "Gündəlik geyim üçün az, amma uzunömürlü parçalar. Bakıda tikilir, kiçik partiyalarla satılır.",
      banners: [],
      instagram: "sade.geyim",
    },
    ["Üst geyim", "Köynək və hudi", "Aksesuar"],
    [
      ["Kərpic rəngli bomber", 119, "sade-godekce", 0, "Suya davamlı parça, iki daxili cib. Ölçülər: S, M, L, XL."],
      ["Toxunma ponço", 84, "sade-ponco", 0, "Pambıq iplikdən əl toxuması, saçaqlı ətək."],
      ["Ağ pambıq köynək", 27.5, "sade-koynek", 1, "220 qramlıq sıx pambıq, yuyulduqdan sonra formasını saxlayır."],
      ["Boz hudi", 68, "sade-hudi", 1, "İçi yumşaq astarlı, geniş kapüşon."],
      ["Şəhər bel çantası", 92, "sade-canta", 2, "15 düymlük noutbuk bölməsi, su keçirməyən fermuar."],
      ["Qara günəş eynəyi", 54, "sade-eynek", 2, "Polarizasiyalı linza, UV400 qoruma."],
    ]
  ),
  mozaika: demoShop(
    "mozaika",
    {
      shopName: "Gülçin Çiçək Evi",
      bio: "Hər səhər yığılan təzə buketlər və sifarişlə bişirilən tortlar. Eyni gün çatdırılma saat 18:00-a qədər.",
      banners: ["gul-banner"],
      instagram: "gulcin.cicek",
    },
    ["Buketlər", "Şirniyyat"],
    [
      ["Bağ gülləri buketi", 58, "gul-buket", 0, "Qızılgül, pion və evkalipt. Kağız bükümdə, lentlə."],
      ["Çəhrayı lalələr", 34.5, "gul-lale", 0, "On beş ədəd Hollandiya laləsi."],
      ["Ürək formalı kompozisiya", 76, "gul-urek", 0, "Qarışıq mövsümi çiçəklərdən qutu kompozisiyası."],
      ["Şokoladlı tort", 49, "gul-tort", 1, "Belçika şokoladı və kakao kremi, 1.2 kq."],
      ["Çiyələkli kapkeyklər", 22.8, "gul-kapkeyk", 1, "Altı ədəd, təzə çiyələk və vanil kremi ilə."],
    ]
  ),
};

export function getShopDemo(templateId: string): ShopPageData | null {
  return SHOP_DEMOS[templateId] ?? null;
}

/** Şablon kartlarında göstərilən üz şəkli. */
export function getShopDemoCover(templateId: string): string | null {
  const demo = SHOP_DEMOS[templateId];
  return demo ? (demo.banners[0] ?? demo.products[0]?.imageUrl ?? null) : null;
}
