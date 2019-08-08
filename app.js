var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('./configs/mongo.config');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

//require ore routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');
const aboutRouter = require('./routes/about');
const adminRouter = require('./routes/admin');
const contactRouter = require('./routes/contact');
const postRouter = require('./routes/single-post');
const loginRouter = require('./routes/login');
const successRouter = require('./routes/success');
const userRouter = require('./routes/user');
const categoryRouter = require('./routes/category');
const cabinetRouter = require('./routes/cabinet');

const app = express();

//passport cfg
const passport = require('passport');
require('./configs/passport.config')(passport);

// view engine 'hbs' setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(`${__dirname}/views/partials`);

app.use(logger('dev'));
app.use(express.json());

//bodyparser
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

//passport
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.warning_msg = req.flash('warning_msg');
    res.locals.error_msg = req.flash('error');
    next();
});

//set express-validator
app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        return {
            param: param,
            msg: msg,
            value: value
        };
    }
}));

//our routs to the pages
app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/admin', adminRouter);
app.use('/contact', contactRouter);
app.use('/single-post', postRouter);
app.use('/success', successRouter);
app.use('/login', loginRouter);
app.use('/admin/user', userRouter);
app.use('/admin/category', categoryRouter);
app.use('/cabinet', cabinetRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
