import { useEffect, useState } from "react"
import { NextPage } from "next";
import Image from "next/image";

interface Props{
    tags:string[];
    setTags:(tags:string[])=>void
}

const TagsInput: NextPage<Props> = (props: Props) => {

    //const [tags, setTags] = useState<string[]>([])
    const handleKeyDown=(evt:React.KeyboardEvent<HTMLInputElement>)=>{
        

        if(evt.key!=='Enter')return

        if(props.tags.length>5){
            console.log(props.tags.length)
            return
        }

        const value=(evt.target as HTMLInputElement).value
        if(!value.trim())return
        
        (evt.target as HTMLInputElement).value=""
        
        if(props.tags.length<5){
            props?.setTags([...props?.tags,value])
        }
        else{

        }
                
    }
    const removeTag=(index:number)=>{
        props?.setTags(props?.tags.filter((el,i)=>i!==index))
    }

    return (
        <div className="w-2/4 pb-4">
            <>
                {props?.tags.map((tag, index) => {
                    return(<div className="bg-[#F8FFE9] flex flex-row rounded-full px-1 h-[25px] w-fit my-2 ml-2 border-[#166f00] border-[1px] justify-center items-center" key={index}>
                        <h1 className=" text-[#000000] font-[QuickSand] ml-1 text-center pb-0.5">{tag}</h1>
                        <div className=" flex justify-center items-center ml-1 hover:cursor-pointer " onClick={()=>{removeTag(index)}}>
                            <Image src="/CloseIcon.svg" alt="CloseButton" width={20} height={20} className=""></Image>
                        </div>
                    </div>)
                })}
            </>
            <input type="text" onKeyDown={handleKeyDown} className={`p-[8px] bg-white text-[#000000] font-[QuickSand] flex focus:outline-none ${props.tags.length>5?`hidden`:``}`} placeholder="Add tags" />
        </div>
    )
}

export default TagsInput