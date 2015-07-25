import DS from 'ember-data';
import Ember from 'ember';

var Model =  DS.Model.extend({
  name : DS.attr('string'),
  manager : DS.belongsTo('manager'),
  employees : DS.hasMany('employee', {async : true}),
  displayName : Ember.computed('name', function() {
    return this.get('name');
  })
});

//Model.reopenClass({
//    FIXTURES : [
//        { id: 1, name: 'Sub Manager A' },
//        { id: 2, name: 'Sub Manager B' }
//    ]
//});

export default Model;
