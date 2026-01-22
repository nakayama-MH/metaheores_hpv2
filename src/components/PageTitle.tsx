import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTitleProps {
  title: string;
}

export const PageTitle = ({ title }: PageTitleProps) => {
  const location = useLocation();

  useEffect(() => {
    document.title = title;
  }, [title, location]);

  return null;
};
