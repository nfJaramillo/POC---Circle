
import { Alchemy, Network } from "alchemy-sdk";

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
