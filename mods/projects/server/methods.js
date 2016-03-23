'use strict';

Meteor.methods({
    projectTooglePublic: function (id) {
        check(this.userId, String);
        check(id, String);
        var project = Project.getCollection().findOne(id);
        if (project && Roles.userIsInRole(this.userId, ['global_admin', 'community_admin', 'course_mentor'], project.courseId)) {
            project.update({$set: {public: !project.public}});
        }
    },
    deleteProjectPost: function (id) {
        check(this.userId, String);
        check(id, String);
        ProjectPost.remove({_id: id});
    }
});
