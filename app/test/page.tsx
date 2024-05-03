'use client';

import { useState } from 'react';


export default function Page() {
  const [count, setCount] = useState(0)


  return (
    <div className="m-20">
      <button className="bg-red-400 border-blue-100" onClick={() => setCount(count + 1)}>add {count}</button>
    </div>
  )
}

