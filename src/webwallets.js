// webwallets key generation
var base58check = require('./base58check')
var crypto = require('./crypto')
var rng = require('secure-random')
var networks = require('./networks')

function getNewBase58Key(password){
   var key = new Buffer(rng(32))
   var passbuf = new Buffer(password,'utf8')
   
   var intHash = crypto.HmacSHA256(key,passbuf)

   var keyVersion = new Buffer('75','hex')
   
   return base58check.encode(Buffer.concat([keyVersion,key,intHash.slice(0,4)]))
}

function checkBase58Key(base58key){
   try{
   var result = base58check.decode(base58key)
   return true
   }
   catch(err){
    
    return false
   } 
}

function createSeed(base58key,password,network){
    var passbuf = new Buffer(password,'utf8')
    var longkey = base58check.decode(base58key)
    var key = longkey.slice(1,33)
    
    
    var seed = crypto.HmacSHA256(crypto.HmacSHA256(key,passbuf),passbuf)
    
    return seed
    
}

function getNetSeed(seed,network){
    var netBuf = new Buffer(network)
    
    return Buffer.concat([seed,netBuf])
}

function checkPassword(base58key,password){  
    var passbuf = new Buffer(password,'utf8')
    var longkey = base58check.decode(base58key)
    
    var key = longkey.slice(1,33)     
    var passCheck = longkey.slice(33)
    
    var iHash = crypto.HmacSHA256(key,passbuf).slice(0,4)
       
    if(iHash.toString('hex')===passCheck.toString('hex')){
        return true
    }else{
        return false
    }     
}

function checkAddress(address,network){
    
    try{
        var addressData = base58check.decode(address)
        if(addressData.readUInt8(0) == networks[network].pubKeyHash){
            return true
        }else{ return false }
    }catch(err){
        return false
    }   
}

module.exports = {
  getNewBase58Key: getNewBase58Key,
  checkBase58Key: checkBase58Key,
  createSeed: createSeed,
  checkPassword: checkPassword,
  getNetSeed: getNetSeed,
  checkAddress: checkAddress
}
