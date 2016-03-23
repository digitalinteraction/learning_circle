'use strict';

RouteCtrls.CommunityAdd = RouteCtrls.Basic.extend({
    headerView: 'communityAddHeader',
    subscriptions: function () {
        return [
            Meteor.subscribe('usersNamesLists')
        ];
    }
});
