var keystone = require('keystone');
var Ticket = keystone.list('Ticket');

exports = module.exports = function(req, res){
	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.form = req.body;
	locals.data = {
		users: []
	};

	view.on('init', function(next){
		var q = keystone.list('User').model.find().select('_id name fullname');
		q.exec(function(err, results){
			locals.data.users = results;
			next(err);
		});
	});


	view.on('post', function(next){
		var newTicket = new Ticket.model(),
				data = req.body;

		newTicket.getUpdateHandler(req).process(data, {
			flashErrors: true,
		}, function(err){
			if (err){
				locals.validationErrors = err.errors;
			} else {
				req.flash('success', 'Your ticket has been created.');
				return res.redirect('/tickets/' + newTicket.slug);
			}
			next();
		});
	});

	view.render('tickets/newticket');
};