import { ethers, Contract } from 'ethers';
import PaymentGateway from './contracts/PaymentGateway.json';
import SmpT from './contracts/SampleToken.json';

const getBlockchain = () =>
  new Promise((resolve, reject) => {
    window.addEventListener('load', async () => {
      if(window.ethereum) {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();

        const paymentGateway = new Contract(
            PaymentGateway.networks[window.ethereum.networkVersion].address,
            PaymentGateway.abi,
            signer
        );

        const smpT = new Contract(
            SmpT.networks[window.ethereum.networkVersion].address,
            SmpT.abi,
            signer
        );
        resolve({provider, paymentGateway, smpT});
      }
      resolve({provider: undefined, paymentGateway: undefined, smpT: undefined});
    });
  });

export default getBlockchain;