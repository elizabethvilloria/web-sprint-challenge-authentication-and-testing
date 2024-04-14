const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../secrets/secrets');
const Users = require('../users/users-model'); 


router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
  }

  try {
      const existingUser = await Users.findBy({ username });
      if (existingUser) {
          return res.status(409).json({ message: "Username taken" });
      }

      const hashedPassword = bcrypt.hashSync(password, 8);
      const newUser = await Users.add({ username, password: hashedPassword });
      
      res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
      res.status(500).json({ message: "Error registering user", error: error.message });
  }
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt with username:', username); 
  if (!username || !password) {
      return res.status(400).json({ message: "username and password required" });
  }
  try {
      const user = await Users.findBy({ username });
      console.log('User found:', user); 
      if (!user || !bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({ message: "invalid credentials" });
      }
      const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
      res.status(200).json({ message: `welcome, ${user.username}`, token });
  } catch (error) {
      console.error(error);  
      res.status(500).json({ message: "Error logging in", error: error.stack }); 
  }
});


module.exports = router;
