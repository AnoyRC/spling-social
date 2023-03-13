import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import { SocialProtocol } from "@spling/social-protocol";
import { useWallet, WalletContextState } from "@solana/wallet-adapter-react";
import styles from "@/styles/Home.module.css";
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
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [title, setTitle] = useState<string>();
  const [article, setArticle] = useState<string | undefined>("");
  const [articleImage, setArticleImage] = useState<File>();
  const [tags, setTags] = useState<string[]>([]);
  const [toggle, setToggle] = useState<boolean>(false);
  const {theme,setTheme}=useTheme()

  const articleImgRef = useRef<HTMLInputElement>(null);

  useAutosizeTextArea(textAreaRef.current, article);
  const solanaWallet = useWallet();

  const handleChange = (evt: React.ChangeEvent<HTMLDivElement>) => {
    const val = evt.target?.innerText;

    setArticle(val);
  };
  const handleThemeSwitch = () => {
    
    setTheme(theme==="dark"?"light":"dark")
  }

  const convertBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  const createPostInitialization = async () => {
    if (articleImage) {
      const articleTmpImage = articleImage;
      let base64Img = await convertBase64(articleTmpImage);
      const FileDataValue = {
        base64: base64Img,
        size: articleImage.size,
        type: articleImage.type,
      };

      console.log(article)

      const post = await socialProtocol?.createPost(
        33,
        title,
        article,
        [FileDataValue as FileData],
        tags.toString(),
        null
      );
      if (post) {
        window.location.href = "/";
      }
    }
  };

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
        if(user!==null)  postInitialize(user);
      }
    };

    const postInitialize = async (user:User | undefined) => {
      if(socialProtocol && user){
        const posts = await socialProtocol.getAllPostsByUserId(user?.userId);
        const sortedPost = posts.sort((a,b) => b.timestamp - a.timestamp )
        const filteredPosts = sortedPost.filter((post) => post.groupId == 33).slice(0,3);
        setPosts(filteredPosts);
      }
    };

    Initialize();
    userIntitialize();
    
  }, [solanaWallet, tags]);

  return (
    <>
      <div className="bg-[#F8FFE9] w-screen min-h-screen dark:bg-[#264D49]">
      <div className='bg-[#FFFFFF] border-[#166F00] border-b-[1px] w-screen z-10 h-16 fixed dark:bg-[#10332E] dark:border-[#40675F]'>
          <div className='flex h-full justify-center'>
            <div className='w-1/3'></div>
            <div className='hover:border-[#166F00] focus-within:border-[#166F00]  dark:hover:border-[#40675F] border-[1px] dark:border-[#264D49] rounded-full flex bg-[#EAEAEA] dark:bg-[#264D49] self-center h-[65%] w-1/3'>
              <Image src="/SearchBtn.svg" alt="SearchButton" width={20} height={20} className="ml-4"></Image>
              <input type="text" placeholder="Search for people or tags" className="bg-[#EAEAEA] dark:bg-[#264D49] w-full h-full rounded-full text-[#8C8C8C] font-[Quicksand] mx-2 focus:outline-none" onClick={()=>{window.location.href="./"}}></input>
              </div>
              <div className='flex w-1/3 justify-center'>
              <button className='transition ease-in delay-100 bg-[#166F00] rounded-full h-[65%] w-24 self-center mx-1 flex items-center justify-center hover:bg-[#5f8e53] dark:bg-[#264D49] dark:hover:bg-[#40675F]' onClick={createPostInitialization}>
                <Image src="/PenIcon.svg" alt="SearchButton" width={15} height={15} className=""></Image>
                <h1 className='text-m ml-1 text-white font-[Quicksand] dark:text-gray-300'>Publish</h1>
              </button>
              <div className='hover:bg-[#F8FFE9] hover:border-[#166F00] hover:border-[1px] bg-[#FFFFFF] rounded-full h-[65%] w-10 self-center flex items-center justify-center ml-1 dark:bg-[#10332E] dark:hover:border-[#40675F]'>
                <Image src="/DarkModeIcon.svg" alt="SearchButton" width={25} height={25} className="hover:cursor-pointer" onClick={handleThemeSwitch}></Image>
              </div>
              <div className='hover:bg-[#F8FFE9] hover:border-[#166F00] hover:border-[1px] bg-[#FFFFFF] rounded-full h-[65%] w-10 self-center flex items-center justify-center ml-1 mr-[10%] hover:cursor-pointer dark:bg-[#10332E] dark:hover:border-[#40675F]' onClick={()=>{setToggle(!toggle)}}>
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
              <h1 className="text-[#505050] text-xl font-[QuicksandBold] text-center mt-3 dark:text-gray-300">
                {userInfo?.nickname}
              </h1>
              <div className='flex mt-3 justify-center items-center border-[#166f00] border-[1px] rounded-full px-2 mb-4 hover:bg-[#5f8e53] dark:bg-[#264D49]  dark:hover:bg-[#40675F]'>
                <div className='bg-[#37ff05] rounded-full h-[13px] w-[13px] shadow-lg shadow-[#37ff05]'></div>
                <h1 className="text-[#505050] text-md font-[Quicksand] text-center ml-1 dark:text-gray-300">
                  Connected
                </h1>
              </div>
            </div>
            }
            { !userInfo && toggle &&
              <div className='bg-[#FFFFFF] border-[#166f00] border-[1px] rounded-xl h-fit w-[15%] fixed ml-[78%] mt-3 flex flex-col items-center dark:bg-[#10332E] dark:border-[#40675F]'>
                <div className='flex mt-3 justify-center items-center border-[#166f00] border-[1px] rounded-full px-2 dark:border-[#40675F]'>
                  <div className='bg-[#ff0000] rounded-full h-[13px] w-[13px] shadow-lg shadow-[#ff4a4a]'></div>
                  <h1 className="text-[#505050] text-md font-[Quicksand] text-center ml-1 dark:text-gray-300">
                    Not Connected
                  </h1>
                </div>
              <button className='transition ease-in delay-100 bg-[#166F00] rounded-full h-[65%] w-24 self-center flex items-center justify-center p-1 m-3 mb-1 hover:bg-[#5f8e53] dark:bg-[#264D49]  dark:hover:bg-[#40675F]' onClick={()=>window.location.href="/connect"}>
                <h1 className='text-m  text-white font-[Quicksand] font-normal text-center'>Connect</h1>
              </button>
              <h1 className='text-[#505050] text-center px-3 text-sm mb-3 dark:text-gray-300'>Connect your wallet to access additional features and support the community</h1>
              </div>
            }
        </div>
        <div className="bg-[#F8FFE9] h-max w-screen flex justify-center  dark:bg-[#10332E] dark:border-[#40675F]">
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
              <div
                onClick={() => {
                  articleImgRef?.current?.click();
                }}
                className=" mt-[96px] p-[8px] rounded-full hover:cursor-pointer"
              >
                {articleImage ? (
                  <img
                    onClick={() => {
                      articleImgRef?.current?.click();
                    }}
                    src={URL.createObjectURL(articleImage)}
                    alt="avatar"
                  />
                ) : (
                  <div className="flex flex-row">
                    <img
                      src="/AddCover.svg"
                      alt="ProfilePic"
                      className="h-20px w-20px mr-2"
                    />
                    <p className="text-[#5E5E5E] font-[QuickSand] dark:text-gray-300">Add Cover</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                ref={articleImgRef}
                onChange={(e) => {
                  if (!e.target.files) return;
                  setArticleImage(e.target.files[0]);
                  console.log(e.target.files[0].type);
                }}
              />

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title..."
                className="w-[90%] placeholder:text-gray-500 text-5xl  mt-2 h-14 p-2 bg-white text-[#000000] font-[QuickSandBold] focus:outline-none dark:bg-[#10332E] dark:border-[#40675F] dark:placeholder:text-gray-400 dark:text-gray-300"
              />
              <div
                contentEditable={true}
                onInput={handleChange}
                className="w-full h-fit p-[8px] placeholder:text-gray-500 border-none hover:cursor-text text-xl empty:before:placeholder:hidden bg-white text-[#000000] font-[QuickSand] focus:outline-none dark:bg-[#10332E] dark:border-[#40675F] dark:placeholder:text-gray-400 dark:text-gray-300"
                placeholder="Body..."
              ></div>
              <TagsInput tags={tags} setTags={setTags} />
            </div>
          </div>

          <div className="w-1/4 ml-7">
            <div className="flex flex-col mt-[96px] w-[18%] fixed items-center">
            
            <div className='bg-[#FFFFFF] w-[100%] h-max border-[#166F00] pb-7 border-[1px] rounded-[26px] flex flex-col justify-center dark:bg-[#10332E] dark:border-[#40675F]'>
              <div className='bg-[#FFFFFF] h-fit w-[100%] rounded-t-[26px] border-[#166F00] border-b-[1px] dark:bg-[#10332E] dark:border-[#40675F]'>
                <h1 className='text-[#000000] text-lg ml-5 my-3 font-[QuicksandLight] font-bold dark:text-gray-300'>Recently Published</h1>
              </div>
              <>
                {(posts && posts.map((post,index) => {
                  if(post.user.avatar) return <ShortPost key={index} post={post} socialProtocol={socialProtocol} user={userInfo} walletAddress={walletAddress}/>
                })) || <h1 className="text-[#5E5E5E] italic text-center mt-3 px-3">{`"Publish your first post and join our community of awesome builders"`}</h1>}
              </>
            </div>
           
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
