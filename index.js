const { encrypt, decrypt } = require('./helper')

class EncHandler {
    constructor(key) {
        this.key = key
        // if no key is provided then throw error
        if (!key) {
            throw new Error("Encryption key is required")
        }
    }
    /**
     * 
     * @param {Object} payload : Object payload to be encrypted
     * @param {Array} fields : Array of fields to be encrypted
     * @returns An Encrypted payload as per the fields provided
     * @throws Error if fields is not provided
     * @throws Error if fields is not in payload
     * @example 
     *  const payload = {
     *      id: '1',
     *      price: '80000',
     *      sales: '900000',
     *      units: '100'
     *  }
     * const fields = ['price', 'sales', 'units']
     * const encrypted = encrypt(payload, fields)
     * console.log(encrypted)
     * // {
     * //   id: '1',
     * //   price: 'U2FsdGVkX18RYNPLtly/ykEjLOQpgtc3ekGyesTCbOo=',
     * //   sales: 'U2FsdGVkX18KW6tBWBmbsojBiqyKsqWhVVvcBO39c80=',
     * //   units: 'U2FsdGVkX19yy5FQJvn3iUOxE7aLi5zmN6Kl06Tvbno='
     * //}  
     */
    encrypt(payload, fields, array = []) {
        return encrypt(payload, fields, array, this.key)
    }

    decrypt(payload, fields, array = []) {
        return decrypt(payload, fields, array, this.key)
    }
}

module.exports = EncHandler;
