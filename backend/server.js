var express        =         require("express");
var bodyParser     =         require("body-parser");
var app            =         express();
var cors = require('cors');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var whitelist = [
  'http://localhost:3000',
  'http://10.0.1.77:3000',
  
];


app.use(cors());




app.post('/housing',function(req,res){
	var persons=req.body.data.persons,startDate=req.body.data.startDate,endDate=req.body.data.endDate,startIndex=req.body.data.count;
	var request = require("request");

var options = { method: 'POST',
  url: 'https://services2.cofman.org:443/search/prod/servicesystem',
  headers: 
   { 'postman-token': '3e5a77aa-f033-29d5-e327-61efb83b1ac9',
     'cache-control': 'no-cache',
     'api-key': 'KBu4xefIb59Ut1KVj8sMvKH4nFWZq2Qg',
     'content-type': 'application/xml' },
  body: '<Cofman>\n\t\t<logon/>\n\t\t<version>2</version>\n\t\t<Searcher>\n\t\t\t<startDate>startDate</startDate>\n\t\t\t<endDate>endDate</endDate>\n\t\t\t<areaid>100001</areaid>\n\t\t\t<persons>persons</persons>\n\t\t\t<startIndex>{startIndex}</startIndex>\n\t\t\t<outCount>20</outCount>\n\t\t\t<discounts>3</discounts>\n\t\t</Searcher>\n\t</Cofman>' };
request(options, function (error, response, body) {
  if (error) throw new Error(error);
console.log(error)

return res.send(response);
});

});



app.listen(8080,function(){
  console.log("Started on PORT 8080");
})
