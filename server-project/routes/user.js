const PrismaClient = require("@prisma/client").PrismaClient;
const prisma = new PrismaClient();
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const  jwt = require('jsonwebtoken');
const passport = require('passport');



router.post('/signup', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    // Validar los datos de entrada
    const user = await prisma.user.create({
      data: {
        email,
        password: bcrypt.hashSync(password, 10),
        firstName,
        lastName,
      },
    });
    res.status(201).json({ user });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
    // Generar un token de acceso
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
});
  
  
module.exports = router;