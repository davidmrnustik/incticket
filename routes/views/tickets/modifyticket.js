var keystone = require('keystone');
var Ticket = keystone.list('Ticket');

exports = module.exports = function(req, res){
	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.form = req.body;
	locals.data = {
		users: [],
		ticket: [],
		products: []
	};

	view.on('init', function(next){
		var q = keystone.list('User').model.find().select('_id name fullname');
		q.exec(function(err, results){
			locals.data.users = results;
			next(err);
		});
	});

	view.on('init', function(next){
		var q = keystone.list('Product').model.find();
		q.exec(function(err, results){
			locals.data.products = results;
			next(err);
		})
	})

	view.on('init', function(next){
		keystone.list('Ticket').model.findOne({ slug: req.params.ticket }).populate('assignedTo').exec(function(err, results){
			locals.data.ticket = results;
			next(err);
		});
	});

	view.on('post', function(next){
		Ticket.model.findById(req.body.id).exec(function(err, item){
			if (err) return req.flash('error', 'There was a problem when updating a ticket.');
			if (!item) return req.flash('error', 'There is no such a ticket.');

			var data = req.body;

			item.getUpdateHandler(req).process(data, function(err){
				if (err) return req.flash('error', 'There was a problem when updating a ticket.');
				req.flash('success', 'Your ticket has been created.');
				return res.redirect('/tickets');
				next();
			})
		})
		
	});

	view.render('tickets/modifyticket');
};