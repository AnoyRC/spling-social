import { NextPage } from "next";
import { Post, SocialProtocol, Reply, User } from "@spling/social-protocol";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Props {
  post: Post | undefined;
  socialProtocol: SocialProtocol | undefined;
  walletAddress: WalletContextState | undefined;
  user: User | null | undefined;
}

const Posts: NextPage<Props> = (props: Props) => {
  const [date, setDate] = useState<String>();
  const [tags, setTags] = useState<String[]>([]);

  useEffect(() => {
    if (props.post?.timestamp) {
      var date = new Date(props.post?.timestamp * 1000); //Scaring me
      setDate(
        date.getDate() +
          " " +
          date.toString().substring(4, 7) +
          " " +
          date.getFullYear()
      ); 
    }
    var tags = props.post?.tags[0].split(",");
    if(tags)  setTags(tags);
  }, [props.post?.timestamp]);

  return (
    <div className="bg-[#FFFFFF] border-[#166f00] border-b-[1px] w-[100%] h-fit">
      <div className="ml-7 mt-4 flex">
        {props.post?.user.avatar && (
          <Image
            src={props.post?.user.avatar}
            alt="avatar"
            width={58}
            height={58}
            className="rounded-full h-[50px] w-[50px]"
          ></Image>
        )}
        <div className="flex flex-col ml-3">
          <h1 className="text-[#505050] text-xl">
            {props.post?.user.nickname}
          </h1>
          <h1 className="text-[#5E5E5E] text-sm">{date?.toString()}</h1>
        </div>
      </div>
      <div>
        <h1 className="text-[#000000] font-medium text-2xl my-3 mx-7">{props.post?.title}</h1>
        <div className="flex h-fit width-[100%] mb-4">
          <h1 className="text-[#000000] text-base mx-7 w-[60%]">{props.post?.text}</h1>
          <div className="bg-[#5E5E5E] w-[40%] h-[140px] mr-7 rounded-xl">
          {props?.post?.media[0].file && <Image src={props?.post?.media[0].file} alt="media" width={251} height={142} className='w-[100%] h-[100%] rounded-lg'></Image>}
          </div>
        </div>
      </div>
      <div className="flex mb-5">
        <div className="flex justify-start w-[70%] ml-5">
          {tags[0] && <div className="w-[fit] h-[fit] border-[#166f00] border-[1px] px-1 rounded-md ml-2">
            <h1 className="text-[#000000]">{tags[0]}</h1>
          </div>}
          {tags[1] && <div className="w-[fit] h-[fit] border-[#166f00] border-[1px] px-1 rounded-md ml-2">
            <h1 className="text-[#000000]">{tags[1]}</h1>
          </div>}
          {tags.length > 2 && (
            <div className="w-[fit] h-[fit] border-[#166f00] border-[1px] px-1 rounded-md ml-2">
              <h1 className="text-[#000000]">{`+${tags.length-2}`}</h1>
            </div>
          )}
        </div>
        <div className="flex justify-end w-[100%] items-center mr-7">
          <div className='bg-[#F8FFE9] hover:border-[#166F00] hover:border-[1px] rounded-full px-3 h-7 w-12 self-center flex items-center justify-center ml-1'>
              <Image src="/LikeIcon.svg" alt="SearchButton" width={15} height={15} className=""></Image>
              <h1 className="text-[#000000] text-lg ml-1">{props.post?.likes.length}</h1>
          </div>
          <div className='bg-[#F8FFE9] hover:border-[#166F00] hover:border-[1px] rounded-full px-1.5 h-7 w-8 self-center flex items-center justify-center ml-1'>
              <Image src="/CommentIcon.svg" alt="SearchButton" width={15} height={15} className=""></Image>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Posts;
