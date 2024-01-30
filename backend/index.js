const express = require('express');
require('./DB/index');
const userCtlr = require('./Controllers/userCtlr');

const app = express();
const PORT = 3000;

app.use('/user', userCtlr);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
  console.log('app running at ' + PORT);
});
