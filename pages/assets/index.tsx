import type { NextPage } from 'next'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'

import { nftaddress, nftmarketaddress } from '../../config'

// JSON representation of smart contract ref from artifacts
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import NftCard from '../../components/NftCard'

const Assets: NextPage = () => {
  const [nfts, setNfts] = useState<any[]>([])
  const [loadingState, setLoadingState] = useState<Boolean>(true)

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    try {
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()

      // Use provider to get ref to token contract
      const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
      // Use signer to get ref to market contract, so we know message.sender
      const marketContract = new ethers.Contract(
        nftmarketaddress,
        Market.abi,
        signer
      )
      const data = await marketContract.fetchMyNFTs()

      const items: any[] = await Promise.all(
        data.map(async (i: any) => {
          const tokenUri = await tokenContract.tokenURI(i.tokenId)
          const meta = await axios.get(tokenUri) // Token metadata
          let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
          }
          return item
        })
      )
      setNfts(items)
      setLoadingState(false)
    } catch (error) {
      console.log(error)
    }
  }

  if (!loadingState && !nfts.length)
    return <h2 className="px-20 py-10 text-3xl">No assets owned</h2>

  return (
    <div className="flex justify-center">
      <div className="asset-container">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {nfts.map((nft, i) => (
            <NftCard index={i} nft={nft} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Assets
