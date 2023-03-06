import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { SocialProtocol } from "@spling/social-protocol";
import { useWallet, WalletContextState } from "@solana/wallet-adapter-react";
import styles from '@/styles/Home.module.css'
import { useRouter } from 'next/router'
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


const Users = () => {
  const [socialProtocol, setSocialProtocol] = useState<SocialProtocol>();
  const [walletAddress, setWalletAddress] = useState<WalletContextState>();
  const [userInfo, setUserInfo] = useState<User | null>();
  const [status,setStatus] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>();
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [userQuery, setUserQuery] = useState<User>();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [toggle, setToggle] = useState<boolean>(false);
  const router = useRouter()

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
      
      if(router.query.id === undefined) return;
      const userQuery = await socialProtocol?.getUser(Number(router.query.id));
      if(userQuery)  setUserQuery(userQuery);
      console.log(userQuery)
    };

    const postInitialize = async () => {
      if(socialProtocol !== null && socialProtocol !== undefined){
        const posts = await socialProtocol.getAllPosts(33);
        const filteredPosts = posts.filter((post) => post.userId == Number(router.query.id) && post.groupId == 33);
        setPosts(filteredPosts);
        console.log(filteredPosts)
      }
    };

    Initialize();
    userIntitialize();
    postInitialize();
  }, [solanaWallet,walletAddress]);

  useEffect(()=>{
    if(userInfo && userQuery){
      if(userInfo.following.includes(userQuery.userId)){
        setIsFollowing(true);
      }
      else{
        setIsFollowing(false);
      }
    }
  },[userInfo,userQuery])



  const handleFollow = async(follow : boolean) => {
    if (userInfo && userQuery) {
      if (follow) {
        await socialProtocol?.followUser(userQuery?.userId);
        setIsFollowing(true);
      }
      else{
        await socialProtocol?.unfollowUser(userQuery?.userId);
        setIsFollowing(false);
      }
    }
  }

  return (
    <>
      <div className='bg-[#F8FFE9] w-screen h-screen'>
      <div className='bg-[#FFFFFF] border-[#166F00] border-b-[1px] w-screen z-10 h-16 fixed'>
          <div className='flex h-full justify-center'>
            <div className='w-1/3'></div>
            <div className='hover:border-[#166F00] focus-within:border-[#166F00] border-[1px] rounded-full flex bg-[#EAEAEA] self-center h-[65%] w-1/3'>
              <Image src="/SearchBtn.svg" alt="SearchButton" width={20} height={20} className="ml-4"></Image>
              <input type="text" placeholder="Search for people or tags" className="bg-[#EAEAEA] w-full h-full rounded-full text-[#8C8C8C] font-[Quicksand] mx-2 focus:outline-none"></input>
              </div>
              <div className='flex w-1/3 justify-center'>
              <button className='transition ease-in delay-100 bg-[#166F00] rounded-full h-[65%] w-24 self-center flex items-center mx-1 hover:bg-[#5f8e53]' onClick={()=>window.location.href="/create"}>
                <Image src="/PenIcon.svg" alt="SearchButton" width={15} height={15} className="ml-5"></Image>
                <h1 className='text-m ml-1 text-[#ffffff] font-[Quicksand] font-normal'>Write</h1>
              </button>
              <div className='hover:bg-[#F8FFE9] hover:border-[#166F00] hover:border-[1px] bg-[#FFFFFF] rounded-full h-[65%] w-10 self-center flex items-center justify-center ml-1'>
                <Image src="/DarkModeIcon.svg" alt="SearchButton" width={25} height={25} className=""></Image>
              </div>
              <div className='hover:bg-[#F8FFE9] hover:border-[#166F00] hover:border-[1px] bg-[#FFFFFF] rounded-full h-[65%] w-10 self-center flex items-center justify-center ml-1 mr-[10%] hover:cursor-pointer' onClick={()=>{setToggle(!toggle)}}>
                <Image src="/AccountIcon.svg" alt="SearchButton" width={25} height={25} className=""></Image>
              </div>
              </div>
            </div>
            {userInfo && toggle && <div className='bg-[#FFFFFF] border-[#166f00] border-[1px] rounded-xl h-fit w-[15%] fixed ml-[78%] mt-3 flex flex-col items-center'>
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
              <h1 className="text-[#505050] text-xl font-[QuicksandBold] text-center mt-3">
                {userInfo?.nickname}
              </h1>
              <div className='flex mt-3 justify-center items-center border-[#166f00] border-[1px] rounded-full px-2 mb-4'>
                <div className='bg-[#37ff05] rounded-full h-[13px] w-[13px] shadow-lg shadow-[#37ff05]'></div>
                <h1 className="text-[#505050] text-md font-[Quicksand] text-center ml-1">
                  Connected
                </h1>
              </div>
            </div>
            }
            { !userInfo && toggle &&
              <div className='bg-[#FFFFFF] border-[#166f00] border-[1px] rounded-xl h-fit w-[15%] fixed ml-[78%] mt-3 flex flex-col items-center '>
              <button className='transition ease-in delay-100 bg-[#166F00] rounded-full h-[65%] w-24 self-center flex items-center justify-center p-1 m-3 mb-1 hover:bg-[#5f8e53]' onClick={()=>window.location.href="/connect"}>
                <h1 className='text-m  text-white font-[Quicksand] font-normal text-center'>Connect</h1>
              </button>
              <h1 className='text-[#505050] text-center px-3 text-sm mb-3'>Connect your wallet to access additional features and support the community</h1>
              </div>
            }
        </div>
        <div className='bg-[#F8FFE9] h-max w-screen flex justify-center'>
          <div className='w-1/3 flex justify-end'>
            <div className='bg-[#FFFFFF] w-[17%] h-max mt-[96px] border-[#166F00] border-[1px] rounded-[26px] flex flex-col justify-center mr-10 fixed'>
              <div className='flex w-[100%] py-2 pl-2 mt-5 hover:bg-[#EAEAEA] hover:cursor-pointer' onClick={()=>{window.location.href = '/'}}>
                <div className='flex justify-start w-[100%]'>
                  <Image src="/FeedIcon.svg" alt="SearchButton" width={30} height={30} className="ml-4"></Image>
                  <h1 className='text-xl ml-3 text-[#000000] font-[Quicksand]'>Your Feed</h1>
                </div>
              </div>
              <div className='flex w-[100%] py-2 pl-2 hover:bg-[#EAEAEA] hover:cursor-pointer' onClick={()=>{window.location.href = '/explore'}}>
                <div className='flex justify-start w-[100%]'>
                  <Image src="/ExploreIcon.svg" alt="SearchButton" width={30} height={30} className="ml-4"></Image>
                  <h1 className='text-xl ml-3 text-[#000000] font-[Quicksand]'>Explore</h1>
                </div>
              </div>
              {userQuery?.userId === userInfo?.userId &&
              <div className='flex w-[100%] py-2 pl-2 mb-4 '>
                <div className='flex justify-start w-[100%]'>
                  <Image src="/ProfileActiveIcon.svg" alt="SearchButton" width={30} height={30} className="ml-4"></Image>
                  <h1 className='text-xl ml-3 text-[#166f00] font-[Quicksand]'>My Profile</h1>
                </div>
                <div className=' flex justify-end w-[10%]'>
                  <div className='bg-[#166f00] w-1.5 h-8 rounded-tl-md rounded-bl-md'></div>
                </div>
              </div>
              }
              {userQuery?.userId !== userInfo?.userId &&
              <div className='flex w-[100%] py-2 pl-2 mb-4 rounded-b-md hover:bg-[#EAEAEA] hover:cursor-pointer' onClick={()=>{if(userInfo) window.location.href = `/user/${userInfo?.userId}`}}>
                <div className='flex justify-start w-[100%]'>
                  <Image src="/ProfileIcon.svg" alt="SearchButton" width={30} height={30} className="ml-4"></Image>
                  <h1 className='text-xl ml-3 text-[#000000] font-[Quicksand]'>My Profile</h1>
                </div>
              </div>
              }
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
                <div className='flex items-center ml-5 pb-1 px-2 hover:bg-[#EAEAEA]' onClick={()=>{setIsFeatured(false)}}>
                  <Image src="/PersonalizedIcon.svg" alt="Personalized" width={13} height={13} ></Image>
                  <h1 className='text-[#000000] ml-2 text-lg'>Personalized</h1>
                </div></>) || 
                <>
                <div className='flex flex-col justify-center'>
                <div className='flex items-center ml-5 h-[100%]'>
                  <Image src="/PersonalizedActiveIcon.svg" alt="Personalized" width={13} height={13} className='mb-[0.5px]' ></Image>
                  <h1 className='text-[#166f00] ml-2 text-lg font-[Quicksand]'>{`${userQuery?.nickname}'s posts`}</h1>
                </div>
                <div className='bg-[#166f00] justify-end flex flex-col w-[85%] h-[4px] self-center rounded-t-md ml-7'></div>
              </div></>}
              </div>
              <>
              {posts && posts.map((post,index) => {
                if(post.user.avatar)
                  return <Posts key={index} post={post} socialProtocol={socialProtocol} user = {userInfo} walletAddress = {walletAddress} />})}
              </>
            </div>
          </div>
          <div className='w-1/3'>
            <div className='flex flex-col fixed mt-[96px] w-[18%] ml-10'>
              <div className='bg-[#FFFFFF] w-[100%] h-max  border-[#166F00] border-[1px] rounded-[26px] flex flex-col justify-center'>
              <div className='flex w-[100%] flex-col justify-center items-center mt-5'>
            {userQuery?.avatar && (
              <Image
               src={userQuery.avatar}
               alt="avatar"
               width={200}
               height={200}
               className="rounded-full h-[150px] w-[150px]"
              ></Image>
            )}
            <h1 className='text-[#000000] text-2xl mt-4 font-[Quicksand] text-center'>{userQuery?.nickname}</h1>
            <h1 className='text-[#000000] text-sm px-7 text-center mt-1 font-[Quicksand]'>{userQuery?.bio}</h1>
            <div className='flex justify-center mx-10 w-[70%] mb-5 font-[Quicksand]'>
              <div className='flex flex-col justify-center items-center'>
                <h1 className='text-[#000000] text-lg mt-4 = font-[Quicksand]'>Following</h1>
                <h1 className='text-[#000000] text-lg font-[Quicksand]'>{userQuery?.following.length}</h1>
              </div>
            </div>
            </div>
              </div>
              {userQuery?.userId !== userInfo?.userId && <button className='transition ease-in delay-100 bg-[#166F00] rounded-2xl my-5 h-fit py-2 px-10 w-fit self-center justify-center flex items-center hover:bg-[#5f8e53]' onClick={()=>{isFollowing ? handleFollow(false) : handleFollow(true)}}>
                <h1 className='text-m ml-1 font-[Quicksand]'>{!isFollowing ? `Follow`: `Unfollow`}</h1>
              </button>}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Users
