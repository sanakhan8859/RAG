const QUERIESModel = require("./../models/queries.model");

const GetPreviousContextOfQueryUsingItsIdService = async (queryId)=>{
    try{

        const queriesResult = await QUERIESModel.findOne({_id : queryId}).exec()

        if(!queriesResult){
            throw new Error(`Unable to retrieve the queries for the queryId ${queryId}`)
        }

        return {
            success : true,
            data : queriesResult.queries
        }

    }catch(err){
        console.log(`Error in GetPreviousContextOfQueryUsingItsIdService with err : ${err}`)
        return {
            success : false,
            message : err.message
        }
    }
}

const CreateNewQueryService = async (query, answer, processingTime, askedAt) => {
    try {
        const QUERIESResult = await QUERIESModel.create({
            queries: [{
                query: query,
                answer: answer,
                processing_time: processingTime,
                asked_at: askedAt
            }]
        });

        if (QUERIESResult) {
            return {
                success: true,
                data: QUERIESResult
            };
        } else {
            throw new Error("Unable to create new query entry in queries collection of MongoDB");
        }
    } catch (err) {
        console.log(`Error in CreateNewQueryService with err: ${err}`);
        return {
            success: false,
            message: err.message
        };
    }
};

const UpdateTheFollowupQueryService = async (queryId, followupQuery, followupAnswer, followupProcessingTime, followupAskedAt) => {
    try {
        // Find the query by ID
        const query = await QUERIESModel.findById(queryId);

        if (!query) {
            throw new Error(`Unable to get query using given queryId ${queryId}`);
        }

        // Update the query array
        query.queries.push({
            query: followupQuery,
            answer: followupAnswer,
            processing_time: followupProcessingTime,
            asked_at: followupAskedAt
        });

        await query.save();

        return {
            success: true,
            data: query
        };
    } catch (err) {
        console.log(`Error in UpdateTheFollowupQueryService with err: ${err}`);
        return {
            success: false,
            message: err.message
        };
    }
};

module.exports = {
    GetPreviousContextOfQueryUsingItsIdService,
    CreateNewQueryService,
    UpdateTheFollowupQueryService
};
