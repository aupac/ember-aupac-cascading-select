import DS from 'ember-data';
import config from '../config/environment';

export default DS.FixtureAdapter.extend({
    queryFixtures: function(fixtures, query, type) {
        return fixtures;
    }
});


