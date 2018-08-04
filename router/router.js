// data
const Movie = require('../models/movie.js');
const User = require('../models/user.js');

module.exports = function (app) {

    /**
     * 路由配置
     */
    app.use(function (req, res, next) {
        console.log(req.session);
        var _user = req.session.user;
        app.locals.user = _user ? _user : null;
        return next();
    });
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

    // list page
    app.get('/admin/userlist', function (req, res) {
        // 查询数据
        User.fetch(function (err, users) {
            console.log(err, users);
            if (err) {
                console.log(err);
            }
            res.render('userlist', {
                title: '列表页',
                users: users
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

    // signup
    app.post('/user/signup', function (req, res) {
        // const user = req.param('user');
        const _user = req.body.user;
        const user = new User(_user);
        User.findOne({
            name: _user.name
        }, (err, auser) => {
            if (err) {
                console.log(err);
            }
            if (auser) {
                res.redirect('/');
            } else {
                user.save((err, user) => {
                    if (err) throw err;
                    console.log(user);
                    res.redirect('/');
                });
            }
        })
    });

    // signin
    app.post('/user/signin', function (req, res) {
        // const user = req.param('user');
        const _user = req.body.user;

        User.findOne({
            name: _user.name
        }, (err, auser) => {
            if (err) {
                console.log(err);
            }
            if (!auser) {
                return res.redirect('/signup')
            }

            auser.comparePassword(_user.password).then(function (isMatch) {
                if (isMatch) {
                    console.log('signin success!');
                    req.session.user = auser;
                    return res.redirect('/');
                } else {
                    return res.redirect('/signin');
                }
            }).catch((err) => {
                console.log(err);
            })
        })
    });

    // logout
    app.get('/logout', function (req, res) {
        delete req.session.user;
        delete app.locals.user;
        res.redirect('/');
    });
}