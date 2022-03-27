const CryptoJS = require('crypto-js');


module.exports = {
    _encrypt: (text, key) => {
        var cipher = CryptoJS.AES.encrypt(text, key);
        return cipher.toString();
    },
    _decrypt: (text, key) => {
        var bytes = CryptoJS.AES.decrypt(text, key);
        var plaintext = bytes.toString(CryptoJS.enc.Utf8);
        return plaintext;
    },
    encrypt: (payload, fields, key) => {
        if (!fields) {
            // fields = Object.keys(payload)
            throw new Error("fields is required")
        }
        const keys = Object.keys(payload)
        // if fields is not in payload keys then throw error
        const diff = fields.filter(field => !keys.includes(field))
        if (diff.length > 0) {
            throw new Error(`Unknown field {${diff}}`)
        }
        // extract values from payload based on fields
        const values = fields.map(field => payload[field])

        // get keys minus fields
        const rest = keys.filter(key => !fields.includes(key))

        const encrypted = values.map(value => module.exports._encrypt(value.toString(), key))
        // return object with encrypted values
        const encryptedPayload = encrypted.reduce((acc, value, index) => {
            acc[fields[index]] = value
            return acc
        }, {})

        return {
            ...encryptedPayload,
            ...rest.reduce((acc, key) => {
                acc[key] = payload[key]
                return acc
            }, {})
        }
    },
    decrypt: (payload, fields, key) => {
        if (!fields) {
            throw new Error("fields is required")
        }
        const keys = Object.keys(payload)
        // if fields is not in payload keys then throw error
        const diff = fields.filter(field => !keys.includes(field))
        if (diff.length > 0) {
            throw new Error(`Unknown field {${diff}}`)
        }
        // extract values from payload based on fields
        const values = fields.map(field => payload[field])

        // get keys minus fields
        const rest = keys.filter(key => !fields.includes(key))

        const decrypted = values.map(value => module.exports._decrypt(value, key))
        // return object with decrypted values
        const decryptedPayload = decrypted.reduce((acc, value, index) => {
            acc[fields[index]] = value
            return acc
        }, {})

        return {
            ...decryptedPayload,
            ...rest.reduce((acc, key) => {
                acc[key] = payload[key]
                return acc
            }, {})
        }
    }
}