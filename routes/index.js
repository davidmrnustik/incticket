/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	api: importRoutes('./api'),
};

// Setup Route Bindings
exports = module.exports = function (app) {
	app.use(function(req, res, next){
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		next();
	});

	// Views
	app.get('/', routes.views.index);
	app.get('/tickets', routes.views.tickets.ticketlist);
	app.get('/projects', routes.views.products.productlist);
	app.get('/projects/:productslug', routes.views.products.singleproduct);
	app.get('/tickets/:ticketslug', routes.views.tickets.singleticket);
	app.get('/mytickets', routes.views.tickets.mytickets);
	app.get('/tags/:tag', routes.views.tickets.tagtickets);
	app.all('/createticket', middleware.requireUser, routes.views.tickets.newticket);
	app.all('/modifyticket/:ticket?', middleware.requireUser, routes.views.tickets.modifyticket);
	app.all('/admin/*', middleware.isAdmin);
	app.all('/join', routes.views.auth.join);
	app.all('/signin', routes.views.auth.signin);
	app.all('/signout', routes.views.auth.signout);
	app.all('/forgotpassword', routes.views.auth.fotgotpassword);
	app.all('/resetpassword/:key', keystone.security.csrf.middleware.init, routes.views.auth.resetpassword);
	app.post('resetpassword', keystone.security.csrf.middleware.validate, routes.views.auth.resetpassword);
	app.get('/search', routes.views.tickets.search);
	app.get('/api/tickets', keystone.middleware.api, routes.api.ticket.getTickets);
	app.get('/api/tickets/:id', keystone.middleware.api, routes.api.ticket.getTicketById);
	app.post('/api/tickets', keystone.middleware.api, routes.api.ticket.createTicket);
	app.put('/api/tickets/:id', keystone.middleware.api, routes.api.ticket.updateTicketById);
	app.delete('/api/tickets/:id', keystone.middleware.api, routes.api.ticket.deleteTicketById);

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
