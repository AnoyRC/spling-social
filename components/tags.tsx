import { useEffect, useState } from "react"
import { NextPage } from "next";
import Image from "next/image";
import { useTheme } from "next-themes";

interface Props{
    tags:string[];
    setTags:(tags:string[])=>void
}

const TagsInput: NextPage<Props> = (props: Props) => {

    const {theme,setTheme}=useTheme()
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
                    return(<div className="bg-[#F8FFE9] flex flex-row rounded-full px-1 h-[25px] w-fit my-2 ml-2 border-[#166f00] border-[1px] justify-center items-center dark:bg-[#10332E] dark:border-[#40675F] " key={index}>
                        <h1 className=" text-[#000000] font-[QuickSand] ml-1 text-center pb-0.5 dark:text-gray-300">{tag}</h1>
                        <div className=" flex justify-center items-center ml-1 hover:cursor-pointer " onClick={()=>{removeTag(index)}}>
                            <Image src={theme==='dark'?`/CloseIconDarkMode.svg`:`/CloseIcon.svg`} alt="CloseButton" width={20} height={20} className=""></Image>
                        </div>
                    </div>)
                })}
            </>
            <input type="text" onKeyDown={handleKeyDown} className={`p-[8px] bg-white text-[#000000] font-[QuickSand] focus:outline-none ${props.tags.length<5?``:`hidden`} dark:placeholder:text-gray-400 dark:bg-[#10332E] dark:border-[#40675F] dark:text-gray-300`} placeholder={`${props.tags.length<5?`Add tags`:``}`} />
        </div>
    )
}

export default TagsInput