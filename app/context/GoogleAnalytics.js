"use client"; // This component must be a Client Component

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function GoogleAnalyticsInner({ ga_id }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // This effect will run on route changes
  useEffect(() => {
    const url = pathname + searchParams.toString();

    // Check if window.gtag is available (it should be)
    if (window.gtag) {
      window.gtag("config", ga_id, {
        page_path: url,
      });
    }
  }, [pathname, searchParams, ga_id]);

  return (
    <>
      {/* 1. The main GA script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${ga_id}`}
      />

      {/* 2. The inline script to initialize gtag */}
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${ga_id}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

export default function GoogleAnalytics({ ga_id }) {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsInner ga_id={ga_id} />
    </Suspense>
  );
}
