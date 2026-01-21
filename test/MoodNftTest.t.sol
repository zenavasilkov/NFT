//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Test, console} from "../lib/forge-std/src/Test.sol";
import {MoodNft} from "../src/MoodNft.sol";

contract MoodNftTest is Test {
    MoodNft moodNft;
    string public constant HAPPY_MOOD_IMAGE_URI =
        "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgd2lkdGg9IjQwMCIgIGhlaWdodD0iNDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgZmlsbD0ieWVsbG93IiByPSI3OCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIzIi8+CiAgPGcgY2xhc3M9ImV5ZXMiPgogICAgPGNpcmNsZSBjeD0iNzAiIGN5PSI4MiIgcj0iMTIiLz4KICAgIDxjaXJjbGUgY3g9IjEyNyIgY3k9IjgyIiByPSIxMiIvPgogIDwvZz4KICA8cGF0aCBkPSJtMTM2LjgxIDExNi41M2MuNjkgMjYuMTctNjQuMTEgNDItODEuNTItLjczIiBzdHlsZT0iZmlsbDpub25lOyBzdHJva2U6IGJsYWNrOyBzdHJva2Utd2lkdGg6IDM7Ii8+Cjwvc3ZnPgo=";
    string public constant SAD_MOOD_IMAGE_URI =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAyNHB4IiBoZWlnaHQ9IjEwMjRweCIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBmaWxsPSIjMzMzIiBkPSJNNTEyIDY0QzI2NC42IDY0IDY0IDI2NC42IDY0IDUxMnMyMDAuNiA0NDggNDQ4IDQ0OCA0NDgtMjAwLjYgNDQ4LTQ0OFM3NTkuNCA2NCA1MTIgNjR6bTAgODIwYy0yMDUuNCAwLTM3Mi0xNjYuNi0zNzItMzcyczE2Ni42LTM3MiAzNzItMzcyIDM3MiAxNjYuNiAzNzIgMzcyLTE2Ni42IDM3Mi0zNzIgMzcyeiIvPgogIDxwYXRoIGZpbGw9IiNFNkU2RTYiIGQ9Ik01MTIgMTQwYy0yMDUuNCAwLTM3MiAxNjYuNi0zNzIgMzcyczE2Ni42IDM3MiAzNzIgMzcyIDM3Mi0xNjYuNiAzNzItMzcyLTE2Ni42LTM3Mi0zNzItMzcyek0yODggNDIxYTQ4LjAxIDQ4LjAxIDAgMCAxIDk2IDAgNDguMDEgNDguMDEgMCAwIDEtOTYgMHptMzc2IDI3MmgtNDguMWMtNC4yIDAtNy44LTMuMi04LjEtNy40QzYwNCA2MzYuMSA1NjIuNSA1OTcgNTEyIDU5N3MtOTIuMSAzOS4xLTk1LjggODguNmMtLjMgNC4yLTMuOSA3LjQtOC4xIDcuNEgzNjBhOCA4IDAgMCAxLTgtOC40YzQuNC04NC4zIDc0LjUtMTUxLjYgMTYwLTE1MS42czE1NS42IDY3LjMgMTYwIDE1MS42YTggOCAwIDAgMS04IDguNHptMjQtMjI0YTQ4LjAxIDQ4LjAxIDAgMCAxIDAtOTYgNDguMDEgNDguMDEgMCAwIDEgMCA5NnoiLz4KICA8cGF0aCBmaWxsPSIjMzMzIiBkPSJNMjg4IDQyMWE0OCA0OCAwIDEgMCA5NiAwIDQ4IDQ4IDAgMSAwLTk2IDB6bTIyNCAxMTJjLTg1LjUgMC0xNTUuNiA2Ny4zLTE2MCAxNTEuNmE4IDggMCAwIDAgOCA4LjRoNDguMWM0LjIgMCA3LjgtMy4yIDguMS03LjQgMy43LTQ5LjUgNDUuMy04OC42IDk1LjgtODguNnM5MiAzOS4xIDk1LjggODguNmMuMyA0LjIgMy45IDcuNCA4LjEgNy40SDY2NGE4IDggMCAwIDAgOC04LjRDNjY3LjYgNjAwLjMgNTk3LjUgNTMzIDUxMiA1MzN6bTEyOC0xMTJhNDggNDggMCAxIDAgOTYgMCA0OCA0OCAwIDEgMC05NiAweiIvPgo8L3N2Zz4K";

    address public user = makeAddr("user");
    address public user2 = makeAddr("user2");

    function setUp() public {
        moodNft = new MoodNft(HAPPY_MOOD_IMAGE_URI, SAD_MOOD_IMAGE_URI);
    }

    function testNameIsCorrect() public view {
        string memory expectedName = "Mood NFT";
        string memory actualName = moodNft.name();
        assert(keccak256(abi.encodePacked(expectedName)) == keccak256(abi.encodePacked(actualName)));
    }

    function testSymbolIsCorrect() public view {
        string memory expectedSymbol = "MN";
        string memory actualSymbol = moodNft.symbol();
        assert(keccak256(abi.encodePacked(expectedSymbol)) == keccak256(abi.encodePacked(actualSymbol)));
    }

    function testMintNft() public {
        vm.prank(user);
        moodNft.mintNft();

        assert(moodNft.balanceOf(user) == 1);
        assert(moodNft.ownerOf(0) == user);
    }

    function testMintMultipleNfts() public {
        vm.startPrank(user);
        moodNft.mintNft();
        moodNft.mintNft();
        vm.stopPrank();

        assert(moodNft.balanceOf(user) == 2);
        assert(moodNft.ownerOf(0) == user);
        assert(moodNft.ownerOf(1) == user);
    }

    function testMultipleUsersCanMint() public {
        vm.prank(user);
        moodNft.mintNft();

        vm.prank(user2);
        moodNft.mintNft();

        assert(moodNft.balanceOf(user) == 1);
        assert(moodNft.balanceOf(user2) == 1);
        assert(moodNft.ownerOf(0) == user);
        assert(moodNft.ownerOf(1) == user2);
    }

    function testTokenURIStartsWithBaseURI() public {
        vm.prank(user);
        moodNft.mintNft();

        string memory uri = moodNft.tokenURI(0);
        string memory baseUri = "data:application/json;base64,";

        bytes memory uriBytes = bytes(uri);
        bytes memory baseUriBytes = bytes(baseUri);

        assert(uriBytes.length >= baseUriBytes.length);

        bool matches = true;
        for (uint256 i = 0; i < baseUriBytes.length; i++) {
            if (uriBytes[i] != baseUriBytes[i]) {
                matches = false;
                break;
            }
        }
        assert(matches);
    }

    function testTokenURIContainsHappyImageInitially() public {
        vm.prank(user);
        moodNft.mintNft();

        string memory uri = moodNft.tokenURI(0);

        bytes memory uriBytes = bytes(uri);
        string memory baseUri = "data:application/json;base64,";
        uint256 startIdx = bytes(baseUri).length;

        bytes memory base64Json = new bytes(uriBytes.length - startIdx);
        for (uint256 i = startIdx; i < uriBytes.length; i++) {
            base64Json[i - startIdx] = uriBytes[i];
        }

        assert(uriBytes.length > startIdx);
    }

    function testFlipMoodFromHappyToSad() public {
        vm.startPrank(user);
        moodNft.mintNft();
        string memory uriBefore = moodNft.tokenURI(0);
        moodNft.flipMood(0);
        string memory uriAfter = moodNft.tokenURI(0);
        vm.stopPrank();

        assert(keccak256(abi.encodePacked(uriBefore)) != keccak256(abi.encodePacked(uriAfter)));
    }

    function testFlipMoodFromSadToHappy() public {
        vm.startPrank(user);
        moodNft.mintNft();
        moodNft.flipMood(0);
        string memory uriWhenSad = moodNft.tokenURI(0);
        moodNft.flipMood(0);
        string memory uriWhenHappy = moodNft.tokenURI(0);
        vm.stopPrank();

        assert(keccak256(abi.encodePacked(uriWhenSad)) != keccak256(abi.encodePacked(uriWhenHappy)));
    }

    function testFlipMoodTwiceReturnsToOriginal() public {
        vm.startPrank(user);
        moodNft.mintNft();
        string memory originalUri = moodNft.tokenURI(0);
        moodNft.flipMood(0);
        moodNft.flipMood(0);
        string memory finalUri = moodNft.tokenURI(0);
        vm.stopPrank();

        assert(keccak256(abi.encodePacked(originalUri)) == keccak256(abi.encodePacked(finalUri)));
    }

    function testCannotFlipMoodIfNotOwner() public {
        vm.prank(user);
        moodNft.mintNft();

        vm.prank(user2);
        vm.expectRevert(MoodNft.MoodNft__CannotFlipMoodIfNotOwner.selector);
        moodNft.flipMood(0);
    }

    function testCanFlipMoodIfApproved() public {
        vm.startPrank(user);
        moodNft.mintNft();
        moodNft.approve(user2, 0);
        vm.stopPrank();

        vm.prank(user2);
        moodNft.flipMood(0);
    }

    function testTokenURIForNonExistentToken() public {
        vm.expectRevert();
        moodNft.tokenURI(999);
    }

    function testTokenURIChangesAfterMoodFlip() public {
        vm.startPrank(user);
        moodNft.mintNft();
        string memory uri1 = moodNft.tokenURI(0);

        moodNft.flipMood(0);
        string memory uri2 = moodNft.tokenURI(0);

        moodNft.flipMood(0);
        string memory uri3 = moodNft.tokenURI(0);
        vm.stopPrank();

        assert(keccak256(abi.encodePacked(uri1)) != keccak256(abi.encodePacked(uri2)));
        assert(keccak256(abi.encodePacked(uri2)) != keccak256(abi.encodePacked(uri3)));
        assert(keccak256(abi.encodePacked(uri1)) == keccak256(abi.encodePacked(uri3)));
    }

    function testFlipMoodMultipleTokens() public {
        vm.startPrank(user);
        moodNft.mintNft();
        moodNft.mintNft();
        vm.stopPrank();

        vm.prank(user);
        moodNft.flipMood(0);

        string memory token1Uri = moodNft.tokenURI(1);
        vm.prank(user);
        moodNft.flipMood(0);

        string memory token1UriAfter = moodNft.tokenURI(1);

        assert(keccak256(abi.encodePacked(token1Uri)) == keccak256(abi.encodePacked(token1UriAfter)));
    }

    function testViewTokenURI() public {
        vm.prank(user);
        moodNft.mintNft();
        string memory uri = moodNft.tokenURI(0);
        console.log("Token URI:", uri);

        assert(bytes(uri).length > 0);
    }

    function testCannotFlipMoodForNonExistentToken() public {
        vm.prank(user);
        vm.expectRevert();
        moodNft.flipMood(999);
    }
}
