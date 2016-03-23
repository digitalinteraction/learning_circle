'use strict';

var checkTaskState = function (taskId, taskType, currentUserId, s) {
    var state;
    var project;
    var blog;
    if (taskId && currentUserId && taskType === 'blog') {
        blog = Blog.findOne({ownerId: currentUserId, taskId: taskId});
        state = blog && blog.status;
    }
    if (taskId && currentUserId && taskType === 'project') {
        project = Project.findOne({ownerId: currentUserId, taskId: taskId});
        state = project && project.status;
    }
    if (taskId && currentUserId && taskType === 'reading') {
        if (Colls.Reading.find({ownerId: currentUserId, taskId: taskId}).count()) {
            state = 'published';
        }
    }
    return state === s;
};

// can be in task context
Template.registerHelper('isTaskPublished', function (tid, ttype, user) {
    var taskId = tid || this._id;
    var taskType = ttype || this.type;
    var currentUserId = user || Meteor.userId();
    return checkTaskState(taskId, taskType, currentUserId, 'published');
});

Template.registerHelper('isTaskDraft', function (tid, ttype, user) {
    var taskId = tid || this._id;
    var taskType = ttype || this.type;
    var currentUserId = user || Meteor.userId();
    return checkTaskState(taskId, taskType, currentUserId, 'draft');
});

Template.registerHelper('isTaskDraftPending', function (tid, ttype, user) {
    var taskId = tid || this._id;
    var taskType = ttype || this.type;
    var currentUserId = user || Meteor.userId();
    return checkTaskState(taskId, taskType, currentUserId, 'draft-pending');
});

Template.consoleViewStudentTaskItem.helpers({
    taskStartQuery: function () {
        if (this._id) {
            return 'taskId=' + this._id;
        }
    },
    isTaskApproved: function () {
        var currentUser = Meteor.user();
        var tasksApproved;
        var taskId = this._id;
        if (currentUser && taskId) {
            tasksApproved = currentUser.tasksApproved;
            return tasksApproved && tasksApproved.indexOf(taskId) !== -1;
        }
    },
    isTaskRejected: function () {
        var currentUser = Meteor.user();
        var tasksRejected;
        var taskId = this._id;
        if (currentUser && taskId) {
            tasksRejected = currentUser.tasksRejected;
            return tasksRejected && tasksRejected.indexOf(taskId) !== -1;
        }
    },
    taskEntityId: function () {
        var taskId = this._id;
        var taskType = this.type;
        var currentUserId = Meteor.userId();
        var blog;
        var project;
        if (taskId && taskType === 'blog') {
            blog = Blog.findOne({taskId: taskId, ownerId: currentUserId});
            return blog && blog._id;
        }
        if (taskId && taskType === 'project') {
            project = Project.findOne({taskId: taskId, ownerId: currentUserId});
            return project && project._id;
        }
    }
});

Template.consoleViewStudentTaskItem.events({
    'click .js-mark-as-read': function () {
        Meteor.call('markAsRead', this._id, this.course);
    },
    'click .js-blogEdit': function () {
        var currentUserId = Meteor.userId();
        var taskId = this._id;
        var blog = Blog.findOne({taskId: taskId, ownerId: currentUserId});
        if (blog) {
            Router.go('/blog/' + blog._id);
            blog.toggleEditMode();
        }
    },
    'click .js-projectEdit': function () {
        var currentUserId = Meteor.userId();
        var taskId = this._id;
        var project = Project.findOne({taskId: taskId, ownerId: currentUserId});
        if (project) {
            Router.go('/project/' + project._id);
            project.toggleEditMode();
        }
    }
});

Template.consoleViewStudentRiver.helpers({
    isCurrentWeek: function () {
        var now = new Date();
        //var start = Session.get('studentDashboardWeekStartDate');
        var start = false;
        //var end = Session.get('studentDashboardWeekEndDate');
        var end = false;
        if (!start && !end) {
            //activity tab
            return true;
        }
        return (now > new Date(start) && now < new Date(end));
    },
    isPastWeek: function () {
        //var end = Session.get('studentDashboardWeekEndDate');
        var end = false;
        return end && new Date() > new Date(end);
    },
    isFutureWeek: function () {
        //var start = Session.get('studentDashboardWeekStartDate');
        var start = false;
        return start && new Date() < new Date(start);
    }
});

Template.consoleViewStudentRiverSummernote.events({
    'click .js-add-new-river-activity': function (e, template) {
        var $summernote = template.summernote;
        var courseId = Session.get('activeCourseId');
        UniHTML.addNewAllowedTag('iframe', true);
        UniHTML.setNewAllowedAttributes(['class', 'src', 'width', 'height', 'scrolling', 'frameborder', 'allowfullscreen'], 'iframe');
        UniHTML.addNewAllowedTag('div', true);
        var description = $summernote && UniHTML.purify($summernote.summernote('code'));
        if (description && courseId) {
            UniRiver.addActivity('unconnectedComment', {
                description: description,
                courseId: courseId
            });
            $summernote.summernote('code', '');
            ReactiveMethod.invalidateCall('uniRiverActivitiesCount');
        }

        e.preventDefault();
    }
});


var autocomplete = new AutocompleteUsers();

Template.consoleViewStudentRiverSummernote.onRendered(function () {
    this.commentTextarea = this.$('textarea');
    this.summernote = this.commentTextarea.summernote({
        toolbar: [],
        height: 80
    });

    this.summernote.on('summernote.keyup', function () {
        var args = Array.prototype.slice.call(arguments);
        var match;
        var patt;
        var urls;
        var url;
        var contentHTML;
        var genUrl;
        var newContent;
        args.unshift(this);
        autocomplete.summernoteKeyUp.apply(autocomplete, args);
        if ($('.console-view-river .note-editable .embed-link').length === 0 && $('.console-view-river .note-editable .embed').length === 0 && (arguments[1].keyCode === 32 || arguments[1].keyCode === 13)) {
            patt = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig;
            urls = [];
            contentHTML = $('.console-view-river .note-editable')[0].innerHTML;

            while (match = patt.exec(contentHTML)) { //eslint-disable-line no-cond-assign
                urls.push(match[0].replace('&nbsp', ''));
            }

            if (urls[0]) {
                url = (urls[0].indexOf('http://') > -1 || urls[0].indexOf('https://') > -1) ? urls[0] : 'http://' + urls[0];
                genUrl = '<a href="' + url + '" class="embed-link" data-card-type="article-full">Loading...</a>';
                newContent = contentHTML.replace(urls[0], genUrl);
                $('.console-view-river .note-editable').html(newContent);
            }
        }
        if ($('.console-view-river .note-editable .embed-link').length > 0) {
            $.embedly.defaults.key = 'a72093ae70ac4c088631ff7d59038545';
            $('a.embed-link').embedly();
        }
    });

    this.summernote.on('summernote.blur', function () {
        autocomplete.summernoteBlur.call(autocomplete);
    });
});
