type InstallTarget = "chrome" | "macos";
type InstallPlacement = "hero" | "cta" | "mac_section" | "growth_page";

type InstallClickPayload = {
  target: InstallTarget;
  placement: InstallPlacement;
  targetUrl: string;
};

type Gtag = (
  command: "event",
  eventName: "install_chrome_click" | "download_macos_click",
  params: Record<string, string>,
) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

const eventByTarget: Record<InstallTarget, "install_chrome_click" | "download_macos_click"> = {
  chrome: "install_chrome_click",
  macos: "download_macos_click",
};

const platformByTarget: Record<InstallTarget, string> = {
  chrome: "chrome",
  macos: "macos",
};

export const trackInstallClick = ({ target, placement, targetUrl }: InstallClickPayload) => {
  window.gtag?.("event", eventByTarget[target], {
    event_category: "install",
    event_label: placement,
    placement,
    platform: platformByTarget[target],
    target_url: targetUrl,
    transport_type: "beacon",
  });
};
