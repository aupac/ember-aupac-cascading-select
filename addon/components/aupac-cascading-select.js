import Ember from 'ember';
import layout from '../templates/components/aupac-cascading-select';

const {computed, observer, isNone} = Ember;

const DefaultItem = Ember.Object.extend({
    optionValuePath :'content',
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
        return this.contentRequest(parentSelection);
      } else {
        return Ember.A([]);
      }
    }),

    zeroRecords : computed.equal('content.length', 0),
    isLoading : computed.and('zeroRecords', 'enabled'), //public

    selectionInvalid: computed.none('selection'),
    selectionValid: computed.not('selectionInvalid'),

    parentInvalid : computed.none('parent.selection'),
    parentValid : computed.not('parentInvalid'),

    isFirstControl : computed.equal('index', 0), //public
    isLastControl : computed('index', function() {
        return this.get('index') === (this.get('controls.length') - 1);
    }), //public
    enabled : computed.or('isFirstControl', 'parentValid'), //public
    notEnabled : computed.not('enabled'),
    disabled: computed.or('notEnabled', 'isLoading'), //public

    parentChanged : observer('parent.selection', function() {
        if(!this.get('isFirstControl')) {
          this.set('selection', null);
          this.get('component').sendAction('action', null);
        }
    }),

    selectionChanged : observer('selection', function() {
        const selection = this.get('selection');
        if(this.get('isLastControl')) {
          if(isNone(selection)) {
            this.get('component').sendAction('action', null);
          } else {
            this.get('component').sendAction('action', selection);
          }
        }
    })
});

export default Ember.Component.extend({
  layout: layout,

  //public API
  items : null,

  //private variables and functions
  controls : null,

  generateControls : Ember.on('init', observer('items.length',function() {
      const items = this.get('items');
      const controls = Ember.A([]);

      if(!Array.isArray(items)) {
      	throw Error('You need to specify an "items" array in your controller');
      }

      //Generate the controls
      items.forEach((item, idx) => {
          const mergedItem = DefaultItem.create(item);
          const SelectControl = AbstractControl.extend({
              component : this,
              index : idx, //public
              extras: mergedItem.get('extras'), //public
              prompt: mergedItem.get('prompt'), //public
              optionValuePath: mergedItem.get('optionValuePath'), //public
              optionLabelPath: mergedItem.get('optionLabelPath'), //public
              contentRequest : mergedItem.get('content'), //renamed as actual content implementation does some extra stuff
              parent : computed('index', function() {
                  const index = this.get('index');
                  return index === 0 ? null : controls[index - 1];
              }), //public
              controls : controls, //TODO breaks Hollywood principal (try to get rid of this)
              selection: mergedItem.get('selection') //public
          });

          controls.pushObject(SelectControl.create());
      });

      const lastSelection = controls.get('lastObject.selection');
      if(lastSelection) {
        this.sendAction('action', lastSelection);
      }

      this.set('controls', controls);
  }))

});
