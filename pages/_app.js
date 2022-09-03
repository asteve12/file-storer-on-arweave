import '../styles/globals.css'
import { providers, utils } from "ethers"
import { WebBundlr } from '@bundlr-network/client'
import { useRef, useState } from 'react'
import { MainContext } from '../context'



function MyApp({ Component, pageProps }) {
  const [bundlrInstance, setBundlrInstance] = useState()
  const [balance,setBalance]  = useState()
  const bundlrRef = useRef()

  async function initialize() {                                                                 

    await window.ethereum.enable()
    const provider = new providers.Web3Provider(window.ethereum)
    await provider._ready()
    const bundlr = new WebBundlr("https://devnet.bundlr.network", "matic", provider)
    await bundlr.ready() 
    setBundlrInstance(bundlr)
    bundlrRef.current= bundlr

    fetchBalance()
    
  }

  async function fetchBalance() {
    const bal = await bundlrRef.current.getLoadedBalance()
    console.log("bal: ", utils.formatEther(bal.toString()))
    setBalance(utils.formatEther(bal.toString()))
  }

  return <MainContext.Provider value={{
    initialize,
    fetchBalance,
    balance,
    bundlrInstance

  }}>
    <div    >
   <Component {...pageProps} />
  </div>
  </MainContext.Provider> 
} 



export default MyApp
