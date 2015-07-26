import Ember from 'ember';

export default Ember.Controller.extend({

  //Bootstrap Styling
  items : [{
    content : function(parent, store) {
      return store.findAll('manager');
    },
    extras : {
      label : 'Manager',
      width : 'col-xs-2'
    }
  },
  {
    content : function(parent, store) {
      return store.findAll('sub-manager');
    },
    extras : {
      label : 'Sub Manager',
      width : 'col-xs-2'
    }
  },
  {
    content : function(parent, store) {
      return store.findAll('employee');
    },
    extras : {
      label : 'Employee',
      width : 'col-xs-2'
    }
  },
  {
    content : function(parent, store) {
      return store.findAll('task');
    },
    extras : {
      label : 'Task',
      width : 'col-xs-2'
    }
  },
  {
    content : function(parent, store) {
      return store.findAll('sub-task');
    },
    extras : {
      label : 'Sub Task',
      width : 'col-xs-2'
    }
  }],

  finalSelection : null,

});
