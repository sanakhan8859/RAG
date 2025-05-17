const PdfParse = require("pdf-parse");
const fs = require('fs')

const ConvertPDFToTextUtil = async (pdfPath)=>{
    try{

        // pdfPath is the location of the pdf on our app server
        let pdfDataBuffer = fs.readFileSync(pdfPath)

        const result = await PdfParse(pdfDataBuffer)

        return {
            success : true,
            data : result
        }


    }catch(err){
        console.log(`Error in ConvertPDFToTextUtil with error : ${err}`)
        return {
            success : false,
            message : err.message
        }
    }
}

module.exports = {
    ConvertPDFToTextUtil
}