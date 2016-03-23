'use strict';

Template.courseView.helpers({
    courseTasks: function () {
        if (this._id) {
            return Colls.Tasks.find({course: this._id});
        }
    },
    canApply: function () {
        var user = UniUsers.getLoggedIn();
        // if not logged in - display button, but there is auto redirect to login/register page
        if (!user) {
            return true;
        }
        // check if student is a course member
        var courses = UniUtils.get(user.findSelf(), 'courses');
        if (courses && courses.indexOf(this._id) !== -1) {
            return false;
        }
        // check if course is not started
        if (moment(new Date(this.startDate)).isAfter(new Date()) &&
            moment(new Date(this.endDate)).isAfter(new Date())) {
            return true;
        }
        return false;
    },
    formatdate: function (date, format) {
        return moment(date).format(format);
    },
    otherCourses: function () {
        return Colls.Courses.find({_id: {$not: this._id}}, {limit: 4});
    },
    isCourseCommunityAdmin: function (id) {
        return !!Roles.userIsInRole(Meteor.userId(), ['community_admin', 'global_admin'], id);
    }
});

Template.courseView.events({
    'click .js-delete-task': function (e) {
        var id = $(e.currentTarget).data('taskid');
        UniUI.areYouSure(e.currentTarget, function () {
            if (typeof id === 'string') {
                Meteor.call('deleteTask', id);
            }
        });
    }
});

Template.courseViewImage.onRendered(function () {
    var data;
    this.autorun(function () {
        data = Template.currentData();
        if (data && data.image) {
            this.subscribe('courseImages', data.image);
        }
    }.bind(this));
});

Template.courseViewImage.helpers({
    courseFileObj: function () {
        var image = this.image;
        if (image) {
            return App.courseImagesCollection.findOne({_id: image});
        }
    }
});

Template.courseViewImageWidget.helpers({
    fileObj: function () {
        var image = this.course.image;
        if (image) {
            return App.courseImagesCollection.findOne({_id: image});
        }
    }
});
