

function encObjectItems(payload, nestedFields) {

    const { _encrypt } = require('../helper')

    const nestedFieldsMap = nestedFields.reduce((acc, field) => {
        const [key, nestedKey] = field.split('.')
        if (!acc[key]) {
            acc[key] = {}
        }
        acc[key][nestedKey] = payload[key][nestedKey]
        return acc
    }, {})


    const nestedFieldsPayload = nestedFields.reduce((acc, field) => {
        const [key, nestedKey] = field.split('.')
        if (!acc[key]) {
            acc[key] = {}
        }
        acc[key] = payload[key]
        return acc
    }, {})

    const keys = nestedFields.map(field => field.split('.')[0])
    const childkeys = nestedFields.map(field => field.split('.')[1])

    let finalOutput = {}

    keys.map((key, index) => {
        const encrypted = _encrypt(nestedFieldsMap[key][childkeys[index]].toString())

        finalOutput = {
            ...finalOutput,
            [key]: {
                ...finalOutput[key],
                [childkeys[index]]: encrypted
            }
        }
    })

    const final = Object.keys(nestedFieldsPayload).map(key => {
        return {
            [key]: { ...nestedFieldsPayload[key], ...finalOutput[key] }
        }
    })

    final.forEach(item => {
        payload = { ...payload, ...item }
    })

    return payload
}


function decrptObjectItems(payload, nestedFields) {

    const { _decrypt } = require('../helper')

    const nestedFieldsMap = nestedFields.reduce((acc, field) => {
        const [key, nestedKey] = field.split('.')
        if (!acc[key]) {
            acc[key] = {}
        }
        acc[key][nestedKey] = payload[key][nestedKey]
        return acc
    }, {})

    const keys = nestedFields.map(field => field.split('.')[0])
    const childkeys = nestedFields.map(field => field.split('.')[1])

    let finalOutput = {}

    keys.map((key, index) => {
        const decrypted = _decrypt(nestedFieldsMap[key][childkeys[index]].toString())

        finalOutput = {
            ...finalOutput,
            [key]: {
                ...finalOutput[key],
                [childkeys[index]]: decrypted
            }
        }
    })

    const nestedFieldsPayload = nestedFields.reduce((acc, field) => {
        const [key, nestedKey] = field.split('.')
        if (!acc[key]) {
            acc[key] = {}
        }
        acc[key] = payload[key]
        return acc
    }, {})

    const final = Object.keys(nestedFieldsPayload).map(key => {
        return {
            [key]: { ...nestedFieldsPayload[key], ...finalOutput[key] }
        }
    })

    final.forEach(item => {
        payload = { ...payload, ...item }
    })

    // remove any field with dot from payload object
    const fieldsWithDot = Object.keys(payload).filter(key => key.includes('.'))

    delete payload[fieldsWithDot]

    return payload
}


function encArrayItems(payload, arrayFields) {
    const { _encrypt } = require('../helper')

    let payl = payload

    // extract array object from payload
    arrayFields.map(field => {
        let fieldsToEncrypt = field.split(':')[1].split('[').join('').split(']').join('').split(',')
        let parentField = field.split(':')[0]

        let semiPayload = payload[parentField].map(item => {

            const payloadKeys = Object.keys(item).reduce((acc, key) => {
                acc.push(key)
                return acc
            }, [])


            const diff = fieldsToEncrypt.filter(field => !payloadKeys.includes(field))
            if (diff.length > 0) {
                throw new Error(`Unknown field {${diff}}`)
            }


            const values = fieldsToEncrypt.map(field => item[field])

            const encrypted = values.map(value => _encrypt(value.toString()))

            // return object with encrypted values
            const encryptedPayload = encrypted.reduce((acc, value, index) => {
                acc[fieldsToEncrypt[index]] = value
                return acc
            }, {})

            // get keys minus fields
            const rest = payloadKeys.filter(key => !fieldsToEncrypt.includes(key))

            let finalOutput = {
                ...encryptedPayload,
                ...rest.reduce((acc, key) => {
                    acc[key] = item[key]
                    return acc
                }, {})
            }

            return finalOutput
        })

        payl[parentField] = semiPayload
    })
    return payl
}

function decrptArrayItems(payload, arrayFields) {
    const { _decrypt } = require('../helper')

    let payl = payload

    // extract array object from payload
    arrayFields.map(field => {
        let fieldsToDecrypt = field.split(':')[1].split('[').join('').split(']').join('').split(',')
        let parentField = field.split(':')[0]

        let semiPayload = payload[parentField].map(item => {

            const payloadKeys = Object.keys(item).reduce((acc, key) => {
                acc.push(key)
                return acc
            }, [])

            const diff = fieldsToDecrypt.filter(field => !payloadKeys.includes(field))

            if (diff.length > 0) {
                throw new Error(`Unknown field {${diff}}`)
            }

            const values = fieldsToDecrypt.map(field => item[field])

            const decrypted = values.map(value => _decrypt(value.toString()))

            // return object with encrypted values
            const decryptedPayload = decrypted.reduce((acc, value, index) => {
                acc[fieldsToDecrypt[index]] = value
                return acc
            }, {})

            // get keys minus fields
            const rest = payloadKeys.filter(key => !fieldsToDecrypt.includes(key))

            let finalOutput = {
                ...decryptedPayload,
                ...rest.reduce((acc, key) => {
                    acc[key] = item[key]
                    return acc
                }, {})
            }

            return finalOutput
        })

        payl[parentField] = semiPayload
    })

    // remove any field with dot from payload object

    const fieldsWithDot = Object.keys(payl).filter(key => key.includes('.'))

    fieldsWithDot.forEach(field => {
        delete payl[field]
    })

    return payl
}

module.exports = { encObjectItems, decrptObjectItems, encArrayItems, decrptArrayItems }
























/**
 *
 *


function encObjectItems(payload, nestedFields) {

    const { encrypt } = require('../helper')

    // console.log(payload)
    // console.log(nestedFields)


    // const items = Object.keys(obj).map(key => {
    //     if (typeof obj[key] === 'object') {
    //         return encObjectItems(obj[key], key)
    //     }
    //     return {
    //         [key]: module.exports._encrypt(obj[key], key)
    //     }
    // })
    // return items



    // const nestedFields = fields.filter(field => field.includes('.'))
    const nestedFieldsMap = nestedFields.reduce((acc, field) => {
        const [key, nestedKey] = field.split('.')
        if (!acc[key]) {
            acc[key] = {}
        }
        acc[key][nestedKey] = payload[key][nestedKey]
        return acc
    }, {})


    // console.log(nestedFieldsMap)


    const nestedFieldsPayload = nestedFields.reduce((acc, field) => {
        const [key, nestedKey] = field.split('.')
        if (!acc[key]) {
            acc[key] = {}
        }
        acc[key] = payload[key]
        return acc
    }, {})

    // console.log('fiinal',nestedFieldsPayload)


    const keys = nestedFields.map(field => field.split('.')[0])
    const childkeys = nestedFields.map(field => field.split('.')[1])

    // console.log('keys', keys)

    // console.log(nestedFieldsMap[keys[0]])

    keys.map((key, index) => {
        const encrypted = encrypt(nestedFieldsMap[key], [childkeys[index]])
        nestedFieldsPayload[key] = {...nestedFieldsPayload[key],...encrypted}
    })

    // console.log('herer',nestedFieldsPayload)
    // encrypt(nestedFieldsMap, [...keys, ...Object.keys(payload)])

    //
    const finalOutput = {
        ...payload,
        ...nestedFieldsPayload
    }
    // console.log(finalOutput)

    return finalOutput




}


module.exports = { encObjectItems }
 */