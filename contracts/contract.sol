// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */
contract Storage {

    struct Donation {
        address donator;
        uint256 amount; 
    }

    Donation[] private donations;


    address private owner;

    modifier isOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    /**
     * @dev Set contract deployer as owner
     */
    constructor() {
        owner = msg.sender;
    }

    function withdraw() public isOwner{
        payable(owner).transfer(address(this).balance);
    }

    function donate() public payable {
        require(msg.value >= 1 wei);

        for (uint p = 0; p < donations.length; p++) {
            if (donations[p].donator == msg.sender) {
                donations[p].amount += msg.value;
                return;
            }
        }
        donations.push(Donation({
                donator: msg.sender,
                amount: msg.value
            }));
    }

    function getTopDonators() public view returns (string memory){
        address addrTop1 = owner;
        uint256 addrAmount1 = 0;

        address addrTop2 = owner;
        uint256 addrAmount2 = 0;

        for (uint p = 0; p < donations.length; p++) {
            if (donations[p].amount > addrAmount1) {
                addrTop2 = addrTop1;
                addrAmount2 = addrAmount1;

                addrTop1 = donations[p].donator;
                addrAmount1 = donations[p].amount;
            }
            else if (donations[p].amount > addrAmount2) {
                addrTop2 = donations[p].donator;
                addrAmount2 = donations[p].amount;
            }
        }

        return string.concat("Top 1: ", Strings.toHexString(uint160(addrTop1), 20), " donation: ", Strings.toString(addrAmount1),
         "\n Top 2: ", Strings.toHexString(uint160(addrTop2), 20), " donation: ", Strings.toString(addrAmount2));
    }

    uint256 lastRand;

    function random() public {
        lastRand = uint256(keccak256(abi.encodePacked("secret", block.timestamp)));
    }

    function checkRandom() public view returns (uint256){
        return lastRand;
    }
}