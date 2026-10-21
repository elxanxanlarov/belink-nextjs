import { prisma } from "@/lib/prisma";
import HomeView from "@/components/landing/HomeView";
import type { FeaturedShop } from "@/types";

export const dynamic = "force-dynamic";

async function getFeaturedShops(): Promise<FeaturedShop[]> {
  try {
    const users = await prisma.user.findMany({
      where: { isFeatured: true },
      select: {
        id: true,
        username: true,
        shopName: true,
        name: true,
        image: true,
        bio: true,
        _count: { select: { products: true } },
      },
      orderBy: [{ featuredOrder: "asc" }, { createdAt: "desc" }],
    });

    return users.flatMap((u) =>
      u.username && !u.username.startsWith("pending_")
        ? [
            {
              id: u.id,
              username: u.username,
              shopName: u.shopName,
              name: u.name,
              image: u.image,
              bio: u.bio,
              productCount: u._count.products,
            },
          ]
        : []
    );
  } catch (error) {
    console.error("Featured shops fetch error:", error);
    return [];
  }
}

export default async function Home() {
  const shops = await getFeaturedShops();

  return <HomeView shops={shops} />;
}
