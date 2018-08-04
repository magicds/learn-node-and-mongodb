const express = require('express');
const logger = require('morgan');
// 此模块已经出express中抽出 用于替代之前express.bodyParser()
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
// const cookieParser = require('cookie-parser'); express-session 1.5 之后就不依赖这个了
// mongoose
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;

// 配置
const config = require('./config.js');
const dbCfg = config.db;

const app = express();

// 链接数据库
const dbConnectionStr = `mongodb://${dbCfg.username}:${dbCfg.password}@localhost:${dbCfg.post}/movie`;
console.log(dbConnectionStr);
mongoose.connect(dbConnectionStr, {
    useMongoClient: true
});
mongoose.connection.on('connected', function () {
    console.log('Connection success!');
});

// 路径必须拼接上当前目录
app.set('views', __dirname + '/app/views/pages');

// 处理格式 解析json 解析表单等数据
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    // for parsing application/x-www-form-urlencoded
    extended: true
}));
// Note Since version 1.5.0, the cookie-parser middleware no longer needs to be used for this module to work. This module now directly reads and writes cookies on req/res. Using cookie-parser may result in issues if the secret is not the same between this module and cookie-parser.
// app.use(cookieParser());
app.use(session({
    secret: 'learn node',
    store: new mongoStore({
        url: dbConnectionStr,
        collection: 'sessions'
    }),
    resave: false,
    saveUninitialized: true,
    cookie: {
        // https://www.npmjs.com/package/express-session#cookiesecure
        /*
        Specifies the boolean value for the Secure Set-Cookie attribute. When truthy, the Secure attribute is set, otherwise it is not. By default, the Secure attribute is not set.
        Note be careful when setting this to true, as compliant clients will not send the cookie back to the server in the future if the browser does not have an HTTPS connection.*/
        secure: false
    }
}));
app.use(express.static(path.join(__dirname, 'public')));
app.locals.moment = require('moment');
// app.set('./', './views');

app.set('view engine', 'jade');

// 配置
const env = process.env.NODE_ENV || 'development';
if ('development' == env) {
    app.set('showStackError', true);
    app.use(logger(':method :url :status'));
    app.locals.pretty = true;
    mongoose.set('debug', true);
}

// 引入路由
require('./router/router')(app);

const server = app.listen(port, function () {
    const host = server.address().address || 'localhost';
    const port = server.address().port;

    console.log(`Server listening at http://${host}:${port}`);
});