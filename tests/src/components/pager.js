import Vue from 'vue';
// import DatatablePager from '../../../src/vue-datatable-pager.vue';
// import DatatablePagerButton from '../../../src/vue-datatable-pager-button.vue';
import DatatableFactory from '../../../src/classes/factory.js';
import Settings from '../../../src/classes/settings.js';

Vue.use((new DatatableFactory));

// Vue.component('datatable-button', DatatablePagerButton);
//
// DatatablePager.settings = new Settings;
// const Ctor = Vue.extend(DatatablePager);
const DtCtor = Vue.options.components['datatable'];
const Ctor = Vue.options.components['datatable-pager'];

function setupVue(propsData, callback){
    if(!propsData){
        propsData = {};
    }

    window.vim = new DtCtor({propsData: propsData});

    if(typeof callback === 'function'){
        callback(window.vim);
    }

    window.vim.$mount();

    return window.vim;
}

export default () => {
    afterEach(function(){
        if(window.vm){
            window.vm.$destroy(true);
        }

        if(Vue.$datatables.default){
            Vue.$datatables.default = null;
        }
    });

    it('builds base HTML for long type', done => {
        let dt = setupVue({
            data: [{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1}],
            columns: [{'label': 'ID', field: 'id'}]
        });

        let vm = (new Ctor({
            propsData: {}
        })).$mount();

        expect(vm.$el.nodeName).toBe('NAV');
        expect(vm.$el.textContent).toBe('12');
        expect(vm.$el.children.length).toBe(1);
        expect(vm.$el.children[0].nodeName).toBe('UL');
        expect(vm.$el.children[0].children.length).toBe(2);

        vm.type = 'short';

        waitForUpdate(() => {
            expect(vm.$el.nodeName).toBe('NAV');
            expect(vm.$el.textContent).toBe('< 1 >');
            expect(vm.$el.children.length).toBe(1);
            expect(vm.$el.children[0].nodeName).toBe('UL');
            expect(vm.$el.children[0].children.length).toBe(3);

            vm.type = 'abbreviated';
            dt.data = [
                {id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},
                {id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},
                {id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},
                {id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},
                {id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},
                {id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},
                {id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},
                {id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},
                {id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},
                {id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},
            ]
        }).then(() => {
            expect(vm.$el.nodeName).toBe('NAV');
            expect(vm.$el.textContent.trim()).toBe('1 2 3 ... 10');
            expect(vm.$el.children.length).toBe(1);
            expect(vm.$el.children[0].nodeName).toBe('UL');
            expect(vm.$el.children[0].children.length).toBe(5);

            vm.page = 5;
        }).then(() => {
            expect(vm.$el.textContent.trim()).toBe('1 ... 3 4 5 6 7 ... 10');
        }).then(done);
    });

    it('returns the correct pagination class', () => {
        let vm = (new Ctor({
            propsData: {}
        })).$mount();

        expect(vm.pagination_class).toBe('pagination');
    });

    it('returns the correct disabled class', () => {
        let vm = (new Ctor({
            propsData: {}
        })).$mount();

        expect(vm.disabled_class).toBe('disabled');
    });

    it('returns the correct next link classes', () => {
        setupVue({
            data: [{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1}],
            columns: [{'label': 'ID', field: 'id'}]
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
            data: [{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1}],
            columns: [{'label': 'ID', field: 'id'}]
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
        let vm = (new Ctor({
            propsData: {}
        })).$mount();

        expect(vm.next_icon).toBe('&gt;');
    });

    it('returns the correct previous icon', () => {
        let vm = (new Ctor({
            propsData: {}
        })).$mount();

        expect(vm.previous_icon).toBe('&lt;');
    });

    it('returns the correct page class', () => {
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

    it('properly adjusts the selected page when total pages changes', done => {
        let dt = setupVue({
            data: [{id: 4},{id: 4},{id: 4},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1},{id: 1}],
            columns: [{'label': 'ID', field: 'id'}]
        });

        let vm = (new Ctor({
            propsData: {
                page: 5,
                perPage: 2
            }
        })).$mount();

        expect(vm.page).toBe(5);
        let spy = jasmine.createSpy('changeCallback');

        vm.$on('change', spy);

        vm.table_instance.filterBy = '4';

        waitForUpdate(() => {
            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith(2);
        }).then(done);
    });
}
