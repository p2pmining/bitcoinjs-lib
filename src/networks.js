// https://en.bitcoin.it/wiki/List_of_address_prefixes
// Dogecoin BIP32 is a proposed standard: https://bitcointalk.org/index.php?topic=409731

var networks = {
  bitcoin: {
    magicPrefix: '\x18Bitcoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80,
    dustThreshold: 546, // https://github.com/bitcoin/bitcoin/blob/v0.9.2/src/core.h#L151-L162
    feePerKb: 10000, // https://github.com/bitcoin/bitcoin/blob/v0.9.2/src/main.cpp#L53
    estimateFee: estimateFee('bitcoin'),
    units: 'BTC'
  },
  dogecoin: {
    magicPrefix: '\x19Dogecoin Signed Message:\n',
    bip32: {
      public: 0x02facafd,
      private: 0x02fac398
    },
    pubKeyHash: 0x1e,
    scriptHash: 0x16,
    wif: 0x9e,
    dustThreshold: 0, // https://github.com/dogecoin/dogecoin/blob/v1.7.1/src/core.h#L155-L160
    dustSoftThreshold: 100000000, // https://github.com/dogecoin/dogecoin/blob/v1.7.1/src/main.h#L62
    feePerKb: 100000000, // https://github.com/dogecoin/dogecoin/blob/v1.7.1/src/main.cpp#L58
    estimateFee: estimateFee('dogecoin'),
    units: 'DOGE'
  },
  litecoin: {
    magicPrefix: '\x19Litecoin Signed Message:\n',
    bip32: {
      public: 0x019da462,
      private: 0x019d9cfe
    },
    pubKeyHash: 0x30,
    scriptHash: 0x05,
    wif: 0xb0,
    dustThreshold: 0, // https://github.com/litecoin-project/litecoin/blob/v0.8.7.2/src/main.cpp#L360-L365
    dustSoftThreshold: 100000, // https://github.com/litecoin-project/litecoin/blob/v0.8.7.2/src/main.h#L53
    feePerKb: 100000, // https://github.com/litecoin-project/litecoin/blob/v0.8.7.2/src/main.cpp#L56
    estimateFee: estimateFee('litecoin'),
    units: 'LTC'
  },
  testnet: {
    magicPrefix: '\x18Bitcoin Signed Message:\n',
    bip32: {
      public: 0x043587cf,
      private: 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
    dustThreshold: 546,
    feePerKb: 10000,
    estimateFee: estimateFee('testnet'),
    units: 'BTC'
  },
  namecoin: {
	magicPrefix: '\x19Namecoin Signed Message:\n',
	bip32: {
	  public: 0x01c5ca77, // p2pmining spec
	  private: 0x01c5c63d // p2pmining spec
	},
	pubKeyHash: 0x34,
	scriptHash: 0x05,
	wif: 0xb4,
	dustThreshold: 5460, // p2pmining spec
	feePerKb: 500000, // p2pmining spec
	estimateFee: estimateFee('namecoin'),
	units: 'NMC',
    newNameFee: 1000000
  }, 
  devcoin: {
	magicPrefix: '\x19Devcoin Signed Message:\n',
	bip32: {
	  public: 0x010aab44,
	  private: 0x010aa709
	},
	pubKeyHash: 0x00,
	scriptHash: 0x05,
	wif: 0x80,
	dustThreshold: 10000000, // p2pmining spec.
	feePerKb: 100000000, // p2pmining spec.
	estimateFee: estimateFee('devcoin'),
	units: 'DVC'
  },
  ixcoin: {
	magicPrefix: '\x19ixcoin Signed Message:\n',
	bip32: {
	  public: 0x03687443,
	  private: 0x036874c8
	},
	pubKeyHash: 0x8a,
	scriptHash: 0x05,
	wif: 0x0a,
	dustThreshold: 5460, // p2pmining spec.
	feePerKb: 100000, // p2pmining spec.
	estimateFee: estimateFee('ixcoin'),
	units: 'IXC'
  },
  i0coin: {
	magicPrefix: '\x19i0coin Signed Message:\n',
	bip32: {
	  public: 0x03653a58,
	  private: 0x03653ae1
	},
	pubKeyHash: 0x69,
	scriptHash: 0x05,
	wif: 0xe9,
	dustThreshold: 5460, // p2pmining spec.
	feePerKb: 100000, // p2pmining spec.
	estimateFee: estimateFee('i0coin'),
        units: 'I0C'
  }
}


function estimateFee(type) {
  return function(tx) {
    var network = networks[type]
    var baseFee = network.feePerKb
    var byteSize = tx.toBuffer().length

    var fee = baseFee * Math.ceil(byteSize / 1000)
    if (network.dustSoftThreshold == undefined) return fee

    tx.outs.forEach(function(e){
      if (e.value < network.dustSoftThreshold) {
        fee += baseFee
      }
    })

    return fee
  }
}

module.exports = networks
