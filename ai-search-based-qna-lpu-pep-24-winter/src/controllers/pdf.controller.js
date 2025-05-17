const fs = require('fs')
const {ConvertPDFToTextUtil} = require("./../utils/pdf.utils")
const {GenerateVectorEmbeddingOfTextUtil} = require("./../utils/openai.utils")
const {GetAllIndexedPdfService, CreateNewPDFEntryService, UpdateTheIndexedInfoOfPDFService, CheckPdfDuplicacyService, DeleteIndexedPdfUsingItsIdService} = require("./../services/pdf.service")
const {FetchOrganizationIdUsingTheUserIdService} = require("./../services/user.service")
const {CreateNewChunkEntryService, DeleteAllChunkTextOfSourceUsingSourceAndSourceIdService} = require("./../services/embedding.service")
const {StoreVectorEmbeddingOfChunkInMilvusVectorDBUtil, DeleteAllChunksVectorFromVectorDBUtil} = require("./../utils/milvus.utils")
const {v2: cloudinary} = require('cloudinary')
require("dotenv").config()

const NODE_ENV = process.env.NODE_ENV

const CLOUDINARY_CLOUD_NAME = process.env[`${NODE_ENV}_CLOUDINARY_CLOUD_NAME`]
const CLOUDINARY_API_KEY = process.env[`${NODE_ENV}_CLOUDINARY_API_KEY`]
const CLOUDINARY_API_SECRET = process.env[`${NODE_ENV}_CLOUDINARY_API_SECRET`]

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME, 
    api_key: CLOUDINARY_API_KEY, 
    api_secret: CLOUDINARY_API_SECRET
})

const GetAllIndexedPdfFromMongoDBController = async (req, res)=>{
    try{

        const GetAllIndexedPdfServiceResult = await GetAllIndexedPdfService()
        if(!GetAllIndexedPdfServiceResult.success){
            throw new Error('Unable to fetch any indexed pdf')
        }
        const {data} = GetAllIndexedPdfServiceResult

        res.status(200).json({
            success : true,
            data : data
        })

    }catch(err){
        console.log(`Error in GetAllIndexedPdfFromMongoDBController`)
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

const IndexNewPDFController = async (req, res)=>{
    try{

        const source = "pdf"

        // get the pdf
        const {originalname : pdfName,  path : pdfPath, size : pdfSize} = req.file

        const userId = req.userId

        // using the userId of the user, lets fetch the organizationId
        const  FetchOrganizationIdUsingTheUserIdServiceResult = await FetchOrganizationIdUsingTheUserIdService(userId)
        if(!FetchOrganizationIdUsingTheUserIdServiceResult.success){
            const err = new Error("Error while fetching organizationId")
            err.statusCode = 500
            throw err
        }
        const {data : organizationId} = FetchOrganizationIdUsingTheUserIdServiceResult

        // check for duplicate pdf indexing. pdfName + pdfSize combination should be different
        const CheckPdfDuplicacyServiceResult = await CheckPdfDuplicacyService(pdfName, pdfSize, organizationId)
        if(CheckPdfDuplicacyServiceResult.success){
            // delete the pdf form the uploads/pdfs folder
            fs.unlinkSync(pdfPath)
            const err = new Error("PDF is already indexed")
            err.statusCode = 500
            throw err
        }

        // convert pdf to text
        const pdfConvertResult = await ConvertPDFToTextUtil(pdfPath)
        if(!pdfConvertResult.success){
            const err = new Error("Error while converting PDF to Text")
            err.statusCode = 500
            throw err
        }
        const {numpages : numOfPagesInPdf, info : {Title : pdfTitle, Author : pdfAuthor}, text : pdfText} = pdfConvertResult.data

        let pdfPublicUrl = ""
        // upload the pdf to the file static storage services like cloudinary or aws s3
        const cloudinaryUploadResult = await cloudinary.uploader.upload(pdfPath,{
            resource_type: "raw",
            access_mode: "public"
        })
        if(cloudinaryUploadResult.secure_url){
            pdfPublicUrl = cloudinaryUploadResult.secure_url
        }else{
            console.log(`Unable to upload pdf with name : ${pdfName} to the cloudinary`)
        }

        // we have to store pdf meta info like name, page_no, owner etc in mongoDB
        const CreateNewPDFEntryServiceResult = await CreateNewPDFEntryService(pdfName, pdfAuthor, organizationId, pdfSize, numOfPagesInPdf, pdfPublicUrl!==""?pdfPublicUrl:null)
        if(!CreateNewPDFEntryServiceResult.success){
            const err = new Error("Unable to create entry for pdf in pdfs collection of mongoDB")
            err.statusCode = 500
            throw err
        }
        const {data :{_id : sourceId}} = CreateNewPDFEntryServiceResult

        // convert pdfText to small small chunk. small small chunk will combinely known as chunks i.e. Array of Chunk
        const chunks = ConvertLargeTextToChunks(pdfText)

        chunks.forEach(async (chunk, index)=>{

            // For each chunk iterate
            
            const chunkNo = index + 1
            
            // create vector embedding using emebedding model of the individual chunk
            const GenerateVectorEmbeddingOfTextUtilResult = await GenerateVectorEmbeddingOfTextUtil(chunk)
            if(!GenerateVectorEmbeddingOfTextUtilResult.success){
                console.log(`Error while generating vector embedding of chunk with chunkNo ${chunkNo} for pdf with name : ${pdfName} and organizationId : ${organizationId}`)
                return
            }
            const {data : vectorEmbedding} = GenerateVectorEmbeddingOfTextUtilResult

            // store the chunk in plain text into the mongoDB
            const CreateNewChunkEntryServiceResult = await CreateNewChunkEntryService(chunk, source, sourceId, chunkNo)
            if(!CreateNewChunkEntryServiceResult.success){
                console.log(`Error while creating chunk entry of chunk with chunkNo ${chunkNo} in embeddings collection of mongoDB  for pdf with name : ${pdfName} and organizationId : ${organizationId}`)
                return
            }
            const {data : {_id}} = CreateNewChunkEntryServiceResult

            // store the vector embedding of chunk in vector db i.e Milvus
            const StoreVectorEmbeddingOfChunkInMilvusVectorDBUtilResult = await StoreVectorEmbeddingOfChunkInMilvusVectorDBUtil(vectorEmbedding, `${source}-${sourceId}-${chunkNo}`, organizationId)
            if(!StoreVectorEmbeddingOfChunkInMilvusVectorDBUtilResult.success){
                console.log(`Error while saving vector embedding of chunk with chunkNo ${chunkNo} in milvus vector database for pdf with name : ${pdfName} and organizationId : ${organizationId}`)
            }
            
        })

        // update the pdf is_indexed and indexed_at value in mongoDB
        const UpdateTheIndexedInfoOfPDFServiceResult = await UpdateTheIndexedInfoOfPDFService(sourceId)
        if(!UpdateTheIndexedInfoOfPDFServiceResult.success){
            console.log("Error while updating indexed info of pdf in mongoDB")
        }

        // delete the pdf form the uploads/pdfs folder
        fs.unlinkSync(pdfPath)

        console.log(`PDF with name ${pdfName} is indexed successfully!`)

        res.status(201).json({
            success : true,
            message : "PDF is indexed"
        })

    }catch(err){
        console.log(`Error in IndexNewPDFController with error : ${err}`)
        res.status(err.statusCode ? err.statusCode : 500).json({
            success : false,
            message : err.message
        })
    }
}

const DeleteIndexedPdfController = async (req, res)=>{
    try{

        const {pdfId : sourceId} = req.params
        const source = "pdf"

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

        // delete pdf information from pdfs collection of mongoDB
        const DeleteIndexedPdfUsingItsIdServiceResult = await DeleteIndexedPdfUsingItsIdService(sourceId)
        if(!DeleteIndexedPdfUsingItsIdServiceResult.success){
            console.log(`Unable to delete pdf from pdfs collection of the mongoDB with id ${sourceId}`)
        }

        res.status(200).json({
                success : true
        })

    }catch(err){
        console.log(`Error in DeleteIndexedPdfController`)
        res.status(err.statusCode ? err.statusCode : 500).json({
            success : false,
            message : err.message
        })
    }
}

module.exports = {
    GetAllIndexedPdfFromMongoDBController,
    IndexNewPDFController,
    DeleteIndexedPdfController,
}