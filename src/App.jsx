import React, { useState, useEffect } from "react";
import "./App.css";
import logo from "../src/assets/logo.jpg";
import { ethers } from "ethers";
import PriceFeed from "../src/artifacts/contracts/HelloWorld.sol/PriceFeed.json";

function App() {
  const [storedPrice, setStoredPrice] = useState("");
  const [selectedPair, setSelectedPair] = useState("");
  const [provider, setProvider] = useState(null);
  const [connectedAddress, setConnectedAddress] = useState("");

  const contractAddress = "0xC37a637F7263f8f2f0cE0fe2B96a8B906944452C";

  useEffect(() => {
    async function connectProvider() {
      // Check if MetaMask is installed
      if (window.ethereum) {
        try {
          // Request account access if needed
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          // Set provider
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(provider);
          // Set connected address
          setConnectedAddress(accounts[0]);
        } catch (error) {
          console.error("Error connecting to Ethereum provider:", error);
        }
      }
    }
    connectProvider();
  }, []);

  const handleChange = (e) => {
    setStoredPrice("");
    setSelectedPair(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (!provider) {
        console.error("Ethereum provider not connected.");
        return;
      }

      let feedid;
      switch (selectedPair) {
        case "BTC/USD":
          feedid = 1;
          break;
        case "ETH/USD":
          feedid = 2;
          break;
        case "LINK/USD":
          feedid = 3;
          break;
        case "BTC/ETH":
          feedid = 4;
          break;
        default:
          return;
      }

      const signer = provider.getSigner();
      const contractWithSigner = new ethers.Contract(
        contractAddress,
        PriceFeed.abi,
        signer
      );

      const transaction = await contractWithSigner.updatePrice(feedid);
      await transaction.wait();
      const latestFetchedPrice = await contractWithSigner.getLastFetchedPrice(
        feedid
      );
      setStoredPrice("$" + parseInt(latestFetchedPrice) / 100000000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="main">
      <div className="container">
        <div className="header">
          {connectedAddress && (
            <p className="connected-address">
              Connected Address: {connectedAddress}
            </p>
          )}
        </div>
        <div className="title">
          <h2>Currency Converter</h2>
        </div>
        <div className="currency-options">
          <select value={selectedPair} onChange={handleChange}>
            <option value="">Select Currency Pair</option>
            <option value="BTC/USD">BTC/USD</option>
            <option value="ETH/USD">ETH/USD</option>
            <option value="LINK/USD">LINK/USD</option>
            <option value="BTC/ETH">BTC/ETH</option>
          </select>
        </div>
        <button className="submit-btn" onClick={handleSubmit}>
          Get Price
        </button>
        <div className="footer">
          {storedPrice && (
            <p className="price-info">
              {selectedPair} Price: <span>{storedPrice}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
