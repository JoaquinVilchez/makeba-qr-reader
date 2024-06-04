import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('https://venti.com.ar/evento/makeba-15-de-junio');
  }, []);

  return null;
};

export default Page;