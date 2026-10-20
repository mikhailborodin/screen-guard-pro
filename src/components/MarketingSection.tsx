import { useEffect, useRef } from 'react';
import { initializeDemo } from '@/data/marketing.mjs';
import { type InstallPlacement, trackInstallClick } from '@/lib/analytics';

// Markup comes exclusively from our build-time content module, never user input.
export const MarketingSection = ({ html, interactive = false }: { html: string; interactive?: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!interactive || !ref.current) return;
    return initializeDemo(ref.current);
  }, [interactive]);
  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} onClick={(event) => {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[data-install]');
    if (link) trackInstallClick({ target: link.dataset.install === 'macos' ? 'macos' : 'chrome', placement: (link.dataset.placement || 'hero') as InstallPlacement, targetUrl: link.href });
  }} />;
};
