import Ember from 'ember';

export default Ember.Controller.extend({

  //Bootstrap Styling
  bootstrapStyledItems : [{
    label : 'Manager',
    modelClass : 'manager',
    extras : {
      width : 'col-xs-2'
    }
  },
  {
    label : 'Sub Manager',
    modelClass : 'sub-manager',
    extras : {
      width : 'col-xs-2'
    }
  },
  {
    label : 'Employee',
    modelClass : 'employee',
    extras : {
      width : 'col-xs-2'
    }
  },
  {
    label : 'Task',
    modelClass : 'task',
    extras : {
      width : 'col-xs-2'
    }
  },
  {
    label : 'Sub Task',
    modelClass : 'sub-task',
    extras : {
      width : 'col-xs-2'
    }
  }],

  bootstrapStyledResult : null,


  //No Styling
  noStyledItems : [{
      label : 'Manager',
      modelClass : 'manager'
  },
  {
    label : 'Sub Manager',
    modelClass : 'sub-manager'
  },
  {
    label : 'Employee',
    modelClass : 'employee'
  },
  {
    label : 'Task',
    modelClass : 'task'
  },
  {
    label : 'Sub Task',
    modelClass : 'sub-task'
  }],

  noStyledResult : null,

  //emberx Select
  xSelectItems : [{
    label : 'Manager',
    modelClass : 'manager'
  },
    {
      label : 'Sub Manager',
      modelClass : 'sub-manager'
    },
    {
      label : 'Employee',
      modelClass : 'employee'
    },
    {
      label : 'Task',
      modelClass : 'task'
    },
    {
      label : 'Sub Task',
      modelClass : 'sub-task'
    }],

  xSelectResult : null

});
