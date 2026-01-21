//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Test} from "../lib/forge-std/src/Test.sol";
import {DeployBasicNft} from "../script/DeployBasicNft.s.sol";
import {BasicNft} from "../src/BasicNft.sol";

contract DeployBasicNftTest is Test {
    DeployBasicNft public deployer;
    BasicNft public basicNft;

    function setUp() public {
        deployer = new DeployBasicNft();
    }

    function testDeployBasicNft() public {
        basicNft = deployer.run();

        assert(address(basicNft) != address(0));

        assert(keccak256(abi.encodePacked(basicNft.name())) == keccak256(abi.encodePacked("Dogie")));
        assert(keccak256(abi.encodePacked(basicNft.symbol())) == keccak256(abi.encodePacked("DOG")));

        assert(basicNft.getTokenCounter() == 0);
    }

    function testDeployBasicNftCanMint() public {
        basicNft = deployer.run();
        address user = makeAddr("user");
        string memory tokenUri = "ipfs://test";

        vm.prank(user);
        basicNft.mintNft(tokenUri);

        assert(basicNft.balanceOf(user) == 1);
        assert(basicNft.ownerOf(0) == user);
    }

    function testDeployBasicNftMultipleTimes() public {
        BasicNft basicNft1 = deployer.run();
        BasicNft basicNft2 = deployer.run();

        assert(address(basicNft1) != address(basicNft2));
    }
}
