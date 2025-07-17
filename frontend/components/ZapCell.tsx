
export const ZapCell = ({name,index,onClick,image} : {name: string;index:number;onClick:()=> void; image?: string;}) => {
  return <div onClick={onClick} className="border border-black py-8 px-8 flex justify-center w-[300px]">
   <div className="flex items-center space-x-1 text-xl">
    <div className="font-bold">
        {index}. 
    </div>
     {image && (
          <img
            src={image}
            alt={name}
            className="w-8 h-6 rounded"
          />
        )}
    <div>
        {name}
    </div>
    </div>
  </div>
}