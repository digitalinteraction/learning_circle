'use strict';

Template.getUserProjects.onCreated(function () {
    check(this.data, {
        userId: String
    });
    this.subscribe('ProjectUserProfile', this.data.userId);
});
Template.getUserProjects.helpers({
    projects: function () {
        return Project.find({ownerId: this.userId});
    }
});
