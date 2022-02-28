const { expect } = require("chai");
const { ethers } = require("hardhat");

// describe("Greeter", function () {
//   it("Should return the new greeting once it's changed", async function () {
//     const Greeter = await ethers.getContractFactory("Greeter");
//     const greeter = await Greeter.deploy("Hello, world!");
//     await greeter.deployed();

//     expect(await greeter.greet()).to.equal("Hello, world!");

//     const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

//     // wait until the transaction is mined
//     await setGreetingTx.wait();

//     expect(await greeter.greet()).to.equal("Hola, mundo!");
//   });
// });

describe("NFTMarket", function(){
  it("Should create and execute market sales", async function(){
    // Get reference to market contract
    const Market = await ethers.getContractFactory("NFTMarket")
    // Deploy and wait for market to be deployed
    const market = await Market.deploy()
    await market.deployed()
    const marketAddress = market.address // Get ref to address from which it was deployed

    // Deploy NFT contract
    const NFT = await ethers.getContractFactory("NFT")
    const nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    const nftContractAddress = nft.address

    let listingPrice = await market.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('100', 'ether')

    // Create NFT tokens
    await nft.createToken("https://www.token.com")
    await nft.createToken("https://www.token2.com")

    // List tokens
    await market.createMarketItem(nftContractAddress, 1, auctionPrice, { value: listingPrice })
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, { value: listingPrice })

    // Get test accounts
    // Ignore first address and get ref to buyer address, e.g. sellect = _, buyer = buyerAddress
    const [_, buyerAddress] = await ethers.getSigners()

    // Connect to market using buyer address and create market sale
    await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, { value: auctionPrice })

    // Query market items
    const items = await market.fetchMarketItems()

    console.log('items: ', items)

  });
})