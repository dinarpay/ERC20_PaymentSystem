import React, { useState, useEffect } from 'react';
import Store from './Store.js';
import getBlockchain from './ethereum.js';

function App() {
  const [paymentGateway, setPaymentGateway] = useState(undefined); 
  const [smpT, setsmpT] = useState(undefined); 
  const [pubKey, setPubKey] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const { paymentGateway, smpT } = await getBlockchain();
      setPaymentGateway(paymentGateway);
      setsmpT(smpT);
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      window.ethereum.request({method: 'eth_getEncryptionPublicKey', params: [accounts[0]]}).
        then((result) => {
          setPubKey(result);
        })
        .catch((error) => {
          if (error.code === 4001) {
            // EIP-1193 userRejectedRequest error
            console.log("We can't encrypt anything without the key.");
          } else {
            console.error(error);
          }
        });
    }
    init();
  }, []);

  if(typeof window.ethereum === 'undefined') {
    return (
      <div className='container'>
        <div className='col-sm-1'>
          <h1>ERC20 Tokens Payment Gateway App</h1>
          <p>You need to install the latest version of Metamask to use this app. MEtamask is an Ethereum wallet, available as a Google chrome extension.</p>
          <ul>
            <li>Go to the <a href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn'>Metamask page</a> on the chrome webstore and install it</li>  
            <li>If you already have it installed, uninstall and re-install it</li>
          </ul>
        </div>
      </div>
    );
  }
  
  return (
    <div className='container'>
      <div className='col-sm-12'>
        <h1>ERC20 Tokens Ecommerce App</h1>
        <Store paymentGateway={paymentGateway} smpT={smpT} buyerPubKey={pubKey}/>
      </div>
    </div>
  );
}

export default App;