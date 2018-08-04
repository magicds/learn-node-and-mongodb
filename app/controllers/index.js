const Movie = require('../models/movie.js');
exports.index = function (req, res) {

    // 查询数据
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        // console.log(movies);
        res.render('index', {
            title: '首页',
            movies: movies
        });

    });

}