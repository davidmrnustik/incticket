var keystone = require('keystone');

exports = module.exports = function(req, res){
	var view = new keystone.View(req, res),
			locals = res.locals;

	locals.filters = {
		keywords: req.query.keywords
	};
	locals.data = {
		tickets: [],
		keywords: ""
	};

	view.on('init', function(next){
		console.log('search keywords=' + locals.filters.keywords);
		locals.data.keywords = locals.filters.keywords;

		keystone.list('Ticket').model.find({$text: { $search: locals.filters.keywords} }, { score: { $meta: "textScore" } }).sort({score: { $meta: "textScore" } }).limit(20).exec(function(err, results){
			if(err){
				console.log(err)
			}
			locals.data.tickets = results;
			next();
		});
	});

	view.render('tickets/search');
};