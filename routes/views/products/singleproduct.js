var keystone = require('keystone');

exports = module.exports = function(req, res){
	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'products';

	locals.data = {
		product: {},
		tickets: {}
	}

	view.on('init', function(next){
		var q = keystone.list('Product').model.findOne({ slug: req.params.productslug }).populate('createdBy');
		q.exec(function(err, result){
			if(result != null){
				locals.data.product = result;
			} else {
				return res.status(404).send(keystone.wrapHTMLError("Sorry, no product found! (404)"))
			}
			next(err);
		});
	});

	view.on('init', function(next){
		var q = keystone.list('Ticket').model.find();
		
		if (locals.data.product){
			q.where('product').in([locals.data.product]);
		}
		
		q.exec(function(err, results){
			if(results != null){
				locals.data.tickets = results;
			} else {
				return res.status(404).send(keystone.wrapHTMLError("Sorry, no ticket found! (404)"))
			}
			next(err);
		})
	})

	view.render('products/singleproduct');
};