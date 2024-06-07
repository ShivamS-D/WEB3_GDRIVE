import { useContext } from "react";
import { ContractContext } from "./ContractContext";

export const useContract=()=>{
  const context=useContext(ContractContext);
  
  if(!context){
    throw Error("ERRORS")
  }
  return context;
}