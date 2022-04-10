# General
This is a wrapper to `"crypto-js": "^3.3.0"` assisting in easy encryption and decryption using AES-256

# Installation
```bash
npm i @dae54/enc
```
This will install @dae54/enc

# Usage
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

<!-- ## Encryption
To Encrypt, an object item, call `encrypt(payload,fields)` instance of encHandler. -->

## Objects
`Sample payload`
```js
const payload = {
    id: '1',
    price: '80000',
    sales: '900000',
    units: '100'
}
```
### Encryption

Use `encrypt(payload,fieldsToEncrypt)` instance of `encHandler`

```js
const fieldsToEncrypt = ['price', 'sales']
const encrypted = encHandler.encrypt(payload,fields)
```

`Output (encrypted)`
```js
{
    id: '1',
    price: 'U2FsdGVkX18RYNPLtly/ykEjLOQpgtc3ekGyesTCbOo=',
    sales: 'U2FsdGVkX18KW6tBWBmbsojBiqyKsqWhVVvcBO39c80=',
    units: '100',
}  
```
### Decryption
Use `decrypt(payload,fieldsToDecrypt)` instance of `encHandler`

```js
const payload = {
    id: '1',
    price: 'U2FsdGVkX18RYNPLtly/ykEjLOQpgtc3ekGyesTCbOo=',
    sales: 'U2FsdGVkX18KW6tBWBmbsojBiqyKsqWhVVvcBO39c80=',
    units: '100',
}
const fields = ['price', 'sales']
const decrypted = encHandler.decrypt(payload,fields)
```

`Output (decrypted)`

```js
{
    id: '1',
    price: '80000',
    sales: '900000',
    units: '100',
}
```

## Nested Objects (1-Level)
`Sample payload`

```js
const payload = {
    id: '1',
    price: '80000',
    sales: '900000',
    units: '100',
    buyer:{
        name:"test name",
        id:"uu"
    }   
}
```
### Encryption

Use `encrypt(payload,fieldsToEncrypt)` instance of `encHandler`, adding the nested objects keys using `dot operator`. See `(buyer.name)` below
```js
const fields = ['price', 'sales', 'units','buyer.name']
const encrypted = encHandler.encrypt(payload,fields)
```

`Output (encrypted)`
```js
{
    id: '1',
    price: 'U2FsdGVkX18RYNPLtly/ykEjLOQpgtc3ekGyesTCbOo=',
    sales: 'U2FsdGVkX18KW6tBWBmbsojBiqyKsqWhVVvcBO39c80=',
    units: 'U2FsdGVkX19yy5FQJvn3iUOxE7aLi5zmN6Kl06Tvbno=',
    buyer:{
         name:"U2FsdGVkX19yy5FQJvn3iUOxE7ybiidoo933dodC=",
         id:"uu"
    }
}  
```

### Decryption
To Decrypt,an object item, call `decrypt(payload,fields)` instance of encHandler, taking note of `dot operator` for nested objects encrypted.

`Sample Payload`
```js
const payload = {
    id: '1',
    price: 'U2FsdGVkX18RYNPLtly/ykEjLOQpgtc3ekGyesTCbOo=',
    sales: 'U2FsdGVkX18KW6tBWBmbsojBiqyKsqWhVVvcBO39c80=',
    units: 'U2FsdGVkX19yy5FQJvn3iUOxE7aLi5zmN6Kl06Tvbno=',
    buyer:{
        name:"U2FsdGVkX19yy5FQJvn3iUOxE7ybiidoo933dodC=",
        id:"uu"
    }   
}
const fields = ['price', 'sales', 'units','buyer.name']
const decrypted = encHandler.decrypt(payload,fields)
```

`Output (decrypted)`

```js
{
    id: '1',
    price: '80000',
    sales: '900000',
    units: '100',
    buyer:{
        name:"test name",
        id:"uu"
    } 
}
```

## Nested Objects Level - 2 and more
    Not supported

## Arrays
`Sample Payload`

```js
const payload = {
    id: '1',
    price: '90000',
    products: [
        {
            id: '1',
            price: '80000',
            sales: '800000',
        },
        {
            id: '2',
            price: '180000.998',
            sales: '800005.2',
        },
    ]
}
```
### Encryption
Use `encrypt(payload,fieldsToEncrypt,arrayFieldsToEncrypt)` instance of `encHandler`.

```js
const fields = ['price']
const arrayFieldsToEncrypt = ['products:[id,price]']
const encrypted = encHandler.encrypt(payload,fields,arrayFieldsToEncrypt)
```
`Output (Encrypted)`
```js
const payload = {
    id:'1'
    price: 'U2FsdGVkX1+tmXBzY8KnpdEbZhD6U7s+MVLqdOyEl+U=',
    products: [
        {
            id: 'U2FsdGVkX1+RCt+erbceDwRVmfz18eKns74swXjH+ww=',
            price: 'U2FsdGVkX1864K0TmWXa3lOe49AQW61jd2d7nMLx3q8=',
            sales: '800000'
        },
        {
            id: 'U2FsdGVkX19lgyE/UG2QHollWHKM1VT2NCCLnTBD454=',
            price: 'U2FsdGVkX19AXOsKSW+ulmM/sBG9JgvvPufwdwhVqn4=',
            sales: '800005.2'
        }
    ]
}
```

### Decryption
To Decrypt,an object item, call `decrypt(payload,fields,fieldsToDecrypt)` instance of encHandler.
`Sample Payload`
```js
{
    id:'1'
    price: 'U2FsdGVkX1+tmXBzY8KnpdEbZhD6U7s+MVLqdOyEl+U=',
    products: [
        {
            id: 'U2FsdGVkX1+RCt+erbceDwRVmfz18eKns74swXjH+ww=',
            price: 'U2FsdGVkX1864K0TmWXa3lOe49AQW61jd2d7nMLx3q8=',
            sales: '800000'
        },
        {
            id: 'U2FsdGVkX19lgyE/UG2QHollWHKM1VT2NCCLnTBD454=',
            price: 'U2FsdGVkX19AXOsKSW+ulmM/sBG9JgvvPufwdwhVqn4=',
            sales: '800005.2'
        }
    ]
}


const fields = ['price']
const arrayFieldsToDecrypt = ['products:[id,price]']
const decrypted = encHandler.decrypt(payload,fields,arrayFieldsToDecrypt)
```
`Output`
```js
const payload = {
    id: '1',
    price: '90000',
    products: [
        {
            id: '1',
            price: '80000',
            sales: '800000',
        },
        {
            id: '2',
            price: '180000.998',
            sales: '800005.2',
        },
    ]
}
```



## Dependencies
This package depends on:
- `"crypto-js": "3.3.0"`

So It should work with NodeJs, React Native and ReactJS.

