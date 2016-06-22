var models = require('../models');
var Page = models.Page;
var User = models.User;
var expect = require('chai').expect;
var chai = require('chai');
var spies = require('chai-spies');
var Sequelize = require('sequelize');

chai.use(spies);

/*var db = new Sequelize('postgres://localhost:5432/wikistack-test', {
    logging: false
});
*/
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
	// Making new database
	before(function(done){
		User.sync({force :true})
		.then(function(){
			return Page.sync({force: true});
		})
		.then(function(){
			done()
		})
	})
	// Making new page
	var newPage, newPage2;
	before(function(done){
		newPage = Page.build({
			title: 'exampleTitle',
			content: 'exampleContent',
			status: 'open',
			date: new Date(),
			tags: ['tag1', 'tag2']
		});
		newPage2 = Page.build({
			title: 'exampleTitle2',
			content: 'exampleContent2',
			status: 'open',
			date: new Date(),
			tags: ['tag2', 'tag3']
		});	
		Promise.all([newPage.save(),newPage2.save()])
		.then(function(){
			done();
		});
		// .build is temporary, without .save() it wouldn't save to the actual database
	});
	describe('attributes', function(){
		it('should have a title in string', function(){
			expect(newPage.title).to.be.a('string');
		});
		it('should have a urlTitle in string', function(){
			expect(newPage.urlTitle).to.be.a('string');
		});
		it('should have a content in string', function(){
			expect(newPage.content).to.be.a('string');
		});
		it('should have a status in string', function(){
			expect(newPage.status).to.be.a('string');
		});
		it('should have a date in date Object', function(){
			expect(newPage.date).to.be.an('date');
		});
		it('should have a tags in an array', function(){
			expect(newPage.tags).to.be.an('array');
		});
	});
	describe('getterMethods', function(){
		describe('route', function(){
			it('should return the route of the page', function(){
				// getterMethods are treated like a property, no need to call() it
				expect(newPage.route).to.equal('/wiki/exampleTitle')
			});
		});
	});
	describe('classMethods', function(){
		describe('findByTag', function(){
			it('should return all pages that match the tag', function(done){
				return Page.findByTag('tag1')
				.then(function(result){
					expect(result[0].title).to.equal('exampleTitle');
					done();
				})
				.catch(function(err){
					done(err);
				});
				// simplified version: .catch(done)
			});
		});
	});
	describe('instanceMethods', function(){
		describe('findSimilar', function(){
			it('never gets itself', function(done){
				newPage.findSimilar()
				.then(function(result){
					var ctr = 0;
					for(var i = 0; i < result.length; i++){
						if(result[i].id == newPage.id) ctr++;
					}
					expect(ctr).to.equal(0);
				done();
				});
			});
			it('gets other pages with any common tags', function(done){
				newPage.findSimilar()
				.then(function(result){
					var ctr = 0;
					for(var i = 0; i < result.length; i++){
						if(result[i].id == newPage2.id) ctr++;
					}
					expect(ctr).to.not.equal(0);
					done();
				});
			});
		});
	});

	describe('Validations', function(){
		var brokenPage;
		before(function(done){
			brokenPage = Page.build({
				title: null,
				content: 'exampleContent',
				status: 'open',
				date: new Date(),
				tags: null
			});
			done();
		});
		it('returns truthy error when page is invalid', function(done){
			brokenPage.save().catch(function(err){
				if(err){
					expect(err).to.exist;
				}
				done();
			});
		});
	});

	describe('Hooks: Before Validate', function(){
		var newPage;
		before(function(){
			newPage = Page.build({
				title: 'exampleTitle',
				content: 'exampleContent',
				status: 'open',
				date: new Date(),
				tags: ['tag1', 'tag2']
			});
		});
		it('will not create a urlTitle if not invoked', function(done){
			expect(newPage.urlTitle).to.equal(undefined);
			done();
		});
		it('creates a urlTitle before validation', function(done){
			newPage.save().then(function(result){			
			expect(result.urlTitle).to.not.equal(undefined);
			done();
			});
		});
	});

});