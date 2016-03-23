'use strict';

RouteCtrls.CommunityListing = RouteCtrls.Basic.extend({
    headerView: 'communityListingHeader',
    subscriptions: function () {
        return [
            Meteor.subscribe('communities')
        ];
    },
    data: function () {
        return {
            community: Colls.Communities.find({}, {fields: {
                title: 1,
                description: 1,
                startDate: 1,
                endDate: 1,
                image: 1
            }})
        };
    }
});
