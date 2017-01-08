var express = require('express');
// 此模块已经出express中抽出 用于替代之前express.bodyParser()
var bodyParser = require('body-parser');
var path = require('path');

var port = process.env.PORT || 3000;

var app = express();

// 路径必须拼接上当前目录
app.set('views', __dirname + '/views/pages');

// 处理格式
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'bower_components')));
// app.set('./', './views');

app.set('view engine', 'jade');

app.listen(port);

console.log('start on port:' + port);


/**
 * 路由配置
 */
// index page
app.get('/', function (req, res) {
    res.render('index', {
        title: '首页',
        movies: [{
            title: '机械战警',
            _id: 1,
            poster: 'https://baidu.com'
        }, {
            title: '机械战警',
            _id: 2,
            poster: 'https://baidu.com'
        }, {
            title: '机械战警',
            _id: 3,
            poster: 'https://baidu.com'
        }, {
            title: '机械战警',
            _id: 4,
            poster: 'https://baidu.com'
        }, {
            title: '机械战警',
            _id: 5,
            poster: 'https://baidu.com'
        }, {
            title: '机械战警',
            _id: 6,
            poster: 'https://baidu.com'
        }]
    });
});
// list page
app.get('/admin/list', function (req, res) {
    res.render('list', {
        title: '列表页'
    });
});
// detail page
app.get('/movie/:id', function (req, res) {
    res.render('detail', {
        title: '详情页'
    });
});
// admin page
app.get('/admin/movie', function (req, res) {
    res.render('admin', {
        title: '管理页'
    });
});
