import DS from 'ember-data';

var Model =  DS.Model.extend({
    name : DS.attr('string')
});

Model.reopenClass({
    FIXTURES : [
        { id: 1, name: 'Task A' },
        { id: 2, name: 'Task B' }
    ]
});


export default Model;
