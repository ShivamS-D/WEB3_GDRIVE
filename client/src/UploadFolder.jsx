

import { useState } from "react";
import { jwt } from "../utils/jwts";

function UploadFolder() {
  const [selectedFile, setSelectedFile] = useState();
  const [imgHsh,setImgHsh]=useState([])
  const changeHandler = (event) => {
    console.log(event)
    setSelectedFile(event.target.files);
  };

  const handleSubmission = async () => {
    console.log("object")
    try {
      const formData = new FormData();
      Array.from(selectedFile).forEach((file) => {
        formData.append("file", file);
      });
      const metadata = JSON.stringify({
        name: "File name",
      });
      formData.append("pinataMetadata", metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: formData,
        }
      );
      const resData = await res.json();
      const url='https://silver-ready-termite-903.mypinata.cloud/ipfs/QmVkWcoekikg7fb9VAiDiXu4k65cAZ4KN98WSKDY6pwQv1/'
      setImgHsh((prevImgHsh) => [
        ...prevImgHsh,
        ...Array.from(selectedFile).map((file) => url + file.name)
      ]);
      console.log(resData)
      console.log(imgHsh)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <label className="form-label"> Choose File</label>
      <input
        directory=""
        webkitdirectory=""
        type="file"
        onChange={changeHandler}
      />

      <button onClick={handleSubmission}>Submit</button>
      {imgHsh.map(img=><li>{img}</li>)}
    </>
    
  );
}

export default UploadFolder;