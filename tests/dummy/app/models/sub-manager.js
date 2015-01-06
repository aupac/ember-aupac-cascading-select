import DS from 'ember-data';

var Model =  DS.Model.extend({
    name : DS.attr('string')
});

Model.reopenClass({
    FIXTURES : [
        { id: 1, name: 'Sub Manager A' },
        { id: 2, name: 'Sub Manager B' }
    ]
});

export default Model;
