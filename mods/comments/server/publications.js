'use strict';
Meteor.publish('docCommentsUsers', function (docId) {
    check(docId, String);
    var commentsUsersIds = [];
    UniComments.Comments.find({containerId: docId}).forEach(function (comment) {
        if (commentsUsersIds.indexOf(comment.userId) < 0) {
            return commentsUsersIds.push(comment.userId);
        }
    });
    return [
        Meteor.users.find({_id: {$in: commentsUsersIds}}, {
            fields: {
                profile: 1,
                name: 1,
                surname: 1,
                status: 1
            }
        }),
        ProfileAvatar.find({'metadata.owner': {$in: commentsUsersIds}})
    ];
});
