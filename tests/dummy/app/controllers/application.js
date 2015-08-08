import Ember from 'ember';

export default Ember.Controller.extend({

  //Bootstrap Styling
  items1 :Ember.computed(function() {
    const store = this.store;
    return [{
        content : function(parent) {
          return store.findAll('manager');
        },
        extras : {
          label : 'Manager',
          width : 'col-xs-2'
        }
      },{
        content : function(parent) {
          return store.findAll('sub-manager');
        },
        sort : ['displayName:desc'],
        extras : {
          label : 'Sub Manager (in descending order)',
          width : 'col-xs-2'
        }
      },{
        content : function(parent) {
          return store.findAll('employee');
        },
        extras : {
          label : 'Employee',
          width : 'col-xs-2'
        }
      },{
        content : function(parent) {
          return store.findAll('task');
        },
        extras : {
          label : 'Task',
          width : 'col-xs-2'
        }
      },{
        content : function(parent) {
          return store.findAll('sub-task');
        },
        extras : {
          label : 'Sub Task',
          width : 'col-xs-2'
        }
      }];
  }),

  items1Selection : null,

  //Select X
  items2 : Ember.computed(function() {
    const store = this.store;
    return [{
        content : function(parent) {
          return store.findAll('manager');
        },
        extras : {
          label : 'Manager',
          width : 'col-xs-2'
        },
        selection : store.find('manager', 1)
      },{
        content : function(parent) {
          return store.findAll('sub-manager');
        },
        extras : {
          label : 'Sub Manager',
          width : 'col-xs-2'
        }
      },{
        content : function(parent) {
          return store.findAll('employee');
        },
        extras : {
          label : 'Employee',
          width : 'col-xs-2'
        }
      },{
        content : function(parent) {
          return store.findAll('task');
        },
        extras : {
          label : 'Task',
          width : 'col-xs-2'
        }
      }, {
        content : function(parent) {
          return store.findAll('sub-task');
        },
        extras : {
          label : 'Sub Task',
          width : 'col-xs-2'
        }
      }];
  }),

  items2Selection : null,


  //Preselected items
  items3: [],

  //Bootstrap Styling
  items3Update : Ember.on('init', function() {
    const store = this.store;
    Ember.RSVP.all([
      store.findRecord('manager', 1),
      store.findRecord('sub-manager', 2),
      store.findRecord('employee', 3),
      store.findRecord('task', 4),
      store.findRecord('sub-task', 5)
    ]).then((results) => {
      const items = [{
          content : function(parent) {
            return store.findAll('manager');
          },
          extras : {
            label : 'Manager',
            width : 'col-xs-2'
          },
          selection : results[0]
        },{
          content : function(parent) {
            return store.findAll('sub-manager');
          },
          extras : {
            label : 'Sub Manager',
            width : 'col-xs-2'
          },
          selection : results[1]
        },{
          content : function(parent) {
            return store.findAll('employee');
          },
          extras : {
            label : 'Employee',
            width : 'col-xs-2'
          },
          selection : results[2]
        },{
          content : function(parent) {
            return store.findAll('task');
          },
          extras : {
            label : 'Task',
            width : 'col-xs-2'
          },
          selection : results[3]
        },{
          content : function(parent) {
            return store.findAll('sub-task');
          },
          extras : {
            label : 'Sub Task',
            width : 'col-xs-2'
          },
          selection : results[4]
        }];

      this.set('items3',items);

    });
  }),

  items3Selection : null,

});
