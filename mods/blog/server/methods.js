'use strict';

Meteor.methods({
    blogTooglePublic: function (id) {
        check(this.userId, String);
        check(id, String);
        var blog = Blog.getCollection().findOne(id);
        if (blog && Roles.userIsInRole(this.userId, ['global_admin', 'community_admin', 'course_mentor'], blog.courseId)) {
            blog.update({$set: {public: !blog.public}});
        }
    }
});
