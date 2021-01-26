
import React, { useEffect, useState } from 'react';

export default function Callback(props) {

  const [count, setCount] = useState(5);
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  useEffect(() => {
    setTimeout(() => {
      if (count === 0) {
        window.close()
      } else {
        setCount(prevCount => prevCount - 1)
      }
      console.log(count)
    }, 1000)
  }, [count])

  // TODO: User reject ederse error param geliyor. O zaman da kapat.
  // TODO: kodu backende yolla ve kapa.
  return (
    <div>
      <h1>Callback page</h1>
      <h2>Countdown</h2>
      <h3>{count}</h3>
      <p>
        Code is {code}
      </p>
    </div>
  )
}