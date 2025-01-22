# enjoyyable


Connecting AWS DynamoDB with Node.js backend:
-	Open IAM Dashboard in AWS Console.
-	Click on create user. 
-	Give it a username
-	Provide the policies. We have to attach the AmazonDynamoDBFullAccess policy to it.
-	Click on Create User
-	Later, click on Create Access Key
-	Copy the Access Key and Secret Access Key

Coming to the Node.js Backend,
-	Install AWS SDK using npm install aws-sdk command.
-	Import aws-sdk package to access the DynamoDB table’s data.
-	Set the environment variables AWS_REGION, AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY_ID in .env file
-	The AWS will automatically detect these things from the .env file
Note: Never create an additional process.env files. Just put everything in .env file






Using MD5 in React.js Frontend: (No longer in the application)
-	Install MD5 using npm install md5
-	Use it this way:
``import md5 from “md5”;
const hashedPassword = md5(e.target.password.value);``

Note: MD5 Hashing technique is not a strong hashing technique because the Rainbow Table Attack may reveal the password.
Switching to bcrypt:
Escaping from the Wrong Route in React.js:
-	Use useEffect to solve this problem. 
-	Keep navigate as dependency in the useEffect.

Code:
``useEffect(() => {
if (window.localStorage.getItem(“username”) === null) {
	navigate(“/LoginPage”);
}, [navigate]);
``
-	Set this code according to the requirement.
 
Use a Transaction (Recommended for Consistency)
A DynamoDB transaction allows you to perform up to 25 operations in a single API call, ensuring atomicity and consistency. This approach works well if each field (user, email, mobile) is unique:
const params = {
  TransactItems: [
    {
      Get: {
        TableName: "enjoyyable_users",
        Key: {user: getUsername}
      }
    },
    {
      Get: {
        TableName: "enjoyyable_users",
        Key: {email: getEmail}
      }
    },
    {
      Get: {
        TableName: "enjoyyable_users",
        Key: {mobile: getMobile}
      }
    }
  ]
};
const result = await dynamoDB.transactGet(params).promise();
Advantages:
•	All operations are executed atomically.
•	Single API call, reducing latency.
•	Guarantees consistency. 
Disadvantages:
•	Requires fields to be primary or unique attributes.

