const { User } = require('../models');

const userData = [
    {
        username: "HPhillips",
        email: "hphillips@gmail.com",
        password: "password123!"
    },
    {
        username: "VBorisov",
        email: "vborisov@yahoo.com",
        password: "password123!"
    },
    {
        username: "INepi",
        email: "inepi@proton.me",
        password: "password123!"
    },
    {
        username: "waoki",
        email: "waoki@gmail.com",
        password: "password123!"
    },
    //You may think it's unrealistic for someone with an aol.com email address to be on a tech blog, but I like to think they're doing their best to catch up.
    {
        username: "adahl",
        email: "adahl@aol.com",
        password: "password123!"
    }
];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;