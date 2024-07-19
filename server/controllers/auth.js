

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const secretKey = 'saikrishna';

const generateToken = (userId) => {
  return jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
};

const register = async (req, res) => {
  const { username, password } = req.body;

  try {
   
    let user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

   
    user = new User({ username, password });

    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

   
    await user.save();

   
    const token = generateToken(user._id);

    res.status(201).json({ token, userId: user._id }); 
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
   
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

   
    const token = generateToken(user._id);

    res.status(200).json({ token, userId: user._id }); 
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  register,
  login,
  generateToken,
};
