
var expect = require('chai').expect;
var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);

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




