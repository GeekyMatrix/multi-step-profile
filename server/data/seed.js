const mongoose = require('mongoose');
const Location = require('../models/Location');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    }

    const seedData = async () => {
        try {
            // Clear existing data
            await Location.deleteMany({});

            // Create countries
            const india = await Location.create({
                name: "India",
                type: "country"
            });

            // Create states for India
            const maharashtra = await Location.create({
                name: "Maharashtra",
                type: "state",
                parent: india._id
            });

            const karnataka = await Location.create({
                name: "Karnataka",
                type: "state",
                parent: india._id
            });

            // Create cities for Maharashtra
            await Location.create([
                {
                    name: "Mumbai",
                    type: "city",
                    parent: maharashtra._id
                },
                {
                    name: "Pune",
                    type: "city",
                    parent: maharashtra._id
                },
                {
                    name: "Nagpur",
                    type: "city",
                    parent: maharashtra._id
                }
            ]);

            // Create cities for Karnataka
            await Location.create([
                {
                    name: "Bengaluru",
                    type: "city",
                    parent: karnataka._id
                },
                {
                    name: "Mysuru",
                    type: "city",
                    parent: karnataka._id
                },
                {
                    name: "Mangalore",
                    type: "city",
                    parent: karnataka._id
                }
            ]);

            console.log('Database seeded successfully!');
            process.exit(0);
        } catch (error) {
            console.error('Error seeding database:', error);
            process.exit(1);
        }
    };

    seedData();
});