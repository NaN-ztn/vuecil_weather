const express = require('express');
const path = require('path');
const compression = require('compression');
const app = express();
app.use(compression())
app.use(express.static(path.join(__dirname, '/dist')))
app.listen(3000, () => {
  console.log('server running at http://localhost:3000');
})