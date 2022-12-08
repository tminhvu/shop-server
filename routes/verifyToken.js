const jwt = require('jsonwebtoken')

// Verify token to see if we can descrypt data from token using JWT_KEY
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token
    if (authHeader) {
        const token = authHeader.split(' ')[1]

        // From token, using JWT_KEY set erlier, decrypt into data, in this case we call it user, and maybe an error
        jwt.verify(token, process.env.JWT_KEY, (err, user) => {
            if (err)
                return res.status(403).json('token is not valid')

            // This user has id field and isAdmin field, see routes/auth.js
            // Create a field named user in request and asign user to it
            req.user = user
            next()
        })
    } else {
        return res.status(401).json('no token')
    }
}

// Verify token and if user decrypt from token is the one making request (ie: the same as endpoint paramater) or user is admin
const verifyTokenUserAndAdmin = (req, res, next) => {
    verifyToken(req, res, ()=> {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next()
        } else {
            res.status(403).json('not allowed')
        }
    })
}

const verifyTokenAdmin = (req, res, next) => {
    verifyToken(req, res, ()=> {
        if (req.user.isAdmin) {
            next()
        } else {
            res.status(403).json('not allowed')
        }
    })
}
module.exports = {verifyToken, verifyTokenUserAndAdmin, verifyTokenAdmin}
