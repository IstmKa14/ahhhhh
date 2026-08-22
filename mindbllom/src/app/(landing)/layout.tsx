// Landing route group layout.
// This layout intentionally does NOT include the global Header or Footer.
// The landing page owns its own Navbar and FooterSection.

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
