import { demoHtml } from '@/data/marketing.mjs';
import { MarketingSection } from './MarketingSection';
const html = demoHtml();
export const BlurDemo = () => <MarketingSection html={html} interactive />;
