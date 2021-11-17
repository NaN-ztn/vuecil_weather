const express = require('express');
const path = require('path');
const compression = require('compression');
const app = express();
app.use(compression())
app.use(express.static(path.join(__dirname, '/dist')))
app.listen(5018, () => {
  console.log('server running at http://localhost:5018');
})