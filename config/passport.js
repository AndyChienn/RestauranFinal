const bcrypt = require('bcryptjs/dist/bcrypt')
const passport = require('passport')
const User = require('../models/user')
const LocalStrategy = require('passport-local').Strategy

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'this mail is not registered.' })
        }
        // if (user.password !== password) {
        //   return done(null, false, { message: 'email or password incorrect.' })
        // }
        return bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            return done(null, false, { message: 'Email or Password incorrect!' })
          }
          return done(null, user)
        })
      })
      .catch(err => done(err, false))
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}