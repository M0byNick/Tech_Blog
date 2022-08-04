const seedUsers = require('./user-seeds');
const seedPosts = require('./post-seeds');
const seedComments = require('./comment-seeds');

const sequelize = require('../config/connection');

const seedAll = async () => {
    await sequelize.sync({
        force: true
    });
    console.log('Your database has synced.');

    await seedUsers();
    console.log('Your users have been seeded');

    await seedPosts();
    console.log('Your posts have been seeded');

    await seedComments();
    console.log('Your comments have been seeded');

    process.exit(0);
};

seedAll();