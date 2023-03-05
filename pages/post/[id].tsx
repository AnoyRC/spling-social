import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import { SocialProtocol } from "@spling/social-protocol";
import { useWallet, WalletContextState } from "@solana/wallet-adapter-react";
import styles from "@/styles/Home.module.css";
import { Router, useRouter } from "next/router";
import {
  FileData,
  ProtocolOptions,
  User,
  Post,
} from "@spling/social-protocol/dist/types";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Keypair } from "@solana/web3.js";
import useAutosizeTextArea from "@/hooks/useAutosizeTextarea";
import TagsInput from "@/components/tags";
import ShortPost from "@/components/shortPost";

const inter = Inter({ subsets: ["latin"] });

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
  const [tags, setTags] = useState<string[]>([]);
  const [post, setPost] = useState<Post>();
  const [date, setDate] = useState<string>("");
  const router = useRouter();

  const solanaWallet = useWallet();

  useEffect(() => {
    setWalletAddress(solanaWallet);

    const Initialize = async () => {
      if (walletAddress?.wallet?.adapter?.publicKey) {
        const socialProtocol: SocialProtocol = await new SocialProtocol(
          solanaWallet,
          null,
          options
        ).init();
        setSocialProtocol(socialProtocol);
        console.log(socialProtocol);
      } else {
        const socialProtocol: SocialProtocol = await new SocialProtocol(
          Keypair.generate(),
          null,
          options
        ).init();
        setSocialProtocol(socialProtocol);
        console.log(socialProtocol);
      }
    };

    const userIntitialize = async () => {
      if (walletAddress?.wallet?.adapter?.publicKey) {
        const user = await socialProtocol?.getUserByPublicKey(
          walletAddress?.wallet?.adapter?.publicKey
        );
        setUserInfo(user);
        console.log(user);
        if (user !== null) setStatus(true);
      }
    };

    const postInitialize = async () => {
      if (socialProtocol !== null && socialProtocol !== undefined) {
        const id = router.query.id;
        if(id === undefined) return;
        const post: Post | null = await socialProtocol.getPost(Number(id));
        if (post) {
          setPost(post);
          var tags = post?.tags[0].split(",");
          if (tags) setTags(tags);
          if (post?.timestamp) {
            var date = new Date(post?.timestamp * 1000); //Scaring me
            setDate(
              date.getDate() +
                " " +
                date.toString().substring(4, 7) +
                " " +
                date.getFullYear()
            ); 
          }
        }
        if (!post) window.location.href = "/";

        if (post) {
          const posts = await socialProtocol.getAllPostsByUserId(post?.userId);
          console.log(posts)
          const sortedPost = await posts.sort(
            (a, b) => b.timestamp - a.timestamp
          );
          const filteredPosts = sortedPost
            .filter(
              (curpost) => curpost.userId == post?.userId && curpost.groupId == 33
            )
            .slice(0, 3);
          setPosts(filteredPosts);
          console.log(filteredPosts)
        }
      }
    };

    Initialize();
    userIntitialize();
    postInitialize();
  }, [solanaWallet]);

  return (
    <>
      <div className="bg-[#F8FFE9] w-screen min-h-screen">
      <div className='bg-[#FFFFFF] border-[#166F00] border-b-[1px] w-screen z-10 h-16 fixed'>
          <div className='flex h-full justify-center'>
            <div className='w-1/3'></div>
            <div className='hover:border-[#166F00] focus-within:border-[#166F00] border-[1px] rounded-full flex bg-[#EAEAEA] self-center h-[65%] w-1/3'>
              <Image src="/SearchBtn.svg" alt="SearchButton" width={20} height={20} className="ml-4"></Image>
              <input type="text" placeholder="Search for people or tags" className="bg-[#EAEAEA] w-full font-[Quicksand] h-full rounded-full text-[#8C8C8C] mx-2 focus:outline-none"></input>
              </div>
              <div className='flex w-1/3 justify-center'>
              <button className='transition ease-in delay-100 bg-[#166F00] rounded-full h-[65%] w-24 self-center flex items-center mx-1 hover:bg-[#5f8e53]' onClick={()=>window.location.href="/create"}>
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
        <div className="bg-[#F8FFE9] h-max w-screen flex justify-center ">
          <div className="w-1/4 flex justify-end">
            <div className="bg-[#FFFFFF] w-[17%] h-max mt-[96px] border-[#166F00] border-[1px] rounded-[26px] flex flex-col justify-center mr-10 fixed">
              <div
                className="flex w-[100%] py-2 mt-5 pl-2 hover:bg-[#EAEAEA] hover:cursor-pointer"
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
                  <h1 className="text-xl ml-3 text-[#000000] font-[Quicksand]">
                    Your Feed
                  </h1>
                </div>
              </div>
              <div className="flex w-[100%] py-2 hover:bg-[#EAEAEA]">
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
                  <h1 className="text-xl ml-3 text-[#000000] font-[Quicksand]">
                    Explore
                  </h1>
                </div>
              </div>
              <div
                className="flex w-[100%] py-2 pl-2 mb-4 hover:bg-[#EAEAEA] hover:cursor-pointer rounded-b-md"
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
                  <h1 className="text-xl ml-3 text-[#000000] font-[Quicksand]">
                    My Profile
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <div className="w-2/4 ">
            <div className="bg-[#FFFFFF] w-[100%] h-fit flex flex-col pb-8 px-8 x-0 border-r-[#166f00] border-r-[1px] border-l-[#166f00] border-l-[1px] min-h-screen">
              <div className=" mt-[96px] p-[8px] rounded-full hover:cursor-pointer">
                <div className="mb-4 flex">
                  {post?.user.avatar && (
                    <Image
                      src={post?.user.avatar}
                      alt="avatar"
                      width={58}
                      height={58}
                      className="rounded-full h-[50px] w-[50px]"
                    ></Image>
                  )}
                  <div className="flex flex-col ml-3">
                    <h1 className="text-[#505050] text-xl font-[QuicksandBold]">
                      {post?.user.nickname}
                    </h1>
                    <h1 className="text-[#5E5E5E] text-sm font-[Quicksand]">
                      {date?.toString()}
                    </h1>
                  </div>
                </div>
                <div></div>
                <img
                  src={post?.media[0].file}
                  alt="avatar"
                />
              </div>

              <div className="w-[90%] text-5xl  mt-2 h-14 px-2 bg-white text-[#000000] font-[QuickSandBold] focus:outline-none">
                <h1>{post?.title}</h1>
              </div>
              <h1 className="w-full h-fit p-[8px] border-none hover:cursor-text text-xl: bg-white text-[#000000] font-[QuickSand] focus:outline-none">
                {post?.text}
              </h1>
              <div className="flex justify-start w-[70%] mt-2">
                {tags &&
                  tags.map((tag, index) => (
                    <div
                      key={index}
                      className="w-[fit] h-[fit] border-[#166f00] border-[1px] px-1 rounded-md ml-2"
                    >
                      <h1 className="text-[#000000] font-[Quicksand]">{tag}</h1>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="w-1/4 ml-7">
            <div className="flex flex-col mt-[96px] w-[18%] fixed items-center">
              <div className="bg-[#FFFFFF] w-[100%] h-max border-[#166F00] pb-7 border-[1px] rounded-[26px] flex flex-col justify-center">
                <div className="bg-[#FFFFFF] h-fit w-[100%] rounded-t-[26px] border-[#166F00] border-b-[1px]">
                  <h1 className="text-[#000000] text-lg ml-5 my-3 font-[QuicksandLight] font-bold">
                    Related Post
                  </h1>
                </div>
                <>
                  {(posts &&
                    posts.map((post, index) => {
                      if (post.user.avatar)
                        return (
                          <ShortPost
                            key={index}
                            post={post}
                            socialProtocol={socialProtocol}
                            user={userInfo}
                            walletAddress={walletAddress}
                          />
                        );
                    })) || (
                    <h1 className="text-[#5E5E5E] italic text-center px-3 mt-3">{`"Seems like this user never posts articles"`}</h1>
                  )}
                </>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
