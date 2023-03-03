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
import Posts from '@/components/post';
import ShortPost from '@/components/shortPost';

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


const Trending = () => {
  const [socialProtocol, setSocialProtocol] = useState<SocialProtocol>();
  const [walletAddress, setWalletAddress] = useState<WalletContextState>();
  const [userInfo, setUserInfo] = useState<User | null>();
  const [status,setStatus] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>();
  const [trendingPosts, setTrendingPosts] = useState<Post[]>();

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
        const posts = await socialProtocol.getAllPosts(33);
        const trendingPosts = posts.sort((a, b) => b.likes.length - a.likes.length);
        setPosts(trendingPosts);
        console.log(trendingPosts);
        const trendingPostsShort = posts.sort((a, b) => b.likes.length - a.likes.length).slice(0, 3);
        setTrendingPosts(trendingPostsShort)
      }
    };

    Initialize();
    userIntitialize();
    postInitialize();
  }, [solanaWallet]);

  const handlePost = async(text : string) =>{
    if(socialProtocol !== null && socialProtocol !== undefined){
      const posts = await socialProtocol.getAllPosts(33);
      const filteredPosts = posts.filter((post) => post.tags[0].search(text) !== -1);
      setPosts(filteredPosts);
    }
  }

  return (
    <>
      <div className='bg-[#F8FFE9] w-screen h-screen'>
        <div className='bg-[#FFFFFF] border-[#166F00] border-b-[1px] w-screen h-16 fixed z-10'>
          <div className='flex h-full justify-center'>
            <div className='w-1/3'></div>
            <div className='hover:border-[#166F00] focus-within:border-[#166F00] border-[1px] rounded-full flex bg-[#EAEAEA] self-center h-[65%] w-1/3'>
              <Image src="/SearchBtn.svg" alt="SearchButton" width={20} height={20} className="ml-4"></Image>
              <input type="text" placeholder="Search for people or tags" className="bg-[#EAEAEA] w-full font-[Quicksand] h-full rounded-full text-[#8C8C8C] mx-2 focus:outline-none"></input>
              </div>
              <div className='flex w-1/3 justify-center'>
              <button className='transition ease-in delay-100 bg-[#166F00] rounded-full h-[65%] w-24 self-center flex items-center mx-1 hover:bg-[#5f8e53]' onClick={()=>window.location.href="./Posts"}>
                <Image src="/PenIcon.svg" alt="SearchButton" width={15} height={15} className="ml-5"></Image>
                <h1 className='text-m ml-1 text-white font-[Quicksand]'>Write</h1>
              </button>
              <div className='hover:bg-[#F8FFE9] hover:border-[#166F00] hover:border-[1px] bg-[#FFFFFF] rounded-full h-[65%] w-10 self-center flex items-center justify-center ml-1'>
                <Image src="/DarkModeIcon.svg" alt="SearchButton" width={25} height={25} className=""></Image>
              </div>
              <div className='hover:bg-[#F8FFE9] hover:border-[#166F00] hover:border-[1px] bg-[#FFFFFF] rounded-full h-[65%] w-10 self-center flex items-center justify-center ml-1 mr-[10%]'>
                <Image src="/AccountIcon.svg" alt="SearchButton" width={25} height={25} className=""></Image>
              </div>
              </div>
            </div>
        </div>
        <div className='bg-[#F8FFE9] h-max w-screen flex justify-center'>
          <div className='w-1/3 flex justify-end'>
            <div className='bg-[#FFFFFF] w-[17%] h-max mt-[96px] border-[#166F00] border-[1px] rounded-[26px] flex flex-col justify-center mr-10 fixed'>
              <div className='flex w-[100%] py-2 mt-5 pl-2 hover:bg-[#EAEAEA] hover:cursor-pointer' onClick={()=>{window.location.href = '/'}}>
                <div className='flex justify-start w-[100%]'>
                  <Image src="/FeedIcon.svg" alt="SearchButton" width={30} height={30} className="ml-4"></Image>
                  <h1 className='text-xl ml-3 text-[#000000] font-[Quicksand]'>Your Feed</h1>
                </div>
              </div>
              <div className='flex w-[100%] py-2 hover:bg-[#EAEAEA]'>
                <div className='flex justify-start pl-2 w-[100%] hover:cursor-pointer' onClick={()=>{window.location.href = '/explore'}}>
                  <Image src="/ExploreIcon.svg" alt="SearchButton" width={30} height={30} className="ml-4"></Image>
                  <h1 className='text-xl ml-3 text-[#000000] font-[Quicksand]'>Explore</h1>
                </div>
              </div>
              <div className='flex w-[100%] py-2 pl-2 mb-4 hover:bg-[#EAEAEA] hover:cursor-pointer rounded-b-md' onClick={()=>{if(userInfo) window.location.href = `/user/${userInfo?.userId}`}}>
                <div className='flex justify-start w-[100%]'>
                  <Image src="/ProfileIcon.svg" alt="SearchButton" width={30} height={30} className="ml-4"></Image>
                  <h1 className='text-xl ml-3 text-[#000000] font-[Quicksand]'>My Profile</h1>
                </div>
              </div>
            </div>
          </div>
          <div className='w-[638px]'>
            <div className='bg-[#FFFFFF] border-[#166f00] border-[1px] rounded-[26px] w-[100%] h-fit py-5 mt-[96px] flex flex-col justify-center items-center'>
                <h1 className='text-[#000000] font-[QuicksandBold] text-4xl text-center'>#Trending</h1>
                <h1 className='font-[Quicksand] text-[#4e4e4e] text-center mt-2'>Explore the most popular post of our community. A constantly <br/> updating list of popular posts!!</h1>
            </div>
            <div className='bg-[#FFFFFF] border-[#166f00] border-[1px] rounded-[26px] w-[100%] h-fit pb-8 mt-5 flex flex-col'>
              <div className='bg-[#FFFFFF] w-[100%] h-[35px] rounded-t-[26px] border-[#166f00] border-b-[1px] flex'>
              </div>
              <>
              {(posts && posts.map((post,index) => {
                if(post.user.avatar)
                  return <Posts key={index} post={post} socialProtocol={socialProtocol} user = {userInfo} walletAddress = {walletAddress} />})) || 
                  <h1 className='text-[#5E5E5E] italic text-center mt-6'>{`"Touch Some Grass, after you come back you will see some posts here!!"`}</h1>}
              </>
              {posts?.length === 0 && <h1 className='text-[#5E5E5E] italic text-center mt-6'>{`"Touch Some Grass, after you come back you will see some posts here!!"`}</h1>}
            </div>
          </div>
          <div className='w-1/3'>
          <div className='bg-[#FFFFFF] w-[18%] h-max mt-[96px] border-[#166F00] pb-7 border-[1px] rounded-[26px] flex flex-col justify-center ml-10 fixed'>
              <div className='bg-[#FFFFFF] h-fit w-[100%] rounded-t-[26px] border-[#166F00] border-b-[1px]'>
                <h1 className='text-[#000000] text-lg ml-5 my-3 font-[QuicksandLight] font-bold'>Top 3</h1>
              </div>
              <>
                {trendingPosts && trendingPosts.map((post,index) => {
                  if(post.user.avatar) return <ShortPost key={index} post={post} socialProtocol={socialProtocol} user={userInfo} walletAddress={walletAddress}/>
                })}
              </>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Trending