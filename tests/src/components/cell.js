import Vue from 'vue';
import Column from '../../../src/classes/column.js';
import DatatableCell from '../../../src/vue-datatable-cell.vue';

const Ctor = Vue.extend(DatatableCell);

Vue.component('test-component', {
	template: `
		<span>Test Component</span>
	`,
	props: ['row']
});

export default () => {
    it('displays field', () => {
        const vm = new Ctor({propsData: {
            column: new Column({
                label: 'ID',
                field: 'user.id'
            }),
            row: {
                user: {
                    id: 7
                }
            }
        }}).$mount();

        expect(vm.$el.textContent.trim()).toBe('7');
    });

    it('displays representation', () => {
        const vm = new Ctor({propsData: {
            column: new Column({
                label: 'ID',
                representedAs: function(row){
                    return row.user.first_name + ' ' + row.user.last_name;
                }
            }),
            row: {
                user: {
                    first_name: 'John',
                    last_name: 'Doe'
                }
            }
        }}).$mount();

        expect(vm.$el.textContent.trim()).toBe('John Doe');
    });

    it('gives representation presidence over field', () => {
        const vm = new Ctor({propsData: {
            column: new Column({
                label: 'ID',
				field: 'id',
                representedAs: function(row){
                    return row.user.first_name + ' ' + row.user.last_name;
                }
            }),
            row: {
				id: 5,
                user: {
                    first_name: 'Jack',
                    last_name: 'Doe'
                }
            }
        }}).$mount();

        expect(vm.$el.textContent.trim()).toBe('Jack Doe');
    });

    it('displays component', () => {
        const vm = new Ctor({propsData: {
            column: new Column({
                label: 'ID',
                component: 'test-component'
            }),
            row: {}
        }}).$mount();

        expect(vm.$el.textContent.trim()).toBe('Test Component');
    });

    it('gives component presidence', () => {
        const vm = new Ctor({propsData: {
            column: new Column({
                label: 'ID',
				field: 'id',
				representedAs: function(row){
					return row.user.first_name;
				},
                component: 'test-component'
            }),
            row: {
				id: 6,
				user: {
					first_name: 'Jimmy'
				}
			}
        }}).$mount();

        expect(vm.$el.textContent.trim()).toBe('Test Component');
    });

    it('will show correct alignment', () => {
        const vm_l = new Ctor({propsData: {
            column: new Column({
                label: 'id',
                field: 'id'
            }),
            row: {
                id: 7
            }
        }}).$mount();

        expect(vm_l.$el.style.textAlign).toBe('left');

        const vm_c = new Ctor({propsData: {
            column: new Column({
                label: 'id',
                field: 'id',
                align: 'center'
            }),
            row: {
                id: 7
            }
        }}).$mount();

        expect(vm_c.$el.style.textAlign).toBe('center');

        const vm_r = new Ctor({propsData: {
            column: new Column({
                label: 'id',
                field: 'id',
                align: 'right'
            }),
            row: {
                id: 7
            }
        }}).$mount();

        expect(vm_r.$el.style.textAlign).toBe('right');
    });
}
