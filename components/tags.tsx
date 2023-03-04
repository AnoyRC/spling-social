import { useEffect, useState } from "react"
import { NextPage } from "next";

interface Props{
    tags:string[];
    setTags:(tags:string[])=>void
}

const TagsInput: NextPage<Props> = (props: Props) => {

    //const [tags, setTags] = useState<string[]>([])
    const handleKeyDown=(evt:React.KeyboardEvent<HTMLInputElement>)=>{

        if(evt.key!=='Enter')return

        const value=(evt.target as HTMLInputElement).value
        if(!value.trim())return
        
        (evt.target as HTMLInputElement).value=""

        props?.setTags([...props?.tags,value])

        
    }
    const removeTag=(index:number)=>{
        props?.setTags(props?.tags.filter((el,i)=>i!==index))
    }

    return (
        <div className="flex flex-col w-2/4">
            <>
                {props?.tags.map((tag, index) => {
                    return(<div className="bg-gray-300 flex flex-row rounded-full px-2 h-[25px]" key={index}>
                        <h1 className="">{tag}</h1>
                        <div className="bg-gray-600 rounded-full ml-1 h-[20px] w-[20px] mt-1 text-white text-center flex justify-center items-center hover:cursor-pointer" onClick={()=>{removeTag(index)}}>
                            x
                        </div>
                    </div>)
                })}
            </>
            <input type="text" onKeyDown={handleKeyDown} className="p-[8px] flex" placeholder="Type something" />
        </div>
    )
}

export default TagsInput