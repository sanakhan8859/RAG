const {GetTextFromWebpageUtil} = require("./../utils/webpage.utils")
const {GenerateVectorEmbeddingOfTextUtil} = require("./../utils/openai.utils")
const {GetAllIndexedWebpageService, CreateNewWebpageEntryService, UpdateTheIndexedInfoOfWebpageService, CheckWebpageDuplicacyService, GetWebpageDetailsUsingItsIdService, DeleteIndexedWebpageUsingItsIdService} = require("./../services/webpage.service")
const {FetchOrganizationIdUsingTheUserIdService} = require("./../services/user.service")
const {CreateNewChunkEntryService, DeleteAllChunkTextOfSourceUsingSourceAndSourceIdService} = require("./../services/embedding.service")
const {StoreVectorEmbeddingOfChunkInMilvusVectorDBUtil, DeleteAllChunksVectorFromVectorDBUtil} = require("./../utils/milvus.utils")
require("dotenv").config()

const NODE_ENV = process.env.NODE_ENV

const GetAllIndexedWebpageFromMongoDBController = async (req, res)=>{
    try{

        const GetAllIndexedWebpageServiceResult = await GetAllIndexedWebpageService()
        if(!GetAllIndexedWebpageServiceResult.success){
            throw new Error('Unable to fetch any indexed webpage')
        }
        const {data} = GetAllIndexedWebpageServiceResult

        res.status(200).json({
            success : true,
            data : data
        })

    }catch(err){
        console.log(`Error in GetAllIndexedWebpageFromMongoDBController`)
        res.status(err.statusCode ? err.statusCode : 500).json({
            success : false,
            message : err.message
        })
    }
}

/***************************************************************************************************************
 * This function splits large text into small small chunk i.e. chunks
 * Chunking strategy we are using is Fixed Length Chunk with overlapping
 * 
 * @param {string} largeText - Original Text to split
 * @param {number} chunkSize - Chunk size default is 400 
 * @param {number} overlappingCount - It will decide how may words will overlap
 * 
 * @return {object} - {
 *      success : true,
 *      data : ""
 * }
***************************************************************************************************************/
const ConvertLargeTextToChunks = (largeText, chunkSize=400, overlappingCount=100)=>{

    // largeText is of 2000 words
    
    const wordArray = largeText.trim().split(" ")
    const wordArrayLength = wordArray.length // 2000

    const chunks = []

    let startIndex
    let endIndex

    totalChunkCount = Math.floor(wordArrayLength/chunkSize)

    for(let i=0; i < totalChunkCount; i++){ // i = 0 -> i <= 5

        if(i==0){
            startIndex = i*chunkSize
        }else{
            startIndex = endIndex - overlappingCount
        }

        if(i==totalChunkCount-1){
            endIndex = wordArrayLength -1
        }else{
            endIndex = startIndex + chunkSize
        }
        

        const chunk = wordArray.slice(startIndex, endIndex).join(" ")

        chunks.push(chunk)
    }

    return chunks

}

const IndexNewWebpageController = async (req, res)=>{
    try{

        const source = "webpage"

        const {url} = req.body

        if(!url){
            const err = new Error("URL is required")
            err.statusCode = 400
            throw err
        }

        const GetTextFromWebpageUtilResult = await GetTextFromWebpageUtil(url)
        if(!GetTextFromWebpageUtilResult.success){
            const err = new Error("Error while getting text from webpage")
            err.statusCode = 500
            throw err
        }
        const {data : {text : webpageText, metadata : {title , description : webpageDescription}}} = GetTextFromWebpageUtilResult

        const webpageTitle = title.trim().replace(/\s+/g, ' ') // Remove newlines and extra whitespace

        const userId = req.userId

        // using the userId of the user, lets fetch the organizationId
        const  FetchOrganizationIdUsingTheUserIdServiceResult = await FetchOrganizationIdUsingTheUserIdService(userId)
        if(!FetchOrganizationIdUsingTheUserIdServiceResult.success){
            const err = new Error("Error while fetching organizationId")
            err.statusCode = 500
            throw err
        }
        const {data : organizationId} = FetchOrganizationIdUsingTheUserIdServiceResult

        // check for duplicate webpage indexing. url should be different
        const CheckWebpageDuplicacyServiceResult = await CheckWebpageDuplicacyService(url, organizationId)
        if(CheckWebpageDuplicacyServiceResult.success){
            const err = new Error("Webpage is already indexed")
            err.statusCode = 500
            throw err
        }

        // we have to store webpage meta info like name, url etc in mongoDB
        const CreateNewWebpageEntryServiceResult = await CreateNewWebpageEntryService(webpageTitle, organizationId, url)
        if(!CreateNewWebpageEntryServiceResult.success){
            const err = new Error("Unable to create entry for webpage in webpages collection of mongoDB")
            err.statusCode = 500
            throw err
        }
        const {data :{_id : sourceId}} = CreateNewWebpageEntryServiceResult

        // convert webpageText to small small chunk. small small chunk will combinely known as chunks i.e. Array of Chunk
        const chunks = ConvertLargeTextToChunks(webpageText)

        chunks.forEach(async (chunk, index)=>{

            // For each chunk iterate
            
            const chunkNo = index + 1
            
            // create vector embedding using emebedding model of the individual chunk
            const GenerateVectorEmbeddingOfTextUtilResult = await GenerateVectorEmbeddingOfTextUtil(chunk)
            if(!GenerateVectorEmbeddingOfTextUtilResult.success){
                console.log(`Error while generating vector embedding of chunk with chunkNo ${chunkNo} for webpage with url : ${url} and organizationId : ${organizationId}`)
                return
            }
            const {data : vectorEmbedding} = GenerateVectorEmbeddingOfTextUtilResult

            // store the chunk in plain text into the mongoDB
            const CreateNewChunkEntryServiceResult = await CreateNewChunkEntryService(chunk, source, sourceId, chunkNo)
            if(!CreateNewChunkEntryServiceResult.success){
                console.log(`Error while creating chunk entry of chunk with chunkNo ${chunkNo} in embeddings collection of mongoDB  for webpage with url : ${url} and organizationId : ${organizationId}`)
                return
            }
            const {data : {_id}} = CreateNewChunkEntryServiceResult

            // store the vector embedding of chunk in vector db i.e Milvus
            const StoreVectorEmbeddingOfChunkInMilvusVectorDBUtilResult = await StoreVectorEmbeddingOfChunkInMilvusVectorDBUtil(vectorEmbedding, `${source}-${sourceId}-${chunkNo}`, organizationId)
            if(!StoreVectorEmbeddingOfChunkInMilvusVectorDBUtilResult.success){
                console.log(`Error while saving vector embedding of chunk with chunkNo ${chunkNo} in milvus vector database for webpage with url : ${url} and organizationId : ${organizationId}`)
            }
            
        })

        // update the webpage is_indexed and indexed_at value in mongoDB
        const UpdateTheIndexedInfoOfWebpageServiceResult = await UpdateTheIndexedInfoOfWebpageService(sourceId)
        if(!UpdateTheIndexedInfoOfWebpageServiceResult.success){
            console.log("Error while updating indexed info of webpage in mongoDB")
        }

        console.log(`Webpage with url ${url} is indexed successfully!`)

        res.status(201).json({
            success : true,
            message : "Webpage is indexed"
        })

    }catch(err){
        console.log(`Error in IndexNewWebpageController with error : ${err}`)
        res.status(err.statusCode ? err.statusCode : 500).json({
            success : false,
            message : err.message
        })
    }
}

const DeleteIndexedWebpageController = async (req, res)=>{
    try{

        const {webpageId : sourceId} = req.params
        const source = "webpage"

        // delete all the chunks text from embeddings collection of the mongoDB
        const DeleteAllChunkTextOfSourceUsingSourceAndSourceIdServiceResult = await DeleteAllChunkTextOfSourceUsingSourceAndSourceIdService(source, sourceId)
        if(!DeleteAllChunkTextOfSourceUsingSourceAndSourceIdServiceResult.success){
            console.log(`Unable to delete chunks text for source : ${source} and sourceId ${sourceId}`)
        }

        // delete all the chunks vector from text_embeddings collection of Milvus Vector Database
        const DeleteAllChunksVectorFromVectorDBUtilResult = await DeleteAllChunksVectorFromVectorDBUtil(source, sourceId)
        if(!DeleteAllChunksVectorFromVectorDBUtilResult.success){
            console.log(`Unable to delete chunks vector for source : ${source} and sourceId ${sourceId}`)
        }

        // delete webpage information from webpages collection of mongoDB
        const DeleteIndexedWebpageUsingItsIdServiceResult = await DeleteIndexedWebpageUsingItsIdService(sourceId)
        if(!DeleteIndexedWebpageUsingItsIdServiceResult.success){
            console.log(`Unable to delete webpage from webpages collection of the mongoDB with id ${sourceId}`)
        }

        res.status(200).json({
                success : true
        })

    }catch(err){
        console.log(`Error in DeleteIndexedWebpageController`)
        res.status(err.statusCode ? err.statusCode : 500).json({
            success : false,
            message : err.message
        })
    }
}

module.exports = {
    GetAllIndexedWebpageFromMongoDBController,
    IndexNewWebpageController,
    DeleteIndexedWebpageController
}