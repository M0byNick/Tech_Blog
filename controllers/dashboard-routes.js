const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');
router.get('/', withAuth, (req, res) => {
    Post.findAll({
            where: {
                user_id: req.session.user_id
            },
            attributes: [
                'id', 'title', 'post_text', 'created_at'
            ],
            include: [{
                    model: Comment,
                    attributes: [
                        'id', 'comment_text', 'post_id', 'user_id', 'created_at'
                    ],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        })
        .then(dbPostData => {
//A getter is a get() function defined for one column
            const posts = dbPostData.map(post => post.get({ plain: true }));
            res.render('dashboard', { posts, loggedIn: true });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//When a user clicks to edit a specific id, make sure hey are logged in
router.get('/edit/:id', withAuth, (req, res) => {
    //If user is logged in, find that post by id
    Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id',
                'title',
                'post_text',
                'created_at'
            ],
            include: [{
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                }
            ]
        })
        //If there is no post with that data found by id, post error
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post exists with this id.' });
                return;
            }

            //Otherwise return object rendered to edit-post page
            const post = dbPostData.get({ plain: true });
            res.render('edit-post', { post, loggedIn: true });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
//If a user wants to edit their user profile
router.get('/edituser', withAuth, (req, res) => {
    User.findOne({
        attributes: {
            exclude: ['password']
        },
        where: {
            id: req.session.user_id
        }
    }).then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({
                message: 'No user exists with this id.'
            });
            return;
        }
        const user = dbUserData.get({ plain: true });
        res.render('edit-user', {user, loggedIn: true});
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

//When a user clicks /new to add a post, render that page
router.get('/new', (req, res) => {
    res.render('add-post');
});

module.exports = router;