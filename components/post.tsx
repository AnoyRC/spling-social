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
  const [like, setLike] = useState<Boolean>(false);
  const [totalLikes, setTotalLikes] = useState<number>(0);

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
    if(props.post?.likes){
      const check = props.post?.likes.find((userId) => userId === props.user?.userId);
      setLike(check ? true : false);
      setTotalLikes(props.post?.likes.length);
    }
    var tags = props.post?.tags[0].split(",");
    if(tags)  setTags(tags);
  }, [props.post?.timestamp, props.post?.likes]);

  const likePost = async () => {
    if(props?.post){
      await props.socialProtocol?.likePost(props.post?.publicKey);
    }
    if(like) setTotalLikes(totalLikes-1);
    else setTotalLikes(totalLikes+1);
    setLike(!like);
  }

  return (
    <div className="bg-[#FFFFFF] border-[#166f00] border-b-[1px] w-[100%] h-fit">
      <div className="ml-7 mt-4 flex hover:cursor-pointer" onClick={()=>{window.location.href = `/user/${props.post?.userId}`}}>
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
          <h1 className="text-[#505050] text-xl font-[QuicksandBold]">
            {props.post?.user.nickname}
          </h1>
          <h1 className="text-[#5E5E5E] text-sm font-[Quicksand]">{date?.toString()}</h1>
        </div>
      </div>
      <div>
        {props.post?.title && <h1 className="text-[#000000] text-2xl my-3 mx-7 font-[QuicksandLight] font-bold hover:cursor-pointer" onClick={()=>{window.location.href = `/post/${props.post?.postId}`}}>{props.post?.title.length < 63 ? props.post?.title : props.post?.title.substring(0,63) + "..."}</h1>}
        <div className="flex h-fit width-[100%] mb-4">
          {props.post && <h1 className="text-[#000000] text-base mx-7 w-[60%] font-[Quicksand]">{props.post?.text.length < 240 ? props.post?.text : props.post?.text.substring(0,239) + "..."}</h1>}
          <div className="bg-[#5E5E5E] w-[40%] h-[140px] mr-7 rounded-xl overflow-hidden">
          {props?.post?.media[0].file && <Image src={props?.post?.media[0].file} alt="media" width={500} height={400} className='transition delay-100 ease-in w-[100%] h-[100%] opacity-80 hover:opacity-100 rounded-lg object-cover hover:scale-110 z-0'></Image>}
          </div>
        </div>
      </div>
      <div className="flex mb-5">
        <div className="flex justify-start w-[70%] ml-5">
          {tags[0] && <div className="w-[fit] h-[fit] border-[#166f00] border-[1px] px-1 rounded-md ml-2">
            <h1 className="text-[#000000] font-[Quicksand]">{tags[0]}</h1>
          </div>}
          {tags[1] && <div className="w-[fit] h-[fit] border-[#166f00] border-[1px] px-1 rounded-md ml-2">
            <h1 className="text-[#000000] font-[Quicksand]">{tags[1]}</h1>
          </div>}
          {tags.length > 2 && (
            <div className="w-[fit] h-[fit] border-[#166f00] border-[1px] px-1 rounded-md ml-2">
              <h1 className="text-[#000000] font-[Quicksand]">{`+${tags.length-2}`}</h1>
            </div>
          )}
        </div>
        <div className="flex justify-end w-[100%] items-center mr-7">
          <div className='bg-[#F8FFE9] hover:border-[#166F00] hover:border-[1px] rounded-full px-3 h-7 w-12 self-center flex items-center justify-center ml-1 hover:cursor-pointer' onClick={likePost}>
              <Image src={like ? `/LikeActiveIcon.svg` : `/LikeIcon.svg`} alt="SearchButton" width={15} height={15} className=""></Image>
              <h1 className="text-[#000000] text-lg ml-1 font-[Quicksand]">{totalLikes}</h1>
          </div>
          <div className='bg-[#F8FFE9] hover:border-[#166F00] hover:border-[1px] rounded-full px-1.5 h-7 w-8 self-center flex items-center justify-center ml-1 hover:cursor-pointer' onClick={()=>{window.location.href = `/post/${props.post?.postId}`}}>
              <Image src="/CommentIcon.svg" alt="SearchButton" width={15} height={15} className=""></Image>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Posts;
