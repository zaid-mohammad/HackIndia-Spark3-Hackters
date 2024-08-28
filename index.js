const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const { MongoClient } = require('mongodb');
// Connection URL
const url = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(url);
// Database Name
const dbName = 'mriirs';
const multer  = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniquePrefix+'-'+file.originalname)
  }
})

const upload = multer({ storage: storage })



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.sendFile(__dirname+'/templates/home.html')
})

app.post('/', upload.single('uploaded_file'), function (req, res){
  let a = req.body['user_email']
  let b = req.body['user_name']
  let c = req.body['user_location']
  let d = req.body['user_message']
  let e = req.file.path
  // console.log(a, b, c, d)

  async function main() {
    // Use connect method to connect to the server
    try{
     await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('complaints');
    // the following code examples can be pasted here...
    let result = await collection.insertOne({email:a, name:b, location:c, message:d, img_path:e})
    return 'done.';
    } catch (e) {
      console.error(e);
    }
  }

  // console.log(e)
  // console.log(req.file)
  // console.log(req.body)
  main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
  res.redirect('/')
})

app.listen(3005)