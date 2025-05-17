const {MilvusClient} = require("@zilliz/milvus2-sdk-node")
require("dotenv")

const NODE_ENV = process.env.NODE_ENV

const MILVUS_ENDPOINT = process.env[`${NODE_ENV}_MILVUS_ENDPOINT`]
const MILVUS_AUTH_KEY = process.env[`${NODE_ENV}_MILVUS_AUTH_KEY`]

const Client = new MilvusClient({
    address : MILVUS_ENDPOINT,
    token : MILVUS_AUTH_KEY,
    timeout: 60000,
})

const StoreVectorEmbeddingOfChunkInMilvusVectorDBUtil = async (vector, keyId, accountId)=>{
    try{

        const milvusResponse = await Client.insert({
            collection_name : "text_embeddings",
            data : [{
                vector_embedding : vector,
                key_id : keyId,
                account_id : accountId
            }]
        })

        if(milvusResponse.insert_cnt!="1"){
            throw new Error(`Unable to save the Vector Embedding inside the Milvus`)
        }

        return {
            success : true
        }


    }catch(err){
        console.log(err)
        console.log(`Error in StoreVectorEmbeddingOfChunkInMilvusVectorDBUtil with err : ${err}`)
        return {
            success : false,
            message : err.message
        }
    }
}

const SearchTop5ResultFromVectorDBUtil = async (queryVector)=>{
    try{

        const MilvusResponse = await Client.search({
            collection_name: "text_embeddings",
            data: queryVector,
            limit: 5
        })

        if(MilvusResponse.results.length===0){
            throw new Error(`Unable to get any vector search result from Milvus`)
        }

        return {
            success : true,
            data : MilvusResponse.results.filter(chunkVectorData=>chunkVectorData.score>0.2)
        }

    }catch(err){
        console.log(`Error in SearchTop5ResultFromVectorDBUtil with error : ${err}`)
        return {
            success : false,
            message : err.message
        }
    }
}

const DeleteAllChunksVectorFromVectorDBUtil = async (source, sourceId)=>{
    try{

        const deleteChunksVectorResult = await Client.delete({
            collection_name : "text_embeddings",
            filter : `key_id like "${source}-${sourceId}-%"`
        })

        if(deleteChunksVectorResult.delete_cnt==0){
            throw new Error("Unable to delete chunks vector")
        }

        return {
            success : true
        }


    }catch(err){
        console.log(`Error in DeleteAllChunksVectorFromVectorDBUtil with err : ${err}`)
        return {
            success : false,
            message : err.message
        }
    }
}

module.exports = {
    StoreVectorEmbeddingOfChunkInMilvusVectorDBUtil,
    SearchTop5ResultFromVectorDBUtil,
    DeleteAllChunksVectorFromVectorDBUtil
}

