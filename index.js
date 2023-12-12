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
    const userTreatment = client.db('smartFarming').collection('treatments');

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
      const result = await userTreatment.insertOne(newProduct);
      res.send(result);
    });

    // get all Treatment
    app.get('/treatments', async (req, res) => {
      const query = {};
      const cursor = userTreatment.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // restock buy blood item and update payment
    app.put('/treatmentPayment/:id', async (req, res) => {
      const id = req.params.id;
      const updatePayment = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          payment: updatePayment.payment,
        },
      };
      const result = await userTreatment.updateOne(query, updateDoc, options);
      res.send(result);
    });
    // // all service filter by service category
    // app.get('/allServices/:service', async (req, res) => {
    //   const service = req.params.service;
    //   const query = { service };
    //   const cursor = allServicesCollection.find(query);
    //   const user = await cursor.toArray();
    //   res.send(user);
    // });
    // // get all services by id
    // app.get('/allServicesId/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const products = await allServicesCollection.findOne(query);
    //   res.send(products);
    // });
    // // // Delete one Service
    // app.delete('/allServices/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await allServicesCollection.deleteOne(query);
    //   res.send(result);
    // });
    // // post  book services
    // app.post('/bookService', async (req, res) => {
    //   const newProduct = req.body;
    //   const result = await bookingCollection.insertOne(newProduct);
    //   res.send(result);
    // });
    // // // get Book Service
    // app.get('/bookService', async (req, res) => {
    //   const query = {};
    //   const cursor = bookingCollection.find(query);
    //   const mainProducts = await cursor.toArray();
    //   res.send(mainProducts);
    // });
    // app.get('/allBooking/:email', async (req, res) => {
    //   const email = req.params.email;
    //   const query = { email };
    //   const cursor = bookingCollection.find(query);
    //   const user = await cursor.toArray();
    //   res.send(user);
    // });
    // // // Delete one Service
    // app.delete('/bookService/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await bookingCollection.deleteOne(query);
    //   res.send(result);
    // });
    // // post  contact
    // app.post('/contact', async (req, res) => {
    //   const newProduct = req.body;
    //   const result = await contactCollection.insertOne(newProduct);
    //   res.send(result);
    // });
    // // // get contact
    // app.get('/contact', async (req, res) => {
    //   const query = {};
    //   const cursor = contactCollection.find(query);
    //   const mainProducts = await cursor.toArray();
    //   res.send(mainProducts);
    // });
    // // // Delete one Service
    // app.delete('/contact/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await contactCollection.deleteOne(query);
    //   res.send(result);
    // });
    // // post  review
    // app.post('/review', async (req, res) => {
    //   const newProduct = req.body;
    //   const result = await reviewCollection.insertOne(newProduct);
    //   res.send(result);
    // });
    // // // get review
    // app.get('/review', async (req, res) => {
    //   const query = {};
    //   const cursor = reviewCollection.find(query);
    //   const mainProducts = await cursor.toArray();
    //   res.send(mainProducts);
    // });
    // app.get('/review/:email', async (req, res) => {
    //   const email = req.params.email;
    //   const query = { email };
    //   const cursor = reviewCollection.find(query);
    //   const user = await cursor.toArray();
    //   res.send(user);
    // });
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
