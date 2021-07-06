const router = require('express').Router();
const { User } = require('../../models');

// this route allows us to create a new user
router.post('/', async (req, res) => {
  try {
    // creates new user data
    const userData = await User.create(req.body);
    console.log(req);
    console.log('-------------')
    console.log(req.body); // req.body is the most recently created user informantion that was just posted to the db

    // saves data
    req.session.save(() => {
      // saves the userData.id equals req.session.user_id
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      req.session.skadi = true;
      console.log(req.session);

      console.log('hello')
      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// allows you to login with an existing account
router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      console.log('Hi')
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

// this route allows us destroy the current users session
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
