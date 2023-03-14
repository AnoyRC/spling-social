import { NextPage } from "next";
import { Post, SocialProtocol, Reply, User } from "@spling/social-protocol";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

interface Props {
  post: Post | undefined;
  socialProtocol: SocialProtocol | undefined;
  walletAddress: WalletContextState | undefined;
  user: User | null | undefined;
}

const ShortPost: NextPage<Props> = (props: Props) => {
  const{theme,setTheme}=useTheme()
    return(
    <div className="w-[100%] h-fit border-[#166f00] border-b-[1px] hover:bg-[#f2f2f2] hover:cursor-pointer transition ease-out dark:border-[#40675F] dark:hover:bg-[#264D49]" onClick={()=>{window.location.href = `/post/${props.post?.postId}`}}>
        <div className="flex mx-5 pt-4 pb-2">
        {props.post?.user.avatar && (
          <Image
            src={props.post?.user.avatar}
            alt="avatar"
            width={58}
            height={58}
            className="rounded-full h-[50px] w-[50px]"
          ></Image>
        )}
        <div className="flex flex-col ml-3 -mt-1.5">
            {props.post?.title && <h1 className="text-[#000000] text-xl font-[Quicksand] dark:text-gray-300">{props.post?.title.length < 40 ? props.post?.title : props.post?.title.substring(0,40) + "..."}</h1>}
            <h1 className="text-[#5E5E5E] text-sm font-[Quicksand] dark:text-gray-300">{props.post?.user.nickname}</h1>
            <div className='hover:bg-[#F8FFE9] rounded-full px-3 h-7 w-12 flex items-center justify-center mt-2 dark:hover:bg-[#40675F]'>
              <Image src={theme==='dark'?`/LikeIconDarkMode.svg`:`/LikeIcon.svg`} alt="SearchButton" width={15} height={15} className=""></Image>
              <h1 className="text-[#000000] text-lg ml-1 font-[Quicksand] dark:text-gray-300">{props.post?.likes.length}</h1>
            </div>
        </div>
        </div>
    </div>)
}

export default ShortPost;