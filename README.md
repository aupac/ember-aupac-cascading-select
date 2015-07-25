# Ember-aupac-cascading-select

Cascading/Dependent Select for Ember Data Models.

## Installation

```
ember install ember-aupac-cascading-select
```

##Usage

###In your controller

####Add an array of models you want to include in your select
```javascript
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
    }]

```

####Each item can contain the following options:
```
    modelClass (required) Ember Data model name in dasherized case
    optionValuePath (default: 'content.id') The ID property on the model
    optionLabelPath (default: 'content.displayName') The property on the model that you want to display to the user
    prompt (default 'Please Select') The default selection label
    label (default - camelized version of the model name) The control label
    extras (default - empty object) An object containing any other information you would like to yield to the component
```

All properties above will be available from the |control|

ie. {{control.extras.width}} would allow you to access a custom width property.

###Add the component to your template

```
action  : (required) An action that gets executed when the final selection is made.  The value of the selected item is passed as a parameter.
items : (required) array of item configurations (see above)
store : (required) a reference to a DS.Store to use.
```

```html
<!-- Notice the |control| at the end, each item in your 'items' array will be passed to this variable -->
{{#aupac-cascading-select items=myItems store=store action=(action (mut selectedItem)) as |control|}}
  <!-- In the component block you can create a select element based on your control, here I am using the soon to be removed Ember.Select in Ember2.0.-->
  <!-- If you like, you can use emberx-select or something else -->
  <div>
      <label>{{control.label}}</label>
      {{view "select"
      content=control.content
      selection=control.selection
      optionValuePath=control.optionValuePath
      optionLabelPath=control.optionLabelPath
      prompt=control.prompt
      disabled=control.disabled
  </div>
  }}
{{/aupac-cascading-select}}
``` 

###How are my models configured

Your ember-data models need to have the correct relationships defined.

For example, if you have an employee that has many tasks and you want to first select an employee and then select the task, it might look as follows.

```javascript
//employee
export default DS.Model.extend({
    name : DS.attr('string'),
    tasks : DS.hasMany('task', {async : true}),
    displayName : Ember.computed('name', function() {
      return this.get('name');
    })
});

//task
export default DS.Model.extend({
  name : DS.attr('string'),
  employee : DS.belongsTo('employee')
  displayName : Ember.computed('name', function() {
    return this.get('name');
  })
});
```

###How are requests made?

Requests are made for additional data according to the ember-data Adapter you are using:

Example:

 1. A request is made for all managers on load `this.store.find('manager')`
 2. Select a manager
 3. A request is made to populate the sub-managers `manager.get('subManagers')`
 4. Select a sub-manager
 5. A request is made to populate the employees `subManager.get('employees')`
 6. etc.

The component will automatically make these requests for you.

###Styling
[Twitter Bootstrap](http://getbootstrap.com/) is used for styling by default, however, you can yield the compoent and style as you wish.


## Demo

* `git clone` this repository
* `npm install`
* `bower install`
* `ember server`
* Visit http://localhost:4200.
