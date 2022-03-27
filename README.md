# Welcome to @dae54/enc
This is a wrapper to `"crypto-js": "^3.1.9-1"` assisting in easy encryption and decryption using AES-256

## Installation
```bash
npm i @dae54/enc
```
This will install @dae54/enc

## Usage
This package exposes 2 public methods, `encrypt` and `decrypt` serving purposes as stating.

- Start by instantiating the class Enc by providing encryption key
```js
const EncHandler = require('@dae54/enc')
const hashKey = 'some random generated key'
const encHandler = new EncHandler(hashKey)

// Here encHandler will have exposed  2 methods
encHandler.encrypt(payload,fields)
encHandler.decrypt(payload,fields)

```

### Encryption
To Encrypt, an object item, call `encrypt(payload,fields)` instance of encHandler.
```js
const payload = {
    id: '1',
    price: '80000',
    sales: '900000',
    units: '100'   
}
const fields = ['price', 'sales', 'units']
const encrypted = encHandler.encrypt(payload,fields)
console.log(encrypted)
// {
//     id: '1',
//     price: 'U2FsdGVkX18RYNPLtly/ykEjLOQpgtc3ekGyesTCbOo=',
//     sales: 'U2FsdGVkX18KW6tBWBmbsojBiqyKsqWhVVvcBO39c80=',
//     units: 'U2FsdGVkX19yy5FQJvn3iUOxE7aLi5zmN6Kl06Tvbno='
// }  
```


### Decryption
To Decrypt,an object item, call `decrypt(payload,fields)` instance of encHandler.
```js
const payload = {
    id: '1',
    price: 'U2FsdGVkX18RYNPLtly/ykEjLOQpgtc3ekGyesTCbOo=',
    sales: 'U2FsdGVkX18KW6tBWBmbsojBiqyKsqWhVVvcBO39c80=',
    units: 'U2FsdGVkX19yy5FQJvn3iUOxE7aLi5zmN6Kl06Tvbno='   
}
const fields = ['price', 'sales', 'units']
const encrypted = encHandler.decrypt(payload,fields)
console.log(encrypted)
// {
//     id: '1',
//     price: '80000',
//     sales: '900000',
//     units: '100'
// }  
```

## Dependencies
This package depends on:
- `"crypto-js": "3.1.9-1"`

So It should work with NodeJs, React Native and ReactJS.

