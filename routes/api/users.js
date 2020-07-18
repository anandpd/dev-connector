const router = require('express').Router();
const {RegistrationValidation} = require('../../validation');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretToken = require('config').get("secretToken");

router.post("/", async(req, res) => {
    const { error } = RegistrationValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { name, email, password } = req.body;
    
     // Check if user exists
        let user = await User.findOne({ email });
        if (user)  return res.status(400).send({message:'User with this email already exists !'});

    // Get users Gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'retro'
        })
        user = new User({ name, email, avatar, password  })
        
    //Encrypt Password using bcrypt
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

    try {
        await user.save();
        const payload = { user: { id:user.id} }
        const token = jwt.sign( payload, secretToken, { expiresIn: '1h' });
        res.json({ token });
    }
    catch (error)  {return res.status(500).send(error.message);}
})

module.exports = router;
