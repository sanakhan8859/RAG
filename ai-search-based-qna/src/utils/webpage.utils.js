const axios = require("axios")
require("dotenv").config()

const NODE_ENV = process.env.NODE_ENV

const FIRECRAWL_API_KEY = process.env[`${NODE_ENV}_FIRECRAWL_API_KEY`]

/***************************************************************************************************************
 * This function scrapes text content from a webpage URL using FireCrawl API
 * 
 * @param {string} url - The webpage URL to scrape content from
 * 
 * @returns {object} - {
 *   success: boolean,
 *   data?: {
 *     text: string, // The scraped text content in markdown format
 *     metadata: object // Additional metadata about the webpage
 *   },
 *   message?: string // Error message if success is false
 * }
 * 
 * The function uses the FireCrawl API to:
 * 1. Initialize a FireCrawl client with the API key
 * 2. Scrape the provided URL and get content in markdown format
 * 3. Return the scraped text and metadata on success
 * 4. Return error details if scraping fails
 * 
 * Example usage:
 * const result = await GetTextFromWebpageUtil('https://example.com')
 * if (result.success) {
 *   console.log(result.data.text) // Scraped text content
 *   console.log(result.data.metadata) // Webpage metadata
 * }
***************************************************************************************************************/
const GetTextFromWebpageUtil = async (url)=>{
    try{

        const scrapeResultResponse = await axios.post('https://api.firecrawl.dev/v1/scrape', {
            url: url,
            formats: ["markdown"]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${FIRECRAWL_API_KEY}`
            }
        });

        const scrapeResult = scrapeResultResponse.data

        if(!scrapeResult.success) {
            throw new Error(scrapeResult.error);
        }

        return {
            success: true,
            data: {
                text: scrapeResult.data.markdown,
                metadata: scrapeResult.data.metadata
            }
        }

    }catch(err){
        console.log(`Error in GetTextFromWebpageUtil with err ${err} for url ${url}`)
        return {
            success : false,
            message : err.message
        }
    }
}

module.exports = {
    GetTextFromWebpageUtil
}