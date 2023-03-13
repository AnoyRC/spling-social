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
  Reply,
} from "@spling/social-protocol/dist/types";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Keypair } from "@solana/web3.js";
import useAutosizeTextArea from "@/hooks/useAutosizeTextarea";
import TagsInput from "@/components/tags";
import ShortPost from "@/components/shortPost";
import ReplyBody from "@/components/reply";
import { useTheme } from "next-themes";

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
  const [replies, setReplies] = useState<Reply[]>();
  const [comment, setComment] = useState<string>();
  const [like, setLike] = useState<Boolean>(false);
  const [totalLikes, setTotalLikes] = useState<number>(0);
  const [toggle, setToggle] = useState<boolean>(false);
  const {theme, setTheme} = useTheme();
  const router = useRouter();
  const [search, setSearch] = useState<string>("")

  const solanaWallet = useWallet();

  const handleThemeSwitch=()=>{

  }

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

    const commentInitialize = async () => {
      if (socialProtocol !== null && socialProtocol !== undefined) {
        const id = router.query.id;
        if(id === undefined) return;
        const replies = await socialProtocol.getAllPostReplies(Number(id));
        setReplies(replies)
      }
    }

    Initialize();
    userIntitialize();
    postInitialize();
    commentInitialize();
  }, [solanaWallet]);

  useEffect(() => {
    if(post?.likes){
      const check = post?.likes.find((userId) => userId === userInfo?.userId);
      setLike(check ? true : false);
      setTotalLikes(post?.likes.length);
    }
  },[post?.likes,userInfo?.userId])

  const likePost = async () => {
    if(post){
      await socialProtocol?.likePost(post?.publicKey);
    }
    if(like) setTotalLikes(totalLikes-1);
    else setTotalLikes(totalLikes+1);
    setLike(!like);
  }

  const handleReplies = async() => {
    if(comment && comment?.length > 0){
      const newReply = await socialProtocol?.createPostReply(Number(router.query.id),comment)

      if(replies && newReply){
        const newReplies = [...replies,newReply];
        setReplies(newReplies);
      }

      setComment("")
    }
  }

  return (
    <>
      <div className='bg-[#F8FFE9]  w-screen h-screen dark:bg-[#10332E]'>
        <div className='bg-[#FFFFFF] dark:bg-[#10332E] border-[#166F00] border-b-[1px] dark:border-[#40675F] w-screen z-10 h-16 fixed'>
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
        <div className="bg-[#F8FFE9] h-max w-screen flex justify-center dark:bg-[#10332E] dark:border-[#40675F]">
          <div className="w-1/4 flex justify-end">
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
          <div className="w-2/4 ">
            <div className="bg-[#FFFFFF] w-[100%] h-fit flex flex-col pb-8 px-8 x-0 border-r-[#166f00] border-r-[1px] border-l-[#166f00] border-l-[1px] min-h-screen dark:bg-[#10332E] dark:border-[#40675F]">
              <div className=" mt-[96px] p-[8px] rounded-full">
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
                  <div className="flex flex-col ml-3 hover:cursor-pointer"  onClick={()=>{window.location.href = `/user/${post?.userId}`}}>
                    <h1 className="text-[#505050] text-xl font-[QuicksandBold] dark:text-gray-300">
                      {post?.user.nickname}
                    </h1>
                    <h1 className="text-[#5E5E5E] text-sm font-[Quicksand] dark:text-gray-300">
                      {date?.toString()}
                    </h1>
                  </div>
                  <div className="flex-grow flex justify-end items-center">
                  <div
                    className="bg-[#F8FFE9] hover:border-[#166F00] hover:border-[1px] rounded-full px-3 h-7 w-12 self-center flex items-center justify-center ml-1 hover:cursor-pointer dark:bg-[#10332E] dark:border-[#40675F]"
                    onClick={likePost}
                  >
                    <Image
                      src={like ? `/LikeActiveIcon.svg` : `/LikeIcon.svg`}
                      alt="SearchButton"
                      width={15}
                      height={15}
                      className=""
                    ></Image>
                    <h1 className="text-[#000000] text-lg ml-1 font-[Quicksand] dark:text-gray-300">
                      {totalLikes}
                    </h1>
                  </div>
                  </div>
                </div>
                <div></div>
                <img src={post?.media[0].file} alt="avatar" />
              </div>

              <div className="w-[90%] text-5xl mt-2 h-fit p-2 bg-white text-[#000000] font-[QuickSandBold] dark:bg-[#10332E] dark:border-[#40675F] dark:text-gray-300">
                <h1>{post?.title}</h1>
              </div>
              <h1 className="w-full h-fit p-[8px] border-none hover:cursor-text text-xl: bg-white text-[#000000] font-[QuickSand] dark:bg-[#10332E] dark:border-[#40675F] dark:text-gray-300">
                {post?.text}
              </h1>
              <div className="flex justify-start w-[70%] mt-2">
                {tags &&
                  tags.map((tag, index) => (
                    <div
                      key={index}
                      className="w-[fit] h-[fit] border-[#166f00] border-[1px] px-1 rounded-md ml-2 dark:bg-[#10332E] dark:border-[#40675F]"
                    >
                      <h1 className="text-[#000000] font-[Quicksand] dark:text-gray-300">{tag}</h1>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="w-1/4 ml-7">
            <div className="flex flex-col mt-[96px] w-[75%] items-center">
              <div className="bg-[#FFFFFF] w-[100%] h-max border-[#166F00] pb-7  mb-5 border-[1px] rounded-[26px] flex flex-col justify-center dark:bg-[#10332E] dark:border-[#40675F]">
                <div className="bg-[#FFFFFF] h-fit w-[100%] rounded-t-[26px] border-[#166F00] border-b-[1px] dark:bg-[#10332E] dark:border-[#40675F]">
                  <h1 className="text-[#000000] text-lg ml-5 my-3 font-[QuicksandLight] font-bold dark:text-gray-300">
                    {(replies && `Comments(${replies.length})`) ||
                      "Comments(0)"}
                  </h1>
                </div>
                {(userInfo && (
                  <div className="flex flex-col border-b-[1px] border-[#166f00] pb-4 dark:bg-[#10332E] dark:border-[#40675F]">
                    <div className="flex ml-5 mt-2">
                      {userInfo?.avatar && (
                        <Image
                          src={userInfo?.avatar}
                          alt="avatar"
                          width={30}
                          height={30}
                          className="rounded-full h-[30] w-[30px]"
                        ></Image>
                      )}
                      <div className="flex flex-col ml-2 justify-center">
                        <h1 className="text-[#505050] text-md font-[Quicksand] dark:text-gray-300">
                          {userInfo?.nickname}
                        </h1>
                      </div>
                    </div>
                    <div className="flex w-[100%] h-fit ml-5">
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-[90%] mt-3 font-[Quicksand] text-[#000000] bg-transparent resize-none focus:outline-none overflow-hidden"
                        placeholder="Write Comment..."
                      ></textarea>
                    </div>
                    <div className="flex w-[100%] h-fit justify-end">
                      <button
                        className="w-[fit] h-[fit] text-[#000000] bg-[#F8FFE9] border-[#166f00] border-[1px] px-2 py-0.5 rounded-full mr-5 mt-2 hover:bg-[#166f00] transition ease-out hover:text-[#ffffff] dark:bg-[#10332E] dark:border-[#40675F] dark:hover:bg-[#40675F]"
                        onClick={handleReplies}
                      >
                        <h1 className="font-[Quicksand]">Submit</h1>
                      </button>
                    </div>
                  </div>
                )) || (
                  <div className="border-b-[1px] border-[#166f00] pb-4 dark:bg-[#10332E] dark:border-[#40675F]">
                    <h1 className="text-[#5E5E5E] italic text-center px-3 mt-3 dark:text-gray-300">{`"Login to post comments"`}</h1>
                  </div>
                )}
                {replies &&
                  replies.map((reply, index) => {
                    return <ReplyBody key={index} reply={reply} />;
                  })}
              </div>
              <div className="bg-[#FFFFFF] w-[100%] h-max border-[#166F00] pb-7 border-[1px] rounded-[26px] flex flex-col justify-center dark:bg-[#10332E] dark:border-[#40675F]">
                <div className="bg-[#FFFFFF] h-fit w-[100%] rounded-t-[26px] border-[#166F00] border-b-[1px] dark:bg-[#10332E] dark:border-[#40675F]">
                  <h1 className="text-[#000000] text-lg ml-5 my-3 font-[QuicksandLight] font-bold dark:text-gray-300">
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
                    <h1 className="text-[#5E5E5E] italic text-center px-3 mt-3 dark:text-gray-300">{`"Seems like this user never posts articles"`}</h1>
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
