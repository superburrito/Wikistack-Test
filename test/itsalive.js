var models = require('../models');
var Page = models.Page;
var User = models.User;
var expect = require('chai').expect;
var chai = require('chai');
var spies = require('chai-spies');
var Sequelize = require('sequelize');
chai.use(spies);

var db = new Sequelize('postgres://localhost:5432/wikistacktest', {
    logging: false
});

describe('simple test', function(){
	it('confirms basic math', function(){
		expect(2+2).to.be.equal(4);
	});
	it('tests timesetout', function(done){
		var start = new Date();
		setTimeout(function(){
			var duration = new Date() - start;
			expect(duration).to.be.closeTo(1000,50);
			// when calling asynchronous functions, call done() afterwards
			// only need one done() in a describe function
			done();
		}, 1000);
	});
	it('confirms for each invokes function ones for every element', function(){
		var arr = [1,2,3,4,5];
		var harry = function(element){
			return element+1;
		};
		harry = chai.spy(harry);
		arr.forEach(harry);
		expect(harry).to.have.been.called.exactly(arr.length);
	});
});

describe('page model', function(){
	before(function(done){
		Promise.all([
	        models.User.sync({}),
	        models.Page.sync({})
	    ])
		.then(function(){
			done()
		})
	})

	var newPage;
	before(function(done){
		newPage = Page.build({
			title: 'exampleTitle',
			content: 'exampleContent',
			status: 'open',
			date: new Date(),
			tags: ['tag1', 'tag2']
		})
		newPage.save()
		.then(function(){
			done()
		})
		// .build is temporary, without .save() it wouldn't save to the actual database
	})
	describe('attributes', function(){
		it('should have a title in string', function(){
			expect(newPage.title).to.be.a('string')
		})
		it('should have a urlTitle in string', function(){
			expect(newPage.urlTitle).to.be.a('string')
		})
		it('should have a content in string', function(){
			expect(newPage.content).to.be.a('string')
		})
		it('should have a status in string', function(){
			expect(newPage.status).to.be.a('string')
		})
		it('should have a date in date Object', function(){
			expect(newPage.date).to.be.an('date')
		})
		it('should have a tags in an array', function(){
			expect(newPage.tags).to.be.an('array')
		})
	})
	describe('getterMethods', function(){
		describe('route', function(){
			it('should return the route of the page', function(){
				// getterMethods are treated like a property, no need to call() it
				expect(newPage.route).to.equal('/wiki/exampleTitle')
			})
		})
	})
	describe('classMethods', function(){
		describe('findByTag', function(){
			it('should return all pages that match the tag', function(done){
				Page.findByTag('tag1')
				.then(function(result){
					//expect(result.length).to.equal(1)
					//expect(result[0].title).to.equal('exampleTitle')
					done()
				})
				.catch(function(err){
					done(err)
				})
				// simplified version: .catch(done)
			})
		})
	})
})
