import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useContext,useState } from "react"
import { MainContext } from '../context'
import BigNumber from 'bignumber.js'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BeatLoader } from 'react-spinners'



export default function Home() {
  const [file, setFile] = useState()
  const [image, setImage] = useState()
  const [URI, setURI] = useState()
  const [amount, setAmount] = useState()
  const [isUpload,setIsUpload] = useState(false)

  let {
    initialize,
    fetchBalance,
    balance,
    bundlrInstance
  } = useContext(MainContext)

  async function initializeBundlr() {
    console.log(window.ethereum)
    if (!window.ethereum) return toast("please install metamask")
    if(window.ethereum.networkVersion !== 80001) return toast("only polygon testnet supported")
    initialize()
    
  }
  async function fundWallet() {
    if (!amount) return
    const amountParsed = parseInput(amount)
    let response = await bundlrInstance.fund(amountParsed)
    console.log("Wallet funded: ", response)
    fetchBalance()

    
    
  }

  function parseInput(input) {
    const conv = new BigNumber(input).multipliedBy(bundlrInstance.currencyConfig.base[1])
    if (conv.isLessThan(1)) {
      console.log("error: value too small")
      return;
    }
    else {

      return conv
    }
  }

  async function uploadFile() {
    if(balance <= 0) return toast("please provide enough fund to handle upload")
    if (!file) return toast("please select a file to upload")
    setIsUpload(true)
    let tx = await bundlrInstance.uploader.upload(file, [{ name: "Content-Type", value: "image/png" }])
    setURI(`http://arweave.net/${tx.data.id}`)
    console.log("my-tx",tx)
     if(tx.status === 200) {
      setIsUpload(false)
      toast("file uploaded successfully")
}
    
  }

  async function onFileChange(e) {
    const file = e.target.files[0]
    if (file) {
      const image = URL.createObjectURL(file)
      setImage(image)
      let reader = new FileReader()
      reader.onload = function () {
        if (reader.result) {
          setFile(Buffer.from(reader.result))
        }
      }
      reader.readAsArrayBuffer(file)
      
    }
    

  }



  return (
    <div className="w-full border-box min-h-screen bg-[#18454A] flex justify-center items-center flex-col   text-[20px] sm:h-screen pb-20 " >
      <ToastContainer
      position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
/>
{/* Same as */}
<ToastContainer />
      <section className='absolute top-0 left-0 pl-5 pt-5 text-[30px] font-bold text-white'>
        <h3  className="">Upstore</h3>
      </section>
      {!balance && <p className="text-[30px] text-center text-white"> Start uploading all  your files using decentralise Protocol</p>}
      {!balance &&  <button className="w-[200px] h-[70px] bg-white text-[#18454A] rounded-xl mt-5"onClick={initializeBundlr}>initialize</button>}
      {balance && <section className='w-[90%]  mt-40 bg-white rounded-xl p-3 shadow-2xl flex flex-col justify-center md:w-[450px]	'>
      {balance && <>
          <h3 className='bg-white  text-[#18454A]'>
            <span className='text-[12px]'>Balance Available to Fund Upload</span>
            <br></br>
            {balance}
          </h3>
        <div className='flex flex-row mt-5 items-center '>
          <input
            placeholder="amount to fund wallet"
            className='w-[60%] h-[50px] p-5 rounded-xl mr-2 text-center  border-2 '
            onChange={e => setAmount(e.target.value)}
              value={amount}>
          </input>
          <button className="w-[140px] h-[50px] rounded-xl bg-[#18454A] text-white" onClick={fundWallet}>fundWallet</button>
        </div>
          <input className="mt-5 mb-5" type="file" onChange={onFileChange} />
          {
          image && <img  className="mt-5 mb-5 h-[200px] w-full object-cover" src={image} ></img>
        }
          <button className='w-full text-white h-[50px] p-2 bg-[#FF5A59] rounded-xl  shadow-2xl' onClick={uploadFile}>
            { !isUpload && "Upload File"}
            {isUpload && <BeatLoader color="#18454A"></BeatLoader> }
          </button>
     
        {
          URI && <a href={URI}  className="text-[15px] text-center mt-1 text-[#f87171]" target="open">check out the image uploaded</a>
       } 
       
      </>
        }

      </section> }
      
    
      
    </div>
  )
}


