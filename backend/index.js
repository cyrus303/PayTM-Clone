const express = require('express');
require('./DB/index');
const userCtlr = require('./Controllers/userCtlr');
const cors = require('cors');
const {PORT} = require('./config');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1/user', userCtlr);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
  console.log('app running at ' + PORT);
});
