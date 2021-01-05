// Copyright 2017 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.






// Guardian API 1079aa37-9969-42e1-8274-abcb9594a6bc
// NYT API TW0NR5iGANAJHeqCGceMqiox1AvILufB

// Bing Autocomplete API aed5e674cc114285914f21fee9e1829d
// Endpoint https://chris-pack.cognitiveservices.azure.com/bing/v7.0/suggestions

//CommentBox io API 5696960862355456-proj

/*
Guardian News –
https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png
34
NY Times –
https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg
*/



/*
  Guardian URL for Home tab:
  https://content.guardianapis.com/search?apikey=[YOUR_API_KEY]&section=(sport|business|technology|politics)&show-blocks=all
  Guardian URL for section tabs:
  https://content.guardianapis.com/[SECTION_NAME]?api-key=[YOUR_API_KEY]&showblocks=all
*/


'use strict';


// [START gae_node_request_example]
const express = require('express');

const app = express();
const axios = require('axios');
var https = require('https');
var url = require('url');


app.use(function(req, res, next) {
 res.header("Access-Control-Allow-Origin", "https://cpackhw8.wl.r.appspot.com"); // update to match the domain you will make the request from
//  res.header("Access-Control-Allow-Origin", "http://localhost:5000"); // update to match the domain you will make the request from

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!').end();
});

app.get('/GuardianSearch', (req, res) => {
  var id = req.query.id;
  var url = "https://content.guardianapis.com/search?q=" + id + "&api-key=1079aa37-9969-42e1-8274-abcb9594a6bc&show-blocks=all";

  https.get(url, (resp) => {
    let data = '';
    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      res.json(data);
    });
  })
})
app.get('/NYTimesSearch', (req, res) => {
  var id = req.query.id;
  url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + id + '&api-key=EnxpNpxXagL7ca50yuNiUBWzadm0xaev';
  https.get(url, (resp) => {
    let data = '';
    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      res.json(data);
    });
  })

})

app.get('/NYTimes', (req, res) => {
  console.log(section);
  var section = req.query.section;
  var url;
  if(section == "sport"){
    section = "sports";
  }
  if(section == "home" || section.length == 0 ){
    url = 'https://api.nytimes.com/svc/topstories/v2/home.json?api-key=EnxpNpxXagL7ca50yuNiUBWzadm0xaev';
  }
  else{
    url = 'https://api.nytimes.com/svc/topstories/v2/' + section + '.json?api-key=EnxpNpxXagL7ca50yuNiUBWzadm0xaev';
  }
  https.get(url, (resp) => {
    let data = '';
    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      res.json(data);
    });
  })
});


app.get('/NYTimesDetails', (req, res) => {
  var id = req.query.id;
  var url;
  url ="https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:(\"" + id + "\")&api-key=EnxpNpxXagL7ca50yuNiUBWzadm0xaev";
  https.get(url, (resp) => {
    let data = '';
    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      res.json(data);
    });
  })
});




app.get('/Guardian', (req, res) => {
  var section = req.query.section;
  var url;
  if(section == "home" || section.length == 0 ){
    url = "https://content.guardianapis.com/search?api-key=1079aa37-9969-42e1-8274-abcb9594a6bc&section=(sport|business|technology|politics)&show-blocks=all";
  }
  else{
    url = 'https://content.guardianapis.com/' + section + '?api-key=1079aa37-9969-42e1-8274-abcb9594a6bc&show-blocks=all';
  }
  https.get(url, (resp) => {
    let data = '';
    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      res.json(data);
    });
  })
});

app.get('/GuardianDetails', (req, res) => {
  var id = req.query.id;
  var url = "https://content.guardianapis.com/" + id + "?api-key=1079aa37-9969-42e1-8274-abcb9594a6bc&show-blocks=all";
  https.get(url, (resp) => {
    let data = '';
    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      res.json(data);
    });
  })
});


// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

module.exports = app;
