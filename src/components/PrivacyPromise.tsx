import { useLocation } from 'react-router-dom';
import { localeFromPath } from '@/data/locales.mjs';
import { trustHtml } from '@/data/marketing.mjs';
import { MarketingSection } from './MarketingSection';
export const PrivacyPromise = () => {
  const { pathname } = useLocation();
  return <MarketingSection html={trustHtml(localeFromPath(pathname))} />;
};
