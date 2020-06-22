//  This is a Constructor function taking age and passport
//  as the paramaters
// shop: "",
// hmac: "",
// code: "",
// state: "",
// authToken: "",
function AuthObj(shop, hmac, code, state, authToken) {
  this.shop = shop;
  this.hmac = hmac;
  this.code = code;
  this.state = state;
  this.authToken = authToken;
}
AuthObj.prototype.shop = function (shop) {
  this.shop = shop;
};
AuthObj.prototype.hmac = function (shop) {
  this.hmac = hmac;
};
AuthObj.prototype.code = function (shop) {
  this.code = code;
};
AuthObj.prototype.state = function (shop) {
  this.state = state;
};
AuthObj.prototype.authToken = function (shop) {
  this.authToken = authToken;
};
//
module.exports = AuthObj;
