var keystone = require('keystone');
var Types = keystone.Field.Types;
var uniqueValidator = require('mongoose-unique-validator');

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User', {
	autokey: { path: 'slug', from: 'username', unique: true }
});

User.add({
	username: { type: String, required: true, unique: true, index: true, default: ''},
	name: { type: Types.Name, initial: true, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	resetPasswordKey: { type: String, hidden: true },
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
});

User.relationship({ path: 'tickets', ref: 'Ticket', refPath: 'createdBy' });
User.relationship({ path: 'product', ref: 'Product', refPath: 'createdBy' });

User.schema.plugin(uniqueValidator);

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});

User.schema.virtual('url').get(function(){
	return '/users/' + this.slug;
})

User.schema.virtual('fullname').get(function(){
	return this.name.first + " " + this.name.last;
})


/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin';
User.register();
