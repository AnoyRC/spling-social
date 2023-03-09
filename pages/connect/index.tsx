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
        "https://rpc.helius.xyz/?api-key=002d43b6-4f76-47c2-b4e1-9c87c9a6e3d2",
    useIndexer: true,
} as ProtocolOptions;

const WalletMultiButtonDynamic = dynamic(
    async () =>
        (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
);


export default function ConnectPage() {



    const [socialProtocol, setSocialProtocol] = useState<SocialProtocol>();
    const [walletAddress, setWalletAddress] = useState<WalletContextState>();
    const [userInfo, setUserInfo] = useState<User | null>();
    const solanaWallet = useWallet();


    useEffect(() => {
        setWalletAddress(solanaWallet);

        const initialize = async () => {
            if (walletAddress?.wallet?.adapter?.publicKey) {
                const socialProtocol: SocialProtocol = await new SocialProtocol(
                    solanaWallet,
                    null,
                    options
                ).init();
                setSocialProtocol(socialProtocol);
                if (!userInfo) {
                  await socialProtocol
                    .getUserByPublicKey(
                      walletAddress?.wallet?.adapter?.publicKey
                    )
                    .then((user) => {
                      console.log(user);
                      setUserInfo(user)
                      if (user) {
                        window.location.href = "/";
                      } else {
                        window.location.href = "./createuser";
                      }
                    });
                }
            }
        };
        initialize();
    }, [solanaWallet]);
    return (

        <div className='w-full h-screen  bg-[#F8FFE9]'>
            <div className=' flex justify-center items-center flex-col h-screen '>
                <div className='border-[#166F00] border-[1px] rounded-[26px] flex p-16 flex-col bg-white'>
                    <Image src="./AccountIcon.svg" alt='AccountIcon'  width={240} height={240} className="self-center"/>
                    <div className='items-center flex justify-center pt-3'><WalletMultiButtonDynamic /></div>
                    
                    <p className="text-center font-[Quicksand] text-[#000000]">
                        Step into the community of solana devs
                    </p>
                </div>

            </div>

        </div>
    )
}