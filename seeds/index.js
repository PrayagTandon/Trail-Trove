const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/trail-trove');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected!");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

/* unsplash collections. 
const collectionOne = '483251'; // woods collection           
const collectionTwo = '3846912'; //campgrounds collection
const collectionThree = '9046579'; //camping
*/

const seedDB = async () => {

    for (let i = 0; i < 30; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000.state]}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat debitis nihil voluptatum, libero, nobis molestiae ipsam culpa quae delectus modi corporis molestias totam exercitationem voluptates!`,
            price
        })
        await camp.save();
    };
};

seedDB().then(() => {
    mongoose.connection.close();
})