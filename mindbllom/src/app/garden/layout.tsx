// Garden layout: full viewport, no global Header or Footer.
// The Garden is an immersive experience that owns its own UI chrome.

export default function GardenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-black">
      {children}
    </div>
  );
}
