const express = require('express');
const Posts = require('./postDb.js')
const router = express.Router();

router.get('/', async (req, res) => {
    try {
      const posts = await Posts.get();
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json({ message: 'Failed to get posts' });
    }
  }); //endpoint works

router.get('/:id',validatePostId, async (req, res) => {
    const { id } = req.params;
  
    try {
      const post = await Posts.getById(id);
  
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({ message: 'Could not find post with given id.' })
      }
    } catch (err) {
      res.status(500).json({ message: 'Failed to get posts' });
    }
  }); //endpoint works
  

router.delete('/:id',validatePostId, async (req, res) => {
    const { id } = req.params;
  
    try {
      const deleted = await Posts.remove(id);
  
      if (deleted) {
        res.json({ removed: deleted });
      } else {
        res.status(404).json({ message: 'Could not find post with given id' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete post' });
    }
  }); //endpoint works

router.put('/:id',validatePostId, async (req, res) => {
    const { id } = req.params;
    const changes = req.body;
        console.log(changes)
    try {
      const post = await Posts.getById(id);
  
      if (post) {
        const updatedPost = await Posts.update(id, changes);
        res.json(updatedPost);
      } else {
        res.status(404).json({ message: 'Could not find post with given id' });
      }
    } catch (err) {
        console.log(err)
      res.status(500).json({ message: 'Failed to update post' });
    }
  }); //endpoint works


  // custom middleware

function validatePostId(req, res, next) {
  const id = req.params.id;
  Posts.getById(id)
        .then(post => {
            console.log(post);
            if (!post) {
                res.status(400).json({ message: "invalid post id" });
            } else {
                req.post = post;
                next();
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "post could not be retrieved" });
        });
}


module.exports = router;