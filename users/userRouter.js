const express = require('express');
const Users = require('./userDb.js')
const router = express.Router();

router.post('/',validateUser, async (req, res) => {
    const postData = req.body;
  
    try {
      const post = await Posts.insert(postData);
      res.status(201).json(post);
    } catch (err) {
      res.status(500).json({ message: 'Failed to create new post' });
    }
  }); //NEEDS WORK

router.post('/:id/posts',validateUserId,validatePost, async (req, res) => {
    const postData = req.body;
    console.log(postData);
    const { id } = req.params; 
  
    try {
      const post = await Users.getUserPosts(id);
  
      if (post) {
        const posts = await Users.insert(postData, id);
        res.status(201).json(posts);
      } else {
        res.status(404).json({ message: 'Could not find post with given id.' })
      }
    } catch (err) {
      res.status(500).json({ message: 'Failed to create new post' });
    }
  }); //NEEDS WORK

router.get('/', async (req, res) => {
    try {
      const users = await Users.get();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: 'Failed to get users' });
    }
  }); //endpoint works

router.get('/:id', validateUserId,async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await Users.getById(id);
  
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'Could not find user with given id.' })
      }
    } catch (err) {
      res.status(500).json({ message: 'Failed to get user' });
    }
  }); //endpoint works
  

router.get('/:id/posts',validateUserId, async (req, res) => {
    const { id } = req.params;

    try {
      const posts = await Users.getUserPosts(id);
  
      if (posts.length) {
        res.json(posts);
      } else {
        res.status(404).json({ message: 'Could not find post for given user' })
      }
    } catch (err) {
      res.status(500).json({ message: 'Failed to get posts' });
    }
  }); //endpoint works


router.delete('/:id',validateUserId, async (req, res) => {
    const { id } = req.params;
  
    try {
      const deleted = await Users.remove(id);
  
      if (deleted) {
        res.json({ removed: deleted });
      } else {
        res.status(404).json({ message: 'Could not find user with given id' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete user' });
    }
  }); //endpoint works

router.put('/:id',validateUserId, async (req, res) => {
    const { id } = req.params;
    const changes = req.body;
   console.log(changes)
    try {
      const user = await Users.getById(id);
  
      if (user) {
        const updatedUser = await Users.update(changes,id);
        res.json(updatedUser);
      } else {
        res.status(404).json({ message: 'Could not find user with given id' });
      }
    } catch (err) {
        console.log(err)
      res.status(500).json({ message: 'Failed to update user' });
    }
  }); //endpoint works

//custom middleware

function validateUserId(req, res, next) {

    const id = req.params.id;

    Users.getById(id)
        .then(user => {
            console.log(user);
            if (!user) {
                res.status(400).json({ message: "invalid user id" });
            } else {
                req.user = user;
                next();
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "user could not be retrieved" });
        });
}

function validateUser(req, res, next) {

    if (!req.body) {
        res.status(400).json({ message: "missing user data" });
    } else if (!req.body.name) {
        res.status(400).json({ message: "missing required name field" });
    } else {
        next();
    }
}

function validatePost(req, res, next) {

    if (!req.body) {
        res.status(400).json({ message: "missing post data" });
    } else if (!req.body.text) {
        res.status(400).json({ message: "missing required text field" });
    } else if (!req.body.user_id) {
        res.status(400).json({ message: "missing required user id field" });
    } else {
        next();
    }
}

module.exports = router;
