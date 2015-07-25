import DS from 'ember-data';
import Ember from 'ember';

var Model =  DS.Model.extend({
  name : DS.attr('string'),
  subManagers : DS.hasMany('sub-manager', {async : true}),
  displayName : Ember.computed('name', function() {
    return this.get('name');
  })
});

//Model.reopenClass({
//    FIXTURES : [
//        { id: 1, name: 'Manager A' },
//        { id: 2, name: 'Manager B' }
//    ]
//});

export default Model;
