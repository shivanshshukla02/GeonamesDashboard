const express = require("express");
const AWS = require("aws-sdk");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();

const awsConfig = {
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

AWS.config.update(awsConfig);

const documentClient = new AWS.DynamoDB.DocumentClient();

const app = express();
app.use(bodyParser.json());

const port = 3009;
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.get("/", (req, res) => {
  res.send("server is on");
});

app.get(`/data`, async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  const ddate1 = req.query.FromDate;
  const ddate2 = req.query.ToDate;
  const id = req.query.ClientId;
  const date1 = new Date(ddate1).getTime();
  const date2 = new Date(ddate2).getTime();

  const params = {
    TableName: "geonamesData",
    ProjectionExpression:
      "clientId, logID, createdAt, #timestamp,#query,#result",
    ExpressionAttributeNames: {
      "#timestamp": "timestamp",
      "#query": "query",
      "#result": "result",
    },
    Limit: 10,
    FilterExpression: "(#timestamp >= :date1) AND (#timestamp <= :date2)",
    ExpressionAttributeValues: {
      ":date1": date1,
      ":date2": date2,
    },
  };

  if (id !== "ALL") {
    // //console.log(id);

    params.FilterExpression += " AND (clientId = :id)";
    params.ExpressionAttributeValues[":id"] = id;
  }

  let allData = [];
  let lastEvaluatedKey;

  do {
    //this is pagination
    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = lastEvaluatedKey;
    }

    const result = await documentClient.scan(params).promise();
    allData = allData.concat(result.Items);
    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);
  // //console.log(allData);
  res.status(200).json(allData);
});
const documentClient1 = new AWS.DynamoDB.DocumentClient();
app.get("/getid", async (req, res) => {
  //this is returning all unique ids present in database
  try {
    const params = {
      TableName: "geonamesData",
      ProjectionExpression: "clientId",
    };

    let clientIds = new Set();
    clientIds.add("ALL");
    let data;

    do {
      data = await documentClient1.scan(params).promise();

      data.Items.forEach((items) => clientIds.add(items.clientId));
      params.ExclusiveStartKey = data.LastEvaluatedKey;
    } while (data.LastEvaluatedKey);
    //console.log(clientIds);
    res.status(200).json(Array.from(clientIds));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching clientIds" });
  }
});

app.get("/clientno", async (req, res) => {
  //this is returning all uniqueIds with no. of its occurence
  try {
    const params = {
      TableName: "geonamesData",
      ProjectionExpression: "clientId",
    };

    let clientIds = new Map();

    let data;

    data = await documentClient1.scan(params).promise();

    data.Items.forEach((items) => {
      if (clientIds.has(items.clientId)) {
        clientIds.set(items.clientId, clientIds.get(items.clientId) + 1);
      } else {
        clientIds.set(items.clientId, 1);
      }
    });

    const result = Array.from(clientIds.entries()).map(([id, count]) => ({
      id,
      count,
    }));
    //console.log(result, "result");
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching clientIds" });
  }
});

app.get("/mapdata", async (req, res) => {
  const ddate1 = req.query.FromDate;
  const ddate2 = req.query.ToDate;
  const id = req.query.ClientId;
  const date1 = new Date(ddate1).getTime();
  const date2 = new Date(ddate2).getTime();

  const params = {
    TableName: "geonamesData",
    ProjectionExpression: "clientId, logID, createdAt, #timestamp",
    ExpressionAttributeNames: {
      "#timestamp": "timestamp",
    },
    Limit: 10,
    FilterExpression: "(#timestamp >= :date1) AND (#timestamp <= :date2)",
    ExpressionAttributeValues: {
      ":date1": date1,
      ":date2": date2,
    },
  };

  let clientIds = new Map();
  let lastEvaluatedKey;

  do {
    //this is pagination
    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = lastEvaluatedKey;
    }

    const data = await documentClient.scan(params).promise();
    data.Items.forEach((items) => {
      if (clientIds.has(items.clientId)) {
        clientIds.set(items.clientId, clientIds.get(items.clientId) + 1);
      } else {
        clientIds.set(items.clientId, 1);
      }
    });
    lastEvaluatedKey = data.LastEvaluatedKey;
  } while (lastEvaluatedKey);
  const result = Array.from(clientIds.entries()).map(([id, count]) => ({
    id,
    count,
  }));
  // //console.log(result, "map data");
  res.status(200).json(result);
});
app.get("/export", async (req,res)=>{
  const ddate1 = req.query.fd;
  const ddate2 = req.query.td;
  const id = req.query.id;
  const date1 = new Date(ddate1).getTime();
  const date2 = new Date(ddate2).getTime();

  const params = {
    TableName: "geonamesData",
    ProjectionExpression:
      "clientId, logID, createdAt, #timestamp,#query,#result",
    ExpressionAttributeNames: {
      "#timestamp": "timestamp",
      "#query": "query",
      "#result": "result",
    },
    Limit: 10,
    FilterExpression: "(#timestamp >= :date1) AND (#timestamp <= :date2)",
    ExpressionAttributeValues: {
      ":date1": date1,
      ":date2": date2,
    },
  };

  if (id !== "ALL") {
    // //console.log(id);

    params.FilterExpression += " AND (clientId = :id)";
    params.ExpressionAttributeValues[":id"] = id;
  }

  let allData = [];
  let lastEvaluatedKey;

  do {
    //this is pagination
    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = lastEvaluatedKey;
    }

    const result = await documentClient.scan(params).promise();
    allData = allData.concat(result.Items);
    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);
  //console.log(allData);
const resp=allData
  const header = resp
        .map((x) => Object.keys(x))
        .reduce((acc, cur) => (acc.length > cur.length ? acc : cur), []);

      let csv = resp.map((row) => {
        return header
          .map((fieldName) => {
            return JSON.stringify(row[fieldName]);
          })
          .join(',');
      });

      csv = [header.join(','), ...csv];
      csv = csv.join('\n');
      // //console.log(csv )
      
      var s3 = new AWS.S3();
      const params1 = {
        Bucket: 'geomanes', // pass your bucket name
        Key: 'exportLogData.csv', // file will be saved as testBucket/contacts.csv
        Body: csv,
      };

      s3.upload(params1, (err, data) => {
        if (err) {
          //console.log(err);
          return res.status(500).json({ error: 'Failed to upload to S3' });
        } 
        //console.log(`File uploaded successfully at ${data.Location}`);
        const link={link:data.Location}
        return res.status(200).json(link);
      });
})
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

