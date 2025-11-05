// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract TrustLens is ERC721URIStorage, Ownable {
    uint256 private _articleIds;

    struct Article {
        uint256 id;
        address author;
        string metadataURI;  // URI pointing to the article metadata (e.g., IPFS)
        uint256 timestamp;
    }

    mapping(uint256 => Article) public articles;
    mapping(address => bool) public registeredJournalists;
    mapping(address => uint256[]) public journalistArticles;

    event ArticlePublished(uint256 indexed id, address indexed author, string metadataURI, uint256 timestamp);
    event JournalistRegistered(address indexed journalist);

    modifier onlyRegisteredJournalist() {
        require(registeredJournalists[msg.sender], "Only registered journalists can perform this action");
        _;
    }

    constructor() ERC721("TrustLensArticle", "TLA") Ownable(msg.sender) {
        // This will set the owner of the contract to the deployer
        transferOwnership(msg.sender);
    }

    // Journalists can register themselves
    function registerJournalist() public {
        registeredJournalists[msg.sender] = true;
        emit JournalistRegistered(msg.sender);
    }

    // Publish an article by providing metadata URI
    function publishArticle(string memory _metadataURI) public onlyRegisteredJournalist {
        _articleIds++;
        uint256 newArticleId = _articleIds;

        articles[newArticleId] = Article(
            newArticleId,
            msg.sender,
            _metadataURI,
            block.timestamp
        );

        journalistArticles[msg.sender].push(newArticleId);

        // Mint an NFT to represent the ownership of the article
        _mint(msg.sender, newArticleId);
        _setTokenURI(newArticleId, _metadataURI);  // Set the token's URI to the metadata URI

        emit ArticlePublished(newArticleId, msg.sender, _metadataURI, block.timestamp);
    }

    // Get articles published by a journalist
    function getArticlesByJournalist(address _journalist) public view returns (uint256[] memory) {
        return journalistArticles[_journalist];
    }

    // Get all articles
    function getAllArticles() public view returns (Article[] memory) {
        Article[] memory allArticles = new Article[](_articleIds);
        for (uint256 i = 1; i <= _articleIds; i++) {
            allArticles[i - 1] = articles[i];
        }
        return allArticles;
    }

    // Get article details by ID
    function getArticle(uint256 _id) public view returns (Article memory) {
        require(articles[_id].author != address(0), "Article does not exist");
        return articles[_id];
    }
}
