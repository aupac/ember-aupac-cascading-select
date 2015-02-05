# Ember-aupac-cascading-select

Automatic Cascading/Dependent Select for Ember Data Models.

## Installation

```
npm install --save-dev ember-aupac-cascading-select
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
    modelClass : null, //Ember Data model name
    label : '???', //Default label to display above the control
    optionValuePath :'content.id', //The ID property on the model
    optionLabelPath : 'content.name', //The property on the model that is considered the ID
    prompt : 'Please Select', //The default text to display when no option is selected
    width: 'col-sm-3' //Size of the control on the screen
```

###Add the component to your template

selection  : (required) The binding for the final select element
items : (required) An array of items (see above)
store : (required) A reference to a DS.Store to use.

```html
{{cascading-select items=items selection=subTask store=controller.store }}
``` 

###JSON Requests
Requests for dependent data is made according to ember-data conventions.

1. A request is made for all managers on load `GET /managers`
2. Select the manager with an id of 1
3. A request is made to populate the submanagers `GET /managers/1/subManagers`
4. Select a sub-manager with an id of 2
5. A request is made to populate the employees `GET /subManagers/2/employees`
6. etc.

The component will automatically make these requests for you, just need to make sure you have server mappings for them.

###Styling
[Twitter Bootstrap](http://getbootstrap.com/) is used for styling.


## Demo

* `git clone` this repository
* `npm install`
* `bower install`
* `ember server`
* Visit http://localhost:4200.
