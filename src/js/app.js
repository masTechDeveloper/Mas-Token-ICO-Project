App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  loading: false,
  tokenPrice: 1000000000000000,
  tokenSold: 0,
  tokensAvailable: 750000,

  init: function () {
    console.log('App Initialized...');
    return App.initWeb3();
  },

  initWeb3: function () {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider(
        'http://localhost:7545'
      );
      web3 = new Web3(App.web3Provider);
    }
    return App.initContracts();
  },

  initContracts: function () {
    $.getJSON('MasTokenSale.json', function (masTokenSale) {
      App.contracts.MasTokenSale = TruffleContract(masTokenSale);
      App.contracts.MasTokenSale.setProvider(App.web3Provider);
      App.contracts.MasTokenSale.deployed().then(function (masTokenSale) {
        console.log('Mas Token Sale Address:', masTokenSale.address);
      });
    }).done(function () {
      $.getJSON('MasToken.json', function (masToken) {
        App.contracts.MasToken = TruffleContract(masToken);
        App.contracts.MasToken.setProvider(App.web3Provider);
        App.contracts.MasToken.deployed().then(function (masToken) {
          console.log('Mas Token Address:', masToken.address);
        });

        //             App.listenForEvents();
        return App.getAccount();
      });
    });
  },

  getAccount: function () {
    if (App.loading) {
      return;
    }
    App.loading = true;

    var loader = $('#loader');
    var content = $('#content');

    loader.show();
    content.hide();

    // Load Accounts Data
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        $('#accountAddress').html(
          'Your Account:  &nbsp;  &nbsp;  &nbsp; ' + account
        );
        // console.log('Metamask Get Account Address : ' + account);
      }
    });

    App.contracts.MasTokenSale.deployed()
      .then(function (instance) {
        masTokenSaleInstance = instance;
        return masTokenSaleInstance.tokenPrice();
      })
      .then(function (tokenPrice) {
        App.tokenPrice = tokenPrice;
        console.log(
          'Token Price Convert WEI to ETHER : ' +
            web3.fromWei(tokenPrice, 'ether')
        );
        $('.token-price').html(
          web3.fromWei(App.tokenPrice, 'ether').toNumber()
        );
        return masTokenSaleInstance.tokenSold();
      })
      .then(function (tokenSold) {
        App.tokenSold = tokenSold.toNumber();
        $('.tokens-sold').html(App.tokenSold);
        $('.tokens-available').html(App.tokensAvailable);
      });

    App.loading = false;
    loader.hide();
    content.show();
  },
};

$(document).ready(function () {
  App.init();
});

// $(function() {
//     $(window).load(function() {
//         App.init();
//     })
// });
