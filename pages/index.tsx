import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { SocialProtocol } from "@spling/social-protocol";
import { useWallet, WalletContextState } from "@solana/wallet-adapter-react";
import styles from '@/styles/Home.module.css'
import {
  FileData,
  ProtocolOptions,
  User,
  Post,
} from "@spling/social-protocol/dist/types";
import dynamic from "next/dynamic";
import { useEffect, useState } from 'react';
import { Keypair } from '@solana/web3.js';

const inter = Inter({ subsets: ['latin'] })

const options = {
  rpcUrl:
    "https://rpc.helius.xyz/?api-key=07172e08-2375-4358-9ad1-522bd8871a8e",
  useIndexer: true,
} as ProtocolOptions;

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);



const Home = () => {
  const [socialProtocol, setSocialProtocol] = useState<SocialProtocol>();
  const [walletAddress, setWalletAddress] = useState<WalletContextState>();
  const [userInfo, setUserInfo] = useState<User | null>();
  const [status,setStatus] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>();

  const solanaWallet = useWallet();

  useEffect(() => {
    setWalletAddress(solanaWallet);

    const Initialize = async () => {
      if(walletAddress?.wallet?.adapter?.publicKey){
        const socialProtocol : SocialProtocol = await new SocialProtocol(solanaWallet, null, options).init();
        setSocialProtocol(socialProtocol);
        console.log(socialProtocol);
      }
      else{
        const socialProtocol : SocialProtocol = await new SocialProtocol(Keypair.generate(), null, options).init();
        setSocialProtocol(socialProtocol);
        console.log(socialProtocol);
      }
    };

    const userIntitialize = async () => {
      if(walletAddress?.wallet?.adapter?.publicKey){
        const user = await socialProtocol?.getUserByPublicKey(walletAddress?.wallet?.adapter?.publicKey);
        setUserInfo(user);
        console.log(user);
        if(user!==null) setStatus(true)
      }
    };

    const postInitialize = async () => {
      if(socialProtocol !== null && socialProtocol !== undefined){
        const posts = await socialProtocol.getAllPosts(15);
        setPosts(posts);
        console.log(posts);
      }
    };

    Initialize();
    userIntitialize();
    postInitialize();
  }, [solanaWallet]);

  return (
    <>
    <WalletMultiButtonDynamic />
    </>
  )
}

export default Home
