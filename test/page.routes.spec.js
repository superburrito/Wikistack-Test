var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);

var models = require('../models');
var Page = models.Page;
var User = models.User;

describe('http requests', function() {
    var page,user
    before(function(done) {
        page = Page.create({
            title: 'exampleTitle',
			content: 'exampleContent',
			status: 'open',
			date: new Date(),
			tags: ['tag1', 'tag2']
        })
        user = User.create({
            name: 'Yao',
            email: 'yaolovesburritos@gmail.com'
        })
        Promise.all([page, user])
        .then(function(page) {
            done()
        })
    })
    describe('GET /wiki/', function() {
        it('responds with 200', function(done) {
            agent
            .get('/wiki')
            .expect(200, done)
        })

    })
    describe('GET /wiki/add', function() {
        it('responds with 200', function(done) {
            agent
            .get('/wiki/add')
            .expect(200, done)
        })

    })
    describe('GET /wiki/:urlTitle', function() {
        it('responds with 200', function(done) {
            agent
            .get('/wiki/exampleTitle')
            .expect(200, done)
        })
        it('responds with 404 if page does not exist', function(done) {
            agent
            .get('/wiki/blablabla')
            .expect(404, done)
        })

    })
    describe('GET /wiki/search', function() {
        it('responds with 200', function(done) {
            agent
            .get('/wiki/search')
            .expect(200, done)
        })

    })
    describe('GET /wiki/:urlTitle/similar', function() {
        it('responds with 200', function(done) {
            agent
            .get('/wiki/exampleTitle/similar')
            .expect(200, done)
        })
        it('responds with 404 if page does not exist', function(done) {
            agent
            .get('/wiki/blablabla/similar')
            .expect(404, done)
        })

    })
    describe('POST /wiki', function() {
        // for POST, we are redirecting back to /wiki, therefore responds with 302
        it('responds with 302', function(done) {
            agent
            .post('/wiki')
            .send({
                name: "yao",
                email: "burritos@gmail.com",
                title: 'exampleTitle2',
    			content: 'exampleContent',
    			status: 'open',
    			tags: ['tag1', 'tag2']
            })
            .expect(302, done)
        })
        it('creates a page in database', function(done) {
            agent
            .get('/wiki/exampleTitle2')
            .expect(200, done)
        })

    })
})
