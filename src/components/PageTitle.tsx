import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTitleProps {
  title: string;
}

export const PageTitle = ({ title }: PageTitleProps) => {
  const location = useLocation();

  useEffect(() => {
    document.title = title;

    // Handle NoIndex for Agency pages
    const isAgency = location.pathname.startsWith('/agency');
    let metaRobots = document.querySelector('meta[name="robots"]');

    if (isAgency) {
      if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.setAttribute('name', 'robots');
        document.head.appendChild(metaRobots);
      }
      metaRobots.setAttribute('content', 'noindex, nofollow');
    } else if (metaRobots) {
      // If it's NOT an agency page, remove the tag or set back to indexable
      metaRobots.setAttribute('content', 'index, follow');
    }
  }, [title, location]);

  return null;
};
