import Ember from 'ember';
import layout from '../templates/components/aupac-cascading-select';

const {computed, observer, isNone} = Ember;

const DefaultItem = Ember.Object.extend({
    modelClass : null,
    label : null,
    optionValuePath :'content.id',
    optionLabelPath : 'content.displayName',
    prompt : 'Please Select',
    content : Ember.A([]),
    extras : {}
});

const AbstractControl = Ember.Object.extend({

    content: computed('parent.selection', function() {

        let parentSelection = this.get('parent.selection');
        let modelClass = Ember.String.dasherize(this.get('modelClass'));

        if(isNone(parentSelection)) {
            return this.get('store').find(modelClass); //This must be the top level item
        } else {
          //TODO user should be able to override this default as the assumptions here may not be correct
          let camelizedName = Ember.String.camelize(modelClass);
          let pluralizedName = Ember.String.pluralize(camelizedName);
          return parentSelection.get(pluralizedName);
        }
    }),

    selectionInvalid: computed.none('selection'),
    selectionValid: computed.not('selectionInvalid'),

    parentInvalid : computed.none('parent.selection'),
    parentValid : computed.not('parentInvalid'),

    isFirstControl : computed.equal('index', 0),
    isLastControl : computed('index', function() {
        return this.get('index') === (this.get('controls.length') - 1);
    }),
    enabled : computed.or('isFirstControl', 'parentValid'),
    disabled: computed.not('enabled'),

    parentChanged : observer('parent.selection', function() {
        if(!this.get('isFirstControl')) {
            this.set('selection', null);
        }
    }),

    selectionChanged : observer('selection', function() {
        let selection = this.get('selection');
        if(this.get('isLastControl')) {
            this.get('component').sendAction('action', selection);
        }
    })
});

export default Ember.Component.extend({
  layout: layout,

  //public API
  items : null,
  store : null,

  //private variables and functions
  controls : null,
  model : null,

  init : function() {
	    this._super.apply(this, arguments);
	    this.generateControls();
  },

  generateControls : observer('items.length', function() {
      let items = this.get('items');
      let controls = Ember.A([]);

      if(isNone(items)) {
      	throw Error('You need to specify an `items` object in your controller');
      }

      this.set('model', Ember.Object.create({}));
      let model = this.get('model');

      //Generate the controls
      items.forEach((item, idx) => {
          let mergedItem = DefaultItem.create(item);
          let content = mergedItem.get('content');

          //fix label
          if(isNone(mergedItem.get('label'))) {
              let currentModelClass = this.get('modelClass');
              mergedItem.set('label', Ember.String.camelize(currentModelClass));
          }

          let store = this.get('store');

          //check store has been passed
          if(isNone(store)) {
              throw Error('DS.Store instance must be passed via the `store` attribute to this component');
          }

          //Content array via model
          let modelClass = mergedItem.get('modelClass');
          if(isNone(modelClass)) {
              throw Error(`No "modelClass" attribute was defined at array index ${idx}!`);
          }
          let camelizedModelClass = Ember.String.camelize(modelClass);

          let SelectControl = AbstractControl.extend({
              component : this,
              index : idx,
              modelClass : modelClass,
              camelizedModelClass : camelizedModelClass,
              extras: mergedItem.get('extras'),
              label: mergedItem.get('label'),
              prompt: mergedItem.get('prompt'),
              optionValuePath: mergedItem.get('optionValuePath'),
              optionLabelPath: mergedItem.get('optionLabelPath'),
              parent : computed('index', function() {
                  let index = this.get('index');
                  return index === 0 ? null : controls[index - 1];
              }),
              controls : controls, //TODO breaks Hollywood principal (try to get rid of this)
              selection: model.get('camelizedModelClass'),
              store : store
          });

          controls.pushObject(SelectControl.create());
      });

      this.set('controls', controls);
  })

});
