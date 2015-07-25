import DS from 'ember-data';
import Ember from 'ember';

var Model =  DS.Model.extend({
  name : DS.attr('string'),
  task : DS.belongsTo('task'),
  displayName : Ember.computed('name', function() {
    return this.get('name');
  })
});

//Model.reopenClass({
//    FIXTURES : [
//        { id: 1, name: 'Sub Task A' },
//        { id: 2, name: 'Sub Task B' }
//    ]
//});


export default Model;
