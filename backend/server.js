const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv')
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const genreRoutes = require('./routes/genreRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const commentRoutes = require('./routes/commentRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reportRoutes = require('./routes/reportRoutes');
const imageRoutes = require('./routes/imageRoutes');
const miniImageRoutes = require('./routes/miniImageRoutes');

const app = express();
const port = process.env.PORT || 4000;

// MIDDLEWARES
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json());

// ROUTES
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/products', productRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/minis', miniImageRoutes);


// STRIPE CONNECTION
app.post("/create-payment-intent", async (req, res) => {
    const { price } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(price),
        currency: "usd",
        automatic_payment_methods: {
            enabled: true,
        },
    });

    res.status(200).send({
        clientSecret: paymentIntent.client_secret,
    });
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('frontend/build'));
    app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/frontend/build/index.html'));
    });
}

mongoose.connect(process.env.MONGODB_URL, () => {
    console.log('Successfully connected to database.');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});

