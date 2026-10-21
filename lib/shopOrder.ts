export function cleanWhatsappPhone(phone?: string | null): string {
  return (phone || "").replace(/[^0-9]/g, "");
}

export function buildWhatsappUrl(phone: string | null | undefined, message: string): string {
  const cleanPhone = cleanWhatsappPhone(phone);
  const text = encodeURIComponent(message);
  return cleanPhone ? `https://wa.me/${cleanPhone}?text=${text}` : `https://wa.me/?text=${text}`;
}

export function buildSingleOrderUrl(
  product: { title: string; price: number },
  username: string | null | undefined,
  phone: string | null | undefined
): string {
  return buildWhatsappUrl(
    phone,
    `Salam! "${product.title}" məhsulu haqqında sifariş vermək istəyirəm.\n\nQiymət: ${product.price} AZN\nMağaza: belink.az/${username}`
  );
}
