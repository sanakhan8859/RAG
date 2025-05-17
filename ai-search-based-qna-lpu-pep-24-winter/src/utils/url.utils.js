function GenerateUniqueIdForTheURLUtil(charCount){
    const possibleCharString = 'ABCDEFGHTFDCXDDFDFCagjsgfjhahjgdjhagdghjagdhdaghj16871361389176361836718'
    let result = ''
    for(let i=0; i<charCount;i++){
        const uniqueIndex = parseInt(Math.random()*(possibleCharString.length-1))
        result+=possibleCharString[uniqueIndex]
    }
    return result
}

module.exports = {
    GenerateUniqueIdForTheURLUtil
}