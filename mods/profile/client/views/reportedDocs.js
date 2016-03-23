'use strict';

/* POSTS */

/* reportedPosts */
Template.reportedPosts.onCreated(function () {
    Meteor.subscribe('reports', 'post');
});

Template.reportedPosts.helpers({
    getPostReports: function () {
        return Colls.Reports.find({docType: 'post'});
    }
});

/* reportedPostItem */
Template.reportedPostItem.helpers({
    title: function () {
        var post = Blog.findOne({_id: this.docId});
        return post && post.title;
    }
});

Template.reportedPostItem.events({
    'click .js-report-accept': function (e) {
        e.preventDefault();
        Meteor.call('setReportStatus', this.reportId, 'accepted', this.docId);
        Blog.update({_id: this.docId}, {$set: {status: 'archived'}});
    },
    'click .js-report-resolve': function (e) {
        e.preventDefault();
        Meteor.call('setReportStatus', this.reportId, 'resolved');
    }
});

/* PROJECTS */

/* reportedProjects */
Template.reportedProjects.onCreated(function () {
    Meteor.subscribe('reports', 'project');
});

Template.reportedProjects.helpers({
    getProjectReports: function () {
        return Colls.Reports.find({docType: 'project'});
    }
});

/* reportedProjectItem */
Template.reportedProjectItem.helpers({
    title: function () {
        var project = Project.findOne({_id: this.docId});
        return project && project.title;
    }
});

Template.reportedProjectItem.events({
    'click .js-report-accept': function (e) {
        e.preventDefault();
        Meteor.call('setReportStatus', this.reportId, 'accepted', this.docId);
        Project.update({_id: this.docId}, {$set: {status: 'archived'}});
    },
    'click .js-report-resolve': function (e) {
        e.preventDefault();
        Meteor.call('setReportStatus', this.reportId, 'resolved');
    }
});
