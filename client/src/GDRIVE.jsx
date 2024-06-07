import React, { useEffect, useState } from 'react';
import { useContract } from './useContract';
import { useLocation } from 'react-router-dom';
import { ethers } from 'ethers';

const GDRIVE = () => {
  const { contract_and_web3 } = useContract();
  const { contract, signer } = contract_and_web3;
  const location = useLocation();
  const [whoImages, setWhoImages] = useState([]);
  const [error, setError] = useState(''); 
  const [refresh,setRefresh]=useState(null)
  const { who } = location.state || {};
   const [buying,setBuying]=useState(false)
  const getWhoUploadImages = async () => {
    try {
      const contractSigner = contract.connect(signer);
      const res = await contractSigner.getAccessedImages(who);
      setWhoImages(res);
    } catch (e) {
      const errorData = e?.error?.data?.message || e?.data?.message || 'Unknown error';
      setError(errorData); 
    }
  };

  useEffect(() => {
    getWhoUploadImages();
  }, [refresh]);
 
  const buyAccess =async ()=>{
    
    setBuying(true)
    try{

      const contractSigner = contract.connect(signer);
      const res=await contractSigner.buyAccess(who,{ value: ethers.utils.parseEther('0.0000001')});
      const receipt=await res.wait()
  setRefresh(receipt)
  setError('')
  setBuying(false)
    }
    catch(e){
      setBuying(false)
      console.log(e)
      
    }
  }
  return (
    <div>
      <div className="images-container">
        {error.length!== 0 ? <button onClickCapture={buyAccess}>{!buying?'Buy Access':'Buying'}</button> : whoImages.map((img, index) => (
          img.image.startsWith('https') ? <img key={index} src={img.image} alt="Uploaded" /> : null
        ))}
      </div>
      {error && <p className="error-message">Error: {error}</p>}  
    </div>
  );
};

export default GDRIVE;
