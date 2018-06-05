const http = require('http')
const https = require('https')
const req = require('request');
const util = require('util');
const path = require('path');
const fs = require('fs');
const port = 3001

var DomParser = require('dom-parser');
var parser = new DomParser();
var p_url = require('url');

async function getLandingHTML() {
 filePath = path.join(__dirname, 'zipcode.html');
 return await readFile(filePath);
}
const readFile = util.promisify(fs.readFile);  



const requestHandler = (request, response) => {
  const { method, url } = request;
  console.log("Route :"+url);
  var url_parts = p_url.parse(request.url, true);
  var query = url_parts.query;
  console.log('query data: ' + url_parts.pathname);
  
  //Route for default landing page "/"
  if (url == '/'){
    getLandingHTML().then(data => {
    console.log(data);
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(data);
    response.end();
	}) 
  } 
  //Route for /scrape_irs function 
  else if (url_parts.pathname == '/scrape_irs') {
	var zip= url_parts.query.zipcode  
    var req = require("request-promise")
  // Callout function to IRS website NodeJS is async so we must use await 
    async function MyRequest(zip) {
      var options = {
          uri: "https://www.irs.gov/efile-index-taxpayer-search?zip="+zip,
          method: "GET",   
      }
      try {
          var result = await req(options);
          return result;
      } catch (err) {
          console.error(err);
      }
  }
   // To ensure Promise is returned from async call 
   // results are handled in the .then() method
  MyRequest(zip).then((res) => {
    txt_body=res;
    //console.log(res)
    var obj = {
      table: []
   };
    var dom = parser.parseFromString(res);
    result_data=dom.getElementsByClassName('views-align-left');
    result_data.forEach(function(element) {
      record=element.innerHTML.split("\n");
      obj.table.push({Name: record[0], Address:record[1]+","+record[2], Contact:record[3], Phone:record[4], type:record[5]});  
      console.log(element.innerHTML);
    });
    var json = JSON.stringify(obj);
    console.log(json)
    var fs = require('fs');
    fs.writeFile("out.json", json, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
    
	  response.writeHead(200, {'Content-Type': 'text/html',"Access-Control-Allow-Origin": "*"});

    response.write(json);
    response.end();
    }); 
    })
  }
  else{
    console.log("Should never get here");
    console.log(url.pathname);
    getLandingHTML().then(data => {
      console.log(data);
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.write(data);
      response.end();
    })

  }
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})


