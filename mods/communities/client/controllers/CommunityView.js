'use strict';

RouteCtrls.CommunityView = RouteCtrls.Basic.extend({
    subscriptions: function () {
        return [
            Meteor.subscribe('community', this.params.communityId),
            Meteor.subscribe('courses')
        ];
    },
    data: function () {
        var communityId = this.params && this.params.communityId;

        return {
            community: Colls.Communities.findOne({_id: communityId}),
            courses: Colls.Courses.find({community_id: communityId}, {fields: {
                title: 1,
                description: 1,
                startDate: 1,
                endDate: 1,
                image: 1,
                community_id: 1
            }})
        };
    }
});
