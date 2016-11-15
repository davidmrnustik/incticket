var keystone = require('keystone');

exports = module.exports = function(req, res){
	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'products';

	locals.data = {
		products: {}
	};

	view.on('init', function(next){
		var q = keystone.list('Product').model.find().select('name team slug');
		q.exec(function(err, results){
			if(results != null){
				locals.data.products = results;
			} else {
				return res.status(404).send(keystone.wrapHTMLError("Sorry, no products found! (404)"))
			}
			next(err);			
		})
	})

	view.render('products/productlist');
};