import mongoose from 'mongoose';

mongoose.connection.once('open', () => {
  console.log(`MongoDB connection ready`.cyan.underline.bold);
});

mongoose.connection.on('error', (err) => {
  console.error(`${err}.`.red.underline.bold);
});

async function mongoConnect() {
  await mongoose.connect(process.env.MONGO_URL);
}
async function mongoDisconnect() {
  await mongoose.disconnect();
}

export { mongoConnect, mongoDisconnect };
