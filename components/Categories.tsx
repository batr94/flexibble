'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { categoryFilters } from '@/constants';

const Categories = () => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category');
  const handleTags = (category: string) => {
    router.push(`${pathName}?category=${category}`);
  };

  return (
    <div className='flexBetween gap-5 w-full flex-wrap'>
      <ul className='flex gap-2 overflow-auto'>
        {categoryFilters.map((category) => (
          <button
            key={category}
            type='button'
            onClick={() => handleTags(category)}
            className={`
              ${category === currentCategory ? 'bg-light-white-300 font-medium' : 'font-normal'}
              px-4 py-3 rounded-lg capitalize whitespace-normal
            `}
          >
            {category}
          </button>
        ))}
      </ul>
    </div>
  )
}

export default Categories