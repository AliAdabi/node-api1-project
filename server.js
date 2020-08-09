const express = require('express');

const db = require('./database');

const server = express()

server.use(express.json())

const PORT = 8000;

server.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`)
})

server.get('/', (req , res) => {
    res.json({message  : 'Hello, the server is running'})
})

server.get('/api/users', (req , res) => {
    
    const users = db.getUsers()
    if(users){
        res.status(200).json(users)
    } else {
        res.status(500).json({
            message: 'User were not found'
        })
    }
});
server.get('/api/users/:id', (req , res) => {
    const id = req.params.id;

    const user = db.getUserById(id)

    if(!id) {
        res.status(500).json({
            message : 'Please provide id'
        })
    } else {
        if(!user) {
            res.status(404).json({
                message : 'no user with given id was found'
            })
        } else {
            res.status(200).json(user)
        }
    }


})

server.delete('/api/users/:id' , (req , res) => {
    const id = req.params.id

    const user = db.getUserById(id)

    try {
        if(!user) {
        res.status(404).json({
            message : 'User with specified ID does not exist'
        })
    } else { 

        db.deleteUser(id)

        res.status(200).json(user)
    }
} catch (e) {
    res.status(500).json({
        message : 'The user cannot be removed'
    })
}
    
})

server.post('/api/users' , (req , res) => {
    try {
    if(!req.body.name || !req.body.bio ) {
        res.status(400).json({
            message : 'Please provide name and bio for the user'
        })
    } else {
        const user = db.createUser(req.body)
        res.status(201).json(user)
    }
} catch (e) {
    res.status(500).json({
        message : 'There was an error while saving the user to the database'
    })
}
})


server.put("/api/users/:id", (req, res) => {
    const id = req.params.id;
  
    const user = db.getUserById(id);
  
    try {
      if (!user) {
        // what if this user doesn't exist
        res.status(404).json({
          message: "The user with the specified ID does not exits.",
        });
      } else {
        // what if you didn't give me the right information
        if (!req.body.name || !req.body.bio) {
          res.status(400).json({
            message: "Please provide name and bio foir the user.",
          });
        } else {
          // success
          const updated = db.updateUser(id, req.body);
          res.status(200).json(updated);
        }
      }
    } catch (e) {
      // general catch
      res.status(500).json({
        message: "The user information could not be modified.",
      });
    }
  });