const express = require("express");
const userRouter = require("./routes/user");
const authRouter = require('./routes/auth');
const passport = require('passport');

const app = express();

app.use(express.json());

app.use('/', authRouter);
app.use("/api/v1/users", userRouter);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});