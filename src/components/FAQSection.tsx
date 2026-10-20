import { useLocation } from 'react-router-dom';
import { faqHtml, faqSchema, getHomeFaqs, homeFaqs } from '@/data/faq.mjs';
import { localeFromPath } from '@/data/locales.mjs';
import { MarketingSection } from './MarketingSection';
export const FAQSection = ({ faqs }: { faqs?: typeof homeFaqs }) => {
  const { pathname } = useLocation();
  const locale = localeFromPath(pathname);
  const items = faqs ?? getHomeFaqs(locale);
  return <>
    <MarketingSection html={faqHtml(items, locale)} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqSchema(items)).replace(/</g,'\\u003c')}} />
  </>;
};
