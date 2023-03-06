import { NextPage} from 'next';
import Image from 'next/image';
import { Reply } from '@spling/social-protocol';
import { useState, useEffect } from 'react';

interface Props {
    reply: Reply | null | undefined;
}


const ReplyBody : NextPage<Props> = (props: Props) => {
    const [date, setDate] = useState<String>();

    useEffect(() => {
        if (props.reply?.timestamp) {
          var date = new Date(props.reply?.timestamp * 1000); //Scaring me
            setDate(timeDifference(Date.now(), date.getTime()));
        }
      }, [props.reply?.timestamp]);

      function timeDifference(current : number, previous : number) {

        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;
    
        var elapsed = current - previous;
    
        if (elapsed < msPerMinute) {
             return Math.round(elapsed/1000) + ' seconds ago';   
        }
    
        else if (elapsed < msPerHour) {
             return Math.round(elapsed/msPerMinute) > 1 ? Math.round(elapsed/msPerMinute) + ' minutes ago' : Math.round(elapsed/msPerMinute) + ' minute ago';   
        }
    
        else if (elapsed < msPerDay ) {
             return Math.round(elapsed/msPerHour ) > 1 ? Math.round(elapsed/msPerHour ) + ' hours ago' : Math.round(elapsed/msPerHour ) + ' hour ago';   
        }
    
        else if (elapsed < msPerMonth) {
            return  Math.round(elapsed/msPerDay) > 1 ? Math.round(elapsed/msPerDay) + ' days ago' : Math.round(elapsed/msPerDay) + ' day ago';   
        }
    
        else if (elapsed < msPerYear) {
            return Math.round(elapsed/msPerMonth) > 1 ? Math.round(elapsed/msPerMonth) + ' months ago' : Math.round(elapsed/msPerMonth) + ' month ago';   
        }
    
        else {
            return Math.round(elapsed/msPerYear ) > 1 ? Math.round(elapsed/msPerYear ) + ' years ago' : Math.round(elapsed/msPerYear ) + ' year ago';   
        }
    }

    return (
      <div className="flex flex-col border-[#166f00] border-b-[1px] pb-4">
        <div className="flex ml-5 mt-2">
          {props.reply?.user.avatar && (
            <Image
              src={props.reply?.user.avatar}
              alt="avatar"
              width={100}
              height={100}
              className="rounded-full h-[45px] w-[45px]"
            ></Image>
          )}
          <div className="flex flex-col ml-2">
            <h1 className="text-[#505050] text-md font-[Quicksand]">
              {props.reply?.user.nickname}
            </h1>
            <h1 className="text-[#5E5E5E] text-sm font-[Quicksand]">{date?.toString()}</h1>
          </div>
        </div>
        <div className="flex flex-col ml-5 mt-2 pr-5">
            <h1 className="text-[#505050] text-md font-[Quicksand]">{props.reply?.text}</h1>
        </div>
      </div>
    );
}

export default ReplyBody;