// NPM Modules
const express = require('express')
const router = express.Router();
const Joi = require('joi');

// Middleware
const validateRequest = require('middleware/validate-request');
const authenticateToken = require('middleware/jwt');


// Service for User
const userService = require('./user.service');


// Module that Exported to other Class
module.exports = router


// ROUTES
router.get('/', index)
router.get('/all', authenticateToken, getAllUser)
router.get('/user/:id', authenticateToken ,getById)
router.get('/register-page', create)
router.get('/login-page', login)
router.post('/login', loginAction);
router.post('/register', validateCreateJSON, store);
router.put('/user/:id', authenticateToken ,validateUpdateJSON, update);
router.delete('/user/:id', authenticateToken, _delete)


// FUNCTIONS
function index(req, res, next) {
    res.json({
        message: 'Welcome to User Endpoint',
    })
}

async function getAllUser(req, res, next) {
    await userService.getAll()
        .then(data => {
            if (data.length == 0) {
                next("All Users Empty. Not found");
                return
            }
            res.status(200).json({
                message: "Data User didapatkan",
                data: data
            })
        })
        .catch((err) => {
            next(err)
        })
}

async function getById(req, res, next) {
    await userService.getById(req.params.id)
        .then(data => {
            if (data == undefined) {
                next("User not found")
                return;
            }
            res.status(200).json({
                message: "Ini Data usernya",
                data: data
            })
        })
        .catch((err) => {
            next(err)
        })
}

// Register User
function create(req, res, next) {
    res.render('register');
}

// Login User
function login(req, res, next) {
    res.render('login');
}

async function loginAction(req, res, next) {
    const { username, password } = req.body
    await userService.login(username, password)
        .then( data => {
            // console.log(data)
            res.status(200).json({
                message: "Berhasil login",
                data
            })
        } )
        .catch( (err) => {
            next(err)
        } )
    // return res.status(204);
    // await userService.login()
}

async function store(req, res, next) {
    await userService.register(req.body)
        .then((result) => {
            res.status(201).json({
                message: "Data Berhasil Masuk",
                data: result,
            })
        })
        .catch((err) => {
            next(err)
        })
}

// Update a User

function edit(req, res, next) {
    // It should return view
}

async function update(req, res, next) {
    is404(req.params.id, next)
        .then(async (value) => {
            if (value) {
                next("User not found");
                return;
            }
            await userService.update(req.params.id, req.body)
                .then((data) => {
                    res.status(204).json({
                        message: "Data berhasil di update",
                        data: data,
                    })
                })
                .catch((err) => {
                    next(err)
                })
        })
        .catch((err) => {
            next(err)
        })
}

// Delete User
async function _delete(req, res, next) {
    is404(req.params.id, next)
        .then(async (value) => {
            if (value) {
                next("User not found");
                return;
            }
            await userService._delete(req.params.id)
                .then((data) => {
                    res.status(204).json({
                        message: "Delete User berhasil"
                    })
                })
                .catch((err) => {
                    next(err)
                })
        })
        .catch((err) => {
            next(err)
        })
}

// Helper Functions

function validateCreateJSON(req, res, next) {
    const Schema = Joi.object({
        first_name: Joi.string()
            .max(256)
            .required(),
        last_name: Joi.string()
            .max(256)
            .required(),
        password: Joi.string()
            .required()
    }).with('first_name', 'last_name');
    validateRequest(req, next, Schema);
}

function validateUpdateJSON(req, res, next) {
    const Schema = Joi.object({
        first_name: Joi.string()
            .max(256)
            .required(),
        last_name: Joi.string()
            .max(256)
            .required(),
    }).with('first_name', 'last_name');
    validateRequest(req, next, Schema);
}

async function is404(user_id, next) {
    var is404 = false;
    await userService.getById(user_id)
        .then((data) => {
            // console.log(data)
            if (data === undefined) {
                is404 = true
            } else {
                is404 = false
            }
        })
        .catch((err) => {
            next(err)
        })
    return is404
}