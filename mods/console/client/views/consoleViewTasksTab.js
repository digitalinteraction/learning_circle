'use strict';

Template.consoleViewTasksTab.onRendered(function () {
    var groupId = this.$('.js-choose-group').val();
    var groupLabel = this.$('.js-choose-group').find('option[value="' + groupId + '"]').text();
    if (groupId && groupLabel) {
        Session.set('activeGroupId', groupId);
        Session.set('activeGroupLabel', groupLabel);
    }
    Session.set('studentDashboardWeekStartDate');
    Session.set('studentDashboardWeekEndDate');
});

Template.consoleViewTasksTab.events({
    'change .js-choose-group': function (e) {
        e.preventDefault();
        var groupId = $(e.target).val();
        var groupLabel = $(e.target).find('option[value="' + groupId + '"]').text();
        if (groupId && groupLabel) {
            Session.set('activeGroupId', groupId);
            Session.set('activeGroupLabel', groupLabel);
        }
    },
    'change .js-switch-week': function (e) {
        var dates = $(e.target).val().split('|');
        if (_.isArray(dates)) {
            Session.set('studentDashboardWeekStartDate', dates[0]);
            Session.set('studentDashboardWeekEndDate', dates[1]);
        }
    }
});

Template.consoleViewWeeksInCourse.onRendered(function () {
    var currentCourseId;
    var self = this;
    self.autorun(function () {
        currentCourseId = Session.get('activeCourseId');
        self.subscribe('course', currentCourseId);
    });
});

Template.consoleViewTasksTableCell.helpers({
    getTaskEntityData: function () {
        var parentData = Template.parentData(1);
        var taskType = this.type;
        var taskId = this._id;
        var userId = parentData && parentData._id;
        var blog;
        var project;
        var reading;
        var entityId;
        var entityTitle;
        var entityURL;
        if (userId && taskId && taskType === 'blog') {
            blog = Blog.findOne({ownerId: userId, taskId: taskId});
            entityId = blog && blog._id;
            entityTitle = blog && blog.title;
            entityURL = blog && '/blog/' + blog._id;
        }
        if (userId && taskId && taskType === 'project') {
            project = Project.findOne({ownerId: userId, taskId: taskId});
            entityId = project && project._id;
            entityTitle = project && project.title;
            entityURL = project && '/project/' + project._id;
        }
        if (userId && taskId && taskType === 'reading') {
            reading = Colls.Reading.findOne({ownerId: userId, taskId: taskId});
            entityId = reading && reading._id;
            entityTitle = reading && 'Reading';
            entityURL = undefined;
        }
        return {
            _id: entityId,
            title: entityTitle,
            url: entityURL
        };
    },
    isTaskApproved: function () {
        var parentData = Template.parentData(1);
        var taskId = this._id;
        var taskType = this.type;
        var userId = parentData && parentData._id;
        var isApproved = taskId && userId && Meteor.users.findOne({_id: userId, tasksApproved: taskId});
        var blog, project, reading;
        var isPendingDraft;
        if (userId && taskId && taskType === 'blog') {
            blog = Blog.findOne({ownerId: userId, taskId: taskId});
            isPendingDraft = blog && blog.status;
        }
        if (userId && taskId && taskType === 'project') {
            project = Project.findOne({ownerId: userId, taskId: taskId});
            isPendingDraft = project && project.status;
        }
        if (userId && taskId && taskType === 'reading') {
            reading = Colls.Reading.findOne({ownerId: userId, taskId: taskId});
            isPendingDraft = reading && 'published';
        }
        if (isPendingDraft !== 'draft-pending') {
            return isApproved;
        }
    },
    isTaskRejected: function () {
        var parentData = Template.parentData(1);
        var taskId = this._id;
        var taskType = this.type;
        var userId = parentData && parentData._id;
        var isRejected = taskId && userId && Meteor.users.findOne({_id: userId, tasksRejected: taskId});
        var blog, project, reading;
        var isPendingDraft;
        if (userId && taskId && taskType === 'blog') {
            blog = Blog.findOne({ownerId: userId, taskId: taskId});
            isPendingDraft = blog && blog.status;
        }
        if (userId && taskId && taskType === 'project') {
            project = Project.findOne({ownerId: userId, taskId: taskId});
            isPendingDraft = project && project.status;
        }
        if (userId && taskId && taskType === 'reading') {
            reading = Colls.Reading.findOne({ownerId: userId, taskId: taskId});
            isPendingDraft = reading && 'published';
        }
        if (isPendingDraft !== 'draft-pending') {
            return isRejected;
        }
    }
});

Template.consoleViewTasksTableCell.events({
    'click .js-task-approve': function (e) {
        e.preventDefault();
        var parentData = UniUtils.getParentTemplateInstance('consoleViewTasksTableRow').data;
        var taskId = this._id;
        var userId = parentData && parentData._id;
        if (userId && taskId) {
            Meteor.call('taskApproval', taskId, userId, 'approve');
        }
    },
    'click .js-task-reject': function (e) {
        e.preventDefault();
        var parentData = UniUtils.getParentTemplateInstance('consoleViewTasksTableRow').data;
        var taskId = this._id;
        var userId = parentData && parentData._id;
        if (userId && taskId) {
            Meteor.call('taskApproval', taskId, userId, 'reject');
        }
    },
    'click .js-new-tab': function (e) {
        e.preventDefault();
        var url = $(e.currentTarget).attr('href');
        if (_.isString(url)) {
            window.open(url);
        }
    }
});

Template.registerHelper('getAllGroups', function (setActiveGroup) {
    var currentCourseContextId = Session.get('activeCourseId');
    var groups = Colls.Groups.find({course: currentCourseContextId}, {sort: {title: 1}});
    if (setActiveGroup && !Session.get('activeGroupId')) {
        var fetchGroups = groups.fetch();
        if (fetchGroups.length) {
            Session.set('activeGroupId', fetchGroups[0]._id);
        }
    }
    return groups;
});
