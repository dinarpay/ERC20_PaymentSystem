const SampleToken = artifacts.require('SampleToken.sol');
const PaymentGateway = artifacts.require('PaymentGateway.sol');

module.exports = async function (deployer, network, addresses) {
    const[seller, payer, _] = addresses;

    console.log('seller: '+seller);
    console.log('payer: '+payer);
    
    console.log(network);
    if(network ==='develop'){
        await deployer.deploy(SampleToken);
        const smp = await SampleToken.deployed();
        await smp.faucet(payer, web3.utils.toWei('10000'));
        console.log('payer balance: '+ await smp.balanceOf(payer));
        console.log('smp contract address: '+smp.address);

        await deployer.deploy(PaymentGateway, seller, smp.address);
    } else{
        const SELLER_ADDRESS = '';
        const SMP_ADDRESS = '';
        await deployer.deploy(PaymentGateway, SELLER_ADDRESS, SMP_ADDRESS);
    }
};
