/** Mağazanın göstərilən adı: sahib dəyişməyibsə istifadəçi adı (username) götürülür. */
export function getShopTitle(shop: {
  shopName?: string | null;
  username?: string | null;
  name?: string | null;
}): string {
  return shop.shopName?.trim() || shop.username || shop.name || "Mağaza";
}
