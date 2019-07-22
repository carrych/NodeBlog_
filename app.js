var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('./configs/mongo');
const bodyParser = require('body-parser');
var hbs = require('hbs');
const expressValidator = require('express-validator');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const aboutRouter = require('./routes/about');
const adminRouter = require('./routes/admin');
const contactRouter = require('./routes/contact');
const postRouter = require('./routes/single-post');
const successRouter = require('./routes/success');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(`${__dirname}/views/partials`);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//set express-validator
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        return {
            param: param,
            msg: msg,
            value: value
        };
    }
}));

//our routs to the pages
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/about', aboutRouter);
app.use('/admin', adminRouter);
app.use('/contact', contactRouter);
app.use('/single-post', postRouter);
app.use('/success', successRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
