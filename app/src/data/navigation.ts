export const navigationItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services", children: [
    { label: "Web Development", href: "/web-development" },
    { label: "AI Solutions", href: "/ai-solutions" },
    { label: "Software Development", href: "/software-development" },
    { label: "Digital Presence", href: "/digital-presence" },
    { label: "Career Services", href: "/career-services" },
    { label: "Training", href: "/training" },
    { label: "Consulting", href: "/consulting" },
    { label: "Maintenance Plans", href: "/maintenance" },
    { label: "Design Services", href: "/design" },
  ] },
  {
    label: "Solutions",
    href: "/services",
  },
  { label: "Training", href: "/training" },
  { label: "Consulting", href: "/consulting" },
  { label: "Contact", href: "/contact" },
];

export const footerLinks = {
  company: [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Solutions", href: "/services" },
    { label: "Training", href: "/training" },
    { label: "Consulting", href: "/consulting" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};
