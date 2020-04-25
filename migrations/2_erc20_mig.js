const MasToken = artifacts.require("MasToken");
const MasTokenSale = artifacts.require("MasTokenSale");

module.exports = function(deployer) {
    deployer.deploy(MasToken, 1000000).then(function() {

        // Token Price is 0.001 Ether
        var tokenPrice = 1000000000000000;
        return deployer.deploy(MasTokenSale, MasToken.address, tokenPrice);
    });
};