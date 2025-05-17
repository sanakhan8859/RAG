const PDFSModel = require("./../models/pdfs.model")

const GetAllIndexedPdfService = async ()=>{
    try{

        const PDFs = await PDFSModel.find().exec()

        if(PDFs){
            return {
                success : true,
                data : PDFs
            }
        }else{
            throw new Error('Unable to fetch pdfs from pdfs collection of mongoDB')
        }

    }catch(err){
        console.log(`Error in GetAllIndexedPdfService with err : ${err}`)
        return {
            success : false,
            message : err.message
        }
    }
}

const CreateNewPDFEntryService = async (name, author, organizationId, size, pageCount, pdfUrl)=>{
    try{

        const PDF = await PDFSModel.create({
            name : name,
            author : author,
            organization : organizationId,
            size : size,
            page_count : pageCount,
            url : pdfUrl
        })

        if(PDF){
            return {
                success : true,
                data : PDF
            }
        }else{
            throw new Error('Unable to create new PDF entry in pdfs collection of mongoDB')
        }

    }catch(err){
        console.log(`Error in CreateNewPDFEntryService with err : ${err}`)
        return {
            success : false,
            message : err.message
        }
    }
}

const UpdateTheIndexedInfoOfPDFService = async (pdfId)=>{
    try{

        const result = await PDFSModel.findByIdAndUpdate(pdfId, {is_indexed : true,  indexed_at : Date()}).exec()

        if(!result){
            throw new Error(`Unable to update the indexing info of pdf with pdfId : ${pdfId}`)
        }

        return {
            success : true
        }

    }catch(err){
        console.log(`Error in UpdateTheIndexedInfoOfPDFService with err : ${err}`)
        return {
            success : false,
            message : err.message
        }
    }
}

const CheckPdfDuplicacyService = async (name, size, organizationId)=>{
    try{

        const result = await PDFSModel.findOne({name : name, size : size, organization : organizationId}).exec() 
        
        if(!result){
            throw new Error(`Unable to check duplicacy of the pdf`)
        }

        return {
            success : true
        }

    }catch(err){
        console.log(`Error in CheckPdfDuplicacyService with err : ${err}`)
        return {
            success : false,
            message : err.message
        }
    }
} 

const GetPDFDetailsUsingItsIdService = async (sourceId)=>{
    try{

        const pdf = await PDFSModel.findById(sourceId).exec()

        if(!pdf){
            throw new Error(`unable to get pdf details for the pdf with sourceId : ${sourceId}`)
        }

        return {
            success : true,
            data : pdf
        }

    }catch(err){
        console.log(`Error in GetPDFDetailsUsingItsIdService with err : ${err}`)
        return {
            success : false,
            message : err.message
        }
    }
}

const DeleteIndexedPdfUsingItsIdService = async (sourceId)=>{
    try{

        const deleteResult = await PDFSModel.deleteMany({_id : sourceId}).exec()

        if(!deleteResult){
            throw new Error(`Unable to delete the pdf with id ${pdfId}`)
        }

        return {
            success : true
        }

    }catch(err){
        console.log(`Error in DeleteIndexedPdfUsingItsIdService`)
        return {
            success : false,
            message : err.message
        }
    }
}

module.exports = {
    GetAllIndexedPdfService,
    CreateNewPDFEntryService,
    UpdateTheIndexedInfoOfPDFService,
    CheckPdfDuplicacyService,
    GetPDFDetailsUsingItsIdService,
    DeleteIndexedPdfUsingItsIdService
}