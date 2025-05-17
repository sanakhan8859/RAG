const multer = require("multer")

// Set pdf storage guideline
const pdfStorage = multer.diskStorage({
    destination : "uploads/pdfs/", // This is the location, where will will be storing the pdfs,
    filename : (req, file, cb)=>{
        const fileName = file.originalname ? file.originalname : `${Date.now()}.pdf`
        cb(null, fileName)
    }
})

// pdf filter logic
const pdfFilter = (req, file, cb) => {
    if(file.mimetype==="application/pdf"){
        cb(null, true)
    }else{
        cb(new Error('Only PDFs are allowed!'), false)
    }
}

// Multer middleware for the pdf
const PdfUploadMiddleware = multer({
    storage : pdfStorage,
    fileFilter : pdfFilter
})

module.exports = {
    PdfUploadMiddleware
}

