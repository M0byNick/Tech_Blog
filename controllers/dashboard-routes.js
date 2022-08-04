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
        }).then(dbPostData => {
            const posts = dbPostData.map(post => post.get({ plain: true }));
            res.render('dashboard', { posts, loggedIn: true });
        }).catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

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
        }).then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post exists with this id.' });
                return;
            }
            const post = dbPostData.get({ plain: true });
            res.render('edit-post', { post, loggedIn: true });
        }).catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

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