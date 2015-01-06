# Ember-aupac-cascading-select

Cascading/Dependent Select for Ember Data Models.

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

####When the final option is selected, the `optionValuePath` will be sent as an action
```javascript
    actions : {
        onComplete : function(modelId) {
            alert('You selected ID: ' + modelId);
        }
    }
```

###Add the component to your template, you need to supply the ember-data store to the component
```html
{{cascading-select items=items action='onComplete' store=controller.store }}
``` 
###Styling
[Twitter Bootstrap](http://getbootstrap.com/) is used for styling.


## Demo

* `git clone` this repository
* `npm install`
* `bower install`
* `ember server`
* Visit http://localhost:4200.
