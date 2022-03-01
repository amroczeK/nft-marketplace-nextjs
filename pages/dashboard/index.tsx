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

const Dashboard: NextPage = () => {
  const [nfts, setNfts] = useState<any[]>([])
  const [sold, setSold] = useState<any[]>([])
  const [loadingState, setLoadingState] = useState<Boolean>(true)

  useEffect(() => {
    loadNfts()
  }, [])

  const loadNfts = async () => {
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
    const data = await marketContract.fetchItemsCreated()

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
          sold: i.sold,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        }
        return item
      })
    )

    const soldItems = items.filter((i) => i.sold)
    console.log('here', soldItems)

    setSold(soldItems)
    setNfts(items)
    setLoadingState(false)
  }

  if (!loadingState && !nfts.length)
    return <h2 className="px-20 py-10 text-3xl">No created assets</h2>

  return (
    <div className="flex flex-col justify-center">
      <div className="asset-container flex flex-col gap-6">
        <div>
          <h2 className="pb-4 text-2xl">Created Assets</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {nfts.map((nft, i) => (
              <NftCard index={i} nft={nft} />
            ))}
          </div>
        </div>
        {Boolean(sold.length) && (
          <div className="border-t-2">
            <h2 className="py-4 mt-4 text-2xl">Items Sold</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {sold.map((nft, i) => (
                <NftCard index={i} nft={nft} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
