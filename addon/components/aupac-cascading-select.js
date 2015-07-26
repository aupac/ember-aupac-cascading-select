import Ember from 'ember';
import layout from '../templates/components/aupac-cascading-select';

const {computed, observer, isNone} = Ember;

const DefaultItem = Ember.Object.extend({
    optionValuePath :'content.id',
    optionLabelPath : 'content.displayName',
    prompt : 'Please Select',
    content : function() {
      return Ember.A([]);
    },
    extras : {}
});

const AbstractControl = Ember.Object.extend({

    content: computed('parent.selection', function() {
      const parentSelection = this.get('parent.selection');
      const isFirstControl = this.get('index') === 0;
      if(isFirstControl || parentSelection) {
        return this.contentRequest(parentSelection, this.get('store'));
      } else {
        return Ember.A([]);
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
        const selection = this.get('selection');
        if(this.get('isLastControl')) {
            this.get('component').sendAction('action', selection);
        }
    })
});

export default Ember.Component.extend({
  layout: layout,

  //public API
  items : null,

  //private variables and functions
  controls : null,
  model : null,

  generateControls : Ember.on('init', observer('items.length', function() {
      const items = this.get('items');
      const controls = Ember.A([]);

      if(!Array.isArray(items)) {
      	throw Error('You need to specify an "items" object in your controller');
      }

      this.set('model', Ember.Object.create({}));
      const model = this.get('model');

      //Generate the controls
      items.forEach((item, idx) => {
          const mergedItem = DefaultItem.create(item);
          const SelectControl = AbstractControl.extend({
              component : this,
              index : idx,
              extras: mergedItem.get('extras'),
              prompt: mergedItem.get('prompt'),
              optionValuePath: mergedItem.get('optionValuePath'),
              optionLabelPath: mergedItem.get('optionLabelPath'),
              contentRequest : mergedItem.get('content'), //renamed as actual content implementation does some extra stuff
              parent : computed('index', function() {
                  const index = this.get('index');
                  return index === 0 ? null : controls[index - 1];
              }),
              controls : controls, //TODO breaks Hollywood principal (try to get rid of this)
              selection: model.get(`item${idx}`),
              store: this.get('store')
          });

          controls.pushObject(SelectControl.create());
      });

      this.set('controls', controls);
  }))

});
