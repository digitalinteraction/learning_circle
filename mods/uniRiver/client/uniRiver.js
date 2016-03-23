'use strict';

Template.UniRiverLCActivity.replaces('UniRiverActivity');

Template.UniRiverLCActivity.inheritsHelpersFrom('UniRiverActivity');
Template.UniRiverLCActivity.inheritsEventsFrom('UniRiverActivity');
Template.UniRiverLCActivity.inheritsHooksFrom('UniRiverActivity');

Template.registerHelper('getUserFromId', function (userId) {
    return UniUsers.findOne({_id: userId});
});

Template.registerHelper('commentsCount', function (docId) {
    return UniComments.Comments.find({containerId: docId}).count();
});

Template.registerHelper('getAvatar', function (userId) {
    var uId = userId || this._id;
    var avatar = uId && ProfileAvatar.findOne({'metadata.owner': uId});
    var avatarUrl = avatar && avatar.url({store: 'thumbs'});
    return avatarUrl;
});

Template.registerHelper('uniRiverActivity', function () {
    var start = Session.get('studentDashboardWeekStartDate');
    var end = Session.get('studentDashboardWeekEndDate');
    var query = {createdAt: {}};

    // limit results to selected course
    query['o.courseId'] = Session.get('activeCourseId');

    if (start) {
        // not a activity tab, limit results to this week
        query.createdAt.$gte = new Date(start);
    }
    if (end) {
        // not a activity tab, limit results to this week
        query.createdAt.$lte = new Date(end);
    }

    // pagination limit
    var limit = Session.get('UniRiverPaginationQueryLimit') || 10;

    return {
        query: query,
        options: {
            limit: limit
        }
    };
});

// uni river pagination

Template.registerHelper('isUniRiverLoader', function () {
    return Session.get('UniRiverActivitySpinner');
});

Template.LcRiver.onCreated(function () {
    Session.set('UniRiverPaginationQueryLimit', 3);
});

Template.LcRiver.onRendered(function () {
    var pagesQueryStep = 3;
    var lastScrollTop = 0;
    var limit = 0;
    var st;
    var activitiesCount = 0;
    this.autorun(function () {
        activitiesCount = ReactiveMethod.call('uniRiverActivitiesCount', {
            courseId: circleConcept.getActiveCourse(),
            activeFilter: circleConcept.getFilter()
        });
    });
    this.autorun(function () {
        limit = Session.get('UniRiverPaginationQueryLimit');
    });
    Session.set('UniRiverActivitySpinner', true);
    var loadPage = _.debounce(function () {
        if (activitiesCount && limit < activitiesCount) {
            st = $(window).scrollTop();
            if (st < lastScrollTop) {
                return;
            }
            if (st + $(window).height() > $('.main-content.consoleView').height()) {
                Session.set('UniRiverPaginationQueryLimit', limit + pagesQueryStep);
            }
            lastScrollTop = st;
        } else {
            Session.set('UniRiverActivitySpinner');
        }
    }, 350);
    $(window).on('scroll.uniRiver', loadPage);
});

Template.LcRiver.onDestroyed(function () {
    $(window).off('scroll.uniRiver');
    Session.set('UniRiverActivitySpinner');
});

var subscribeCountComments = function () {
    var template = this;
    this.autorun(function () {
        var docId = template.data._id;
        if (docId) {
            Meteor.subscribe('countComments', docId);
        }
    });
};

Template.UniRiverBlogItem.onCreated(function () {
    var template = this;
    this.autorun(function () {
        var docId = template.data.o._id;
        if (docId) {
            Meteor.subscribe('countComments', docId);
        }
    });
});

Template.UniRiverBlogItem.helpers({
    imageURL: function () {
        var image;
        if (UniUtils.get(this, 'o.image')) {
            image = App.blogImagesCollection.findOne(this.o.image);
            if (image) {
                return image.url();
            }
            return false;
        }
    },
    getActionTypeName: function () {
        switch (this.o.what) {
            case 'update':
                return i18n('river.updated');
            case 'published':
                return i18n('river.published');
            case 'comment':
                return i18n('river.commentedAt');
        }
    }
});

Template.UniRiverProjectItem.onCreated(function () {
    var template = this;
    this.autorun(function () {
        var docId = template.data.o._id;
        if (docId) {
            Meteor.subscribe('countComments', docId);
        }
    });
});

Template.UniRiverProjectItem.helpers({
    imageURL: function () {
        var image;
        if (UniUtils.get(this, 'o.image')) {
            image = App.projectImagesCollection.findOne(this.o.image);
            if (image) {
                return image.url();
            }
        }
    },
    getActionTypeName: function () {
        switch (this.o.what) {
            case 'update':
                return i18n('river.updated');
            case 'published':
                return i18n('river.published');
            case 'commented':
                return i18n('river.commentedAt');
        }
    }
});


var showCommentsEvent = {
    'click .js-show-comments-box': function (e, templ) {
        templ.$('.river-comments-box').toggle();
    },
    'click .js-show-share-box': function (e, templ) {
        templ.$('.river-share-box').toggle();
    }
};


Template.UniRiverBlogItem.events(showCommentsEvent);
Template.UniRiverProjectItem.events(showCommentsEvent);
Template['UniRiverMessage-unconnectedComment'].events({
    'click .js-show-comments-box': function (e, templ) {
        templ.$('.river-comments-box').toggle();
    },
    'click .js-show-share-box': function (e, templ) {
        templ.$('.river-share-box').toggle();
    },
    'click .js-edit-post': function (event, template) {
        var text;
        var postId = Template.instance().data._id;
        if (postId) {
            text = template.$('.post-text textarea[name="post-text"]').get(0).value;
            Meteor.call('uniEditPost', {_id: postId, text: text});
            Session.set('editPostId');
        }
    },
    'click .js-delete-post': function (event) {
        var postId = Template.instance().data._id;
        UniUI.areYouSure(event.currentTarget, function () {
            Meteor.call('uniDeletePost', postId);
        });
    },
    'click .js-edit-post-form': function () {
        var postId = Template.instance().data._id;
        if (postId) {
            Session.set('editPostId', postId);
        }
    }
});
Template.unconnectedCommentEditForm.onRendered(function () {
    this.commentTextarea = this.$('textarea');
    this.summernote = this.commentTextarea.summernote({
        toolbar: [],
        height: 150
    });
});

Template.unconnectedCommentEditForm.onDestroyed(function () {
    this.summernote.summernote('destroy');
});

Template['UniRiverMessage-unconnectedComment'].helpers({
    isEditMode: function () {
        return Session.get('editPostId') === Template.instance().data._id;
    },
    canEdit: function () {
        return Template.instance().data.actor._id === Meteor.userId();
    }
});
Template['UniRiverMessage-taskDeadline'].events(showCommentsEvent);
Template.consoleViewStudentTaskItem.events(showCommentsEvent);
Template.consoleViewScheduleItem.events(showCommentsEvent);
Template.consoleViewLectureScheduleItem.events(showCommentsEvent);

Template['UniRiverMessage-unconnectedComment'].onCreated(subscribeCountComments);
Template['UniRiverMessage-taskDeadline'].onCreated(subscribeCountComments);
Template.consoleViewStudentTaskItem.onCreated(subscribeCountComments);
Template.consoleViewScheduleItem.onCreated(subscribeCountComments);
Template.consoleViewLectureScheduleItem.onCreated(subscribeCountComments);


Template.uniRiverShareBox.events({
    'click .js-share': function (ev) {
        ev.preventDefault();

        var post = this.o;
        var type = $(ev.currentTarget).data('type');
        var params = {};
        var url;
        // TODO This share is only for projects and blogs if You want share another type of Documents please refactore this code.
        var ObjectUrl = (this.action === 'createdBlog') ? Router.path('blogView', {_id: post._id}) : Router.path('projectView', {_id: post._id});
        while (ObjectUrl.charAt(0) === '0') {
            ObjectUrl = ObjectUrl.substr(1);
        }
        ObjectUrl = Meteor.absoluteUrl(ObjectUrl);
        switch (type) {
            case 'facebook':
                url = 'https://www.facebook.com/sharer.php';
                params.u = ObjectUrl;
                break;
            case 'google':
                url = 'https://plus.google.com/share';
                params.url = ObjectUrl;
                break;
            case 'twitter':
                url = 'https://twitter.com/home';
                params.status = post.title;
                break;
            case 'pinterest':
                url = 'https://pinterest.com/pin/create/button/';
                params.url = ObjectUrl;
                params.media = Meteor.absoluteUrl($('.js-share-media').attr('src'));
                params.description = post.title;
                break;
            default:
                console.warn('Invalid sharing type');
                return;
        }

        window.open(url + '?' + $.param(params), 'share-' + type,
            'width=580,height=400,toolbar=0,status=0,location=0,menubar=0,directories=0,scrollbars=0'
        );
    }
});

var parseQueryAndOptions = function (query, options) {
    query = _.isObject(query) ? query : {};
    options = _(options || {}).defaults({
        sort: {
            'o.lastAction': -1,
            createdAt: -1
        }
    });
    query = circleConcept.cleanQuery(query, 'Activities');
    query = circleConcept.getQuery(query, 'Activities');

    return {query: query, options: options};
};

Template.LcRiver.onCreated(function () {
    Session.set('commentAdded');
    Session.set('studentDashboardWeekStartDate');
    Session.set('studentDashboardWeekEndDate');
    this.autorun(function () {
        var data = Blaze.getData();
        var parsed = parseQueryAndOptions(data.query, data.options);
        Meteor.subscribe('classActivity', parsed.query, parsed.options);
    });
});

Template.LcRiver.helpers({
    getActivities: function (query, options) {
        var parsed = parseQueryAndOptions(query, options);
        query = parsed.query;
        options = parsed.options;

        var list = [];
        var lastComment;
        if (Session.get('commentAdded')) {
            lastComment = Session.get('commentAdded');
            UniRiver.Activities.find(query, options).forEach(function (item) {
                if (item._id === lastComment._id) {
                    item.o.lastAction = lastComment.lastAction;
                }
                list.push(item);
            });
            return _.sortBy(list, function (doc) {
                return -doc.o.lastAction;
            });
        }

        return UniRiver.Activities.find(query, options);
    }
});
