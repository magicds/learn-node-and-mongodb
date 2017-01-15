var express = require('express');
// 此模块已经出express中抽出 用于替代之前express.bodyParser()
var bodyParser = require('body-parser');
var path = require('path');

// mongoose
var mongoose = require('mongoose');
// data
var Movie = require('./models/movie.js');

// 此模块用于合并对象
var underscore = require('underscore');

var port = process.env.PORT || 3000;

var app = express();

// 链接数据库
mongoose.connect('mongoose://localhost/movie');

// 路径必须拼接上当前目录
app.set('views', __dirname + '/views/pages');

// 处理格式
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'bower_components')));
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
        res.render('index', {
            title: '首页',
            movies: movies
        });

    });

});

// detail page
app.get('/movie/:id', function (req, res) {
    var id = req.params.id;

    Movie.findById(id, function (err, movie) {
        res.render('detail', {
            title: movie.title,
            movie: movie
        });
    });

});

// admin update movie
app.get('/admin/update/:id',function(res,req){
    var id = req.params.id;

    Movie.findById(id, function (err, movie) {
        res.render('detail', {
            title: movie.title,
            movie: movie
        });
    });
});


// admin post movie
app.post('/admin/movie/new', function (res, req) {

    var movieObj = req.body.movie;
    var id = movieObj._id;
    var _movie;
    // It is existed, need update
    if (id !== undefined) {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            } else {
                _movie = underscore.extend(movie, movieObj);
                
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
    }
    // save data
    _movie.save(function (err, movie) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/movie/' + movie._id);
        }
    });
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
        title: '管理页'
    });
});
