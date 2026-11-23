import { useEffect, useState, type ReactNode } from "react";

const SPLASH_MS = 2400;
const FADE_MS = 500;

export function SplashScreen({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const leaveTimer = window.setTimeout(() => setLeaving(true), SPLASH_MS - FADE_MS);
    const hideTimer = window.setTimeout(() => setVisible(false), SPLASH_MS);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  return (
    <>
      {children}
      {visible ? (
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-ink text-canvas transition-opacity ${
            leaving ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          style={{ transitionDuration: `${FADE_MS}ms` }}
          aria-hidden={leaving}
        >
          <img
            src="/images/properties/hero-home.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,32,29,0.35),rgba(20,32,29,0.92))]" />
          <div className="relative px-6 text-center">
            <p className="splash-rise font-serif text-5xl tracking-tight sm:text-6xl">Letwell</p>
            <p className="splash-rise-delay mt-4 text-sm uppercase tracking-[0.28em] text-canvas/70">
              Homes to rent, calmly
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
