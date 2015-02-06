import Ember from 'ember';

var DefaultItem = Ember.Object.extend({
    modelClass : null,
    label : null,
    optionValuePath :'content.id',
    optionLabelPath : 'content.displayName',
    prompt : 'Please Select',
    content : [],
    width: 'col-sm-3'
});

var AbstractControl = Ember.Object.extend({

    content: function() {

        var parentSelection = this.get('parent.selection');
        var modelClass = this.get('modelClass').dasherize();

        if(Ember.none(parentSelection)) {
            return this.get('store').find(modelClass); //This must be the top level item
        } else {
            return parentSelection.get(modelClass.camelize().pluralize());
        }
    }.property('parent.selection').readOnly(),

    selectionInvalid: Ember.computed.none('selection'),
    selectionValid: Ember.computed.not('selectionInvalid'),

    parentInvalid : Ember.computed.none('parent.selection'),
    parentValid : Ember.computed.not('parentInvalid'),

    isFirstControl : Ember.computed.equal('index', 0),
    isLastControl : function() {
        return this.get('index') === (this.get('controls.length') - 1);
    }.property('index'),
    enabled : Ember.computed.or('isFirstControl', 'parentValid'),
    disabled: Ember.computed.not('enabled'),

    parentChanged : function() {
        if(!this.get('isFirstControl')) {
            this.set('selection', null);
        }
    }.observes('parent.selection'),

    selectionChanged : function() {
        var selection = this.get('selection');
        if(this.get('isLastControl')) {
            this.set('finalSelection', selection);
        }
    }.observes('selection')
});

export default Ember.Component.extend({


    //public API
    items : null,
    store : null,
    selection : null,

    //private variables and functions
    controls : null,
    model : null,

    actions : {
        getModels: function(modelClass) {
            return this.get('store').find(modelClass);
        }
    },

    generateControls : function() {
        var self = this;
        var items = this.get('items');
        var controls = [];
        //var selection = this.get('selection');
        
        if(Ember.none(items)) {
        	throw Error('You need to specify an `items` object in your controller');
        }

        this.set('model', Ember.Object.create({}));
        var model = this.get('model');

        //Generate the controls
        items.forEach(function(item, idx) {
            var mergedItem = DefaultItem.create(item);
            var content = mergedItem.get('content');

            //fix label
            if(Ember.none(mergedItem.get('label'))) {
                var currentModelClass = self.get('modelClass');
                mergedItem.set('label', currentModelClass.camelize());
            }

            if (Ember.none(content)) {
                //Content array hard coded
                //TODO ????
            } else {
                var store = self.get('store');

                //check store has been passed
                if(Ember.none(store)) {
                    throw Error('DS.Store instance must be passed via the `store` attribute to this component');
                }

                //Content array via model
                var modelClass = mergedItem.get('modelClass');
                if(Ember.none(modelClass)) {
                    throw Error('No `modelClass` attribute was defined!');
                }
                var camelizedModelClass = modelClass.camelize();


                var SelectControl = AbstractControl.extend({
                    component : self,
                    index : idx,
                    modelClass : modelClass,
                    camelizedModelClass : camelizedModelClass,
                    width: mergedItem.get('width'),
                    label: mergedItem.get('label'),
                    prompt: mergedItem.get('prompt'),
                    optionValuePath: mergedItem.get('optionValuePath'),
                    optionLabelPath: mergedItem.get('optionLabelPath'),
                    parent : function() {
                        var index = this.get('index');
                        return index === 0 ? null : controls[index - 1];
                    }.property('index').readOnly(),
                    controls : controls, //TODO breaks hollywood principal (try to get rid of this)
                    selection: model.get('camelizedModelClass'),
                    store : store,
                    finalSelectionBinding : 'component.selection'
                });

                controls.pushObject(SelectControl.create());
            }
        }, this);

        this.set('controls', controls);

    }.observes('items').on('init')

});
