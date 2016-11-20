var keystone = require('keystone');

exports = module.exports = function(req, res){
	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'tickets';

	locals.data = {
		ticket: {}
	};

	view.on('init', function(next){
		var q = keystone.list('Ticket').model.findOne({ slug: req.params.ticketslug }).populate('assignedTo createdBy tags similarTicket product');
		q.exec(function(err, result){
			if(result != null){
				locals.data.ticket = result;
			} else {
				return res.status(404).send(keystone.wrapHTMLError("Sorry, no ticket found! (404)"))
			}
			next(err);
		});
	});

	view.render('tickets/singleticket');
};
