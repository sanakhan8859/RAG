const EMBEDDINGSModel = require("./../models/embeddings.model")

const CreateNewChunkEntryService = async (text, source, sourceId, chunkNumber)=>{
    try{

        const Chunk = await EMBEDDINGSModel.create({
            text : text,
            source : source,
            source_id : sourceId,
            chunk_no : chunkNumber
        })

        if(Chunk){
            return {
                success : true,
                data : Chunk
            }
        }else{
            throw new Error('Unable to create new Chunk entry in embeddings collection of mongoDB')
        }

    }catch(err){
        console.log(`Error in CreateNewChunkEntryService with err : ${err}`)
        return {
            success : false,
            message : err.message
        }
    }
}

const GetTextOfChunkUsingChunkNoSourceAndSourceId = async (chunkNumber, source, sourceId)=>{
    try{

        const chunk = await EMBEDDINGSModel.findOne({
            source : source,
            chunk_no : chunkNumber,
            source_id : sourceId
        })

        if(!chunk){
            throw new error(`unable to find chunk with chunkNo ${chunkNumber}, source ${source} and sourceId ${sourceId}`)
        }

        return {
            success : true,
            data : chunk.text
        }

    }catch(err){
        console.log(`Error in GetTextOfChunkUsingChunkNoSourceAndSourceId with err : ${err}`)
        return {
            success : false,
            message : err.message
        }
    }
}

const DeleteAllChunkTextOfSourceUsingSourceAndSourceIdService = async (source, sourceId)=>{
    try {

        const result = EMBEDDINGSModel.deleteMany({source : source, source_id : sourceId}).exec()

        if(!result){
            throw new Error(`Unable to delete chunks text of source ${source} and sourceId ${sourceId}`)
        }

        return {
            success : true
        }

    }catch(err){
        console.log(`Error in DeleteAllChunkTextOfSourceUsingSourceAndSourceIdService with err : ${err}`)
        return {
            success : false
        }
    }
}

module.exports = {
   CreateNewChunkEntryService,
   GetTextOfChunkUsingChunkNoSourceAndSourceId,
   DeleteAllChunkTextOfSourceUsingSourceAndSourceIdService
}