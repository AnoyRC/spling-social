import { useEffect, useState } from "react"

function TagsInput() {

    const [tags, setTags] = useState<string[]>(["HTML","CSS"])
    const handleKeyDown=(evt:React.KeyboardEvent<HTMLInputElement>)=>{

        if(evt.key!=='Enter')return

        const value=(evt.target as HTMLInputElement).value
        if(!value.trim())return
        
        (evt.target as HTMLInputElement).value=""

        setTags([...tags,value])

        
    }
    const removeTag=(index:number)=>{
        setTags(tags.filter((el,i)=>i!==index))
    }

    return (
        <div className="flex flex-row">
            <>
                {tags.map((tag, index) => {
                    return(<div className="bg-gray-300 flex flex-row rounded-full px-2 h-[25px]" key={index}>
                        <h1 className="">{tag}</h1>
                        <div className="bg-gray-600 rounded-full ml-1 h-[20px] w-[20px] mt-1 text-white text-center flex justify-center items-center hover:cursor-pointer" onClick={()=>{removeTag(index)}}>
                            x
                        </div>
                    </div>)
                })}
            </>
            <input type="text" onKeyDown={handleKeyDown} className="tags-input" placeholder="Type somthing" />
        </div>
    )
}

export default TagsInput