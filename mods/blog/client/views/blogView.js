'use strict';

Template.blogView.onCreated(function () {
    var self = this;

    self.isReady = new ReactiveVar(false);
    this.autorun(function () {
        var id = UniUtils.get(Router.current(), 'params._id');
        Meteor.subscribe('BlogPostView', id, function () {
            self.isReady.set(true);
        });
        Meteor.subscribe('reportInformation', id);
    });
});

var getPost = function () {
    var id = UniUtils.get(Router.current(), 'params._id');
    return Blog.findOne(id);
};

Template.blogView.helpers({
    isReady: function () {
        return Template.instance().isReady.get();
    },
    post: getPost
});
Template.blogView.events({
    'click .js-post-set-status': function (ev) {
        var el = ev.currentTarget;
        var status;
        var id;
        var post = getPost();
        if (post) {
            status = $(ev.currentTarget).data('status');
            id = UniUtils.get(Router.current(), 'params._id');

            if (status === 'archived') {
                UniUI.areYouSure(el, function () {
                    Blog.update({_id: id}, {$set: {status: status}});
                    Meteor.call('setReportStatus', undefined, 'accepted', id);
                    if (post.editMode) {
                        post.toggleEditMode();
                    }
                });
            } else {
                Blog.update({_id: id}, {$set: {status: status}});
                post.toggleEditMode();
                if (status === 'published' && post.taskId) {
                    Meteor.call('taskApprovalClear', post.taskId);
                }
            }
        }
    },
    'click .js-post-toggle-public': function () {
        var id = UniUtils.get(Router.current(), 'params._id');
        if (id) {
            Meteor.call('blogTooglePublic', id);
        }
    },
    'click .js-post-toggle-mode': function () {
        var post = getPost();
        if (post) {
            post.toggleEditMode();
        }
    },
    'click .js-post-save': function (e, t) {
        var post = getPost();
        var formId;
        if (post) {
            formId = Blog.getUpdateFormId(post._id);
            t.$('#' + formId).submit();
            //post.toggleEditMode();
            if (post.taskId) {
                Meteor.call('taskApprovalClear', post.taskId);
            }
        }
    },
    'click .js-post-report': function () {
        var post = getPost(), data;
        if (post) {
            data = {
                userId: Meteor.userId,
                docId: post._id,
                docOriginalStatus: post.status,
                docType: 'post',
                status: 'reported'
            };
            UniUI.openModal('reportModal', data);
        }
    },
    'click .js-post-delete': function (ev) {
        var el = ev.currentTarget;
        var post = getPost();
        UniUI.areYouSure(el, function () {
            setTimeout(function () {
                Router.go('/blog');
                if (post) {
                    Blog.getCollection().remove({_id: post._id});
                }
            }, 100);
        });
    },
    'click .js-share': function (ev) {
        ev.preventDefault();

        var post = getPost();
        var type = $(ev.currentTarget).data('type');
        var params = {};
        var url;

        switch (type) {
            case 'facebook':
                url = 'https://www.facebook.com/sharer.php';
                params.u = window.location.href;
                break;
            case 'google':
                url = 'https://plus.google.com/share';
                params.url = window.location.href;
                break;
            case 'twitter':
                url = 'https://twitter.com/home';
                params.status = post.title;
                break;
            case 'pinterest':
                url = 'https://pinterest.com/pin/create/button/';
                params.url = window.location.href;
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
