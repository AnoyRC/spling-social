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


const Home = () => {
  const [socialProtocol, setSocialProtocol] = useState<SocialProtocol>();
  const [walletAddress, setWalletAddress] = useState<WalletContextState>();
  const [userInfo, setUserInfo] = useState<User | null>();
  const [status,setStatus] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>();
  const [isFeatured, setIsFeatured] = useState<boolean>(true);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>();
  const [personalizedPosts, setPersonalizedPosts] = useState<Post[]>();
  const [loadPersonalized, setLoadPersonalized] = useState<boolean>(false);
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
        setPosts(posts);
        const trendingPosts = posts.sort((a, b) => b.likes.length - a.likes.length).slice(0, 3);
        setTrendingPosts(trendingPosts)
        console.log(posts);
        handlePosts();
      }
    };

    const handlePosts = async() => {
      if(socialProtocol !== null && socialProtocol !== undefined && userInfo !== null && userInfo !== undefined && !loadPersonalized){
        const posts : Post[] = []
        userInfo?.following.forEach(async(userId) => {
          const userPost = await socialProtocol?.getAllPostsByUserId(userId)
          posts.push(...userPost);
        });
        setPersonalizedPosts(posts);
        setLoadPersonalized(true);
        console.log(posts);
      }
    }

    Initialize();
    userIntitialize();
    postInitialize();
  }, [solanaWallet, isFeatured]);

  return (
    <>
      <div className='bg-[#F8FFE9] w-screen h-screen'>
        <div className='bg-[#FFFFFF] border-[#166F00] border-b-[1px] w-screen h-16 fixed'>
          <div className='flex h-full justify-center'>
            <div className='w-1/3'></div>
            <div className='hover:border-[#166F00] focus-within:border-[#166F00] border-[1px] rounded-full flex bg-[#EAEAEA] self-center h-[65%] w-1/3'>
              <Image src="/SearchBtn.svg" alt="SearchButton" width={20} height={20} className="ml-4"></Image>
              <input type="text" placeholder="Search for people or tags" className="bg-[#EAEAEA] w-full h-full rounded-full text-[#8C8C8C] mx-2 focus:outline-none"></input>
              </div>
              <div className='flex w-1/3 justify-center'>
              <button className='transition ease-in delay-100 bg-[#166F00] rounded-full h-[65%] w-24 self-center flex items-center mx-1 hover:bg-[#5f8e53]' onClick={()=>window.location.href="./Posts"}>
                <Image src="/PenIcon.svg" alt="SearchButton" width={15} height={15} className="ml-5"></Image>
                <h1 className='text-m ml-1 text-white'>Write</h1>
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
              <div className='flex w-[100%] mb-2 mt-8'>
                <div className='flex justify-start w-[100%]'>
                  <Image src="/FeedActiveIcon.svg" alt="SearchButton" width={30} height={30} className="ml-4"></Image>
                  <h1 className='text-xl ml-3 text-[#166f00]'>Your Feed</h1>
                </div>
                <div className=' flex justify-end w-[10%]'>
                  <div className='bg-[#166f00] w-1.5 h-8 rounded-tl-md rounded-bl-md'></div>
                </div>
              </div>
              <div className='flex w-[100%] py-2 hover:bg-[#EAEAEA] hover:cursor-pointer' onClick={()=>{window.location.href = '/explore'}}>
                <div className='flex justify-start w-[100%]'>
                  <Image src="/ExploreIcon.svg" alt="SearchButton" width={30} height={30} className="ml-4"></Image>
                  <h1 className='text-xl ml-3 text-[#000000]'>Explore</h1>
                </div>
              </div>
              <div className='flex w-[100%] py-2 mb-6 hover:bg-[#EAEAEA] hover:cursor-pointer' onClick={()=>{if(userInfo) window.location.href = `/user/${userInfo?.userId}`}}>
                <div className='flex justify-start w-[100%]'>
                  <Image src="/ProfileIcon.svg" alt="SearchButton" width={30} height={30} className="ml-4"></Image>
                  <h1 className='text-xl ml-3 text-[#000000]'>My Profile</h1>
                </div>
              </div>
            </div>
          </div>
          <div className='w-[638px]'>
            <div className='bg-[#FFFFFF] border-[#166f00] border-[1px] rounded-[26px] w-[100%] h-fit pb-8 mt-[96px] flex flex-col'>
              <div className='bg-[#FFFFFF] w-[100%] h-[50px] rounded-t-[26px] border-[#166f00] border-b-[1px] flex'>
               {isFeatured && (<><div className='flex flex-col justify-center'>
                  <div className='flex items-center ml-7 h-[100%]'>
                    <Image src="/FeaturedActiveIcon.svg" alt="Featured" width={16} height={16} ></Image>
                    <h1 className='text-[#166f00] ml-2 text-lg'>Featured</h1>
                  </div>
                  <div className='bg-[#166f00] justify-end flex flex-col w-[80%] h-[4px] self-center rounded-t-md ml-7'></div>
                </div>
                <div className='flex items-center ml-5 pb-1 px-2 hover:bg-[#EAEAEA]' onClick={()=>{if(userInfo) setIsFeatured(false)}}>
                  <Image src="/PersonalizedIcon.svg" alt="Personalized" width={13} height={13} ></Image>
                  <h1 className='text-[#000000] ml-2 text-lg'>Personalized</h1>
                </div></>) || 
                <>
                <div className='flex items-center ml-5 pb-1 px-2 hover:bg-[#EAEAEA]' onClick={()=>{setIsFeatured(true)}}>
                  <Image src="/FeaturedIcon.svg" alt="Featured" width={16} height={16} ></Image>
                  <h1 className='text-[#000000] ml-2 text-lg'>Featured</h1>
                </div>
                <div className='flex flex-col justify-center'>
                <div className='flex items-center ml-5 h-[100%]'>
                  <Image src="/PersonalizedActiveIcon.svg" alt="Personalized" width={13} height={13} className='mb-[0.5px]' ></Image>
                  <h1 className='text-[#166f00] ml-2 text-lg'>Personalized</h1>
                </div>
                <div className='bg-[#166f00] justify-end flex flex-col w-[85%] h-[4px] self-center rounded-t-md ml-7'></div>
              </div></>}
              </div>
              <>
              {isFeatured && (posts && posts.map((post,index) => {
                if(post.user.avatar)
                  return <Posts key={index} post={post} socialProtocol={socialProtocol} user = {userInfo} walletAddress = {walletAddress} />}))}
              </>
              {isFeatured && posts?.length === 0 && <h1 className='text-[#5E5E5E] italic text-center mt-6'>{`"Touch Some Grass, after you come back you will see some posts here!!"`}</h1>}

              <>
              {!isFeatured && loadPersonalized && (personalizedPosts && personalizedPosts.map((post,index) => {
                if(post.user.avatar)
                  return <Posts key={index} post={post} socialProtocol={socialProtocol} user = {userInfo} walletAddress = {walletAddress} />}))}
              </>
              {!isFeatured && !loadPersonalized && <h1 className='text-[#5E5E5E] italic text-center mt-6'>{`"Loading..."`}</h1>}
              {!isFeatured && loadPersonalized && personalizedPosts?.length === 0 && <h1 className='text-[#5E5E5E] italic text-center mt-6'>{`"Guess What, You follow noone !!"`}</h1>}

            </div>
          </div>
          <div className='w-1/3'>
            <div className='bg-[#FFFFFF] w-[18%] h-max mt-[96px] border-[#166F00] border-[1px] rounded-[26px] flex flex-col justify-center ml-10 fixed'>
              <div className='bg-[#FFFFFF] h-fit w-[100%] rounded-t-[26px] border-[#166F00] border-b-[1px]'>
                <h1 className='text-[#000000] text-lg ml-5 my-3'>Trending</h1>
              </div>
              <>
                {trendingPosts && trendingPosts.map((post,index) => {
                  if(post.user.avatar) return <ShortPost key={index} post={post} socialProtocol={socialProtocol} user={userInfo} walletAddress={walletAddress}/>
                })}
              </>
              <div className='bg-[#FFFFFF] h-fit w-[100%] flex justify-center items-center rounded-b-[26px] hover:bg-[#EAEAEA]'>
                <h1 className='text-[#000000] text-lg py-2'>See More...</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
