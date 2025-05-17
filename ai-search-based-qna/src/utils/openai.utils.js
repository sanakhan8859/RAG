const axios = require("axios")
const { model } = require("mongoose")
require('dotenv').config()

const NODE_ENV = process.env.NODE_ENV

const OPENAI_KEY = process.env[`${NODE_ENV}_OPENAI_KEY`]

const EMBEDDING_MODEL = process.env[`${NODE_ENV}_EMBEDDING_MODEL`]

const GenerateVectorEmbeddingOfTextUtil = async (text)=>{
    try{

        const OPENAI_EMBEDDING_MODEL_API_URL = "https://api.openai.com/v1/embeddings"

        const data = {
            model : EMBEDDING_MODEL,
            input : text
        }

        const config = {
            headers : {
                'Authorization' : `Bearer ${OPENAI_KEY}`,
                'Content-Type' : 'application/json'
            }
        }

        const apiResult = await axios.post(OPENAI_EMBEDDING_MODEL_API_URL, data, config)

        if(!apiResult.data || !apiResult.data.data || apiResult.data.data.length ==0){
            throw new Error('Error while generating embedding')
        }

        return {
            success : true,
            data : apiResult.data.data[0].embedding
        }

    }catch(err){
        console.log(`Error in GenerateVectorEmbeddingOfTextUtil with err : ${err}`)
        return {
            success : false,
            message : err.message
        }
    }
}

const GenerateAnswerOfQueryUsingOrginalQueryAndRelevantContextUtil = async (query, relevantChunks)=>{
    try{

        const message = [
            {
              "role": "system",
              "content": "You are an AI assistant that answers user queries strictly based on the provided context. Do not use external knowledge or make assumptions. If the context does not contain relevant information, respond with 'I'm sorry, but I don't have enough information to answer that.'"
            },
            {
              "role": "user",
              "content": `User Query: ${query}\n\nRelevant Context: ${relevantChunks.join("\n\n\n")}`
            }
        ]

        const data = {
            model : 'gpt-4o',
            messages : message,
            max_tokens : 4000
        }

        const config = {
                headers : {
                    'Authorization' : `Bearer ${OPENAI_KEY}`,
                    'Content-Type' : 'application/json'
                }
        } 

        const apiResponse = await axios.post('https://api.openai.com/v1/chat/completions', data, config)

        if(apiResponse.data.choices.length===0){
            throw new Error("Unable to generate answer for the query")
        }

        return {
            success : true,
            data : apiResponse.data.choices[0].message.content.trim()
        }

    }catch(err){
        console.log(`Error in GenerateAnswerOfQueryUsingOrginalQueryAndRelevantContextUtil with err : ${err}`)
        return {
            success : false,
            message : err.message
        }
    }
}

const GenerateAnswerOfQueryUsingPastContextAndCurrentContextUtil = async (pastConversationString, followupQuery, followupRelevantChunks) => {
    try {
        const message = [
            {
                "role": "system",
                "content": "You are an AI assistant that answers user queries strictly based on the provided context, including past conversations and relevant information. Do not use external knowledge or make assumptions. If the context does not contain relevant information, respond with 'I'm sorry, but I don't have enough information to answer that.'"
            },
            {
                "role": "user",
                "content": `Previous Conversation:\n${pastConversationString}\n\nUser's Follow-up Query: ${followupQuery}\n\nRelevant Context for Follow-up:\n${followupRelevantChunks.join("\n\n")}`
            }
        ];

        const data = {
            model: 'gpt-4o',
            messages: message,
            max_tokens: 4000
        };

        const config = {
            headers: {
                'Authorization': `Bearer ${OPENAI_KEY}`,
                'Content-Type': 'application/json'
            }
        };

        const apiResponse = await axios.post('https://api.openai.com/v1/chat/completions', data, config);

        if (apiResponse.data.choices.length === 0) {
            throw new Error("Unable to generate answer for the query");
        }

        return {
            success: true,
            data: apiResponse.data.choices[0].message.content.trim()
        };

    } catch (err) {
        console.log(`Error in GenerateAnswerOfQueryUsingPastContextAndCurrentContextUtil with err: ${err}`);
        return {
            success: false,
            message: err.message
        };
    }
};

module.exports = {
    GenerateVectorEmbeddingOfTextUtil,
    GenerateAnswerOfQueryUsingOrginalQueryAndRelevantContextUtil,
    GenerateAnswerOfQueryUsingPastContextAndCurrentContextUtil
}