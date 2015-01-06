import DS from 'ember-data';

var Model =  DS.Model.extend({
    name : DS.attr('string')
});

Model.reopenClass({
    FIXTURES : [
        { id: 1, name: 'Person A' },
        { id: 2, name: 'Person B' }
    ]
});


export default Model;
