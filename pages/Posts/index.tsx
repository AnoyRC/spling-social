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
import { useEffect, useRef, useState } from 'react';
import { Keypair } from '@solana/web3.js';
import useAutosizeTextArea from '@/hooks/useAutosizeTextarea';
import TagsInput from '@/components/tags';

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
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const [title, setTitle] = useState<string>();
    const [article, setArticle] = useState<string | undefined>();
    const [articleImage,setArticleImage]=useState<File>();
    const [tags, setTags]=useState<string[]>([])

    const articleImgRef=useRef<HTMLInputElement>(null);

    useAutosizeTextArea(textAreaRef.current, article)
    const solanaWallet = useWallet()

    const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = evt.target?.value;

        setArticle(val);
    };

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
    const createPostInitialization=async()=>{
        if(articleImage){
            const articleTmpImage=articleImage
            let base64Img=await convertBase64(articleTmpImage)
            const FileDataValue={
                type:articleImage.type,
                base64:base64Img,
                size:articleImage.size,
            }

            const post=await socialProtocol?.createPost(
                33,
                title,
                article,
                FileDataValue as FileData[],
                tags.toString(),
                null,
            )
        }
    }

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

                const user=await socialProtocol.getUserByPublicKey(walletAddress?.wallet?.adapter?.publicKey)
                    
                setUserInfo(user)
                console.log(tags)
                if(!user){
                    window.location.href="/"
                }
            }
            
            
        }
        initialize()
    }, [solanaWallet, walletAddress,tags])


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
                        <div className='bg-[#FFFFFF] border-r-[#166f00] border-r-[1px] border-l-[#166f00] border-l-[1px]  w-[100%] h-screen pb-8 px-8 flex flex-col'>
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
                                    <div className='flex flex-row'>
                                        <img src="/AddCover.svg" alt="ProfilePic" className='h-20px w-20px mr-2' />
                                        <p>Add Cover</p>
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
                                className="w-[90%] placeholder:text-gray-500 text-3xl  mt-2 h-12 p-2 focus:outline-none"
                            />
                            <textarea
                                onChange={handleChange}
                                ref={textAreaRef}
                                value={article}
                                placeholder="Body..."
                                className="w-[100%] h-32 placeholder:text-gray-500  mt-2 p-2 focus:outline-none overflow:hidden"

                            />
                            <TagsInput tags={tags} setTags={setTags}/>

                        </div>
                    </div>


                    <div className='w-1/4 ml-3'>
                        <button className='transition ease-in delay-100 bg-[#166F00] rounded-full h-[30px] w-max-content self-center flex items-center mx-1 hover:bg-[#5f8e53] mt-[96px]' onClick={() => window.location.href = "./Posts"}>
                            <Image src="/PenIcon.svg" alt="SearchButton" width={15} height={15} className="ml-7"></Image>
                            <h1 className='text-m ml-1 text-white mr-7'>Write</h1>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}



