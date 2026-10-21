import { seoPages } from "@/data/seoContent.mjs";
import { installUrl } from "@/data/conversion.mjs";
import { getCopy, localeFromPath, localeList, localizedPath, stripLocalePrefix } from "@/data/locales.mjs";
import { trackInstallClick } from "@/lib/analytics";
import { useLocation, Link } from "react-router-dom";

export const Footer = () => {
  const { pathname } = useLocation();
  const locale = localeFromPath(pathname);
  const nav = getCopy(locale).nav;
  const homePath = localizedPath("/", locale);
  const welcomePath = localizedPath("/welcome/", locale);
  const rawBase = stripLocalePrefix(pathname);
  const normalizedBase = rawBase === "/" ? "/" : `${rawBase.replace(/\/+$/, "")}/`;
  const switchBase = ["/", "/welcome/", "/uninstall/"].includes(normalizedBase) ? normalizedBase : "/";
  const footerInstallUrl = installUrl(pathname, "footer");
  return (
    <footer className="py-12 px-4 border-t border-border/50">
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src="/app-icon.png?v=20261021" alt="Screen Privacy Blur logo" width={32} height={32} className="w-8 h-8 rounded-lg" />
            <span className="font-display font-semibold">Screen Privacy Blur</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground md:justify-end">
            <a
              href={footerInstallUrl}
              data-install="chrome"
              data-placement="footer"
              onClick={() => trackInstallClick({ target: "chrome", placement: "footer", targetUrl: footerInstallUrl })}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              {nav.addToChromeFree}
            </a>
            <a href={`${homePath}#pricing`} className="hover:text-foreground">{nav.pricing}</a>
            <Link to="/compare/" className="hover:text-foreground">{nav.compare}</Link>
            <Link to={welcomePath} className="hover:text-foreground">{nav.welcomeSandbox}</Link>
            <Link to="/use-cases/" className="hover:text-foreground transition-colors">{nav.useCases}</Link>
            <Link to="/alternatives/" className="hover:text-foreground transition-colors">{nav.alternatives}</Link>
            <Link to="/privacy-policy/" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms/" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link to="/data-collection/" className="hover:text-foreground transition-colors">Data Collection</Link>
            <Link to="/permissions/" className="hover:text-foreground transition-colors">Permissions</Link>
            <Link to="/support/" className="hover:text-foreground transition-colors">{nav.support}</Link>
          </div>

          <p className="text-sm text-muted-foreground">
            {nav.rights}
          </p>
        </div>
        <nav aria-label="Comparisons and use cases" className="mt-8 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">{seoPages.filter(page => page.group !== "Trust").map(page => <a key={page.path} href={page.path}>{page.title}</a>)}</nav>
        <nav aria-label={nav.languageLabel} className="m-lang-footer mt-6 justify-center">
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
        </nav>
      </div>
    </footer>
  );
};
