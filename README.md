# ERC20 Payment System
<div id="top"></div>


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

![Payment Ovewrview][payment-overview]

This is a basic online payment systme based on ERC20 tokens. 

In order to implement it, we used a sample ERC20 token (SMP) as the payment currency. Thanks to ERC20 standards, SMP token can simple change to any ERC20 such as USDT, USDC, DAI etc.

It can be assumed that the system has 3 different layers: blockchain layer, backend and frontend. 

On blockchain side, we has 3 contracts. One is Sampmle ERC20 Token itself, the other one is payment contract which works as a payment processor and the other is migration contract for deploying them to ethereum network.

* Frontend connects to user wallet (metamask in this project) and gets account's public key to share with the backend. It also requests the product(a link url in this project) and runs the related crypto payment.
* Backend accepts requests for payment with user's public key and creates a payment id to any frontend user. It also listens the payment events and creates encrypted content and sends it to the user.
* Contracts are one time deployed to the network and always be reachable. Once they are deployed, any wallet app can connect it and pay.


<p align="right">(<a href="#top">back to top</a>)</p>



### Built With


* [Node.js](https://nodejs.org/)
* [React.js](https://reactjs.org/)
* [Ethers](https://docs.ethers.io/v5/)
* [Mongoose](https://mongoosejs.com/)
* [Koa](https://koajs.com/)
* [Bootstrap](https://getbootstrap.com)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started
![System Ovewrview][system-overview]

The project runs as follows step-by-step:

* User reaches the page on a browser. 
* Metamask asks for access and shares the user's connected address' public key.
* Then products are listed on UI.
* User chooses one of the products and clicks the buy button.
* UI sends a request to get a paymentID from the server. The request must contain the user's public key.
* Backend server gets the request, creates a random paymentID, and saves it to MongoDB with the user's public key. This step is important to deliver the content safely.
* After getting payment ID specifically generated for the user, the user calls ERC20 token contract's approve function to let Payment Gateway token gets payment. On this step, the Payment Gateway contract has the right to spend tokens in a specified amount on behalf of the user.
* Then user calls Payment Gateway contracts' pay method, which has got the payment authority, to finalize the payment.
* Payment Gateway contract transfers specified amount from user's account to seller account.
* After the transfer function runs, the contract emits the PaymentDone event with payment ID, timestamp, etc. information.
* When Server's event listener catches the PaymentDone event with the specified payment ID, encrypts the content with the buyer's public key, and sends it to the buyer.
* Buyer gets the encrypted data and decrypts it with the private key which was stored by Metamask and finds the bought content.

### Prerequisites

* Metamask should be set up on browser. (https://metamask.io/)
* Ganache is used as the local network. (https://trufflesuite.com/ganache/)

* npm
  ```sh
  npm install npm@latest -g
  ```
 
* Truffle
  ```sh
  npm install -g truffle
  ```

And the rest shuld be installed by following the project imports.




<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Salih Cemil Cetin - [@salihcemil](https://twitter.com/salihcemil) - salihceil@gmail.com

Project Link: [https://github.com/salihcemil/ERC20_PaymentSystem](https://github.com/salihcemil/ERC20_PaymentSystem)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[product-screenshot]: images/main.jpeg
[payment-overview]: images/main.jpg
[system-overview]: images/HL-Overview.png

