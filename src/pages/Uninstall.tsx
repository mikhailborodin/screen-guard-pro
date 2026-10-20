import { useLocation } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MarketingSection } from '@/components/MarketingSection';
import { localeFromPath } from '@/data/locales.mjs';
import { uninstallHtml } from '@/data/retention.mjs';
import { marketingStyles } from '@/data/marketingStyles.mjs';
export default function Uninstall() {
  const { pathname } = useLocation();
  return <main className="min-h-screen bg-background pt-24"><style>{marketingStyles}</style><Navbar /><MarketingSection html={uninstallHtml(localeFromPath(pathname))} /><Footer /></main>;
}
