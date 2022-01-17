const Koa = require('koa');
const Router = require('@koa/router');
const cors = require('@koa/cors');
const ethers = require('ethers');
const PaymentGateway = require('../frontend/src/contracts/PaymentGateway.json');
const { Payment } = require('./db.js');
const ethUtil = require('ethereumjs-util');
const sigUtil = require('@metamask/eth-sig-util');
//import * as sigUtil from "eth-sig-util";

const app = new Koa();
const router = new Router();

const items = {
  '1': {id: 1, url: 'http://UrlToDownloadItem1'},
  '2': {id: 2, url: 'http://UrlToDownloadItem2'}
};


//generate a paymentId for purchage
router.get('/api/getPaymentId/:itemId/:buyerPubKey', async (ctx, next) => {
  if(ctx.params.buyerPubKey.length == 0){
    ctx.body = {
    }
  }
  //1. generate paymentId randomly
  const paymentId = (Math.random() * 10000).toFixed(0);
  //2. save paymentId + itemId in mongo 
  await Payment.create({
    id: paymentId,
    itemId: ctx.params.itemId, 
    paid: false,
    buyerPubKey: ctx.params.buyerPubKey
  });
  //3. return paymentId to sender
  ctx.body = {
    paymentId
  }
});

//get the url to download an item purchased
router.get('/api/getItemUrl/:paymentId', async (ctx, next) => {
  //1. verify paymentId exist in db and has been paid
  const payment = await Payment.findOne({id: ctx.params.paymentId});
  var encryptionPublicKey = payment.buyerPubKey;
  var url = items[payment.itemId].url;

  const encryptedMessage = ethUtil.bufferToHex(
    Buffer.from(
      JSON.stringify(
        sigUtil.encrypt({publicKey: encryptionPublicKey,
          data: url,
          version: 'x25519-xsalsa20-poly1305'}
        )
      ),
      'utf8'
    )
  );

  //2. return url to download item
  if(payment && payment.paid === true) {
    ctx.body = encryptedMessage;
  } else {
    ctx.body = encryptedMessage;
  }
});

app
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(4000, () => {
  console.log('Server running on port 4000');
});

const listenToEvents = () => {
  const provider = new ethers.providers.JsonRpcProvider('http://localhost:7545');
  const networkId = '5777';
  //when connecting to mainnet or public testnets, use this instead
  //const provider = ethers.providers.getDefaultProvider('mainnet | kovan | etc..');
  //const networkId = '1'; //mainnet 
  //const networkId = '42'; //kovan 

  const paymentGateway = new ethers.Contract(
    PaymentGateway.networks[networkId].address,
    PaymentGateway.abi,
    provider
  );
  paymentGateway.on('PaymentDone', async (payer, amount, paymentId, date) => {
    console.log(`New payment received: 
      from ${payer} 
      amount ${amount.toString()} 
      paymentId ${paymentId} 
      date ${(new Date(date.toNumber() * 1000)).toLocaleString()}
    `);
    const payment = await Payment.findOne({id: paymentId.toString()});
    if(payment) {
      payment.paid = true;
      await payment.save();
    }
  });
};
listenToEvents();