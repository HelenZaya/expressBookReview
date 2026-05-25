const express = require('express');
const session = require('express-session');
const { authenticated } = require('./router/auth_users.js');
const { general } = require('./router/general.js');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "secret_key_2024",
  resave: true,
  saveUninitialized: true
}));

app.use('/', general);
app.use('/', authenticated);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
