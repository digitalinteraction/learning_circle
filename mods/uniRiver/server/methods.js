'use strict';

Meteor.methods({
    'uniRiverActivitiesCount': function (object) {
        check(object.courseId, String);
        var query;
        if (this.userId) {
            query = {'o.courseId': object.courseId};
            query = circleConcept.getQuery(query, 'Activities', {
                activeCourseId: object.courseId,
                activeFilter: object.activeFilter
            });
            return UniRiver.Activities.find(query, {fields: {_id: 1}}).count();
        }
    },
    uniEditPost: function (object) {
        check(object._id, String);
        check(object.text, String);
        if (this.userId) {
            return UniRiver.Activities.update({_id: object._id}, {$set: {'o.description': object.text}});
        }
    },
    uniDeletePost: function (postId) {
        check(postId, String);
        if (this.userId) {
            return UniRiver.Activities.remove({_id: postId});
        }
    }
});
