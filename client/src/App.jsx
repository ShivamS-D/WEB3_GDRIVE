import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { abi } from './GoogleDrive.json';
import { jwt } from '../utils/jwts';
import './App.css'; // Import the CSS file
import { useContract } from './useContract';
import { Link, useNavigate } from 'react-router-dom';
const App = () => {
  const navigate=useNavigate()
  const {contract_and_web3,dispatch}=useContract()
  const [address, setAddress] = useState('');
  const [isConnected, setConnected] = useState(false);
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);
  const [imgHash, setImgHash] = useState('');
  const [showImg, setShowImg] = useState(false);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [accessAddr, setAccessAddr] = useState('');
  const [accessImg, setAccessedImg] = useState([]);
  const [showAccessImg, setShowAccessImg] = useState(false);
  const [addr,setAddr]=useState('')
  const [accessBy,setAccessBy]=useState([])
  const [whoHasUploaded,setWhoHasUpload]=useState([])
  const [isUploaded,setIsUploaded]=useState(false)
const [isAccessGiven,setIsAccessGiven]=useState(false)
const initializeContract = async () => {
  setError('');
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAddress(accounts[0]);
    localStorage.setItem('address', accounts[0]);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    // Use the address directly to get the balance
    // const balance = await signer.getBalance(accounts[0]);
    // console.log(balance.toString());

    setSigner(signer);

    const contract = new ethers.Contract('0xbc36127b0406da2bdb6139d5094071543ed13994', abi, signer);
    setContract(contract);

    setConnected(true);
    dispatch({ type: 'SET_CONTRACT', payload: { contract, signer, address: accounts[0] } });
  } catch (e) {
    setConnected(false);
    if (e.code === 4001) {
      setError('User rejected the request.');
    } else {
      setError('An error occurred while connecting to the wallet.');
    }
  }
};

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        initializeContract();
        setImages([]);
        setAccessBy([])
      });

      if (localStorage.getItem('address')) {
        initializeContract();
        }
        }

  }, []);

  useEffect(() => {
    if (receipt) {
      getImages();
      getWhoHasUploaded();
    }
  }, [receipt]);

  useEffect(()=>{
getAccessBy()
getWhoHasUploaded()

  },[contract,address])

  const handleDisconnect = () => {
    localStorage.removeItem('address');
    setAddress('');
    setConnected(false);
    setImages([]);
    setAccessedImg([]);
    setAccessBy([])
    setAccessAddr('')
    setAddr('')
    setShowImg(false);

    setShowAccessImg(false);
    dispatch({type:'RESET_CONTRACT'})
  };


  const getImages = async () => {
    if (contract && address) {
      try {
        const imgs = await contract.getAccessedImages(address);
        if (imgs) {
          setImages(imgs);
          setShowImg(true);
        }
      } catch (e) {
        setShowImg(false);
      }
    }
  };

  const uploadImg = async () => {
    setError('');
    setIsUploaded(true)
    try {
      
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        body: formData,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const json = await res.json();
      const imgHash = `https://silver-ready-termite-903.mypinata.cloud/ipfs/${json.IpfsHash}`;
      setImgHash(imgHash);
      if (contract && signer) {
        try {
          const contractWithSigner = contract.connect(signer);
          const response = await contractWithSigner.uploadImages(address,imgHash);
          const receipt = await response.wait();
          setReceipt(receipt);
          setError('')
          setIsUploaded(false)
        } catch (e) {
          setIsUploaded(false)
          setError('An error occurred while uploading the image to the contract.');
        }
      }
    } catch (e) {
      setIsUploaded(false)
      if (e.code === 4001) {
        setError('User rejected the transaction.');
      } else {
        setError('An error occurred while uploading the image.');
      }
    }
  };

  const giveAccess = async () => {
    
    if (contract && address && accessAddr) {
      setIsAccessGiven(true)
      try {
        const contractWithSigner = contract.connect(signer);
        await contractWithSigner.giveAccess(accessAddr);
        setIsAccessGiven(false)
      } catch (e) {
        setIsAccessGiven(false)

        console.log(e);
      }
    }
  };

  const getAccessedImage = async () => {
    
    if (contract && address ) {
      try {
        const contractWithSigner = contract.connect(signer);
        const res = await contractWithSigner.getAccessedImages(addr);
        setAccessedImg(res);
        setShowAccessImg(true);
      } catch (e) {
        console.log(e);
        setAccessedImg([])
        setShowAccessImg(false);
      }
    }
  };
   const getAccessBy=async ()=>{
     if(contract && address){
      const contractWithSigner = contract.connect(signer);
      const res=await contractWithSigner.getAccessedBy(address);
      setAccessBy(res)
    }
   }
   const getWhoHasUploaded=async()=>{
    const contractSigner=contract.connect(signer);
    const res=await contractSigner.getWhoHasUploaded()
    setWhoHasUpload(res)
  }
  return (
    <div className="container">
      {isConnected ? (
        <>
          <button key={1} onClick={handleDisconnect}>Disconnect</button>
          <p>{address}</p>
          <button onClick={getImages}>Get Images</button>
          {showImg && (
            <div>
              <p>Your Images</p>
            <div className="images-container">
              {images.length === 0 ? <p>You have no images</p> : images.map((img, index) => (
                img.image.startsWith('https') ? <img key={index} src={img.image} alt="Uploaded" /> : null
              ))}
              
            </div>
            </div>
          )}
          <div id='upload'>
          <label htmlFor="file-upload">Upload Your File</label>
          <input type="file" id="file-upload" onChange={e => setFile(e.target.files[0])} />
          <button onClick={uploadImg}>{!isUploaded?'Upload':'Uploading'}</button>
          </div>
          <br />
          <div className='address'>
            <label htmlFor="file_upload">Give Access</label>
            <input type="text" onChange={e => setAccessAddr(e.target.value)} placeholder='Address' />
            <button onClick={giveAccess}>{!isAccessGiven?'Give Access':'Giving Access'}</button>
          </div>
          {/* <input type="text" value={addr} /> */}
          <select onChange={e=>{setAddr(e.target.value); console.log(e.target.value)}}><option key={address} value={address}>Select The Address Which has given Access to you</option>
  {accessBy.map((img, index) => (
    <option key={index} value={img} >{img}</option>
  ))}
</select>
  <button onClick={getAccessedImage}>Get Accessed Image</button>
  {error && <p className="error">{error}</p>}
          
          {showAccessImg && (
            <div className="images-container">
              <p>Access Images</p>
              {accessImg.length === 0 ? <p>You have no images</p> : accessImg.map((img, index) => (
                img.image.startsWith('https') ? <img key={index} src={img.image} alt="Uploaded" /> : null
              ))}
            </div>
          )}
          <br />
          <p>You can buy the images uploaded by the addresses below</p>
          {whoHasUploaded.map(who=>(
            // <Link to={{pathname:'/buy',state:{who:"Ashutosh"}}}>{who}</Link>
            <button onClick={()=>{navigate('/buy',{state:{who}})}}>{who}</button>
          )

          )}
          {/* <Link to={'/buy'}>Uploaded By</Link> */}
        </>
      ) : (
        <button onClick={initializeContract}>Connect</button>
      )}
    </div>
  );
};

export default App;
