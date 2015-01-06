import DS from 'ember-data';

var Model =  DS.Model.extend({
    name : DS.attr('string')
});

Model.reopenClass({
    FIXTURES : [
        { id: 1, name: 'Manager A' },
        { id: 2, name: 'Manager B' }
    ]
});

export default Model;
