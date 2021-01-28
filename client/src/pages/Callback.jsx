
import React, { useEffect, useState } from 'react';

export default function Callback(props) {

  const [count, setCount] = useState(2);
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  useEffect(() => { 
    setTimeout(() => {
      if (count === 0) {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ auth_code: code })
        };

        fetch('http://localhost:3000/authorize', requestOptions)
        .then(response => {
          console.log(response.userId);
        }).then( ()=> {
          window.close();
        });
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