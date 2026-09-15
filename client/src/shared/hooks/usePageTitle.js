import { useEffect } from 'react';
import { makePageTitle } from '@/shared/lib/helpers';

export function usePageTitle(title) {
  useEffect(() => {
    document.title = makePageTitle(title);
  }, [title]);
}
