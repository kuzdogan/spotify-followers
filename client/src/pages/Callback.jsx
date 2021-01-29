
import React, { useEffect, useState } from 'react';

export default function Callback(props) {
  const [message, setMessage] = useState('');
  const urlParams = new URLSearchParams(window.location.search);

  useEffect(() => {
    if (urlParams.get('error')) {
      setMessage('You did not accept the request, my brother.');
    }
    else {
      const state = urlParams.get('state');
      if (state !== process.env.REACT_APP_STATE) {
        setMessage('OOOPS YOU ARE AN ATTACKER!!!!');
        // window.close();
      }
      else {
        const code = urlParams.get('code');
        setMessage('Thank you for your trust');
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ auth_code: code })
        };
        fetch('http://localhost:3000/authorize', requestOptions)
          .then(() => {
            // window.close();
          });
      }
    }
    // window.close();
    // alert(message);
  });

  return (
    <div>
      <h1>Callback page</h1>
      <p>
        {message}
      </p>
    </div>
  )
}