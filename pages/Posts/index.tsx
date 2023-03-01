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


export default function Posts() {
    const [socialProtocol, setSocialProtocol] = useState<SocialProtocol>();
    const [walletAddress, setWalletAddress] = useState<WalletContextState>();
    const [userInfo, setUserInfo] = useState<User | null>();
    const [status, setStatus] = useState<boolean>(false);
    const [posts, setPosts] = useState<Post[]>();
    const [isFeatured, setIsFeatured] = useState<boolean>(true);

    const solanaWallet = useWallet()
    useEffect(() => {
        setWalletAddress(solanaWallet)
        const initialize = async () => {
            if (walletAddress?.wallet?.adapter?.publicKey) {
                const socialProtocol: SocialProtocol = await new SocialProtocol(
                    solanaWallet,
                    null,
                    options
                ).init()
                setSocialProtocol(socialProtocol)
            }
        }
        initialize()
    }, [solanaWallet, walletAddress])


    return (
        <>
            <div className='bg-[#F8FFE9] w-screen h-screen'>

                <div className='bg-[#F8FFE9] h-max w-screen flex justify-center'>
                    <div className='w-1/4 flex justify-end'>
                        <div className='bg-[#FFFFFF] w-[17%] h-max mt-[96px] border-[#166F00] border-[1px] rounded-[26px] flex flex-col justify-center mr-10 fixed'>
                            <div className='flex w-[100%] mb-2 mt-8'>
                                <div className='flex justify-start w-[100%]'>
                                    <Image src="/FeedActiveIcon.svg" alt="SearchButton" width={30} height={30} className="ml-4"></Image>
                                    <h1 className='text-xl ml-3 text-[#166f00]'>Your Feed</h1>
                                </div>
                                <div className=' flex justify-end w-[10%]'>
                                    <div className='bg-[#166f00] w-1.5 h-8 rounded-tl-md rounded-bl-md'></div>
                                </div>
                            </div>
                            <div className='flex w-[100%] py-2 hover:bg-[#EAEAEA]'>
                                <div className='flex justify-start w-[100%]'>
                                    <Image src="/ExploreIcon.svg" alt="SearchButton" width={30} height={30} className="ml-4"></Image>
                                    <h1 className='text-xl ml-3 text-[#000000]'>Explore</h1>
                                </div>
                            </div>
                            <div className='flex w-[100%] py-2 mb-6 hover:bg-[#EAEAEA]'>
                                <div className='flex justify-start w-[100%]'>
                                    <Image src="/ProfileIcon.svg" alt="SearchButton" width={30} height={30} className="ml-4"></Image>
                                    <h1 className='text-xl ml-3 text-[#000000]'>My Profile</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='w-2/4'>
                        <div className='bg-[#FFFFFF] border-r-[#166f00] border-r-[1px] border-l-[#166f00] border-l-[1px]  w-[100%] h-screen pb-8  flex flex-col'>


                        </div>
                    </div>
                    {/* <div className='w-1/3'>
                        <div className='bg-[#FFFFFF] w-[18%] h-max mt-[96px] border-[#166F00] border-[1px] rounded-[26px] flex flex-col justify-center ml-10 fixed'>
                            <div className='bg-[#FFFFFF] h-fit w-[100%] rounded-t-[26px] border-[#166F00] border-b-[1px]'>
                                <h1 className='text-[#000000] text-lg ml-5 my-3'>Trending</h1>
                            </div>

                            <div className='bg-[#FFFFFF] h-fit w-[100%] flex justify-center items-center rounded-b-[26px] hover:bg-[#EAEAEA]'>
                                <h1 className='text-[#000000] text-lg py-2'>See More...</h1>
                            </div>
                        </div>
                    </div> */}

                    <div className='w-1/4 mt-12 ml-3'>
                        <button className='transition ease-in delay-100 bg-[#166F00] rounded-full h-[30px] w-max-content self-center flex items-center mx-1 hover:bg-[#5f8e53]' onClick={() => window.location.href = "./Posts"}>
                            <Image src="/PenIcon.svg" alt="SearchButton" width={15} height={15} className="ml-7"></Image>
                            <h1 className='text-m ml-1 text-white mr-7'>Write</h1>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}



