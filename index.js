// const fs = require('fs');
// data = fs.readFileSync("results(1).csv",'utf-8',(err)=>{
//     console.log("FILE READ")
//     // console.log(data)
//     // return data
// })
 
 
// const csv=require('csvtojson')
// let dt1= csv({
//     noheader:true,
//     output: "csv"
// })
// .fromString(data)
// .then((csvRow)=>{
   
   
//     return csvRow // => [["1","2","3"], ["4","5","6"], ["7","8","9"]]
 
// })
// try1 = dt1.then((dt1)=>{
//     fs.writeFile("./final11.json",JSON.stringify(dt1),(err)=>{
//         if(err)
//         {
//             console.log(err)
//         }
//         else{
//             console.log("FILE WRITTEN")
//         }
//     })
//     return dt1
// })
 
// const http= require('http')
// const server = http.createServer((req,res)=>{
 
//     //console.log(req.url);
   
//         res.end(JSON.stringify(dt1));
   
// })

 
//     //console.log(req.url);
   
      
// server.listen(3000,'127.0.0.1',()=>{
//     console.log("Server is running on port 3000")
// })
// AWS.config.setPromisesDependency(Promise);
 
// var save = (items) => {
//     var dynamodb = new AWS.DynamoDB.DocumentClient();
//     var params = {
//         RequestItems: {
//             'MyDynamoDBTable': items
//         }
//     }
 
//     return dynamodb.batchWrite(params).promise();
// }
 
 
 
// var items = [];
 
// csv({noheader: true})
//     .fromString(data)
//     .on("csv", (row) => {
//         console.log(row);
       
//         var item = {
//             PutRequest: {
//                 Item: {
//                     id: uuid(),
//                     gauge: row[0],
//                     city : row[1],
//                     value: row[3],
//                     temp1: row[4],
//                     temp2: row[5]
//                 }
//             }            
//         };
 
//         items.push(item);
//     })
//     .on('done', () => {
//         save(items)
//             .then((result) => console.log(result))
//             .catch((error) => console.error(error));
//     });
 
const http= require('http')
const fs = require('fs');
data = fs.readFileSync("results(1).csv",'utf-8',(err)=>{
    console.log("FILE READ")
    // console.log(data)
    // return data
})
 
 
const csv=require('csvtojson')
let dt1= csv({
    noheader:true,
    output: "csv"
})
.fromString(data)
.then((csvRow)=>{
   
   
    return csvRow
 
})
 
 
 
 
try2=dt1.then((dt1)=>{
// Get first row for column headers
headers = dt1[0];
console.log(headers)
var json = [];
var qq=-1;    
dt1.forEach(function(d){
    // Loop through each row
    if(qq===-1)
    {
        qq=1
        return
    }
    tmp = {}
    for(var i = 0; i < headers.length; i++){
        tmp[headers[i]] = d[i];
    }
    // Add object to list
    json.push(tmp);
});
 
 
const server = http.createServer((req,res)=>{
 
//console.log(req.url);
 
    res.end(JSON.stringify(json, null, 4))
 
})
 
server.listen(3000,'127.0.0.1',()=>{
console.log("Server is running on port 3000")
})
console.log(typeof(json))
fs.writeFile("./final11.json",JSON.stringify(json),(err)=>{
    if(err)
    {
        console.log(err)
    }
    else{
        console.log("FILE WRITTEN")
    }
})
 
})







