
// https://youtu.be/mbsmsi7l3r4?t=748

require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

// Since we are passing json to /login we need to make sure that the server can handle that
// Lets the application use json from the body that gets past up to it inside the requst
app.use(express.json());


const posts = [
    {
        username: 'Jim',
        title: 'Post 1'
    },
    {
        username: 'Adam',
        title: 'Post 2'
    }
]


app.get('/posts', authenticateToken(req, res, next) {
    req.user
    res.json('posts')
})


app.post('/login', (req, res) => {
    // Here we authenticate the requst using JWT so we don't let everyone access the POST request
    // only specific users.
    
    const username = req.body.username;
    
    // Creating the user
    const user = { name : username };

    // Creating aur access token
    // sign(payload, secret) takes our payload (the object we want to serialize) and the secret
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    
    // Now when we make a requst to login,
    // whatever username we pass up (assuming it's authenticated correctly),
    // it's going to create an accesstoken for us.
    // That access token is going to have the user information SAVED INSIDE OF IT
    res.json({ accessToken: accessToken });
})


// Middleware to GET THE TOKEN that comes from the HEADER.
// We verify that this is the correct user, and then return that user in app.get('/posts')
function authenticateToken(req, res, next) {
    // The token is called Bearer (a keyward/format)
    // and has the actual TOKEN afterwards (the massive string from the HEADER)

        // Bearer 'space' TOKEN

    // Here we get the actual HEADER (headers) 
    // and then the authorization part['authorization'] from the HEADER
    // which is going to have the format of Bearer followed by the TOKEN
    const authHeader = req.headers['authorization'];

    // Here we getting our TOKEN
    // We need to split it with a space since the is a space inbetween Bearer and TOKEN
    // And we want to get the second parameter in that array [1] which is the actual TOKEN
    const token = authHeader.split(' ')[1];

    // If we have an authHeader - return the authHeader TOKEN portion which we split on the space,
    // otherwise - just return "undefine"
    if (token == null) return res.sendStatus(401);

    // If we get down here we know that we have a valid token and need to verify it
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user ) => {
        
        if (err) return res.sendStatus(403)
        req.user = user 
    })

}


app.listen(3000);