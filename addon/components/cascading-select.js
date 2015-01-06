import Ember from 'ember';

var DefaultItem = Ember.Object.extend({
    modelClass : null,
    label : '???',
    optionValuePath :'content.id',
    optionLabelPath : 'content.name',
    prompt : 'Please Select',
    content : [],
    width: 'col-sm-3'
});

var AbstractControl = Ember.Object.extend({

    content: function() {
        return this.get('store').find(this.get('modelClass'), this.getParms());
    }.property('parent.selection').readOnly(),

    getParms : function() {
        var parentControls = [];

        var parent = this.get('parent');
        if(!Ember.none(parent)) {
            parentControls.pushObject(parent);
            while(!parent.get('isFirstControl')) {
                parent = parent.get('parent');
                parentControls.pushObject(parent);
            }
        }

        var parms = {};
        parentControls.forEach(function(item, idx, enumerable) {
            parms[item.get('camelizedModelClass')] = item.get('selection');
        });

        return parms;
    },

    selectionInvalid: Ember.computed.none('selection'),
    selectionValid: Ember.computed.not('selectionInvalid'),

    parentInvalid : Ember.computed.none('parent.selection'),
    parentValid : Ember.computed.not('parentInvalid'),

    isFirstControl : Ember.computed.equal('index', 0),
    isLastControl : function() {
        return this.get('index') === (this.get('controls.length') - 1);
    }.property('index'),  //Ember.computed.equal('index', 'controls.length'),
    enabled : Ember.computed.or('isFirstControl', 'parentValid'),
    disabled: Ember.computed.not('enabled'),

    parentChanged : function() {
        if(!this.get('isFirstControl')) {
            this.set('selection', null);
        }
    }.observes('parent.selection')
});

export default Ember.Component.extend({


    //public API
    items : null,
    store : null,
    onComplete : null,

    //private variables and functions
    controls : null,
    model : null,

    actions : {
        getModels: function(modelClass, controlIndex) {
            return this.get('store').find(modelClass);
        }
    },

    generateControls : function() {
        var self = this;
        var items = this.get('items');
        var controls = [];
        
        if(Ember.none(items)) {
        	throw Error('You need to specify an `items` object in your controller');
        }

        this.set('model', Ember.Object.create({}));
        var model = this.get('model');

        //Generate the controls
        items.forEach(function(item, idx, enumerable) {
            var mergedItem = DefaultItem.create(item);
            var content = mergedItem.get('content');

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
                        return index === 0 ? controls[index] : controls[index - 1];
                    }.property('index').readOnly(),
                    controls : controls, //TODO breaks hollywood principal (try to get rid of this)
                    selection: model.get('camelizedModelClass'),
                    store : store
                });

                controls.pushObject(SelectControl.create());
            }
        }, this);

        this.set('controls', controls);

    }.observes('items').on('init'),

    postSuccessAction : function() {
        //TODO This sucks, think of a better way!
        this.get('controls').forEach(function(item, idx, enumerable) {
            if(item.get('isLastControl') && item.get('selectionValid')) {
                this.sendAction('action', item.get('selection'));
            }
        }, this);
    }.observes('controls.@each.selection')

});