'use strict';

RouteCtrls.CommunityEdit = RouteCtrls.Basic.extend({
    subscriptions: function () {
        return [
            Meteor.subscribe('community', this.params.communityId),
            Meteor.subscribe('usersNamesLists')
        ];
    },
    data: function () {
        return {
            community: Colls.Communities.findOne({_id: this.params.communityId})
        };
    }
});
