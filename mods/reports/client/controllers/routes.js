'use strict';

Router.route('/reportedPosts', {
    name: 'reportedPosts',
    template: 'reportedPosts',
    onBeforeAction: function () {
        // if (!Roles.userIsInRole(Meteor.userId(), ['global_mentor', 'global_admin'])) {
        //     Router.go('/');
        //     return;
        // }
        this.next();
    }
});

Router.route('/reportedProjects', {
    name: 'reportedProjects',
    template: 'reportedProjects',
    onBeforeAction: function () {
        // if (!Roles.userIsInRole(Meteor.userId(), ['global_mentor', 'global_admin'])) {
        //     Router.go('/');
        //     return;
        // }
        this.next();
    }
});
