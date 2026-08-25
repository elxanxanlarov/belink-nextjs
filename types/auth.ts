export interface AuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  username?: string | null;
  shopName?: string | null;
  bio?: string | null;
}

export interface NavbarProps {
  onGoogleClick?: () => void;
  onOpenImagePreview?: (url: string) => void;
}

