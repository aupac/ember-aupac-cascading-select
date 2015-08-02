# ember-aupac-cascading-select

Flexible Cascading/Dependent Select for Ember.

![alt tag](https://github.com/aupac/ember-aupac-cascading-select/blob/master/example.jpg)

Demo [here](http://aupac.github.io/ember-aupac-cascading-select/)

## Installation

```
ember install ember-aupac-cascading-select
```

##Usage

###In your controller

####Add an array of models you want to include in your select
```javascript
  items : Ember.computed(function() {
    const store = this.store; //if you need access to the DS.Store use a computed property
    return [{
      content : function(parent) {
        //Here we are using ember-data to return all managers
        return store.findAll('manager');
      },
      extras : {
        //The extras object allows you to pass arbitrary information for use in the template
        label : 'Manager',
        width : 'col-xs-2'
      }
    },
    {
      content : function(parent) {
        //Here we are retrieving a hasMany relationship (subManagers) on a manager (see above) and populating the select with them. 
        return parent.get('subManagers');
      },
      extras : {
        label : 'Sub Manager',
        width : 'col-xs-2'
      }
    },
    {
      //You can override the property on the model used for display in the select, the default is `content.displayName`
      optionLabelPath : 'content.name',
      //You override the default "Please Select" with whatever you like.
      prompt : 'Select an Employee',
      content : function(parent) {
        //You can fine tune you requests how you like 
        return store.query('employee', {
          subManager:parent.get('id'),
          enabled:true
        });
      },
      extras : {
        label : 'Employee',
        width : 'col-xs-2'
      }
    }
  })
  

```

####Each array item can contain the following options:

-    `content` (required) - function that returns the content to display in the dropdown.  The 'parent' item is passed in as an argument.
-    `optionValuePath` (default: 'content') - The ID property on the model
-    `optionLabelPath` (default: 'content.displayName') - The property on the model that you want to display to the user
-    `prompt` (default 'Please Select') - The default selection label
-    `extras` (default - empty object) - An object containing any other information you would like to yield to the component
-    `selection` (default - null) - The initial object to select from the list (**must be a resolved promise**)

All properties above will be available from the |control|

ie. `{{control.extras.width}}` would allow you to access a custom width property.

####In addition to the above there are some automatic properties that are controlled by the component and available in the template.

- `control.selection` - the current selection (will be null if no selection is made).
- `control.disabled` - `true` if the control is disabled.
- `control.enabled` - `true` if the control is enabled.
- `control.isLoading` - `true` when the current controls content is being loaded.
- `control.isFirstControl` - `true` if the current control is the first one in the array.
- `control.isLastControl` - `true` if the current control is the last one in the array.
- `control.index` - the current array index of the control.

###Add the component to your template


- `action`  : (required) - An action that gets executed when the final selection is made.  The value of the selected item is passed as the first argument.
- `items` : (required) - array of item configurations (see above).

```html
<!-- Notice the |control| at the end, each item in your 'items' array will be passed to this variable -->
<!-- Notice the 'action' shorthand '(action (mut selectedItem))', this basically sets up an action to set the selectedItem property without actually needing the action on the controller -->
{{#aupac-cascading-select items=items action=(action (mut selectedItem)) as |control|}}
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

Or using [emberx-select](https://github.com/thefrontside/emberx-select)

```html
      {{#aupac-cascading-select items=selectXitems action=(action (mut finalSelectXSelection)) as |control|}}
          <div class="form-group {{control.extras.width}}">
            {{#if control.isLoading}}
                <i class="fa fa-spinner fa-pulse"></i>
            {{/if}}
              <label>{{control.extras.label}}</label>
            {{x-select action=(action (mut control.selection))
            multiple=false
            content=control.content
              selection=control.selection
            optionValuePath=control.optionValuePath
            optionLabelPath=control.optionLabelPath
            prompt=control.prompt
            disabled=control.disabled
            class="form-control"
            }}
          </div>
      {{/aupac-cascading-select}}
```

###Prepopulating selections
In some cases you may want to pre-populate selections.  This can ba achieved by setting the `selection` property for each element in the array, however, you need to ensure all promises are resolved beforehand.  
Be sure to set the items array after all promises have completed

One way of doing this it to setup

```javascript
  items: [], //in this case we bind to an empty array which will be updated once all promises have resolved.

  itemsUpdate : Ember.on('init', function() {
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
      },
        {
          content : function(parent) {
            return store.findAll('sub-manager');
          },
          extras : {
            label : 'Sub Manager',
            width : 'col-xs-2'
          },
          selection : results[1]
        },
        {
          content : function(parent) {
            return store.findAll('employee');
          },
          extras : {
            label : 'Employee',
            width : 'col-xs-2'
          },
          selection : results[2]
        },
        {
          content : function(parent) {
            return store.findAll('task');
          },
          extras : {
            label : 'Task',
            width : 'col-xs-2'
          },
          selection : results[3]
        },
        {
          content : function(parent) {
            return store.findAll('sub-task');
          },
          extras : {
            label : 'Sub Task',
            width : 'col-xs-2'
          },
          selection : results[4]
        }];

      this.set('items',items); //now that all the promises are resolved we update the items array.
    });
  })

```


## Demo

* `git clone` this repository
* `npm install`
* `bower install`
* `ember server`
* Visit http://localhost:4200/ember-aupac-cascading-select/.
