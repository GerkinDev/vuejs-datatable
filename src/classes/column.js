import { get } from 'object-path';

class Column {
    constructor(props){
        this.setAlignment(props.align);
        this.label = props.label || '';
        this.field = props.field || null;
        this.representedAs = props.representedAs || null;
        this.component = props.component || null;
        this.interpolate = props.interpolate || false;
        this.headerComponent = props.headerComponent || null;
        this.sortable = this.isSortable(props);
        this.filterable = this.isFilterable(props);
        this.headerClass = props.headerClass || '';
    }

    setAlignment(value){
        if(!value || typeof value !== 'string'){
            this.align = 'left';

            return this;
        }

        if(value.toLowerCase() === 'center'){
            this.align = 'center';

            return this;
        }

        if(value.toLowerCase() === 'right'){
            this.align = 'right';

            return this;
        }

        this.align = 'left';

        return this;
    }

    isFilterable(props){
        if(props.filterable === false){
            return false;
        }

        if(!props.field && !props.representedAs){
            return false;
        }

        if(this.component && !(this.representedAs || this.field)){
            return false;
        }

        return true;
    }

    isSortable(props){
        if(props.sortable === false){
            return false;
        }

        if(!props.field && !props.representedAs){
            return false;
        }

        if(this.component && !(this.representedAs || this.field)){
            return false;
        }

        return true;
    }

    getRepresentation(row) {
        if(this.representedAs && typeof this.representedAs === 'function'){
            return this.representedAs(row);
        }

        if(this.component && this.filterable){
            return this.plain_text_function(row, this);
        }

        return get(row, this.field);
    }

    getValue(row){
        return this.getRepresentation(row);
    }

    matches(row, filter_string) {
        let col_representation = ('' + this.getRepresentation(row) + '').toLowerCase();

        return col_representation.indexOf(filter_string.toLowerCase()) !== -1;
    }
}

export default Column;
