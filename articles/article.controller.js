const express = require('express')
const router = express.Router();
const Joi = require('joi');

// Article Service
const articleService = require('./article.service');

// User Service
const userService = require('../users/user.service');

// Middleware
const validateRequest = require('middleware/validate-request');
const authenticateToken = require('middleware/jwt');

// Module Exports
module.exports = router

router.use(authenticateToken)

// Routes
router.get('/all', getAll)
router.get('/list', showArticleList)
router.get('/:id', getById)
router.get('/add-article', create)
router.get('/edit-article', updateView)
router.get('/show-article', show)
router.post('/store', validateCreateJSON, store)
router.put('/:id', getById, validateUpdateJSON, update)
router.delete('/:id', getById, _delete)


// Functions

async function getAll(req, res, next){
    await articleService.getAll()
        .then( (data) => {
            res.status(200).json({
                message: "Berhasil mengambil data",
                data: data
            })
        } )
        .catch( (err) => {
            next(err)
        } )
}

// Show All Article View
function showArticleList(req,res,next) {
    res.render('article-list')
}

function updateView(req, res, next) {
    res.render('article-update')
}

function create(req, res, next){
    // It should return view
    res.render('article-add')
}

function show(req,res,next) {
    res.render('article-get')
}

async function getById(req, res, next){
    await articleService.getById(req.params.id)
        .then( async (data) => {
            if (data == undefined) {
                next("Article not found")
                return;
            }
            data.author = await userService.getById(data.user_id)
            res.status(200).json({
                message: "Berhasil mengambil data pada artikel spesifik",
                data: data,
            })
        } )
}

async function isExist(){

}

// Register a Article



async function store( req, res, next ){
    // Check whether the User is really exist or not
    let is404 = false;
    await userService.getById(req.body.user_id)
        .then( (data) => {
            if (data == undefined) {
                is404 = true
                return next("User not found.")
            }
        } )
        .catch( (err) => {
            next(err)
        } );
    // If is404, then the function is stopped
    if(is404){
        return
    }
    await articleService.store(req.body)
    .then( (data) => {
        res.status(201).json({
            message: "Input Article Berhasil",
            data: data
        })
    } )
    .catch ( (err) => next(err) )
}

// Update a Article



async function update( req, res, next ){
    await articleService.update(req.params.id, req.body)
        .then( (data) => {
            res.status(204).json({
                message: "Update Berhasil",
                data: data,
            })
        } )
        .catch( (err) => {
            next(err)
        } )
}

async function _delete( req, res, next ){
    await articleService.delete(req.params.id)
        .then( (data) => {
            if (data.affectedRows == 0) {
                next("Article not found")
                return;
            }
            res.status(204).json({
                message: "Data berhasil di delete",
                data: data
            })
        } )
        .catch( (err) => {
            next(err)
        } )
}

function validateCreateJSON( req, res, next ) {
    const Schema = Joi.object({
        title: Joi.string()
                .required()
                .max(256),
        content: Joi.string()
                .required(),
        user_id : Joi.number()
                .required(),
    }).with('title', 'content')

    validateRequest(req, next, Schema);
}

function validateUpdateJSON( req, res, next ) {
    const Schema = Joi.object({
        title: Joi.string()
                .required()
                .max(256),
        content: Joi.string()
                .required(),
    }).with('title', 'content')

    validateRequest(req, next, Schema);
}