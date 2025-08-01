// Google Analytics tracking utilities
export const trackEvent = (
  action,
  category = 'General',
  label = '',
  value = 0
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export const trackPageView = (url, title) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.GATSBY_GA_MEASUREMENT_ID, {
      page_title: title,
      page_location: window.location.href,
      page_path: url,
    });
  }
};

export const trackTiming = (
  name,
  value,
  category = 'Performance',
  label = ''
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'timing_complete', {
      name: name,
      value: value,
      event_category: category,
      event_label: label,
    });
  }
};
