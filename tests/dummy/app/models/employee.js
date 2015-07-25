import DS from 'ember-data';
import Ember from 'ember';

var Model =  DS.Model.extend({
    name : DS.attr('string'),
    subManager : DS.belongsTo('sub-manager'),
    tasks : DS.hasMany('task', {async : true}),
    displayName : Ember.computed('name', function() {
      return this.get('name');
    })
});

//Model.reopenClass({
//    FIXTURES : [
//        { id: 1, name: 'Person A' },
//        { id: 2, name: 'Person B' }
//    ]
//});


export default Model;
