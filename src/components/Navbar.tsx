import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

import { installUrl } from "@/data/conversion.mjs";
import { getCopy, localeFromPath, localeList, localizedPath, stripLocalePrefix } from "@/data/locales.mjs";
import { trackInstallClick } from "@/lib/analytics";

export const Navbar = () => {
  const { pathname } = useLocation();
  const locale = localeFromPath(pathname);
  const nav = getCopy(locale).nav;
  const homePath = localizedPath("/", locale);
  const rawBase = stripLocalePrefix(pathname);
  const normalizedBase = rawBase === "/" ? "/" : `${rawBase.replace(/\/+$/, "")}/`;
  const switchBase = ["/", "/welcome/", "/uninstall/"].includes(normalizedBase) ? normalizedBase : "/";
  const extensionUrl = installUrl(pathname, "navbar");
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="container max-w-6xl mx-auto">
        <div className="flex items-center justify-between glass rounded-2xl px-3 sm:px-6 py-3">
          <a href={homePath} className="flex items-center gap-2">
            <img src="/app-icon.png?v=20261021" alt="" width={32} height={32} className="w-8 h-8 rounded-lg" />
            <span className="font-display text-sm sm:text-base font-semibold text-foreground">Screen Privacy Blur</span>
          </a>

          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href={`${homePath}#pricing`} className="hover:text-foreground transition-colors">{nav.pricing}</a>
            <Link to="/compare/" className="hover:text-foreground transition-colors">{nav.compare}</Link>
            <a href={`${homePath}#features`} className="hover:text-foreground transition-colors">{nav.features}</a>
            <a href={`${homePath}#how-it-works`} className="hover:text-foreground transition-colors">{nav.howItWorks}</a>
            <a href={`${homePath}#privacy`} className="hover:text-foreground transition-colors">{nav.privacy}</a>
            <Link to="/support/" className="hover:text-foreground transition-colors">{nav.support}</Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a href={`${homePath}#pricing`} className="text-sm text-muted-foreground md:hidden">{nav.pricing}</a>
            <details className="m-lang-menu">
              <summary aria-label={nav.languageLabel}>🌐 {locale.toUpperCase()}</summary>
              <div className="m-lang-list">
                {localeList.map((item) => (
                  <a
                    key={item.code}
                    href={localizedPath(switchBase, item.code)}
                    hrefLang={item.hreflang}
                    aria-current={item.code === locale ? "page" : undefined}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </details>
            <Button asChild variant="default" size="sm" className="group">
              <a
                href={extensionUrl}
                data-install="chrome"
                data-placement="navbar"
                onClick={() => trackInstallClick({ target: "chrome", placement: "navbar", targetUrl: extensionUrl })}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Chrome className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline">{nav.installFree}</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
