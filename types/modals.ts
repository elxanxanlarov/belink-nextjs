export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface AuthModalProps extends BaseModalProps {
  onOpenTerms?: () => void;
}

export interface ModalSection {
  heading: string;
  text: string;
}

export interface PolicyModalData {
  title: string;
  lastUpdated: string;
  sections: ModalSection[];
}

export interface ContactItem {
  type: string;
  value: string;
  href?: string;
  description: string;
}

export interface ContactModalData {
  title: string;
  subtitle: string;
  contacts: ContactItem[];
}

export interface ImagePreviewModalProps extends BaseModalProps {
  imageUrl: string;
  altText?: string;
}

