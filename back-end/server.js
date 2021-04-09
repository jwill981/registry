const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// parse application/json
app.use(bodyParser.json());

// connect to the database
mongoose.connect('mongodb://localhost:27017/wedding-registry', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const multer = require('multer')
const upload = multer({
    dest: '../front-end/public/images/',
    limits: {
        fileSize: 100000000
    }
});

// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
app.post('/api/photos', upload.single('photo'), async (req, res) => {
    // Just a safety check
    if (!req.file) {
        return res.sendStatus(400);
    }
    res.send({
        path: "/images/" + req.file.filename
    });
});

const coupleSchema = new mongoose.Schema({
    name: String,
    date: String,
    address: String,
});

const Couple = mongoose.model('Couple', coupleSchema);

//Create couple object in database
app.post('/api/couples', async (req, res) => {
    console.log("I work!!!");
    const couple = new Couple({
        name: req.body.name,
        date: req.body.date,
        address: req.body.address,
    });
    try {
        await couple.save();
        res.send(couple);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

//Get a list of all couples in the database
app.get('/api/couples', async (req, res) => {
    try {
        let couples = await Couple.find();
        res.send(couples);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.delete('/api/couples/:coupleID', async (req, res) => {
    try{
        let couple = await Couple.findOne({ _id: req.params.coupleID });
        if (!couple){
            res.send(404);
            return;
        }
        await couple.delete();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.put('/api/couples/:coupleID', async (req, res) => {
    try {
        let couple = await Couple.findOne({ _id: req.params.coupleID });
        if (!couple){
            res.send(404);
            return;
        }
        couple.name = req.body.name;
        couple.date = req.body.date;
        couple.address = req.body.address;
        await couple.save();
        res.send(couple);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

const itemSchema = new mongoose.Schema({
    couple: {
        type: mongoose.Schema.ObjectId,
        ref: 'Couple'
    },
    name: String,
    bought: Boolean,
    path: String,
    description: String,
})

const Item = mongoose.model('Item', itemSchema);

//create item object in database
app.post('/api/couples/:coupleID/items', async (req, res) => {
    try {
        let couple = await Couple.findOne({ _id: req.params.coupleID });
        if (!couple) {
            res.send(404);
            return;
        }
        let item = new Item({
            couple: couple,
            name: req.body.name,
            bought: req.body.bought,
            path: req.body.path,
            description: req.body.description
        });
        await item.save();
        res.send(item);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

//get a list of items for a couple
app.get('/api/couples/:coupleID/items', async (req, res) => {
    try {
        let couple = await Couple.findOne({ _id: req.params.coupleID });
        if (!couple) {
            res.send(404);
            return;
        }
        let items = await Item.find({ couple: couple });
        res.send(items);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

//update an item
app.put('/api/couples/:coupleID/items/:itemID', async (req, res) => {
    try {
        let item = await Item.findOne({_id: req.params.itemID, project: req.params.projectID});
        if (!item){
            res.send(404);
            return;
        }
        item.name = req.body.name;
        item.description = req.body.description;
        await item.save();
        res.send(item);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

//bought an item
app.put('/api/items/:itemID', async (req, res) => {
    try {
        let item = await Item.findOne({_id: req.params.itemID});
        if (!item){
            res.send(404);
            return;
        }
        item.bought = true;
        await item.save();
        res.send(item);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

//delete an item
app.delete('/api/couples/:coupleID/items/:itemID', async (req, res) => {
    try{
        let item = await Item.findOne({_id: req.params.itemID, project: req.params.projectID});
        if (!item){
            res.send(404);
            return;
        }
        await item.delete();
        res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
    

});

app.listen(3000, () => console.log('Server listening on port 3000!'));