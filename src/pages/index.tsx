import Head from 'next/head'

import { useState } from "react";
import { Toaster } from 'react-hot-toast';
import { useWallet } from "@solana/wallet-adapter-react";
import useCandyMachine from '../hooks/use-candy-machine';
import Header from '../components/header';
import Footer from '../components/footer';
import useWalletBalance from '../hooks/use-wallet-balance';
import { shortenAddress } from '../utils/candy-machine';
import Countdown from 'react-countdown';
import styled from "styled-components";
import { Button} from "@material-ui/core";
import { pink } from '@material-ui/core/colors';

const MintButton = styled(Button)`padding:10px`;

const Home = () => {
  const [balance] = useWalletBalance()
  const [isActive, setIsActive] = useState(false);
  const wallet = useWallet();
  const [mintCount, setmintCount] = useState(1);


  const { isSoldOut, mintStartDate, isMinting, onMint, onMintMultiple, nftsData } = useCandyMachine()

  return (
    <main className="p-5">
      <Toaster />
      <Head>
        <title>ElonWoof Mint</title>
        <link rel="icon" href="/ElonWoof.png" />
      </Head>

      <Header />

      <div className="flex flex-col justify-center items-center flex-1 space-y-3 mt-20">
        <img
          className="rounded-md shadow-lg"
          src={`/ElonWoof.png`}
          height={200}
          width={200}
          alt="Candy Image" />

        <span className="text-gray-800 font-bold text-2xl cursor-default">
          MINT ELONWOOF NFT 0.15 Each
        </span>

        {!wallet.connected && <span
          className="text-gray-800 font-bold text-2xl cursor-default">
          NOT CONNECTED, PLEASE CLICK SELECT WALLET...
        </span>}

        {wallet.connected &&
          <p className="text-gray-800 font-bold text-lg cursor-default">Address: {shortenAddress(wallet.publicKey?.toBase58() || "")}</p>
        }

        {wallet.connected &&
          <>
            <p className="text-gray-800 font-bold text-lg cursor-default">Balance: {(balance || 0).toLocaleString()} SOL</p>
            <p className="text-gray-800 font-bold text-lg cursor-default">Available/Minted/Total: {nftsData.itemsRemaining}/{nftsData.itemsRedeemed}/{nftsData.itemsAvailable}</p>
          </>
        }
        <span className="text-gray-800 font-bold text-2xl cursor-default">
          Mint Count
        </span>
        

        <div className="flex flex-col justify-start items-start">
        {wallet.connected && 
          <div style={{margin: "auto"}}>
          <MintButton id="plus" style={{backgroundColor:'#F0F8FF', margin: '10px'  }} onClick={() => mintCount>1 && setmintCount(mintCount-1)}>-</MintButton>
           {mintCount}
          <MintButton id="plus" style={{backgroundColor:'#F0F8FF', margin: '10px'  }} onClick={() => setmintCount(mintCount+1)}>+</MintButton> 
          
          <MintButton
              disabled={isSoldOut || isMinting || !isActive}
              onClick={() => onMintMultiple(mintCount)}
              style={{backgroundColor:'#F0F8FF', margin: '10px' }}
            >
              {isSoldOut ? (
                "SOLD OUT"
              ) : isActive ?
                <span>MINT {isMinting && 'LOADING...'}</span> :
                <Countdown
                  date={mintStartDate}
                  onMount={({ completed }) => completed && setIsActive(true)}
                  onComplete={() => setIsActive(true)}
                  renderer={renderCounter}
                />
              }
            </MintButton>  
        </div>}
        <div className="container list text-center">
        {/* <div className="listtext"> */}
        <dl className="row">
          <h1 className="h1-800 font-bold text-2xl cursor-default"> Project Description</h1>
          <br></br>
          <p className="lead">500 exclusive, hand-mand Elon Woof NFTs minting for only 0.15 Solana. Elon Woof is the son of Shiba Inu and Elon Musk, the newest memetoken in 
            the Solana blockchain. The goal of the NFT is to provide liquidity for the EWOOF Token's pool. 50% of the money raised from the sales of the 
          NFTs will be used to provide liquidity to the pool.  <br></br> <strong>NFT holders will receive weekly Elon Woof airdrops.</strong> </p>
          
          <br></br>
          <br></br>
          <dt className="col-sm-3 text-xl" >Price: 0.15 Solana</dt>
          {/* <dd className="col-sm-9">0.15 Solana</dd> */}

          <dt className="col-sm-3 text-xl">Quantity: 500</dt>
          {/* <dd className="col-sm-9 ">  500  </dd> */}
          <br></br>
          <br></br>
          <dt className="col-sm-3 font-bold">Utility</dt>
          <dd className="col-sm-9 "> NFT holders will receive weekly airdrops of EWOOF Token </dd>
          <br></br>
          <br></br>
          <dt className="col-sm-3 font-bold">Liquidity</dt>
          <dd className="col-sm-9 "> 50% of the money generated from the NFT sales will be used to provide liquidity for the Elon Woof Token  </dd>
          

        </dl>
      </div>

      </div>
    </div>
    </main>
  );
};

const renderCounter = ({ days, hours, minutes, seconds }: any) => {
  return (
    <span className="text-gray-800 font-bold text-2xl cursor-default">
      Live in {days} days, {hours} hours, {minutes} minutes, {seconds} seconds
    </span>
  );
};

export default Home;



