import Ember from 'ember';

export default Ember.Controller.extend({

    items : [{
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

    subTask : null

});
