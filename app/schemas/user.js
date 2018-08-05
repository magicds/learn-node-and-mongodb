const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const bcrypt = require('bcrypt');

// 加盐强度
const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    role: {
        type: Number,
        default: 0
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    },
});

// 存储之前调用
UserSchema.pre('save', function (next) {
    // 新增的数据
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }
            this.password = hash;
            next();
        });
    });
});
UserSchema.methods = {
    comparePassword(_pwd) {
        return bcrypt.compare(_pwd, this.password);
    }
}

UserSchema.statics = {
    // select all
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    // select by id
    findById: function (id, cb) {
        return this
            .findOne({
                _id: id
            })
            .exec(cb);
    }
};

module.exports = UserSchema;