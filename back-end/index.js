const express = require('express');
const bodyParser = require("body-parser");


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/creative4', {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const entrySchema = new mongoose.Schema({
    user: Object,
    date: String,
    moods: Array,
    accomplishments: Array,
    miracle: String,
    entry: String,
});

// create a virtual paramater that turns the default _id field into id
userSchema.virtual('id')
    .get(function () {
        return this._id.toHexString();
    });

entrySchema.virtual('id')
    .get(function () {
        return this._id.toHexString();
    });

// Ensure virtual fields are serialised when we turn this into a JSON object
userSchema.set('toJSON', {
    virtuals: true
});
entrySchema.set('toJSON', {
    virtuals: true
});

// create a model for tickets
const User = mongoose.model('User', userSchema);
const Entry = mongoose.model('Entry', entrySchema);




//Creates a new user or checks if a user already exists
app.post('/api/user', async (req, res) => {

    try {
        console.log('Finding username')
        const userExist = await User.findOne({ username: req.body.username, password: req.body.password })

        if (userExist === null) {
            console.log('User not found. Creating user')

            const user = new User({
                username: req.body.username,
                password: req.body.password
            });
            await user.save();
            res.send({
                user: user,
                success: true
            });
        } else {
            console.log('User found')
            res.send({
                user: userExist,
                success: true
            })
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});



app.delete('/api/entries/:id', async (req, res) => {
    try {
      await Entry.deleteOne({
        _id: req.params.id
      });
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  });


app.post('/api/entries', async (req, res) => {
    try {
        let entries = await Entry.find({ user: req.body.user});
        res.send({
            entries: entries
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

//Creates a new entry for the specified Ues
app.post('/api/entry', async (req, res) => {
    try {
        if (req.body.user !== null && req.body.user !== null) {
            const newEntry = new Entry({
                user: req.body.user,
                date: req.body.date,
                moods: req.body.moods,
                accomplishments: req.body.accomplishments,
                miracle: req.body.miracle,
                entry: req.body.entry,
            });
            await newEntry.save();

            const allEntries = await Entry.find({ user: req.body.user })
            res.send({
                entries: allEntries
            });
        } else {
            console.log('Unable to find user');
            res.sendStatus(400);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));