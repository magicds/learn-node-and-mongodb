const Movie = require('../models/movie.js');
// 此模块用于合并对象
const underscore = require('underscore');

exports.new = function (req, res) {
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
}

exports.save = function (req, res) {

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

}

exports.update = function (req, res) {
    var id = req.params.id;

    if (id) {
        Movie.findById(id, function (err, movie) {
            res.render('admin', {
                title: movie.title + '更新页',
                movie: movie
            });
        });
    }
}

exports.delete = function (req, res) {
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
}

exports.detail = function (req, res) {
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

}

exports.list = function (req, res) {
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
}