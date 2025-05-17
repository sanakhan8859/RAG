const WEBPAGESModel = require("./../models/webpages.model")

const GetAllIndexedWebpageService = async ()=>{
    try{

        const Webpages = await WEBPAGESModel.find().exec()

        if(Webpages){
            return {
                success : true,
                data : Webpages
            }
        }else{
            throw new Error('Unable to fetch webpages from webpages collection of mongoDB')
        }

    }catch(err){
        console.log(`Error in GetAllIndexedWebpageService with err : ${err}`)
        return {
            success : false,
            message : err.message
        }
    }
}

const CreateNewWebpageEntryService = async (name, organizationId, url)=>{
    try{

        const webpage = await WEBPAGESModel.create({
            name : name,
            organization : organizationId,
            url : url
        })

        if(webpage){
            return {
                success : true,
                data : webpage
            }
        }else{
            throw new Error('Unable to create new webpage entry in webpages collection of mongoDB')
        }

    }catch(err){
        console.log(`Error in CreateNewWebpageEntryService with err : ${err}`)
        return {
            success : false,
            message : err.message
        }
    }
}

const UpdateTheIndexedInfoOfWebpageService = async (webpageId)=>{
    try{

        const result = await WEBPAGESModel.findByIdAndUpdate(webpageId, {is_indexed : true,  indexed_at : Date()}).exec()

        if(!result){
            throw new Error(`Unable to update the indexing info of webpage with webpageId : ${webpageId}`)
        }

        return {
            success : true
        }

    }catch(err){
        console.log(`Error in UpdateTheIndexedInfoOfWebpageService with err : ${err}`)
        return {
            success : false,
            message : err.message
        }
    }
}

const CheckWebpageDuplicacyService = async (url, organizationId)=>{
    try{

        const result = await WEBPAGESModel.findOne({url : url, organization : organizationId}).exec() 
        
        if(!result){
            throw new Error(`Unable to check duplicacy of the webpage`)
        }

        return {
            success : true
        }

    }catch(err){
        console.log(`Error in CheckWebpageDuplicacyService with err : ${err}`)
        return {
            success : false,
            message : err.message
        }
    }
} 

const GetWebpageDetailsUsingItsIdService = async (sourceId)=>{
    try{

        const webpage = await WEBPAGESModel.findById(sourceId).exec()

        if(!webpage){
            throw new Error(`unable to get webpage details for the webpage with sourceId : ${sourceId}`)
        }

        return {
            success : true,
            data : webpage
        }

    }catch(err){
        console.log(`Error in GetWebpageDetailsUsingItsIdService with err : ${err}`)
        return {
            success : false,
            message : err.message
        }
    }
}

const DeleteIndexedWebpageUsingItsIdService = async (sourceId)=>{
    try{

        const deleteResult = await WEBPAGESModel.deleteMany({_id : sourceId}).exec()

        if(!deleteResult){
            throw new Error(`Unable to delete the webpage with id ${webpageId}`)
        }

        return {
            success : true
        }

    }catch(err){
        console.log(`Error in DeleteIndexedWebpageUsingItsIdService`)
        return {
            success : false,
            message : err.message
        }
    }
}

module.exports = {
    GetAllIndexedWebpageService,
    CreateNewWebpageEntryService,
    UpdateTheIndexedInfoOfWebpageService,
    CheckWebpageDuplicacyService,
    GetWebpageDetailsUsingItsIdService,
    DeleteIndexedWebpageUsingItsIdService
}