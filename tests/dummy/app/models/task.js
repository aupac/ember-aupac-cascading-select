import DS from 'ember-data';
import Ember from 'ember';

var Model =  DS.Model.extend({
  name : DS.attr('string'),
  employee : DS.belongsTo('employee'),
  subTasks : DS.hasMany('sub-task', {async : true}),
  displayName : Ember.computed('name', function() {
    return this.get('name');
  })
});

//Model.reopenClass({
//    FIXTURES : [
//        { id: 1, name: 'Task A' },
//        { id: 2, name: 'Task B' }
//    ]
//});


export default Model;
