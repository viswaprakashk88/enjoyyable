const express = require('express');
const http = require('http');
const https = require('https');
const socketIo = require('socket.io');
const fs = require("fs");
const querystring = require('querystring');
const Buffer = require('buffer').Buffer;
const request = require('request');
const app = express();
const cors = require("cors");
const {Server} = require("socket.io");
require('dotenv').config();
const AWS = require('aws-sdk');
const axios = require('axios');

app.use(cors({origin: "*"}));

app.use(express.json());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
var REDIRECT_URI = 'https://localhost:3001';

console.log(CLIENT_ID);


//For HTTPS-Secure Transmission
const options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
};

//Including the SSL Certificate into the server.
const server = https.createServer(options, app);
const io = new Server(server, {
  cors: {origin:"*", methods: ["GET", "POST"]},
});

function generateRandomString() {
  var characters = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var charactersLength = characters.length;
  var result = '';
  for(var i = 0 ; i < 16 ; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

//Example API For Reference (DON'T DELETE THIS)
// app.get("/api",(req,res)=>{
//   return res.json({message : "Message from Prakash 'God'"});
// });

const usersStatus = {};

//Socket Activities
io.on("connection", (socket) => {
  console.log("a user connected "+socket.id);
  
  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
    console.log("send message worked, "+data.socketId+", "+data.sentMessage);
  });
  socket.on("send_playerListener", (data) => {
    socket.broadcast.emit("receive_playerListener", data);
  });

  socket.on("sendToggledInfo", (data) => {
    socket.emit("receiveToggledInfo", data);
  });
});


//Route to test the AWS API
app.get("/scatter", (req, res) => {
    const documentClient = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName : "enjoyyable_users"
    }
    documentClient.scan(params, (err, data) => {
      if (err) {
        res.send({success : "false"})
      }
      else{
        res.send({success : "true", itemed : data});
      }
    });
});

//(for USER LOGIN)Endpoint to Check Whether the given credentials are valid or not 
app.get("/checkLoginCredentials", (req, res) => {
  const loginUsername = req.query.un;
  const loginPassword = req.query.pw;

  const documentClient = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName : "enjoyyable_users",
      Key : {user : loginUsername }
    }
    documentClient.get(params, (err, data) => {
      if (err) {
        res.send(err)
      }
      else{
        try {
          if (data["Item"]["password"] === loginPassword ) {
            res.send({loginStatus : "success", ok : true});
            return;
          }
        } catch (err) {
          console.log("err is : " + err);
        }

        res.send({loginStatus : "failed", ok : true});

      }
    });
});


//Route to serve Signup Request
app.post("/validateSignup", async (req, res) => {
  const { username,password,email,mobile,name } = req.body;

  var documentClient = new AWS.DynamoDB.DocumentClient();

  const getUsername = username;
  const getName = name;
  const getEmail = email;
  const getMobile = mobile;
  const getPassword = password;

  //this params is to check whether there is already a record in the table with one of the user entered {username, email, mobile}
  const paramsToCheck = {
    TableName: "enjoyyable_users",
    FilterExpression: "#user = :username OR #email = :email OR #mobile = :mobile",
    ExpressionAttributeNames: {
      "#user" : "user",
      "#mobile" : "mobile",
      "#email" : "email"
    },
    ExpressionAttributeValues: {
      ":username": getUsername,
      ":email": getEmail,
      ":mobile": getMobile
    },
  };
  
  var ress = null;
  documentClient.scan(paramsToCheck, (err,data) => {
    if (err) {
      //Error occured while scanning through the table in SignpUp
      res.send({ok : false});
    }
    else if (data.Items.length === 0) {
      //Received Item do not exists in the table. Thus, creating a new one
      const paramsToInsert = {
        TableName : "enjoyyable_users",
        Item : {
          user : getUsername,
          password : getPassword,
          email : getEmail,
          mobile : getMobile,
          name : getName
        }
      };

      documentClient.put(paramsToInsert, (err, data) => {
        if (err) {
          res.send({"isItemInserted" : false, "isItemExists" : false, ok : false});
        }
        else {
          res.send({ "isItemInserted" : true, "isItemExists" : false, ok : true });
        }
      });
    }
    else {
      res.send({ "isItemInserted" : false, "isItemExists" : true, ok : true });
    }
  });
});


//Route for SearchUser API
app.post("/searchUser", async (req, res) => {
  const { userHint, username } = req.body;
  var documentClient = new AWS.DynamoDB.DocumentClient();
  
  const paramsForUsers = {
    TableName : "enjoyyable_users",
    FilterExpression : "contains(#username, :username) OR contains(#name, :name)",
    ExpressionAttributeNames : {
      "#username" : "user",
      "#name" : "name",
      "#friendshipStatus" : "friendshipStatus"
    },
    ExpressionAttributeValues : {
      ":username" : userHint,
      ":name" : userHint
    },
    Select : "SPECIFIC_ATTRIBUTES",
    ProjectionExpression : "#name, #username, #friendshipStatus",
  };
  documentClient.scan(paramsForUsers, (err, data) => {
    if (err){
      res.send({ok : false, error_message : err.message});
      return;
    }
    return res.send({items: data.Items});

  });
});

//Getting Connection Requests of a user
app.post("/getRequests", async (req, res) => {
  const { userHint, username } = req.body;
  var documentClient = new AWS.DynamoDB.DocumentClient();

  const paramsForRequests = {
    TableName : "connection_requests",
    FilterExpression : "contains(#username, :username)",
    ExpressionAttributeNames : {
      "#username": "username",
    },
    ExpressionAttributeValues : {
      ":username" : username
    },
    // Select : "SPECIFIC_ATTRIBUTES",
    // ProjectionExpression : "#name, #toUsername, #friendshipStatus"
  };
  documentClient.scan(paramsForRequests, (err, data) => {
    if (err){
      res.send({ok : false, error_message : err.message});
      return;
    }
    return res.send({items: data, userHinted: userHint, usernamed: username});
  });
});


//Route to Store the connection request sent 
app.post("/sendConnectionRequest", (req, res) => {
  const {sendFromUsername, sendTime, sendToUsername, sendName, sendMyName} = req.body;
  const documentClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName : "connection_requests",
    Item : {
      "time" : sendTime+"",
      "username" : sendFromUsername + "#&#" + sendToUsername,
      "name" : sendMyName + "#&#" +sendName,
      "friendshipStatus" : "requested",
    },

  };
  documentClient.put(params, (err, data) => {
    if (err) {
      console.log(err);
      res.send({ok : false, err: err,"requestSent":false});
      return;
    }
    console.log("connection request sent");
    res.send({ok:true, "requestSent": true});
  });
});

//Route to get the accept the connection request
app.post("/acceptRequest", (req, res) => {
  const {time} = req.body;
  const paramsToAcceptRequest = {
    TableName : "connection_requests",
    Key : {time : time},
    UpdateExpression: 'set #friendshipStatus = :friended',
    ExpressionAttributeNames : {
      "#friendshipStatus" : "friendshipStatus"
    },
    ExpressionAttributeValues : {
      ":friended" : "friends"
    }
  };
  const documentClient = new AWS.DynamoDB.DocumentClient();
  documentClient.update(paramsToAcceptRequest, (err, data) => {
    if (err) {
      res.send({ok : false, error : err_message});
    }
    res.send({ok : true, connected : true});
  });
});

//Route to get all the connection requests
app.post("/getAllRequests", (req, res) => {
  const {username} = req.body;
  const documentClient = new AWS.DynamoDB.DocumentClient();
  const paramsToGetAllRequests = {
    TableName : "connection_requests",
    FilterExpression : "contains(#username, :username) AND #friendshipStatus = :friendshipStatus",
    ExpressionAttributeNames : {
      "#username" : "username",
      "#friendshipStatus" : "friendshipStatus"
    },
    ExpressionAttributeValues : {
      ":username" : username,
      ":friendshipStatus" : "requested"
    }
  }
  documentClient.scan(paramsToGetAllRequests, (err, data) => {
    if (err) {
      res.send({ok : false, error_message : err});
    }
    else{
      const filteredData = data.Items.filter(item => item.username.endsWith(username));
      console.log(filteredData);
      res.send({items : filteredData});
    }
  });
});

//Route To Fetch User Info
app.post("/getUserInfo", (req, res) => {
  const {username} = req.body;
  const documentClient = new AWS.DynamoDB.DocumentClient();
  const paramsToGetAllRequests = {
    TableName : "enjoyyable_users",
    FilterExpression : "contains(#username, :username)",
    ExpressionAttributeNames : {
      "#username" : "user",
      "#email" : "email",
      "#name" : "name",
      "#mobile" : "mobile"
    },
    ExpressionAttributeValues : {
      ":username" : username
    },
    Select : "SPECIFIC_ATTRIBUTES",
    ProjectionExpression : "#username, #email, #name, #mobile"
  }
  // console.log(username + " in getUserInfo");
  documentClient.scan(paramsToGetAllRequests, (err, data) => {
    if (err) {
      res.send({ok : false, error_message : err});
    }
    
    else{
      res.send({items : data});
    }
  });
});

//Route to fetch the user's friends list
app.post("/getFriends" , (req, res) => {
  const {username} = req.body;
  const documentClient = new AWS.DynamoDB.DocumentClient();
  
  const paramsToGetFriends = {
    TableName : "connection_requests",
    FilterExpression : "contains(#username, :username) AND #friendshipStatus = :friendshipStatus",
    ExpressionAttributeNames : {
      "#username" : "username",
      "#friendshipStatus" : "friendshipStatus"
    },
    ExpressionAttributeValues : {
      ":username" : username,
      ":friendshipStatus" : "friends"
    }
  };
  documentClient.scan(paramsToGetFriends, (err, data) => {
    if (err) {
      res.send({ok : false, err : err.message});
    }
    
    if (data && data["Items"]){
      tempData = data["Items"].filter((item) => {
        splittedParts = item["username"].split("#&#");
        return splittedParts[0] === username || splittedParts[1] === username;
      })
      res.send({ok : true, items : tempData});
    }
    else {
      res.send({items : data});
    }
  });
});


//Route to check whether the given groupId already exists or not.
app.post ("/checkGroupId", (req, res) => {
  const {groupIdname} = req.body;
  const documentClient = new AWS.DynamoDB.DocumentClient();
  const paramsToCheckGroupId = {
    TableName : "groups",
    FilterExpression : "groupid = :groupid",
    ExpressionAttributeValues : {
      ":groupid" : groupIdname
    }
  };
  documentClient.scan(paramsToCheckGroupId, (err, data) => {
    if (err) {
      res.send({ok : false, error_message : err.message});
      return;
    }

    res.send({ok : true, exists : data["Items"].length > 0});
  });
});


//Route to create a group name
app.post ("/createGroup", (req, res) => {
  const {groupIdname, groupName, groupMembers, groupAdmin, dateTime} = req.body;
  const documentClient = new AWS.DynamoDB.DocumentClient();
  const paramsToCreateGroup = {
    TableName : "groups",
    Item : {
      "groupid" : groupIdname,
      "groupName" : groupName,
      "groupMembers" : groupMembers,
      "groupAdmin" : groupAdmin,
      "dateTime" : dateTime
    }
  };
  documentClient.put(paramsToCreateGroup, (err, data) => {
    if (err) {
      res.send({ok : false, error_message : err.message});
      return;
    }
    res.send({ok : true, created : true});
  });
});

//Route to get the groups that the user is part of
app.post ("/getGroups", (req, res) => {
  const {username} = req.body;
  const paramsToGetGroups = {
    TableName : "groups",
    FilterExpression : "contains(#groupMembers, :username)",
    ExpressionAttributeNames : {
      "#groupMembers" : "groupMembers"
    }, 
    ExpressionAttributeValues : {
      ":username" : username
    }
  };
  const documentClient = new AWS.DynamoDB.DocumentClient();
  documentClient.scan(paramsToGetGroups, (err, data) => {
    if (err) {
      res.send({ok : false, error_message : err.message});
      return;
    }
    res.send({ ok : true, items : data.Items});
  });
});

// app.get("/redirectApi", (req, res) => {
//   res.redirect("https://www.google.com");
// });


//fetching Group Members' names
app.post("/getNames", (req, res) => {
  const keys = req.body.usernames.map(username => ({
    user: username
  }));
  console.log(keys);
  const attributesToGet = ['#user', '#name']
  const documentClient = new AWS.DynamoDB.DocumentClient();
  const paramsToGetNames = {
    RequestItems: {
      "enjoyyable_users": {
        Keys: keys,
        ProjectionExpression: "#user, #name",
        ExpressionAttributeNames: {
          "#user": "user",
          "#name": "name"
        }
      },
      
    },
    
  }
  try {
    documentClient.batchGet(paramsToGetNames, (err, data) => {
      if (err) {
        res.send({ok: false, error_message: "Error Fetching Names Of The Group "+ err.message});
      }
      else {
        res.send({ok: true, items:data.Responses["enjoyyable_users"]});
      }
    });
  }
  catch (exception) {
    res.send({ok: false, error_message: "Error in Try Fetching Names Of The Group"});
  }
});

//Updating the name of the user profile
app.post ("/updateName", (req, res) => {

  const {name,username} = req.body;
  const documentClient = new AWS.DynamoDB.DocumentClient();
  console.log(name + ", " + username + " in updateName Route");
  const paramsToGetGroups = {
    TableName : "enjoyyable_users",
    Key : {user : username},
    UpdateExpression: 'set #name = :name',
    ExpressionAttributeNames: {
      "#name": "name"
    },
    ExpressionAttributeValues : {
      ":name": name
    }
  };
  try{
    documentClient.update(paramsToGetGroups, (err, data) => {
      if (err) {
        res.send({ok : false, error_message : err.message});
      }
      else{
        res.send({ ok : true, items : data.Items});
      }
    });
  } catch (exception) {
    res.send({ok: false, error_message: "Something went wrong!" + exception.message});
  }
});

//Sample API
// app.get("/appendGroups", (req,res) => {
//   res.send("hi");
// });

//Spotify Authorization
var states = generateRandomString();
var scopes = 'user-read-private user-read-email streaming user-modify-playback-state user-read-playback-state';
app.get('/login', function(req, res) {
    res.redirect('https://accounts.spotify.com/authorize?response_type=code&redirect_uri=https://localhost:3000&client_id=' + CLIENT_ID + '&scope=' + scopes+ '&state=' + states );
    console.log('https://accounts.spotify.com/authorize?response_type=code&redirect_uri=https://localhost:3000&client_id=' + CLIENT_ID + '&scope=' + scopes+ '&state=' + states);
});

var accessToken = '';


//Getting the acccess token using the "code"
app.get('/accessToken', (req, res) => {
  var coded = req.query.code;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: coded,
      redirect_uri: 'https://localhost:3000',
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')),
      'Content-Type' : 'application/x-www-form-urlencoded'
    },
    json: true
  }
  request.post(authOptions, function(error, response, body) {

    if (!error && response.statusCode === 200) {
      accessToken = body.access_token;
      return res.json({message : 'Message From Prakash The Lord', accessToken:body.access_token, refreshToken: body.refresh_token})
    }
  });
});

//Route for Refreshing the Access Token given the refresh token
// if (!error && response.statusCode === 200) {
  //   res.send({message : 'Message From Prakash The Lord', accessToken: body.access_token, refreshToken: body.refresh_token});
  // }
app.post('/refreshToken', async function (req, res) {
  try {
      const refreshToken = req.body.refreshToken;
      console.log("Received Refresh Token:", refreshToken);
      console.log(req.body.currentDateTime);
      
      const refreshTokenResponse = await axios.post("https://accounts.spotify.com/api/token", 
          new URLSearchParams({
              grant_type: 'refresh_token',
              refresh_token: refreshToken 
          }).toString(), 
          {
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
              }
          }
      );
      console.log(refreshTokenResponse);
      if (refreshTokenResponse.status === 200) {
        
          res.send({
              message: 'Message From Prakash The Lord',
              accessToken: refreshTokenResponse.data.access_token,
              refreshToken: refreshTokenResponse.data.refresh_token || refreshToken // Use old refreshToken if new one is not provided
          });
      }
  } catch (error) {
      console.error("Error refreshing token:", error.response ? error.response.data : error.message);
      res.status(500).send({ error: 'Failed to refresh token' });
  }
});


//Server Listener
server.listen(3001,   () => {
  console.log('Socket.IO server is running on port 3001');
});