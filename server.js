const express = require(`express`);
const logger = require(`morgan`);
const mongoose = require(`mongoose`);
const path = require(`path`);
const bcrypt = require(`bcrypt`);
const PORT = 3001;
const routes = require(`./controllers`);

const db = require(`./models`);

const app = express();

const session = require('express-session');
const sess = {
    secret: 'Super secret secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
};
app.use(session(sess));

app.use(logger(`dev`));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(`public`));
app.use(routes);

mongoose.connect(`mongodb://localhost/Stay_RnB`, { useNewUrlParser: true });

// Create new user
app.post(`/api/users`, async (req, res) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        const newUser = await db.User.create(req.body);
        req.session.userId = newUser._id
        res.status(200).json(newUser);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Create new listing
app.post(`/api/listings`, async (req, res) => {
    try {
        const newListing = await db.Owner.create(req.body);
        await db.User.findOneAndUpdate({_id: req.session.userId}, { $push: { listings: newListing._id } }, { new: true })
        res.status(200).json(newListing);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Get user with listings
app.get(`/api/users`, async (req, res) => {
    try {
        const getUser = await db.User.findOne({ _id: req.session.userId }).populate(`listings`);
        res.status(200).json(getUser);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})

// Logging in
app.post('/api/login', async (req, res) => {
    try {
        const userData = await db.User.findOne({ email: req.body.email }).select(`password email username`);
        if (!userData) {
            res
                .status(400)
                .json({ message: 'Incorrect email or password, please try again' });
            return;
        }
        bcrypt.compare(req.body.password, userData.password, (err, isMatching) => {
            if (err) {
                console.log(err);
            } else if (isMatching) {
                req.session.userId = userData._id;
                req.session.save(() => {
                    req.session.loggedIn = true;
                    res.json({ user: userData, message: 'You are now logged in!' });
                });
                console.log(`successful login!`)
            } else {
                res.status(400).json({ message: 'Incorrect email or password, please try again' });
                return;
            }
        })
    } catch (err) {
        res.status(400).json(err);
    };
});

// Logging out
app.post('/api/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    };
});


app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}.`)
});