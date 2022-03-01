import type { NextPage } from 'next'
import Head from 'next/head'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { IMarketItem } from '../types'

import { nftaddress, nftmarketaddress } from '../config'

// JSON representation of smart contract ref from artifacts
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

const Home: NextPage = () => {
  const [nfts, setNfts] = useState<any[]>([])
  const [loadingState, setLoadingState] = useState<Boolean>(true)

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider()
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      provider
    )
    const data = await marketContract.fetchMarketItems()

    const items: any[] = await Promise.all(
      data.map(async (i: any) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)
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
  }

  async function buyNft(nft: any) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)

    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')

    const transaction = await contract.createMarketSale(
      nftaddress,
      nft.tokenId,
      {
        value: price,
      }
    )
    await transaction.wait()
    await loadNFTs()
  }

  if (!loadingState && !nfts.length)
    return <h2 className="px-20 py-10 text-3xl">No items in marketplace</h2>

  return (
    <div className="flex justify-center">
      <Head>
        <title>NFT Marketplace</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-4">
          {nfts.map((nft, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border shadow hover:scale-105"
            >
              <img src={nft.image} alt={nft.name} />
              <div className="p-4">
                <h3 className="h-[64px] text-2xl font-semibold">{nft.name}</h3>
                <div className="h-[70px] overflow-hidden">
                  <p>{nft.description}</p>
                </div>
              </div>
              <div className="bg-gray-800 p-4">
                <p className="mb-4 text-2xl font-bold text-white">
                  {nft.price} Matic
                </p>
                <button
                  className="w-full rounded bg-gray-700 py-2 px-12 font-bold text-white"
                  onClick={() => buyNft(nft)}
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
