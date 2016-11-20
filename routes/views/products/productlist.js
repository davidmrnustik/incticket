var keystone = require('keystone');

exports = module.exports = function(req, res){
	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'products';

	locals.data = {
		products: {}
	};

	view.on('init', function(next){
		var q = keystone.list('Product').model.find().select('name team slug createdBy').where('publishedStatus').in(['published']).populate('createdBy');
		q.exec(function(err, results){
			locals.data.products = results;
			next(err);			
		})
	})

	view.render('products/productlist');
};