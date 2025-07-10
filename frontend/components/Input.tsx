"use client"
export const Input = ({label,placeholder,onChange,type="text"} : {
  label:string;
  placeholder:string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>)=>void
  type?: "text" | "password"
 }) => {
 return <div>
  <div className="text-sm">
   * <label>{label}</label>
  </div>
   <input className="border rounded mt-1 w-full" type={type} placeholder={placeholder} onChange={onChange}/>
 </div>
}