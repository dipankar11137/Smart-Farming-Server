const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());

const uri =
  'mongodb+srv://smart_farming:BLVy8fp0rN635mcH@cluster0.hoikbae.mongodb.net/?retryWrites=true&w=majority';


const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    // console.log("database connect");
    const userCollection = client.db('smartFarming').collection('user');
    const treatmentCollection = client
      .db('smartFarming')
      .collection('treatments');

    //   // // // // // // // // // // // //
    //create and update a user
    app.put('/create-user/:email', async (req, res) => {
      const email = req.params.email;
      const user = req.body;

      const filter = { email: email };
      const options = { upsert: true };

      const updatedDoc = {
        $set: user,
      };

      const result = await userCollection.updateOne(
        filter,
        updatedDoc,
        options
      );

      res.send(result);
    });
    // // post User
    app.post('/user', async (req, res) => {
      const newProduct = req.body;
      const result = await userCollection.insertOne(newProduct);
      res.send(result);
    });
    // get User
    app.get('/users', async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const mainProducts = await cursor.toArray();
      res.send(mainProducts);
    });
    // get user by email
    app.get('/user/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const cursor = userCollection.find(query);
      const user = await cursor.toArray();
      res.send(user);
    });

    // //                        All Treatment
    // All Treatment Collection
    app.post('/treatments', async (req, res) => {
      const newProduct = req.body;
      const result = await treatmentCollection.insertOne(newProduct);
      res.send(result);
    });

    // get all Treatment
    app.get('/treatments', async (req, res) => {
      const query = {};
      const cursor = treatmentCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // get treatment by email
    app.get('/treatment/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const cursor = treatmentCollection.find(query);
      const user = await cursor.toArray();
      res.send(user);
    });
    // // get all treatment by id
    app.get('/treatmentId/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await treatmentCollection.findOne(query);
      res.send(result);
    });
    //  treatment  update payment
    app.put('/treatmentPayments/:id', async (req, res) => {
      const id = req.params.id;
      const updatePayments = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          payment: updatePayments.payment,
        },
      };
      const result = await treatmentCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });
    //  treatment  update Prescription
    app.put('/treatmentPrescription/:id', async (req, res) => {
      const id = req.params.id;
      const updatePrescription = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          prescription: updatePrescription.prescription,
        },
      };
      const result = await treatmentCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });
    // treatment delete

    app.delete('/dTreatment/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await treatmentCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Running Smart Farming');
});

app.listen(port, () => {
  console.log('Smart Farming server is running ');
});
