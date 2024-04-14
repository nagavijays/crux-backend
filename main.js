// Import the necessary modules.
const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
const { BigQuery } = require('@google-cloud/bigquery');
const cors = require('cors');

// Create an Express app.
const app = express();

// Use CORS to allow requests from any origin.
app.use(cors());

// Parse incoming JSON requests.
app.use(express.json());

app.get('/', function (req, res) {
  res.send('Service is Running!');
});

app.get('/query', async function (req, res) {
  const originUrl = req.query.originUrl;
  const yyyymm = req.query.yyyymm
  console.log("yyyymm: ", yyyymm);
  console.log("originUrl: ", originUrl);
  var rows = await runQuery(originUrl, yyyymm);
  res.send(rows);
})

async function runQuery(originUrl, yyyymm) {
  // Instantiate BigQuery client
  const bigqueryClient = new BigQuery();

  // project ID and query
  const projectId = 'vj-experiments';
  const query = `SELECT * FROM \`chrome-ux-report.materialized.metrics_summary\` 
  where origin = '${originUrl}'
  and yyyymm = ${yyyymm}`

  // Run the query
  const [rows] = await bigqueryClient.query({
      query: query,
      location: 'US', 
  });

  console.log('Query Results:');
  rows.forEach(row => console.log(row));
  return rows;
}


// Start the server.
app.listen(4040, () => {
  console.log('Server listening on port 4040');
});

module.exports = app;
