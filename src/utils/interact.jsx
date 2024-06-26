
import { Alchemy, Network } from "alchemy-sdk";
import { v4 as uuidv4 } from 'uuid';
//import * as openpgp from 'openpgp';


const alchemyKey = 'MZOFtJq4vlHU3MlvX7nCWJjtvEijsfDw';
const config = {
  apiKey: alchemyKey,
  network: Network.ETH_SEPOLIA,
};
const alchemy = new Alchemy(config);
//const contractABI = require('../smartContract/contract-abi.json')
const contractAddress = '0x9D4cCb21b17658A7E3220933EE3BeC839f80403c';

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "Billetera conectada"
        ,
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        severity: "error",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      severity: "warning",
      status: (
        <div>
          {" "}
          🦊{" "}
          <a target="_blank" rel="noopener noreferrer" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </div>
      ),
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆🏽 Write a message in the text-field above.",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        severity: "error",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      severity: "warning",
      status: (
        <div>
          {" "}
          🦊{" "}
          <a target="_blank" rel="noopener noreferrer" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </div>
      ),
    };
  }
};

export const checkNFT = async () => {
  try {

    const response = await alchemy.nft.getNftsForOwner(contractAddress, {
      omitMetadata: false,
    });
    //console.log(JSON.stringify(response, null, 2))
    return {
      success: true,
      status: JSON.stringify(response, null, 2)

    }
  } catch (error) {
    return {
      success: false,
      severity: "error",
      status: "😥 Something went wrong: " + error.message
    }
  }
}
export const postCard = async (payLoad) => {

  const pk = await getPublicKey()
  const url = 'https://api-sandbox.circle.com/v1/cards';
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: 'Bearer SAND_API_KEY:9783c9ab8e080ffe216e638f3801134d:90c3892d3eb3bd9a789989d2b370ede2'
    },
    body: JSON.stringify({
      idempotencyKey: uuidv4(),
      keyId: pk.data.keyId,
      encryptedData: 'LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tCgp3Y0JNQTBYV1NGbEZScFZoQVFmL2J2bVVkNG5LZ3dkbExKVTlEdEFEK0p5c0VOTUxuOUlRUWVGWnZJUWEKMGgzQklpRFNRU0RMZmI0NEs2SXZMeTZRbm54bmFLcWx0MjNUSmtPd2hGWFIrdnNSMU5IbnVHN0lUNWJECmZzeVdleXlNK1JLNUVHV0thZ3NmQ2tWamh2NGloY29xUnlTTGtJbWVmRzVaR0tMRkJTTTBsTFNPWFRURQpiMy91eU1zMVJNb3ZiclNvbXkxa3BybzUveWxabWVtV2ZsU1pWQlhNcTc1dGc1YjVSRVIraXM5ckc0cS8KMXl0M0FOYXA3UDhKekFhZVlyTnVNZGhGZFhvK0NFMC9CQnN3L0NIZXdhTDk4SmRVUEV0NjA5WFRHTG9kCjZtamY0YUtMQ01xd0RFMkNVb3dPdE8vMzVIMitnVDZKS3FoMmtjQUQyaXFlb3luNWcralRHaFNyd3NKWgpIdEphQWVZZXpGQUVOaFo3Q01IOGNsdnhZVWNORnJuNXlMRXVGTkwwZkczZy95S3loclhxQ0o3UFo5b3UKMFVxQjkzQURKWDlJZjRBeVQ2bU9MZm9wUytpT2lLall4bG1NLzhlVWc3OGp1OVJ5T1BXelhyTzdLWTNHClFSWm8KPXc1dEYKLS0tLS1FTkQgUEdQIE1FU1NBR0UtLS0tLQo',
      billingDetails: {
        name: payLoad.fullName,
        city: payLoad.city,
        country: payLoad.country,
        line1: payLoad.addressLine,
        district: payLoad.district,
        postalCode: payLoad.postalCode
      },
      expMonth: payLoad.expiryMonth,
      expYear: payLoad.expiryYear,
      metadata: {
        email: payLoad.email,
        phoneNumber: payLoad.phone,
        sessionId: 'DE6FA86F60BB47B379307F851E238617',
        ipAddress: '244.28.239.130'
      }
    })
  };

  const resp = await fetch(url, options)
  const card = await resp.json()
  postPayment(card, payLoad)

}

const getPublicKey = async () => {

  const url = 'https://api-sandbox.circle.com/v1/encryption/public';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: 'Bearer SAND_API_KEY:9783c9ab8e080ffe216e638f3801134d:90c3892d3eb3bd9a789989d2b370ede2'
    }
  };

  const resp = await fetch(url, options)
  return await resp.json()
}

export const postPayment = async (card, payLoad) => {
  console.log(card)

  const pk = await getPublicKey()
  const url = 'https://api-sandbox.circle.com/v1/payments';
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json', 'content-type': 'application/json',
      authorization: 'Bearer SAND_API_KEY:9783c9ab8e080ffe216e638f3801134d:90c3892d3eb3bd9a789989d2b370ede2'
    },
    body: JSON.stringify({
      idempotencyKey: uuidv4(),
      keyId: pk.data.keyId,
      metadata: {
        email: payLoad.email,
        phoneNumber: payLoad.phone,
        sessionId: 'xxx',
        ipAddress: '244.28.239.130'
      },
      amount: { amount: payLoad.price, currency: 'USD' },
      autoCapture: true,
      verification: 'none',
      verificationSuccessUrl: 'https://www.example.com/3ds/verificationsuccessful',
      verificationFailureUrl: 'https://www.example.com/3ds/verificationfailure',
      source: { id: card.data.id, type: 'card' },
      description: '',
      channel: ''
    })
  };

  const resp = await fetch(url, options)
  const payment = await resp.json()
  postPayout(payment, payLoad)

}


export const postPayout = async (payment, payLoad) => {
  console.log(payment)


  const url = 'https://api-sandbox.circle.com/v1/payouts';
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: 'Bearer SAND_API_KEY:9783c9ab8e080ffe216e638f3801134d:90c3892d3eb3bd9a789989d2b370ede2'
    },
    body: JSON.stringify({
      idempotencyKey: uuidv4(),
      destination: { type: 'address_book', id: 'ebd0408d-a809-544f-a3f2-eb3b88a288c7' },
      amount: { amount: payLoad.price, currency: 'USD' },
      toAmount: { currency: 'USD' }
    })
  };

  fetch(url, options)
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.error('error:' + err));

}