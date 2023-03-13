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
  const [toggle, setToggle] = useState<boolean>(false);
  const [search,setSearch]=useState<string>('')

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

  const handleThemeSwitch=()=>{

  }
  return (
    <>
      <div className='bg-[#F8FFE9] w-screen h-screen dark:bg-[#10332E] dark:border-[#40675F]'>
      <div className='bg-[#FFFFFF] border-[#166F00] border-b-[1px] w-screen z-10 h-16 fixed dark:bg-[#10332E] dark:border-[#40675F]'>
          <div className='flex h-full justify-center'>
            <div className='w-1/3'></div>
            <div className='hover:border-[#166F00] focus-within:border-[#166F00]  dark:hover:border-[#40675F] border-[1px] dark:border-[#264D49] rounded-full flex bg-[#EAEAEA] dark:bg-[#264D49] self-center h-[65%] w-1/3'>
              <Image src="/SearchBtn.svg" alt="SearchButton" width={20} height={20} className="ml-4"></Image>
              <input type="text" placeholder="Search for people or tags" className="bg-[#EAEAEA] dark:bg-[#264D49] w-full h-full rounded-full text-[#8C8C8C] font-[Quicksand] mx-2 focus:outline-none" onChange={(e)=>{setSearch(e.target.value)}}></input>
              </div>
              <div className='flex w-1/3 justify-center'>
              <button className='transition ease-in delay-100 bg-[#166F00] dark:bg-[#264D49] rounded-full h-[65%] w-24 self-center flex items-center mx-1 hover:bg-[#5f8e53] dark:hover:bg-[#40675F]' onClick={()=>window.location.href="/create"}>
                <Image src="/PenIcon.svg" alt="SearchButton" width={15} height={15} className="ml-5"></Image>
                <h1 className='text-m ml-1 text-[#ffffff] font-[Quicksand] font-normal dark:text-gray-300 '>Write</h1>
              </button>
              <div className='hover:bg-[#F8FFE9] hover:border-[#166F00] dark:hover:border-[#40675F] hover:border-[1px] bg-[#FFFFFF] dark:bg-[#10332E] rounded-full h-[65%] w-10 self-center flex items-center justify-center ml-1'>
                <Image src="/DarkModeIcon.svg" alt="SearchButton" width={25} height={25} className="hover:cursor-pointer" onClick={handleThemeSwitch}></Image>
              </div>
              <div className='hover:bg-[#F8FFE9] hover:border-[#166F00] dark:hover:border-[#40675F] hover:border-[1px] bg-[#FFFFFF] dark:bg-[#10332E] rounded-full h-[65%] w-10 self-center flex items-center justify-center ml-1 mr-[10%] hover:cursor-pointer' onClick={()=>{setToggle(!toggle)}}>
                <Image src="/AccountIcon.svg" alt="SearchButton" width={25} height={25} className=""></Image>
              </div>
              </div>
            </div>
            {userInfo && toggle && <div className='bg-[#FFFFFF] border-[#166f00] border-[1px] rounded-xl h-fit w-[15%] fixed ml-[78%] mt-3 flex flex-col items-center dark:bg-[#10332E] dark:border-[#40675F]'>
              <div className='rounded-t-xl bg-[#EAEAEA] w-[100%] h-[30%] overflow-hidden'>
              <Image src="/CloseIcon.svg" alt="CloseButton" width={25} height={20} className="mt-2 ml-[89%] transition ease-out hover:rotate-90 absolute z-10 hover:cursor-pointer" onClick={()=>{setToggle(false)}}></Image>
              {userInfo.avatar && <Image
                src={userInfo?.avatar}
                alt="avatar"
                width={300}
                height={300}
                className="object-cover opacity-90 hover:opacity-100 hover:scale-110 z-0 transition ease-out delay-100"
                ></Image>}
              </div>
              <h1 className="text-[#505050] dark:text-gray-300 text-xl font-[QuicksandBold] text-center mt-3">
                {userInfo?.nickname}
              </h1>
              <div className='flex mt-3 justify-center items-center border-[#166f00] border-[1px] rounded-full px-2 mb-4 dark:border-[#40675F]'>
                <div className='bg-[#37ff05] rounded-full h-[13px] w-[13px] shadow-lg shadow-[#37ff05] '></div>
                <h1 className="text-[#505050] dark:text-gray-300 text-md font-[Quicksand] text-center ml-1">
                  Connected
                </h1>
              </div>
            </div>
            }
            { !userInfo && toggle &&
              <div className='bg-[#FFFFFF] border-[#166f00] border-[1px] rounded-xl h-fit w-[15%] fixed ml-[78%] mt-3 flex flex-col items-center  dark:bg-[#10332E] dark:border-[#40675F]'>
                <div className='flex mt-3 justify-center items-center border-[#166f00] border-[1px] rounded-full px-2 dark:border-[#40675F]'>
                  <div className='bg-[#ff0000] rounded-full h-[13px] w-[13px] shadow-lg shadow-[#ff4a4a]'></div>
                  <h1 className="text-[#505050] text-md font-[Quicksand] text-center ml-1  dark:text-gray-300">
                    Not Connected
                  </h1>
                </div>
              <button className='transition ease-in delay-100 bg-[#166F00] rounded-full h-[65%] w-24 self-center flex items-center justify-center p-1 m-3 mb-1 hover:bg-[#5f8e53] dark:bg-[#264D49]  dark:hover:bg-[#40675F]' onClick={()=>window.location.href="/connect"}>
                <h1 className='text-m  text-white font-[Quicksand] font-normal text-center'>Connect</h1>
              </button>
              <h1 className='text-[#505050] text-center px-3 text-sm mb-3  dark:text-gray-300'>Connect your wallet to access additional features and support the community</h1>
              </div>
            }
        </div>
        <div className='bg-[#F8FFE9] h-max w-screen flex justify-center  dark:bg-[#10332E] dark:border-[#40675F]'>
          <div className='w-1/3 flex justify-end'>
          <div className="bg-[#FFFFFF] w-[17%] h-max mt-[96px] border-[#166F00] border-[1px] rounded-[26px] flex flex-col justify-center mr-10 fixed dark:bg-[#10332E] dark:border-[#40675F]">
            <div
                className="flex w-[100%] py-2 mt-5 pl-2 hover:bg-[#EAEAEA] hover:cursor-pointer dark:hover:bg-[#40675F]"
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                <div className="flex justify-start w-[100%]">
                  <Image
                    src="/FeedIcon.svg"
                    alt="SearchButton"
                    width={30}
                    height={30}
                    className="ml-4"
                  ></Image>
                  <h1 className="text-xl ml-3 text-[#000000] font-[Quicksand] dark:text-gray-300">
                    Your Feed
                  </h1>
                </div>
              </div>
              <div className="flex w-[100%] py-2 hover:bg-[#EAEAEA] dark:hover:bg-[#40675F]">
                <div
                  className="flex justify-start pl-2 w-[100%] hover:cursor-pointer"
                  onClick={() => {
                    window.location.href = "/explore";
                  }}
                >
                  <Image
                    src="/ExploreIcon.svg"
                    alt="SearchButton"
                    width={30}
                    height={30}
                    className="ml-4"
                  ></Image>
                  <h1 className="text-xl ml-3 text-[#000000] font-[Quicksand] dark:text-gray-300">
                    Explore
                  </h1>
                </div>
              </div>
              <div
                className="flex w-[100%] py-2 pl-2 mb-4 hover:bg-[#EAEAEA] hover:cursor-pointer rounded-b-md dark:hover:bg-[#40675F]"
                onClick={() => {
                  if (userInfo)
                    window.location.href = `/user/${userInfo?.userId}`;
                }}
              >
                <div className="flex justify-start w-[100%]">
                  <Image
                    src="/ProfileIcon.svg"
                    alt="SearchButton"
                    width={30}
                    height={30}
                    className="ml-4"
                  ></Image>
                  <h1 className="text-xl ml-3 text-[#000000] font-[Quicksand] dark:text-gray-300">
                    My Profile
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <div className='w-[638px]'>
            <div className='bg-[#FFFFFF] border-[#166f00] border-[1px] rounded-[26px] w-[100%] h-fit py-5 mt-[96px] flex flex-col justify-center items-center dark:bg-[#10332E] dark:border-[#40675F]'>
                <h1 className='text-[#000000] font-[QuicksandBold] text-4xl text-center dark:text-gray-300'>#Trending</h1>
                <h1 className='font-[Quicksand] text-[#4e4e4e] text-center mt-2 dark:text-gray-300'>Explore the most popular post of our community. A constantly <br/> updating list of popular posts!!</h1>
            </div>
            <div className='bg-[#FFFFFF] border-[#166f00] border-[1px] rounded-[26px] w-[100%] h-fit pb-8 mt-5 flex flex-col dark:bg-[#10332E] dark:border-[#40675F]'>
              <div className='bg-[#FFFFFF] w-[100%] h-[35px] rounded-t-[26px] border-[#166f00] border-b-[1px] flex dark:bg-[#10332E] dark:border-[#40675F]'>
              </div>
              <>
              {(posts && posts.map((post,index) => {
                if(post.user.avatar)
                  return <Posts key={index} post={post} socialProtocol={socialProtocol} user = {userInfo} walletAddress = {walletAddress} />})) || 
                  <h1 className='text-[#5E5E5E] italic text-center mt-6 dark:text-gray-300'>{`"Touch Some Grass, after you come back you will see some posts here!!"`}</h1>}
              </>
              {posts?.length === 0 && <h1 className='text-[#5E5E5E] italic text-center mt-6 dark:text-gray-300'>{`"Touch Some Grass, after you come back you will see some posts here!!"`}</h1>}
            </div>
          </div>
          <div className='w-1/3'>
          <div className='bg-[#FFFFFF] w-[18%] h-max mt-[96px] border-[#166F00] pb-7 border-[1px] rounded-[26px] flex flex-col justify-center ml-10 fixed dark:bg-[#10332E] dark:border-[#40675F]'>
              <div className='bg-[#FFFFFF] h-fit w-[100%] rounded-t-[26px] border-[#166F00] border-b-[1px] dark:bg-[#10332E] dark:border-[#40675F]'>
                <h1 className='text-[#000000] text-lg ml-5 my-3 font-[QuicksandLight] font-bold dark:text-gray-300'>Top 3</h1>
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
