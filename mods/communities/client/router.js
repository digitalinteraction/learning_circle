'use strict';

Router.map(function () {
    this.route('/community/add', {
        name: 'communityAdd'
    });
    this.route('/community/:communityId', {
        name: 'communityView'
    });
    this.route('/community', {
        name: 'communityListing'
    });
    this.route('/community/:communityId/edit', {
        name: 'communityEdit'
    });
});
