const mongoose = require('mongoose');

const mongoURI =
  'mongodb+srv://Sachin:oiIYTc6Xva29zWqT@mongodb.7d1cjqv.mongodb.net/PayTM';

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('Connected to PayTM DB');
  })
  .catch((error) => {
    console.log('Error connecting to PayTM DB', error);
  });
