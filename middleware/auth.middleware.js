function authenticate(req, res, next) {
    if (req.session.user) {
        next()
    } else {
        req.session.regenerate(function (err) {
            if (err) next(err)
            
            // save the session before redirection to ensure page
            // load does not happen before session is saved
            req.session.save(function (err) {
              if (err) return next(err)
              res.redirect('/')
            })
        })
    }
}

module.exports = {
    authenticate
}