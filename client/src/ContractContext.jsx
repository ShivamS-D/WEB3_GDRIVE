import { createContext, useReducer } from "react"
export const ContractContext=createContext();
export const contractReducer=(state,action)=>{
  switch(action.type){
    case 'SET_CONTRACT':
      return {
        contract_and_web3:action.payload
        
      }
    case 'RESET_CONTRACT':
      return {
        contract_and_web3:{contract:{},signer:null, address:''}
      }
      default:
        return state
  }
}

export const ContractContextProvider=({children})=>{
  const [state,dispatch]=useReducer(contractReducer,{contract_and_web3:{contract:{},signer:null, address:''}});
  return (
    <ContractContext.Provider value={{...state,dispatch}}>
      {children}
    </ContractContext.Provider>
  )
}