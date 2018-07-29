const express = require('express');
// 此模块已经出express中抽出 用于替代之前express.bodyParser()
const bodyParser = require('body-parser');
const path = require('path');

// mongoose
const mongoose = require('mongoose');
// data
const Movie = require('./models/movie.js');

// 此模块用于合并对象
const underscore = require('underscore');

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
app.set('views', __dirname + '/views/pages');

// 处理格式 解析json 解析表单等数据
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded

app.use(express.static(path.join(__dirname, 'public')));
app.locals.moment = require('moment');
// app.set('./', './views');

app.set('view engine', 'jade');

app.listen(port);

console.log('start on port:' + port);

/**
 * 路由配置
 */

// index page
app.get('/', function (req, res) {
    // 查询数据
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        console.log(movies);
        res.render('index', {
            title: '首页',
            movies: movies
        });

    });

});

// detail page
app.get('/movie/:id', function (req, res) {
    console.log('req :' + req);
    var id = req.params.id;
    console.log('id :' + id);
    Movie.findById(id, function (err, movie) {
        console.log(movie);
        res.render('detail', {
            title: movie.title,
            movie: movie
        });
    });

});

// admin update movie
app.get('/admin/update/:id', function (req, res) {
    var id = req.params.id;

    if (id) {
        Movie.findById(id, function (err, movie) {
            res.render('admin', {
                title: movie.title + '更新页',
                movie: movie
            });
        });
    }
});


// admin post movie
app.post('/admin/movie/new', function (req, res) {

    var movieObj = req.body.movie;
    var id = movieObj._id;
    var _movie;

    // It is existed, need update
    if (id !== 'undefined') {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            } else {
                _movie = underscore.extend(movie, movieObj);
                _movie.save(function (err, movie) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect('/movie/' + movie._id);
                    }
                });
            }
        });
    } else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            language: movieObj.language,
            country: movieObj.country,
            summary: movieObj.summary,
            flash: movieObj.flash,
            poster: movieObj.poster,
            year: movieObj.year
        });
        // save data
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/movie/' + movie._id);
            }
        });
    }

});



// list page
app.get('/admin/list', function (req, res) {
    // 查询数据
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: '列表页',
            movies: movies
        });

    });
});



// admin page
app.get('/admin/movie', function (req, res) {
    res.render('admin', {
        title: '后台录入',
        movie: {
            title: '',
            doctor: '',
            country: '',
            language: '',
            summary: '',
            year: '',
            flash: '',
            poster: ''
        }
    });
});


// delete
app.delete('/admin/list', function (req, res) {
    console.log(req);
    var id = req.query.id;
    if (id) {
        Movie.remove({
            _id: id
        }, function (err, movie) {
            if (err) {
                console.log(err);
            } else {
                res.json({
                    success: 1
                });
            }
        });
    }
});