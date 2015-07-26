# ember-aupac-cascading-select

Cascading/Dependent Select for Ember.

![alt tag](https://github.com/aupac/ember-aupac-cascading-select/blob/master/example.jpg)


## Installation

```
ember install ember-aupac-cascading-select
```

##Usage

###In your controller

####Add an array of models you want to include in your select
```javascript
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
      return parent.get('subManagers');
    },
    extras : {
      label : 'Sub Manager',
      width : 'col-xs-2'
    }
  },
  {
    content : function(parent, store) {
      return parent.get('employees');
    },
    extras : {
      label : 'Employee',
      width : 'col-xs-2'
    }
  }
```

####Each array item can contain the following options:
```
    content (required) function that returns the content to display in the dropdown.  The 'parent' item is passed in as an argument.
    optionValuePath (default: 'content.id') The ID property on the model
    optionLabelPath (default: 'content.displayName') The property on the model that you want to display to the user
    prompt (default 'Please Select') The default selection label
    extras (default - empty object) An object containing any other information you would like to yield to the component
```

All properties above will be available from the |control|

ie. {{control.extras.width}} would allow you to access a custom width property.

####In addition to the above there are some automatic properties that are controlled by the component and available in the template.

control.disabled - is the control disabled.
control.selection - the current selection (will be null if no selection is made)

###Add the component to your template

```
action  : (required) An action that gets executed when the final selection is made.  The value of the selected item is passed as the first argument.
items : (required) array of item configurations (see above)
store : (optional) if you want to use ember-data to retrieve your models you need to pass a DS.Store through to the component.
```

```html
<!-- Notice the |control| at the end, each item in your 'items' array will be passed to this variable -->
<!-- Notice the 'action' shorthand '(action (mut selectedItem))', this basically sets up an action to set the selectedItem property without actually needing the action on the controller -->
{{#aupac-cascading-select items=myItems store=store action=(action (mut selectedItem)) as |control|}}
  <!-- In the component block you can create a select element based on your control, here I am using the soon to be removed Ember.Select in Ember2.0.-->
  <!-- If you like, you can use emberx-select or something else -->
  <div class="form-group {{control.extras.width}}">
      <label>{{control.extras.label}}</label>
    {{view "select"
    content=control.content
    selection=control.selection
    optionValuePath=control.optionValuePath
    optionLabelPath=control.optionLabelPath
    class = "form-control"
    prompt=control.prompt
    disabled=control.disabled
    }}
  </div>
  }}
{{/aupac-cascading-select}}
``` 

## Demo

* `git clone` this repository
* `npm install`
* `bower install`
* `ember server`
* Visit http://localhost:4200.
