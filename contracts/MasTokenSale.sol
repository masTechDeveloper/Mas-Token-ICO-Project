pragma solidity >=0.4.21 <0.7.0;

import "./MasToken.sol";


contract MasTokenSale {
    address payable admin;
    MasToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokenSold;

    event Sell(address _buyer, uint256 _amount);

    constructor(MasToken _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function muliply(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x, "Error");
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        require(
            msg.value == muliply(_numberOfTokens, tokenPrice),
            "masg value should be equal to mul fun"
        );
        require(tokenContract.balanceOf(admin) >= _numberOfTokens, "");
        require(tokenContract.transfer(msg.sender, _numberOfTokens), "");
        tokenSold += _numberOfTokens;
        emit Sell(msg.sender, _numberOfTokens);
    }

    function endSale() public {
        require(msg.sender == admin, "Comment");
        require(
            tokenContract.transfer(admin, tokenContract.balanceOf(admin)),
            "Comment"
        );

        // UPDATE: Let's not destroy the contract here
        // Just transfer the balance to the admin
        admin.transfer(address(this).balance);
        // selfdestruct(admin);
    }
}
