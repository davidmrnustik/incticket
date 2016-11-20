var keystone = require('keystone');
var Types = keystone.Field.Types;

var Product = new keystone.List('Product', {
	autokey: { from: 'name', path: 'slug', unique: true},
});

Product.add({
	name: { type: String, required: true },
	team: { type: String },
	publishedStatus: { type: Types.Select, options: 'draft, published', default: 'draft' },
	createdBy: { type: Types.Relationship, ref: 'User', index: true, default: "", many: false },
	createdAt: { type: Date, default: Date.now }
});
Product.schema.virtual('fulltitle').get(function(){
	return this.name + ' ' + this.team;
})

Product.relationship({ ref: 'Ticket', refPath: 'product', path: 'productticket'});

Product.defaultSort = '-title';
Product.defaultColumns = 'title|20%, team, publishedStatus, createdBy';

Product.schema.virtual('url').get(function(){
	return '/projects/' + this.slug;
})

Product.register();