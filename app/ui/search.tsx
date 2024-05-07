'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  const router = useRouter() // for mannipulate the current pathname
  const searchParams = useSearchParams() // get the readonly search params value
  const pathname = usePathname() // get the current pathname

  const handleSearch = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target?.value
    console.log('search for ', inputValue, '...')
    const searchQuery = new URLSearchParams(searchParams)
    searchQuery.set('page', '1')
    if (!inputValue.replace(/\s/g, ''))
      searchQuery.delete('query')
    else
      searchQuery.set('query', inputValue)

    // modify the current url -> pathname
    router.replace(`${pathname}?${searchQuery.toString()}`)

  }, 300)

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={handleSearch}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
