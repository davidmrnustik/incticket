var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation
	locals.section = 'tickets';
	locals.data = {
		tickets: []
	}

	// load all tickets
	view.on('init', function(next) {
		var q = keystone.list('Ticket').paginate({
			page: req.query.page || 1,
			perPage: 5,
			maxPages: 5
		}).populate('assignedTo createdBy tags product')
		.sort('-updatedAt');
		q.exec(function(err, results){
			locals.data.tickets = results;
			next(err);
		});
		//var c = keystone.list('Ticket').model.count({'category': 'Bug'})
		//c.exec(function(err, count){
		//	console.log("There are " + count + " bugs.");
		//})
	});

	// render the view
	view.render('tickets/ticketlist');
};