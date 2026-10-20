import { useLocation } from 'react-router-dom';
import { localeFromPath } from '@/data/locales.mjs';
import { heroHtml } from '@/data/marketing.mjs';
import { MarketingSection } from './MarketingSection';
export const Hero = () => {
  const { pathname } = useLocation();
  return <MarketingSection html={heroHtml(localeFromPath(pathname))} interactive />;
};
