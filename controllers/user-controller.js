const _ = require('lodash');
const {User, validate} = require('../models/user');
const bcrypt = require('bcrypt');

let controller = {
    getUser: async (req, res) => {
        const user = await User.findById(req.user._id).select('-password');
        res.send(user);
    },
    newUser: async (req, res) => {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send('User is already registered.');

        user = new User(_.pick(req.body, ['firstName', 'lastName', 'password', 'email']));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();

        const token = user.generateAuthToken();
        res.header('x-auth-token', token).send(_.pick(user, ['_id','firstName', 'lastName', 'email']));
    },
    getUsers: async (req, res) => {
        User.find()
		    .then(result => {
			    if(result.length === 0) {
				    res.send('No users found.');	
				    return;
			    }
			    let response = result.map(item  => {
				    return _.pick(item, ['_id', 'email', 'firstName', 'lastName']);
			    });
			    res.send(response);
		    });
    },
    authUser: async (req, res) => {
        if(req.body === {}) {
            return res.status(400).send({
                message: "Invalid user data."
            });
        }
        const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(400).send('Incorrect email or password.');
    
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword) return res.status(400).send('Incorrect email or password.');
    
        const token = user.generateAuthToken(); 
    
        return res.send(token);
    }
}

module.exports = controller;