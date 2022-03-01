import type { NextPage } from 'next'
import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

const client = ipfsHttpClient({
  url: 'https://ipfs.infura.io:5001/api/v0',
})

import { nftaddress, nftmarketaddress } from '../../config'

// JSON representation of smart contract ref from artifacts
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

const CreateItem: NextPage = () => {
  const [uploading, setUploading] = useState(false)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [formInput, updateFormInput] = useState({
    price: '',
    name: '',
    description: '',
  })

  const router = useRouter()

  const onChange = async (e: any) => {
    const file = e.target.files[0]
    try {
      setUploading(true)
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      })
      setUploading(false)

      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log(error)
      setUploading(false)
    }
  }

  const createMarketItem = async () => {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return
    const data = JSON.stringify({ name, description, image: fileUrl })

    try {
      setUploading(true)
      const added = await client.add(data)
      setUploading(false)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      // After files is uploaded to IPFS, pass URL to save it on Polygon
      createSale(url)
    } catch (error) {
      console.log('Error uploading file:', error)
      setUploading(false)
    }
  }

  const createSale = async (url: string) => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)

    let signer = provider.getSigner()
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)

    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()

    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()

    const price = ethers.utils.parseUnits(formInput.price, 'ether')

    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()

    transaction = await contract.createMarketItem(nftaddress, tokenId, price, {
      value: listingPrice,
    })

    await transaction.wait()
    router.push('/')
  }

  return (
    <div className="flex justify-center">
      <div className="flex w-1/2 flex-col pb-12">
        <input
          placeholder="Asset Name"
          className="mt-8 rounded border p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 rounded border p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          placeholder="Asset Price in Matic"
          className="mt-8 rounded border p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        <input type="file" name="Asset" className="my-4" onChange={onChange} />
        {fileUrl && <img className="mt-4 rounded" width="350" src={fileUrl} />}
        <button
          onClick={createMarketItem}
          className="mt-4 rounded bg-gray-800 p-4 font-bold text-white shadow-lg"
        >
          Create Digital Asset
        </button>
      </div>
    </div>
  )
}

export default CreateItem;