import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useContext,useState } from "react"
import { MainContext } from '../context'
import BigNumber from 'bignumber.js'


export default function Home() {
  const [file, setFile] = useState()
  const [image, setImage] = useState()
  const [URI, setURI] = useState()
  const [amount, setAmount] = useState()

  let {
    initialize,
    fetchBalance,
    balance,
    bundlrInstance
  } = useContext(MainContext)

  async function initializeBundlr() {
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
    let tx = await bundlrInstance.uploader.upload(file, [{ name: "Content-Type", value: "image/png" }])
    setURI(`http://arweave.net/${tx.data.id}`)
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
    <div style={containerStyle}>
     
      {!balance &&  <button onClick={initializeBundlr}>initialize</button>}
      {balance && <>
        <h3>balance: {balance}</h3>
        <div style={{
          padding:"30px 0px"
        }} >
          <input
            placeholder="amount to fund wallet"
            onChange={e => setAmount(e.target.value)}
          value={amount}></input>
          <button onClick={fundWallet}>fundWallet</button>
        </div>
        <input type="file" onChange={onFileChange}/>
        <button onClick={uploadFile}>Upload File</button>
        {
          image && <img src={image} style={{
            width: "500px",
            

          }}></img>
        }
        {
          URI && <a href={URI}>{URI}</a>
       } 
       
      </>
        }
      
    </div>
  )
}

const containerStyle = {
  padding:"100px 20px"
}
