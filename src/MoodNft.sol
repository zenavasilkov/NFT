//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

contract MoodNft is ERC721 {
    uint256 private s_tokenCounter;
    string private s_happySvgImageUri;
    string private s_sadSvgImageUri;
    string private constant BASE_URI = "data:application/json;base64,";

    enum Mood {
        HAPPY,
        SAD
    }

    error MoodNft__CannotFlipMoodIfNotOwner();
    mapping(uint256 => Mood) private s_tokenIdToMood;

    constructor(string memory happySvgImageUri, string memory sadSvgImageUri) ERC721("Mood NFT", "MN") {
        s_tokenCounter = 0;
        s_happySvgImageUri = happySvgImageUri;
        s_sadSvgImageUri = sadSvgImageUri;
    }

    function mintNft() public {
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter++;
    }

    function flipMood(uint256 tokenId) public {
        if (getApproved(tokenId) != msg.sender && ownerOf(tokenId) != msg.sender) {
            revert MoodNft__CannotFlipMoodIfNotOwner();
        }

        if (s_tokenIdToMood[tokenId] == Mood.HAPPY) {
            s_tokenIdToMood[tokenId] = Mood.SAD;
        } else {
            s_tokenIdToMood[tokenId] = Mood.HAPPY;
        }
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);

        string memory imageURI;

        imageURI = s_tokenIdToMood[tokenId] == Mood.HAPPY ? s_happySvgImageUri : s_sadSvgImageUri;

        return string(
            abi.encodePacked(
                BASE_URI,
                Base64.encode(
                    abi.encodePacked(
                        '{"name":"',
                        name(),
                        '", "description":"An NFT that reflects the mood of the owner, 100% on Chain!", ',
                        '"attributes": [{"trait_type": "moodiness", "value": 100}], "image":"',
                        imageURI,
                        '"}'
                    )
                )
            )
        );
    }
}
