'use strict';

Router.map(function () {
    this.route('/resources', {
        name: 'resourcesListing'
    });
    this.route('/resources/view/:_id?', {
        name: 'resourcesView'
    });
});
