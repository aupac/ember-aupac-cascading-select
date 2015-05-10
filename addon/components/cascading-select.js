import Ember from 'ember';

var DefaultItem = Ember.Object.extend({
    modelClass : null, //top level only
    modelClassParams : {}, //top level only
    property : null, //sub item only
    label : null,
    optionValuePath :'content.id',
    optionLabelPath : 'content.displayName',
    prompt : 'Please Select',
    width: 'col-sm-3',
    contentOverride : null
});

var AbstractControl = Ember.Object.extend({

    selectOptions: function() {

        var parentSelection = this.get('parent.selection');
        var content = this.content;

        if(this.get('index') === 0) {
            if(content) {
                return this.content(this);
            } else {
                var modelClass = this.get('modelClass').dasherize();
                var modelClassParams = this.get('modelClassParams');
                return this.get('store').find(modelClass, modelClassParams); //This must be the top level item
            }
        } else if(!Ember.isNone(parentSelection)) {
            if(content) {
                return this.content(this);
            } else {
                var property = this.get('property'); //additional fields can be computed properties or regular properties of the model
                return parentSelection.get(property);
            }
        } else {
            return [];
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

//    finalSelectionChanged : function() {
//        if(this.get('isLastControl')) {
//            //this.set('selection', this.get('finalSelection'));
//
//            // invalidate parent as it will need to regenerate sub-selection based on it,
//            // a better way might be to force the current item to refresh iteself somehow
//            this.set('parent.selection', null);
//        }
//    }.observes('finalSelection')
});

export default Ember.Component.extend({


    //public API
    items : null,
    store : null,
    selection : null,
    renderAgain : null,

    //private variables and functions
    controls : null,
    model : null,

//    selectionChanged : function() {
//        if(this.get('selection') === null) {
//            this.generateControls(); //TODO this is a quickfix, needs to be updated properly
//        }
//    }.observes('selection'),

    onRerenderAgainChanged : function() {
        this.generateControls();
    }.observes('renderAgain'),

    generateControls : function() {
        var self = this;
        var items = this.get('items');
        var controls = [];
        //var selection = this.get('selection');

        if(Ember.isNone(items)) {
        	throw Error('You need to specify an `items` object in your controller');
        }

        this.set('model', Ember.Object.create({}));
        var model = this.get('model');

        //Generate the controls
        items.forEach(function(item, idx) {
            var mergedItem = DefaultItem.extend(item).create();

            //fix label
            if(Ember.isNone(mergedItem.get('label'))) {
                var currentModelClass = self.get('modelClass');
                mergedItem.set('label', currentModelClass.camelize());
            }

            var store = self.get('store');

            //check store has been passed
            if(Ember.isNone(store)) {
                throw Error('DS.Store instance must be passed via the `store` attribute to this component');
            }

            //Content array via model
            var modelClass = mergedItem.get('modelClass');
            if(Ember.isNone(modelClass) && idx === 0) {
                throw Error('No `modelClass` attribute was defined on the top level model!');
            }
            if(!Ember.isNone(modelClass) && idx > 0) {
                throw Error('`modelClass` is not only supported at the top level item not index ' + idx);
            }

            var property = mergedItem.get('property');
            if(!Ember.isNone(property) && idx === 0) {
                throw Error('`property` is only supported for index 0, not index ' + idx);
            }
            if(Ember.isNone(property) && idx > 0) {
                throw Error('No `property` attribute was defined at index ' + idx);
            }

            var SelectControl = AbstractControl.extend({
                component : self,
                index : idx,
                modelClass : modelClass, //This can be merged in automatically ..
                modelClassParams :  mergedItem.get('modelClassParams'),//This can be merged in automatically ..
                content : mergedItem.get('content'),//This can be merged in automatically ..
                property : property, //This can be merged in automatically ..
                width: mergedItem.get('width'), //This can be merged in automatically ..
                label: mergedItem.get('label'),//This can be merged in automatically ..
                prompt: mergedItem.get('prompt'),//This can be merged in automatically ..
                optionValuePath: mergedItem.get('optionValuePath'),//This can be merged in automatically ..
                optionLabelPath: mergedItem.get('optionLabelPath'),//This can be merged in automatically ..
                parent : function() {
                    var index = this.get('index');
                    return index === 0 ? null : controls[index - 1];
                }.property('index').readOnly(),
                controls : controls, //TODO breaks Hollywood principal (try to get rid of this)
                selection: Ember.isNone(modelClass) ?  model.get(property) : model.get(modelClass.camelize()),
                store : store,
                finalSelectionBinding : 'component.selection'
            });

            var selectControl = SelectControl.create();
            controls.pushObject(selectControl);
        }, this);

        this.set('controls', controls);

    }.observes('items').on('init')

});
