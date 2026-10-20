import { useLocation } from 'react-router-dom';
import { localeFromPath } from '@/data/locales.mjs';
import { featuresHtml } from '@/data/marketing.mjs';
import { MarketingSection } from './MarketingSection';
export const Features = () => {
  const { pathname } = useLocation();
  return <MarketingSection html={featuresHtml(localeFromPath(pathname))} />;
};
