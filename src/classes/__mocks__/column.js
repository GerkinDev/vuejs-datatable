/* eslint-disable no-undef */
// Import this named export into your test file:
const mock = jest.fn().mockImplementation(function mockColumn(config){
	Object.assign(this, config);
	this.matches = (row, filter) => `${ this.getRepresentation(row) }`.toLowerCase().indexOf(filter.toLowerCase()) > -1;
	this.getRepresentation = row => this.field ? row[this.field] : this.representedAs(row);
	return this;
});

export default mock;
