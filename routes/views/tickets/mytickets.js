var keystone = require('keystone');

exports = module.exports = function(req, res){
	var view = new keystone.View(req, res),
	locals = res.locals;

	locals.section = 'mytickets';

	locals.data = {
		tickets: {},
		user: req.user
	}

	view.on('init', function(next){
		var q = keystone.list('Ticket').model.find( { assignedTo: req.user} ).populate('assignedTo createdBy product tags');
		q.exec(function(err, results){
			locals.data.tickets = results;
			next(err);
		})
	})

	view.render('tickets/mytickets');

}