const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const axios = require('axios');

mongoose.connect('mongodb://localhost:27017/trail-trove');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected!");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

// unsplash collections. 
const collectionOne = '483251'; // woods collection           
const collectionTwo = '3846912'; //campgrounds collection
const collectionThree = '9046579'; //camping


// call unsplash and return small image
async function seedImg(collection) {
    try {
        const resp = await axios.get('https://api.unsplash.com/photos/random', {
            params: {
                client_id: 'yIS7jL7t78s5g2m_8Ihl4LaMoEuTwn1xmJHTIJEG-kI',
                collections: collection,
                count: 30  //max count allowed by unsplash API 
            },
            headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' }
        })
        // console.log(resp.data);  // was garbled data prior to setting headers  11/27/2022
        return resp.data.map((a) => a.urls.small);

    } catch (err) {
        console.error(err)
    }
}

const seedDB = async () => {
    await Campground.deleteMany({});
    //make 3 API requests to unsplash, 30 images per request 
    const imageSetOne = await seedImg(collectionOne);
    const imageSetTwo = await seedImg(collectionTwo);
    const imageSetThree = await seedImg(collectionThree);

    //spread into one array
    const imgs = [...imageSetOne, ...imageSetTwo, ...imageSetThree]; // 90 random images
    console.log(imgs);
    for (let i = 0; i < 30; i++) {
        // setup - get random number based on each arrays length   
        const descriptorsSeed = Math.floor(Math.random() * descriptors.length);
        const placeSeed = Math.floor(Math.random() * places.length);
        const citySeed = Math.floor(Math.random() * cities.length);
        const price = Math.floor(Math.random() * 25) + 10;
        const imgsSeed = Math.floor(Math.random() * imgs.length);
        // seed data into campgrounds collection
        const camp = new Campground({
            image: `${imgs[imgsSeed]}`,
            title: `${descriptors[descriptorsSeed]} ${places[placeSeed]}`,
            location: `${cities[citySeed].city}, ${cities[citySeed].state}`,
            description:
                'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis, nihil tempora vel aspernatur quod aliquam illum! Iste impedit odio esse neque veniam molestiae eligendi commodi minus, beatae accusantium, doloribus quo!',
            price
        })
        await camp.save();
    };
};

seedDB().then(() => {
    mongoose.connection.close();
})