

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

module.exports = { encObjectItems, decrptObjectItems }
























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