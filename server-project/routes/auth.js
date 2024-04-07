const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt')
const PrismaClient = require("@prisma/client").PrismaClient;
const prisma = new PrismaClient();

const app = express.Router();

app.get('/', checkAuthenticated, (req, res) => {
  res.render('./views/index.ejs', { name: req.user.name })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('./views/login.ejs')
})

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('./views/register.ejs')
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('./views/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('./views/login')
}

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const user = await prisma.userP2.create({
      data: 
      {
        email: req.body.email,
        name:  req.body.name,
        password: bcrypt.hashSync(req.body.password, 10),
      }
    })
    
    res.redirect('/login')
  } catch {
    res.redirect('./views/register')
  }
})

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: './views/login',
  failureFlash: true
}))

module.exports = app;