import Vue from 'vue';
import DatatablePager from '../../../src/vue-datatable-pager.vue';
import DatatablePagerButton from '../../../src/vue-datatable-pager-button.vue';
import Settings from '../../../src/classes/settings.js';

Vue.component('datatable-button', DatatablePagerButton);

DatatablePager.settings = new Settings;
const Ctor = Vue.extend(DatatablePager);


function setupVue(data){
    window.Vue = Vue;
    window.Vue.$datatables = data || {};
}

export default () => {
    // TODO: figure out how to test this component
    it('builds base HTML for long type', () => {
        pending('Need to figure out how to compile chilren');
    });

    it('returns the correct pagination class', () => {
        setupVue();

        let vm = (new Ctor({
            propsData: {}
        })).$mount();

        expect(vm.pagination_class).toBe('pagination');
    });

    it('returns the correct disabled class', () => {
        setupVue();

        let vm = (new Ctor({
            propsData: {}
        })).$mount();

        expect(vm.disabled_class).toBe('disabled');
    });

    it('returns the correct next link classes', () => {
        setupVue({
            default: {
                total_rows: 15
            }
        });

        let vm = (new Ctor({
            propsData: {}
        })).$mount();

        expect(vm.next_link_classes).toBe('');

        let vm2 = (new Ctor({
            propsData: {
                perPage: 15,
            }
        })).$mount();

        expect(vm2.next_link_classes).toBe('disabled');
    });

    it('returns the correct previous link classes', () => {
        setupVue();

        let vm = (new Ctor({
            propsData: {}
        })).$mount();

        expect(vm.previous_link_classes).toBe('disabled');

        let vm2 = (new Ctor({
            propsData: {
                perPage: 2
            }
        })).$mount();

        expect(vm2.previous_link_classes).toBe('disabled');

        let vm3 = (new Ctor({
            propsData: {
                perPage: 2,
                page: 2
            }
        })).$mount();

        expect(vm3.previous_link_classes).toBe('');
    });

    it('returns the correct total number of pages', () => {
        setupVue({
            default: {
                total_rows: 15
            }
        });

        let vm = (new Ctor({
            propsData: {}
        })).$mount();

        expect(vm.total_pages).toBe(2);

        let vm2 = (new Ctor({
            propsData: {
                perPage: 2,
            }
        })).$mount();

        expect(vm2.total_pages).toBe(8);

        let vm3 = (new Ctor({
            propsData: {
                perPage: 5,
            }
        })).$mount();

        expect(vm3.total_pages).toBe(3);
    });

    it('returns the correct next icon', () => {
        setupVue();

        let vm = (new Ctor({
            propsData: {}
        })).$mount();

        expect(vm.next_icon).toBe('&gt;');
    });

    it('returns the correct previous icon', () => {
        setupVue();

        let vm = (new Ctor({
            propsData: {}
        })).$mount();

        expect(vm.previous_icon).toBe('&lt;');
    });

    it('returns the correct page class', () => {
        setupVue({
            default: {
                total_rows: 15
            }
        });

        let vm = (new Ctor({
            propsData: {
                perPage: 2,
            }
        })).$mount();

        expect(vm.getClassForPage(1)).toBe('active');

        let vm2 = (new Ctor({
            propsData: {
                perPage: 2,
                page: 2,
            }
        })).$mount();

        expect(vm2.getClassForPage(1)).toBe('');
    });

    // TODO: figure out how to test this
    it('properly adjusts the selected page when total pages changes', () => {
        pending('need to figure out how to update the data bindings to test this.');
    });
}
