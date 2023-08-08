var db = require('../config/connection')

var collection = require('../config/collection')
const { response } = require('express')
const { ObjectId } = require('mongodb')

var objectId = require('mongodb').ObjectId

module.exports = {

    addProduct : (product,callback) => {
        db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data)=>{
            callback(data.insertedId.toString())
        })
    },

    getAllProducts : ()=>{
        return new Promise(async(resolve,reject)=>{
            let products =await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },

    deleteProduct : (prodId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id: new objectId(prodId)}).then((reponse)=>{
                resolve(response)
            })
        })    
    },

    getProductDetails : (prodId) => {
        return new Promise ((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id: new ObjectId(prodId)}).then((product)=>{
                resolve(product)
            })
        })
    },

    updateProduct : (prodId,proDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id: new ObjectId(prodId)},{
                $set : {
                    Name            : proDetails.Name,
                    sellingPrice    : proDetails.sellingPrice,
                    actualPrice     : proDetails.actualPrice,
                    discount        : proDetails.discount,
                    status          : proDetails.status,
                    new             : proDetails.new,
                    outOfStock      : proDetails.outOfStock    
                }
            }).then((response)=>{
                resolve()
            })
        })
    },

    addNewDrop : (product,callback) => {
        db.get().collection(collection.NEW_DROPS).insertOne(product).then((data)=>{
            callback(data.insertedId.toString())
        })
    },

    getAllNewDrop : ()=>{
        return new Promise(async(resolve,reject)=>{
            let products =await db.get().collection(collection.NEW_DROPS).find().toArray()
            resolve(products)
        })
    },

    deleteNewDropProduct : (prodId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.NEW_DROPS).deleteOne({_id: new objectId(prodId)}).then((reponse)=>{
                resolve(response)
            })
        })    
    },

    
}