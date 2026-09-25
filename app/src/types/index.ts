export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export type ContactInquiryStatus =
  | "NEW"
  | "CONTACTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CLOSED";
