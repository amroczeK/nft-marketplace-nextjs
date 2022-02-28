# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```

### Test output example
```
NFTMarket
items:  [
  [
    BigNumber { value: "2" },
    '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    BigNumber { value: "2" },
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    '0x0000000000000000000000000000000000000000',
    BigNumber { value: "100000000000000000000" },
    false,
    itemId: BigNumber { value: "2" },
    nftContract: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    tokenId: BigNumber { value: "2" },
    seller: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    owner: '0x0000000000000000000000000000000000000000',
    price: BigNumber { value: "100000000000000000000" },
    sold: false
  ]
]
    ✓ Should create and execute market sales (1049ms)


  1 passing (1s)
```