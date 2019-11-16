# Review-svc #


**Create a review**
----
  Create a review for a given business based on business_id .

* **URL**

  `/businesses/{:business_id}/reviews`
  
  Sample Url
  
  `http://{hostname}/businesses/c94a726c-f9d4-4602-8836-ba7248366fce/reviews`
* **Method:**

  `POST`
  
*  **Request Body**

   **Required:**
   ``` 
    {
      "cool": number,
      "funny": number,
      "stars": number,
      "text": "string",
      "useful": number,
      "user_id": "string",
      "username": "string"
    }
   ```
   **Sample Request Body**
      ``` 
        {
          "cool": 55,
          "funny": 12,
          "stars": 5,
          "text": "great service",
          "useful": 1,
          "user_id": "reviewer_3@gmail.com",
          "username": "guy_1"
        }
      ```
* **Success Response:**

  * **Code:** 200 <br />
    **Response Body:** `"message": "Review added successfully"`
 
* **Error Response:**

  * **Code:** 500  <br />
    **Response Body:** `{error: "Unable to add review"}`

**Get reviews by business_id**
----
  Get a reviews for a given business based on business_id .

* **URL**

  `/businesses/{:business_id}/reviews`
  
  Sample Url
  `http://{hostname}/businesses/c94a726c-f9d4-4602-8836-ba7248366fce/reviews`

* **Method:**

  `GET`
  
  **Optional Query Parameters:**
     
     `last_key_review_id="string"`<br/>
     `last_key_business_id="string"`
  
     **Sample Url with  optional parameters**
     `http://{hostname}/businesses/c94a726c-f9d4-4602-8836-ba7248366fce/reviews?last_key_business_id=e9a7c61e-3f16-4ce6-a99b-3ab9cbf13970&last_key_review_id=048d9af2-98f8-4040-9a47-3a091b05b1b8`


* **Success Response:**

  * **Code:** 200 <br />
    **Sample Response Body:** 

   ``` 
    {
      "reviews": [
        {
          "review_id": "048d9af2-98f8-4040-9a47-3a091b05b1b8",
          "user_id": "reviewer_3@gmail.com",
          "cool": 55,
          "stars": 5,
          "text": "great service",
          "business_id": "c94a726c-f9d4-4602-8836-ba7248366fce",
          "useful": 1,
          "funny": 12,
          "username": "guy_1"
        }
      ],
      "LastEvaluatedKey": {
        "review_id": "048d9af2-98f8-4040-9a47-3a091b05b1b8",
        "business_id": "c94a726c-f9d4-4602-8836-ba7248366fce"
      }
    }
   ```

* **Error Response:**

  * **Code:** 404  <br />
    **Response Body:** `{error: "No reviews found for businessId  ${business_id}"}`

  OR

  * **Code:** 500  <br />
    **Response Body:** `"Error occurred while fetching reviews"`
    

**Delete a review**
----
  Delete a existing review based on business_id and review_id.

* **URL**

  `/businesses/{:business_id}/reviews/{:review_id}`

  Sample Url
  
  `localhost:3002/businesses/c94a726c-f9d4-4602-8836-ba7248366fce/reviews/cea21094-f094-4e87-ae91-9842ea596f88`  
  

* **Method:**

  `DELETE`

* **Success Response:**

  * **Code:** 200 <br />
    **Response Body:** <br />
    `{message: "Review deleted successfully"}`
    
* **Error Response:**

  * **Code:** 500  <br />
    **Response Body:** <br />
     `{error_message: "Error occurred while deleting review", error: err}`

AWS DYNAMODB CLI
============= 
***Start Local DynamoDB from location where dynamo jar file is present*** <br />
	`java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb`

***List Tables*** <br />
`aws dynamodb list-tables --endpoint-url http://localhost:8000`

***Describe Tables*** <br />
`aws dynamodb describe-table --table-name sportify-reviews --endpoint-url http://localhost:8000`<br />

***Scan Table to see all items***<br />
`aws dynamodb scan --table-name sportify-reviews --endpoint-url http://localhost:8000`<br />
`aws dynamodb scan --table-name sportify-reviews --index-name business-index --endpoint-url http://localhost:8000`<br />

***Delete Table*** <br />
`aws dynamodb delete-table --table-name sportify-reviews --endpoint-url http://localhost:8000`<br />

***Create sportify-reviews table*** <br />
```
aws dynamodb create-table \
    --table-name sportify-reviews \
    --attribute-definitions \
        AttributeName=review_id,AttributeType=S \
    --key-schema AttributeName=review_id,KeyType=HASH  \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
   --endpoint-url http://localhost:8000
```

***Create business-index Global Secondary Index on sportify-reviews table***
```
aws dynamodb update-table \
    --table-name sportify-reviews \
    --attribute-definitions AttributeName=business_id,AttributeType=S \
    --global-secondary-index-updates \
    "[{\"Create\":{\"IndexName\": \"business-index\",\"KeySchema\":[{\"AttributeName\":\"business_id\",\"KeyType\":\"HASH\"}], \
    \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 10, \"WriteCapacityUnits\": 10      },\"Projection\":{\"ProjectionType\":\"ALL\"}}}]" \
--endpoint-url http://localhost:8000
```
    
***Check Status of Global Secondary Index***
 `aws dynamodb describe-table --table-name sportify-reviews --endpoint-url http://localhost:8000 | grep IndexStatus`

***Delete GSI business-index***
```
aws dynamodb update-table \
    --table-name sportify-reviews \
    --attribute-definitions AttributeName=business_id,AttributeType=S \
    --global-secondary-index-updates \
    "[{\"Delete\":{\"IndexName\":\"business-index\"}}]" \
--endpoint-url http://localhost:8000
```


