var MasToken = artifacts.require('./MasToken.sol');
var MasTokenSale = artifacts.require('./MasTokenSale.sol');

contract('MasTokenSale', function (accounts) {
  var tokenInstance;
  var tokenSaleInstance;
  var admin = accounts[0];
  var buyer = accounts[1];
  var numberOfTokens;
  var tokenPrice = 1000000000000000; // in WEI
  var tokensAvailable = 750000;

  it('Initialized the contract with the correct values', function () {
    return MasTokenSale.deployed()
      .then(function (instance) {
        tokenSaleInstance = instance;
        return tokenSaleInstance.address;
      })
      .then(function (address) {
        assert.notEqual(address, 0x0, 'Has contract address');
        return tokenSaleInstance.tokenContract();
      })
      .then(function (address) {
        assert.notEqual(address, 0x0, 'Has Token contract Address');
        return tokenSaleInstance.tokenPrice();
      })
      .then(function (price) {
        assert.equal(price, tokenPrice, 'Token price is correct');
      });
  });

  it('Faciliate Token Buying', function () {
    return MasToken.deployed()
      .then(function (instance) {
        // Token instance 1st
        tokenInstance = instance;
        return MasTokenSale.deployed();
      })
      .then(function (instance) {
        // Token Sale instance
        tokenSaleInstance = instance;
        // 75% of tokens to the token sale
        return tokenInstance.transfer(
          tokenSaleInstance.address,
          tokensAvailable,
          { from: admin }
        );
      })
      .then(function (receipt) {
        numberOfTokens = 10;
        return tokenSaleInstance.buyTokens(numberOfTokens, {
          from: buyer,
          value: numberOfTokens * tokenPrice,
        });
      })
      .then(function (receipt) {
        assert.equal(receipt.logs.length, 1, 'Triggers one event');
        assert.equal(
          receipt.logs[0].event,
          'Sell',
          'should be the "Sell" event'
        );
        assert.equal(
          receipt.logs[0].args._buyer,
          buyer,
          'Logs the account that purchase the tokens'
        );
        assert.equal(
          receipt.logs[0].args._amount,
          numberOfTokens,
          'Logs the number of tokens purchased'
        );
        return tokenSaleInstance.tokenSold();
      })
      .then(function (amount) {
        assert.equal(
          amount.toNumber(),
          numberOfTokens,
          'Increments the number of tokens sold'
        );
        // return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: 1 });
      });

    // .then(assert.fail).catch(function(error) {
    //     assert.equal(error.message.indexOf('revert') >= 0, "msg.value must equal number of tokens in wei");
    //     assert(error.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
    // });
  });

  it('ends token sale', function () {
    return MasToken.deployed()
      .then(function (instance) {
        // Grab token instance first
        tokenInstance = instance;
        return MasTokenSale.deployed();
      })
      .then(function (instance) {
        // Then grab token sale instance
        tokenSaleInstance = instance;
        // Try to end sale from account other than the admin
        return tokenSaleInstance.endSale({ from: buyer });
      })
      .then(assert.fail)
      .catch(function (error) {
        assert(
          error.message.indexOf('revert' >= 0, 'must be admin to end sale')
        );
        // End sale as admin
        return tokenSaleInstance.endSale({ from: admin });
      })
      .then(function (receipt) {
        return tokenInstance.balanceOf(admin);
        // }).then(function(balance) {
        //     assert.equal(balance.toNumber(), 999990, 'returns all unsold Mas tokens to admin');
        //     // Check that the contract has no balance
        //     balance = web3.eth.getBalance(tokenSaleInstance.address)
        //     assert.equal(balance.toNumber(), 0);
      });
  });
});
