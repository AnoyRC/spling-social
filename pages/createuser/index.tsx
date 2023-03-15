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
import { NextPage } from 'next';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from 'next-themes';


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



const CreateUser = () => {



    const [socialProtocol, setSocialProtocol] = useState<SocialProtocol>();
    const [walletAddress, setWalletAddress] = useState<WalletContextState>();
    const [userInfo, setUserInfo] = useState<User | null>();
    const [avatar, setAvatar] = useState<File>()
    const [userName, setUserName] = useState<string>("")
    const [bio, setBio] = useState<string>("")
    const avatarRef = useRef<HTMLInputElement>(null)
    const{theme,setTheme}=useTheme()
    const solanaWallet = useWallet();

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

    const createuser = async () => {
        if (userName?.length === 0) {
            return toast.warn("Enter a username")
        }
        if (!avatar) {
            return toast.warn("Upload a avatar")
        }
        if (!bio) {
            return toast.warn("Enter a bio")
        }
        if (socialProtocol) {
            if (avatar) {
                const profileImage = avatar;
                let base64Img = await convertBase64(profileImage);
                const FileDataValue = {
                    base64: base64Img,
                    size: avatar.size,
                    type: avatar.type,
                };


                const promise = async () => {
                    const user: User = await socialProtocol.createUser(
                        userName,
                        FileDataValue as FileData,
                        bio
                    );
                    if (user) {
                        window.location.href = '/'
                    }
                    console.log(user);
                };
                toast.promise(promise(), {
                    pending: "Creating Profile",
                    success: "Profile Created",
                    error: "Error Creating Profile",
                });

            } else {
                console.log("Add avatar")
                return
            }
        }
    }

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

            }
        };
        initialize();
    }, [solanaWallet, walletAddress]);
    return (

        <div className='w-full h-screen  bg-[#F8FFE9] dark:bg-[#10332E] dark:border-[#40675F]' style={{backgroundImage:`url(${walletAddress && theme === 'dark' ?"/BgDarkMode.png": "/Bg.png"})`,width:'100%',height:'50%'}}>
            <div className=' flex justify-center items-center flex-col h-screen '>
                <div className='border-[#166F00] border-[1px] rounded-[26px] flex flex-col bg-white p-5 dark:bg-[#10332E] dark:border-[#40675F]'>
                    <div
                        onClick={() => {
                            avatarRef?.current?.click();
                        }}
                        className="rounded-full hover:cursor-pointer self-center py-3"
                    >
                        {avatar ? (
                            <img
                                onClick={() => {
                                    avatarRef?.current?.click();
                                }}
                                src={URL.createObjectURL(avatar)}
                                alt="avatar"
                                className='rounded-full h-[120px] w-[120px] border-4 border-[#166F00] dark:bg-[#264D49] dark:border-[#40675F]'
                            />
                        ) : (
                            <div className="flex flex-row">
                                <img
                                    src={walletAddress && theme === 'dark' ?"/UploadProfileIconDarkMode.svg": "/UploadProfileIcon.svg"}
                                    alt="ProfilePic"
                                    className="h-[120px] w-[120px] "
                                />

                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        ref={avatarRef}
                        onChange={(e) => {
                            if (!e.target.files) return;
                            setAvatar(e.target.files[0]);
                            console.log(e.target.files[0].type);
                        }}
                    />
                    <input
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Username"
                        className="bg-[#EAEAEA] w-[430px]  rounded-full text-[#8C8C8C] dark:text-gray-300 font-[Quicksand] mx-2 focus:outline-none  self-center mb-6 p-2 border-[1px] border-[#166F00] dark:bg-[#264D49] dark:border-[#264D49] dark:hover:border-[#40675F]"
                    />
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Bio"
                        className="bg-[#EAEAEA] w-[430px] h-[203px] rounded-lg text-[#8C8C8C] dark:text-gray-300 font-[Quicksand] mx-2 focus:outline-none mb-6 p-2 border-[1px] border-[#166F00] dark:bg-[#264D49] dark:border-[#264D49] dark:hover:border-[#40675F]"
                    />

                    <button className='bg-[#166F00] w-[40%] self-center font-[QuicksandBold] text-lg text-white p-2 rounded-xl dark:bg-[#264D49] dark:hover:bg-[#40675F]' onClick={createuser}>
                        Sign Up
                    </button>

                    <p className="text-center py-2 font-[Quicksand] w-[307px] self-center text-[#000000] dark:text-gray-300">
                        One time sign-up to access
                        the budding community
                    </p>
                </div>

            </div>
            <ToastContainer
                position="bottom-left"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                draggable
                theme='dark'
            />
        </div>
    )
}


export default CreateUser