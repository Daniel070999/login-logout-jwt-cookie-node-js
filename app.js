const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const port = 3000;

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/', require('./users/users.controller'));

app.listen(port, () => {
    console.log('App Listening on port ' + port);
});