//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Test} from "../lib/forge-std/src/Test.sol";
import {BasicNft} from "../src/BasicNft.sol";
import {DeployBasicNft} from "../script/DeployBasicNft.s.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BasicNftTest is Test {
    DeployBasicNft public deployer;
    BasicNft public basicNft;
    address public USER = makeAddr("user");
    address public USER2 = makeAddr("user2");
    string public constant PUG =
        "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";
    string public constant SHIBA =
        "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=1-SHIBA_INU.json";

    function setUp() public {
        deployer = new DeployBasicNft();
        basicNft = deployer.run();
    }

    function testNameIsCorrect() public view {
        string memory expectedName = "Dogie";
        string memory actualName = basicNft.name();
        assert(keccak256(abi.encodePacked(expectedName)) == keccak256(abi.encodePacked(actualName)));
    }

    function testSymbolIsCorrect() public view {
        string memory expectedSymbol = "DOG";
        string memory actualSymbol = basicNft.symbol();
        assert(keccak256(abi.encodePacked(expectedSymbol)) == keccak256(abi.encodePacked(actualSymbol)));
    }

    function testTokenCounterStartsAtZero() public view {
        assert(basicNft.getTokenCounter() == 0);
    }

    function testMintNft() public {
        vm.prank(USER);
        basicNft.mintNft(PUG);

        assert(basicNft.balanceOf(USER) == 1);
        assert(basicNft.ownerOf(0) == USER);
        assert(keccak256(abi.encodePacked(basicNft.tokenURI(0))) == keccak256(abi.encodePacked(PUG)));
        assert(basicNft.getTokenCounter() == 1);
    }

    function testMintMultipleNfts() public {
        vm.startPrank(USER);
        basicNft.mintNft(PUG);
        basicNft.mintNft(SHIBA);
        vm.stopPrank();

        assert(basicNft.balanceOf(USER) == 2);
        assert(basicNft.ownerOf(0) == USER);
        assert(basicNft.ownerOf(1) == USER);
        assert(keccak256(abi.encodePacked(basicNft.tokenURI(0))) == keccak256(abi.encodePacked(PUG)));
        assert(keccak256(abi.encodePacked(basicNft.tokenURI(1))) == keccak256(abi.encodePacked(SHIBA)));
        assert(basicNft.getTokenCounter() == 2);
    }

    function testTokenCounterIncrements() public {
        assert(basicNft.getTokenCounter() == 0);

        vm.prank(USER);
        basicNft.mintNft(PUG);
        assert(basicNft.getTokenCounter() == 1);

        vm.prank(USER);
        basicNft.mintNft(SHIBA);
        assert(basicNft.getTokenCounter() == 2);
    }

    function testMultipleUsersCanMint() public {
        vm.prank(USER);
        basicNft.mintNft(PUG);

        vm.prank(USER2);
        basicNft.mintNft(SHIBA);

        assert(basicNft.balanceOf(USER) == 1);
        assert(basicNft.balanceOf(USER2) == 1);
        assert(basicNft.ownerOf(0) == USER);
        assert(basicNft.ownerOf(1) == USER2);
        assert(basicNft.getTokenCounter() == 2);
    }

    function testTokenURIForNonExistentToken() public {
        vm.expectRevert();
        basicNft.tokenURI(999);
    }

    function testTokenURIStoredCorrectly() public {
        string memory customUri = "https://example.com/nft/123";
        vm.prank(USER);
        basicNft.mintNft(customUri);

        assert(keccak256(abi.encodePacked(basicNft.tokenURI(0))) == keccak256(abi.encodePacked(customUri)));
    }

    function testEmptyTokenURI() public {
        vm.prank(USER);
        basicNft.mintNft("");

        string memory uri = basicNft.tokenURI(0);
        assert(keccak256(abi.encodePacked(uri)) == keccak256(abi.encodePacked("")));
    }

    function testERC721Transfer() public {
        vm.prank(USER);
        basicNft.mintNft(PUG);

        vm.prank(USER);
        basicNft.transferFrom(USER, USER2, 0);

        assert(basicNft.ownerOf(0) == USER2);
        assert(basicNft.balanceOf(USER) == 0);
        assert(basicNft.balanceOf(USER2) == 1);
    }

    function testERC721Approval() public {
        vm.prank(USER);
        basicNft.mintNft(PUG);

        vm.prank(USER);
        basicNft.approve(USER2, 0);

        assert(basicNft.getApproved(0) == USER2);

        vm.prank(USER2);
        basicNft.transferFrom(USER, USER2, 0);

        assert(basicNft.ownerOf(0) == USER2);
    }

    function testERC721SetApprovalForAll() public {
        vm.startPrank(USER);
        basicNft.mintNft(PUG);
        basicNft.mintNft(SHIBA);
        basicNft.setApprovalForAll(USER2, true);
        vm.stopPrank();

        assert(basicNft.isApprovedForAll(USER, USER2) == true);

        vm.prank(USER2);
        basicNft.transferFrom(USER, USER2, 0);

        assert(basicNft.ownerOf(0) == USER2);
    }

    function testCannotTransferTokenYouDontOwn() public {
        vm.prank(USER);
        basicNft.mintNft(PUG);

        vm.prank(USER2);
        vm.expectRevert();
        basicNft.transferFrom(USER, USER2, 0);
    }

    function testCannotTransferTokenNotApproved() public {
        vm.prank(USER);
        basicNft.mintNft(PUG);

        vm.prank(USER2);
        vm.expectRevert();
        basicNft.transferFrom(USER, USER2, 0);
    }

    function testTokenURIPersistsAfterTransfer() public {
        vm.prank(USER);
        basicNft.mintNft(PUG);

        vm.prank(USER);
        basicNft.transferFrom(USER, USER2, 0);

        assert(keccak256(abi.encodePacked(basicNft.tokenURI(0))) == keccak256(abi.encodePacked(PUG)));
    }
}
