var keystone = require('keystone');

exports = module.exports = function(req, res){
	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'tags';
	locals.filters = {
		tag: req.params.tag.toLowerCase()
	}
	locals.data = {
		tickets: [],
		tags: []
	}

	// Load all tags
	/*view.on('init', function(next){
		keystone.list('Tag').model.find().exec(function(err, results){
			if (err || !results.length){
				return next(err)
			}
			locals.data.tags = results;
			next(err);
		});
	});*/

	// Load the current tag filter
	view.on('init', function(next){

		if (req.params.tag) {
			keystone.list('Tag').model.findOne({ slug: locals.filters.tag}).exec(function(err, result){
				locals.data.tag = result;
				next(err);
			})
		} else {
			next();
		}
	})

	// Load the tickets

	view.on('init', function(next){
		var q = keystone.list('Ticket').model.find().populate('assignedTo createdBy tags');

		if (locals.data.tag){
			q.where('tags').in([locals.data.tag]);
		}

		q.exec(function (err, results) {
			locals.data.tickets = results;
			next(err);
		});
	})

	view.render('tickets/tagtickets');
};