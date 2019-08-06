const express = require('express');
const router = express.Router();
const Msgs = require('../handlers/Msgs');
const multer = require('multer');
const {storageConfig, fileFilter} = require('../configs/multer.config');
const Category = require('../models/category.model');
const Post = require('../models/post.model');
const PostHandler = require('../handlers/PostHandler');


/* GET start page. */
router.get('/', (req, res) => {
    Category.find()
        .then((temp) => {
            if (req.user) {
                const {role, username} = req.user;
                if (role === 'admin')
                    res.render('index', {isAdmin: true, role: true, name: username, items: temp});
                else res.render('index', {isAdmin: false, role: true, name: username, items: temp});
            }
            else {
                res.render('index', {warning_msg: Msgs.Login(), items: temp});
            }
        })
        .catch(err => console.log(err));
});

/* POST Create new post. */

router.post('/add-new-post', multer({
    storage: storageConfig,
    fileFilter: fileFilter
}).single('mainimage'), (req, res) => {

    const {title} = req.body;
    const {username} = req.user;

    Post.findOne({title: title})
        .then((post) => {
            // if this post have new title, we created new post else such post already exist
            if (!post) {

                req.checkBody('title', Msgs.Empty('Title')).notEmpty();
                req.checkBody('title', 'Title must be between 5-60 characters long.').len(5, 60);
                req.checkBody('title', 'Title can contain letters, numbers and punctuation marks.').matches(/^[A-Za-z0-9.!\s(),:;?-]+$/, 'i');
                req.checkBody('postContent', Msgs.Empty('Post content')).notEmpty();

                const errors = req.validationErrors();

                if (errors) {
                    Category.find()
                        .then((temp) => {
                            res.render('index', {
                                items: temp,
                                errors,
                                isAdmin: true,
                                role: true,
                                name: username
                            });
                        })
                        .catch(err => console.log(err));
                }
                else {
                    PostHandler.CreatePost(req)
                        .then(newPost => {
                            newPost.save();
                        })
                        .catch(err => console.log(err));
                    req.flash('success_msg', Msgs.Success());
                    res.redirect('/');
                }
            }
        })
        .catch(err => console.log(err));
});

/* GET all posts. */
router.get('/posts', async (req, res) => {

    const posts = await PostHandler.AllPostsWithFullInfo();

    if (!posts) res.status(404).json({error: Msgs.Fail()});

    res.status(200).json({posts});
});

/* GET all categories. */
router.get('/categories', async (req, res) => {

    const categories = await Category.find();

    if (!categories) res.status(404).json({error: Msgs.Fail()});

    res.status(200).json({categories});
});

module.exports = router;
