const CryptoJS = require('crypto-js');
const { encObjectItems, decrptObjectItems, encArrayItems, decrptArrayItems } = require('./dist/wrapper')
var globKey = null;

module.exports = {
    _encrypt: (text) => {
        var cipher = CryptoJS.AES.encrypt(text, globKey);
        return cipher.toString();
    },
    _decrypt: (text) => {
        var bytes = CryptoJS.AES.decrypt(text, globKey);
        var plaintext = bytes.toString(CryptoJS.enc.Utf8);
        return plaintext;
    },
    encrypt: (payload, fieldsToEncrypt, arrayFields, key) => {
        if (!globKey) globKey = key;
        if (!fieldsToEncrypt) {
            throw new Error("fields is required")
        }
        const payloadKeys = Object.keys(payload).reduce((acc, key) => {
            acc.push(key)
            if (typeof payload[key] === 'object') {
                acc.push(...Object.keys(payload[key]).map(k => `${key}.${k}`))
            }
            return acc
        }, [])

        // if fieldsToEncrypt is not in payload keys then throw error
        const diff = fieldsToEncrypt.filter(field => !payloadKeys.includes(field))
        if (diff.length > 0) {
            throw new Error(`Unknown field {${diff}}`)
        }

        // if field is in dot notation then remove it from fields and add it to nestedFields
        const nestedFields = fieldsToEncrypt.filter(field => field.includes('.'))

        // remove nested fields from fields
        const fieldsWithoutNested = fieldsToEncrypt.filter(field => !field.includes('.'))

        // extract values from payload based on fields
        const values = fieldsWithoutNested.map(field => payload[field])

        const encrypted = values.map(value => module.exports._encrypt(value.toString(), key))
        // return object with encrypted values
        const encryptedPayload = encrypted.reduce((acc, value, index) => {
            acc[fieldsToEncrypt[index]] = value
            return acc
        }, {})

        // get keys minus fields
        const rest = payloadKeys.filter(key => !fieldsToEncrypt.includes(key))

        // remove dot notation from rest
        const restWithoutDot = rest.map(key => key.split('.')[0])

        let finalOutput = {
            ...encryptedPayload,
            ...restWithoutDot.reduce((acc, key) => {
                acc[key] = payload[key]
                return acc
            }, {})
        }

        // if nested fields are present then go to encObjectItems
        if (nestedFields.length > 0) {
            finalOutput = encObjectItems(finalOutput, nestedFields)
        }

        if (arrayFields.length > 0) {
            finalOutput = encArrayItems(finalOutput, arrayFields)
        }

        return finalOutput
    },
    decrypt: (payload, fields, arrayFields, key) => {
        if (!globKey) globKey = key;

        if (!fields) {
            throw new Error("fields is required")
        }
        // const keys = Object.keys(payload)

        const payloadKeys = Object.keys(payload).reduce((acc, key) => {
            acc.push(key)
            if (typeof payload[key] === 'object') {
                acc.push(...Object.keys(payload[key]).map(k => `${key}.${k}`))
            }
            return acc
        }, [])

        // if fields is not in payload keys then throw error
        const diff = fields.filter(field => !payloadKeys.includes(field))
        if (diff.length > 0) {
            throw new Error(`Unknown field {${diff}}`)
        }

        // fields not in dot notation
        const fieldsWithoutDot = fields.filter(field => !field.includes('.'))
        const fieldsWithDot = fields.filter(field => field.includes('.'))

        // extract values from payload based on fields
        const values = fieldsWithoutDot.map(field => payload[field])

        // get keys minus fields
        const rest = payloadKeys.filter(key => !fields.includes(key))

        const decrypted = values.map(value => module.exports._decrypt(value, key))
        // return object with decrypted values
        const decryptedPayload = decrypted.reduce((acc, value, index) => {
            acc[fields[index]] = value
            return acc
        }, {})

        let finalOutput = {
            ...decryptedPayload,
            ...rest.reduce((acc, key) => {
                acc[key] = payload[key]
                return acc
            }, {})
        }

        if (fieldsWithDot.length > 0) {
            return decrptObjectItems(finalOutput, fieldsWithDot)
        }

        if (arrayFields.length > 0) {
            finalOutput = decrptArrayItems(finalOutput, arrayFields)
        }

        return finalOutput
    },
}
