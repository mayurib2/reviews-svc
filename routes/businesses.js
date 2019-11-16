const express = require('express');
const AWS = require('aws-sdk');
const router = new express.Router();
const uuid = require('uuidv4').default;

AWS.config.update({
    region: "us-east-1",
    endpoint: "http://localhost:8000",
    accessKeyId: "ad",
    secretAccessKey: "da"
});
const dynamodbDocClient = new AWS.DynamoDB.DocumentClient();

router.get('/:business_id/reviews', async (req, res) => {
    let review_params, business_id = req.params.business_id;
    res.setHeader('Access-Control-Allow-Origin', '*');

    review_params = {
        TableName: "sportify-reviews",
        IndexName: 'business-index',
        KeyConditionExpression: "business_id = :business_id",
        ExpressionAttributeValues: {
            ':business_id': business_id,
        },
        Limit: 1
    };

    if (req.query.last_key_review_id && req.query.last_key_business_id) {
        review_params.ExclusiveStartKey = {
            review_id: req.query.last_key_review_id,
            business_id: req.query.last_key_business_id
        };
    }

    let review_results, all_review_results = [], response = {};
    let review_result_length = 0;
    try {
        do {
            console.log("review_params ", review_params);
            review_results = await dynamodbDocClient.query(review_params).promise();
            console.log("review_results = ", review_results);
            if (review_results && review_results.Items && review_results.Items.length > 0) {
                all_review_results.push(...review_results.Items);
                review_result_length = all_review_results.length;
            }
            if (review_results.LastEvaluatedKey) {
                if (review_result_length > 0) {
                    response.reviews = all_review_results;
                    response.LastEvaluatedKey = review_results.LastEvaluatedKey;
                    return res.json(response);
                }
                review_params.ExclusiveStartKey = review_results.LastEvaluatedKey;
            }
        } while (review_results.LastEvaluatedKey);

        if (review_result_length > 0) {
            response.reviews = all_review_results;
            return res.json(response);
        } else
            return res.status(404).json({error: `No reviews found for businessId  ${business_id}`});

    } catch (err) {
        res.status(500).json({error_message: "Error occurred while fetching reviews", error: err});
    }
})

router.post('/:business_id/reviews', (req, res) => {
    const review_params = {
        TableName: "sportify-reviews",
        Item: {
            "review_id": uuid(),
            "business_id": req.params.business_id,
            "cool": req.body.cool,
            "funny": req.body.funny,
            "stars": req.body.stars,
            "text": req.body.text,
            "useful": req.body.useful,
            "user_id": req.body.user_id,
            "username": req.body.username
        }
    };

    console.log("Adding a new review...");
    res.setHeader('Access-Control-Allow-Origin', '*');

    dynamodbDocClient.put(review_params, (err, result_reviews) => {
        if (err) {
            console.error("Unable to add review", JSON.stringify(err));
            return res.status(500).json({error: "Unable to add review"});
        } else {
            console.log("Result of adding to review ", result_reviews);
            return res.status(200).json({"message": "Review added successfully"});
        }
    });
});

router.delete('/:business_id/reviews/:review_id', async (req, res) => {

    const review_id = req.params.review_id;
    const business_id = req.params.business_id;
    console.log(`Deleting records based on review_id = ${review_id} and business_id = ${business_id}`);

    const review_params = {
        TableName: "sportify-reviews",
        Key: {
            "review_id": review_id
        }
    };

    let review_delete_result;
    try {
        review_delete_result = await dynamodbDocClient.delete(review_params).promise();
        console.log("review_delete_result delete results :", review_delete_result);
        return res.status(200).json({message: "Review deleted successfully"});
    } catch (err) {
        console.log(`Error occurred deleting review  with review_id ${review_id} and business_id ${business_id}`);
        res.status(500).json({error_message: "Error occurred while deleting review", error: err});
    }
});

module.exports = router;
