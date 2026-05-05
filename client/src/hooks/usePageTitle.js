import { useEffect } from 'react';
import { makePageTitle } from '../utils/helpers';

export function usePageTitle(title) {
  useEffect(() => {
    document.title = makePageTitle(title);
  }, [title]);
}
