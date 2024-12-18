import mongoose from 'mongoose';

const {
  MONGODB_URI = 'mongodb+srv://steelejames022:ugsyLn4rGnDhpQkF@cluster0.kdb0c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/cats',
} = process.env;
console.log('connecting db', MONGODB_URI);

const conn = mongoose
  .connect(MONGODB_URI)
  .then(function () {
    console.log('DB Connected');
  })
  .catch(function (error) {
    console.log('line check');
    console.log('Error connecting to DB', error);
  });

export default conn;
