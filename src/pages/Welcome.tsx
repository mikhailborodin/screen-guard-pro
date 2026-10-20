import { useLocation } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MarketingSection } from '@/components/MarketingSection';
import { localeFromPath } from '@/data/locales.mjs';
import { welcomeHtml } from '@/data/marketing.mjs';
import { marketingStyles } from '@/data/marketingStyles.mjs';
export default function Welcome() {
  const { pathname } = useLocation();
  return <main className="min-h-screen bg-background pt-24"><style>{marketingStyles}</style><Navbar /><MarketingSection html={welcomeHtml(localeFromPath(pathname))} interactive /><Footer /></main>;
}
