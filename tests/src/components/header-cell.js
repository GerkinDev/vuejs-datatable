import Vue from 'vue';
import Column from '../../../src/classes/column.js';
import Settings from '../../../src/classes/settings.js';
import DatatableHeader from '../../../src/vue-datatable-header.vue';

const Ctor = Vue.extend(DatatableHeader);

const settings = new Settings;

export default () => {
    it('builds expected base html', () => {
        const vm = new Ctor({propsData: {
            column: new Column({
                label: 'Column Label'
            }),
            settings: settings
        }}).$mount();

        expect(vm.$el.style.textAlign).toBe('left');
        expect(vm.$el.textContent.trim()).toBe('Column Label');
        expect(vm.$el.children.length).toBe(0);
    });

    it('can change text alignment', () => {
        const vm_c = new Ctor({propsData: {
            column: new Column({
                label: 'Column Label',
                align: 'center'
            }),
            settings: settings
        }}).$mount();

        expect(vm_c.$el.style.textAlign).toBe('center');

        const vm_r = new Ctor({propsData: {
            column: new Column({
                label: 'Column Label',
                align: 'right'
            }),
            settings: settings
        }}).$mount();

        expect(vm_r.$el.style.textAlign).toBe('right');
    });

    it('will hide non-sortability', () => {
        const vm = new Ctor({propsData: {
            column: new Column({
                label: 'Column Label',
            }),
            settings: settings
        }}).$mount();

        expect(vm.$el.children.length).toBe(0);

        const vm2 = new Ctor({propsData: {
            column: new Column({
                label: 'Column Label',
                representedAs: function(){ return ''; },
                sortable: false
            }),
            settings: settings
        }}).$mount();

        expect(vm2.$el.children.length).toBe(0);
    });

    it('will display sortability', () => {
        const vm = new Ctor({propsData: {
            column: new Column({
                label: 'Column Label',
                representedAs: function(){ return ''; },
            }),
            settings: settings
        }}).$mount();

        expect(vm.$el.children.length).toBe(1);
        expect(vm.$el.children[0].nodeName).toBe('SPAN');
        expect(vm.$el.children[0].className).toBe('sort glyphicon glyphicon-sort');
    });

    it('will use correct classes for sort display', () => {
        const vm = new Ctor({propsData: {
            column: new Column({
                label: 'Column Label',
                representedAs: function(){ return ''; },
            }),
            settings: settings
        }}).$mount();

        expect(vm.canSort).toBe(true);
        expect(vm.is_sorted).toBe(false);
        expect(vm.is_sorted_ascending).toBe(false);
        expect(vm.is_sorted_descending).toBe(false);
        expect(vm.classes).toBe('sort glyphicon glyphicon-sort');

        vm.direction = 'asc';
        expect(vm.canSort).toBe(true);
        expect(vm.is_sorted).toBe(true);
        expect(vm.is_sorted_ascending).toBe(true);
        expect(vm.is_sorted_descending).toBe(false);
        expect(vm.classes).toBe('sort glyphicon glyphicon-sort-by-alphabet');

        vm.direction = 'desc';
        expect(vm.canSort).toBe(true);
        expect(vm.is_sorted).toBe(true);
        expect(vm.is_sorted_ascending).toBe(false);
        expect(vm.is_sorted_descending).toBe(true);
        expect(vm.classes).toBe('sort glyphicon glyphicon-sort-by-alphabet-alt');

        vm.direction = null;
        expect(vm.canSort).toBe(true);
        expect(vm.is_sorted).toBe(false);
        expect(vm.is_sorted_ascending).toBe(false);
        expect(vm.is_sorted_descending).toBe(false);
        expect(vm.classes).toBe('sort glyphicon glyphicon-sort');
    });
}
