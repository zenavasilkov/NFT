//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test} from "../lib/forge-std/src/Test.sol";
import {MintBasicNft} from "../script/Interactions.s.sol";
import {BasicNft} from "../src/BasicNft.sol";
import {DeployBasicNft} from "../script/DeployBasicNft.s.sol";

contract InteractionsTest is Test {
    BasicNft public basicNft;
    MintBasicNft public mintScript;
    address public deployer = makeAddr("deployer");
    address public user = makeAddr("user");
    string public constant PUG_URI =
        "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";

    function setUp() public {
        vm.prank(deployer);
        DeployBasicNft deployScript = new DeployBasicNft();
        basicNft = deployScript.run();

        mintScript = new MintBasicNft();
    }

    function testMintNftOnContract() public {
        uint256 initialBalance = basicNft.balanceOf(deployer);
        uint256 initialCounter = basicNft.getTokenCounter();

        vm.prank(deployer);
        basicNft.mintNft(PUG_URI);

        assert(basicNft.balanceOf(deployer) == initialBalance + 1);
        assert(basicNft.getTokenCounter() == initialCounter + 1);
    }

    function testMintNftOnContractSetsCorrectTokenURI() public {
        vm.prank(deployer);
        basicNft.mintNft(PUG_URI);

        uint256 tokenId = basicNft.getTokenCounter() - 1;
        string memory tokenUri = basicNft.tokenURI(tokenId);
        assert(keccak256(abi.encodePacked(tokenUri)) == keccak256(abi.encodePacked(PUG_URI)));
    }

    function testMintNftOnContractMultipleTimes() public {
        vm.startPrank(deployer);
        basicNft.mintNft(PUG_URI);
        basicNft.mintNft(PUG_URI);
        basicNft.mintNft(PUG_URI);
        vm.stopPrank();

        assert(basicNft.balanceOf(deployer) == 3);
        assert(basicNft.getTokenCounter() == 3);
    }

    function testMintNftOnContractDifferentUsers() public {
        vm.prank(deployer);
        basicNft.mintNft(PUG_URI);

        vm.prank(user);
        basicNft.mintNft(PUG_URI);

        assert(basicNft.balanceOf(deployer) == 1);
        assert(basicNft.balanceOf(user) == 1);
        assert(basicNft.getTokenCounter() == 2);
    }

    function testScriptMintNftOnContractUsesCorrectURI() public view {
        assert(keccak256(abi.encodePacked(mintScript.PUG_URI())) == keccak256(abi.encodePacked(PUG_URI)));
    }
}

