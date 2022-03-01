# NFT Marketplace with Polygon, Next.js, Typescript, Tailwind, Solidity, Hardhat, Ethers.js and IPFS
## Web application framework - Next.js Solidity development environment - Hardhat File Storage - IPFS Ethereum Web Client Library - Ethers.js

### Deploy locally and run local node
#### First time deployment run hardhat node and attach account to your wallet and switch network to localhost
```
npx hardhat node

Output:
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========

WARNING: These accounts, and their private keys, are publicly known.
Any funds sent to them on Mainnet or any other live network WILL BE LOST.

Account #0: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

#### Once account setup and configured in config.js and hardhat node running, deploy the network
```
npx hardhat run scripts/deploy.js --network localhost

Output:
nftMarket deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
nft deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

#### Once the network is deployed successfully run the application
```
npm run dev
```

### Test output example
```
NFTMarket
items:  [
  {
    price: '100000000000000000000',
    tokenId: '2',
    seller: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    owner: '0x0000000000000000000000000000000000000000',
    tokenUri: 'https://www.token2.com'
  }
]
    ✓ Should create and execute market sales (1117ms)


  1 passing (1s)
```