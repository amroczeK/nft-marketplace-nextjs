// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    // Determine owner of contract to receive listing fee
    address payable owner;
    uint256 listingPrice = 0.025 ether;

    // Set the owner
    constructor() {
        owner = payable(msg.sender);
    }

    struct MarketItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;

    // Ommit event everytime item created
    event MarketItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    // Returns the listing price of the contract
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    // Places an item for sale on the marketplace
    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant { // Prevents re-entry attacks
        require(price > 0, "Price must be at least 1 wei");
        require(msg.value == listingPrice, "Price must be equal to listing price");

        _itemIds.increment();
        uint256 itemId = _itemIds.current();
    
        idToMarketItem[itemId] =  MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );

        // Transfer ownership of NFT to contract
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            false
        );
    }

    // Creates the sale of a marketplace item
    // Transfers ownership of the item, as well as funds between parties
    function createMarketSale(
        address nftContract,
        uint256 itemId
        ) public payable nonReentrant {
        uint price = idToMarketItem[itemId].price; // Ref to price
        uint tokenId = idToMarketItem[itemId].tokenId; // Ref to token
        // Validate asking price equal to value
        require(msg.value == price, "Please submit the asking price in order to complete the purchase");

        // Transfer value of transaction to seller
        idToMarketItem[itemId].seller.transfer(msg.value);
        // Transfer contract ownership to buyer
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketItem[itemId].owner = payable(msg.sender); // Change owner on market item
        idToMarketItem[itemId].sold = true; // Set market item to sold
        _itemsSold.increment(); // Total items sold incremented
        payable(owner).transfer(listingPrice); // Commission
    }

    // Returns an array of all unsold market items
    // It is a VIEW - doesn't do any transactional processing
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint itemCount = _itemIds.current(); // Total number of items currently created
        uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
        uint currentIndex = 0;

        // Total number of unsold items
        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint i = 0; i < itemCount; i++) {
            // If item has empty address, it hasn't been sold yet
            if (idToMarketItem[i + 1].owner == address(0)) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                // Add unsold item to array
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns an array of items that the user has purchased */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        // Count number of items user has created
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            // Validate user owns item and add item to items array
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns an array of items the user has created */
    function fetchItemsCreated() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}