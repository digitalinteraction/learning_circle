'use strict';
uniNotifications.register('commentBlog', {
    templateName: 'notificationCommentItem',
    entityCollectionName: 'Blog',
    relatedUser: function (entity) {
        var relatedUsersIds = [];
        var currentUserId = Meteor.userId();
        UniComments.Comments.find({containerId: entity._id}, {
            sort: {createdAt: -1},
            fields: {containerId: 1, userId: 1}
        }).forEach(function (comment) {
            if (comment.userId !== currentUserId) {
                relatedUsersIds.push(comment.userId);
            }
        });

        if (entity.ownerId !== currentUserId) {
            relatedUsersIds.push(entity.ownerId);
        }
        return _.uniq(relatedUsersIds);
    },
    getURL: function (notification) {
        return Meteor.absoluteUrl('blog/' + notification.entityId);
    }
});

uniNotifications.register('commentProject', {
    templateName: 'notificationCommentItem',
    entityCollectionName: 'Project',
    relatedUser: function (entity) {
        var relatedUsersIds = [];
        var currentUserId = Meteor.userId();
        UniComments.Comments.find({containerId: entity._id}, {
            sort: {createdAt: -1},
            fields: {containerId: 1, userId: 1}
        }).forEach(function (comment) {
            if (comment.userId !== currentUserId) {
                relatedUsersIds.push(comment.userId);
            }
        });

        if (entity.ownerId !== currentUserId) {
            relatedUsersIds.push(entity.ownerId);
        }
        return _.uniq(relatedUsersIds);
    },
    getURL: function (notification) {
        return window.location.origin + '/project/' + notification.entityId;
    }
});

uniNotifications.register('commentPost', {
    templateName: 'notificationCommentPostItem',
    entityCollectionName: 'UniRiver.Activities',
    relatedUser: function (entity) {
        var relatedUsersIds, currentUserId;
        if (entity) {
            relatedUsersIds = [];
            currentUserId = Meteor.userId();
            UniComments.Comments.find({containerId: entity._id}, {
                sort: {createdAt: -1},
                fields: {containerId: 1, userId: 1}
            }).forEach(function (comment) {
                if (comment.userId !== currentUserId) {
                    relatedUsersIds.push(comment.userId);
                }
            });

            if (entity.actor._id !== currentUserId) {
                relatedUsersIds.push(entity.actor._id);
            }
            return _.uniq(relatedUsersIds);
        }
    },
    getURL: function () {
        return window.location.origin + '/class';
    }
});

uniNotifications.register('joinProject', {
    templateName: 'notificationJoinItem',
    entityCollectionName: 'Project',
    relatedUser: function (entity) {
        if (entity.ownerId !== Meteor.userId()) {
            return entity.ownerId;
        }
    },
    getURL: function (notification) {
        return window.location.origin + '/project/' + notification.entityId;
    }
});

uniNotifications.register('archivedProject', {
    templateName: 'notificationArchiveItem',
    entityCollectionName: 'Project',
    relatedUser: function (entity) {
        if (entity.ownerId !== Meteor.userId()) {
            return entity.ownerId;
        }
    },
    getURL: function (notification) {
        return window.location.origin + '/project/' + notification.entityId;
    }
});

uniNotifications.register('archivedBlog', {
    templateName: 'notificationArchiveItem',
    entityCollectionName: 'Blog',
    relatedUser: function (entity) {
        if (entity.ownerId !== Meteor.userId()) {
            return entity.ownerId;
        }
    },
    getURL: function (notification) {
        return window.location.origin + '/blog/' + notification.entityId;
    }
});

uniNotifications.register('mentionsInComment', {
    templateName: 'notificationCommentMentionedItem',
    entityCollectionName: 'UniComments.Comments',
    relatedUser: function (entity) {
        var res = entity.text;
        var match;
        var patt = /<a href="(.*profile[/]+[a-zA-Z0-9]+)"/g;
        var hrefs = [];
        var relatedUsers = [];

        while (match = patt.exec(res)) { //eslint-disable-line no-cond-assign
            hrefs.push(match[1]);
        }

        hrefs.forEach(function (href) {
            var data = href.split('/');
            if (typeof data[4] === 'string') {
                relatedUsers.push(data[4]);
            }
        });
        return relatedUsers;
    },
    getURL: function (notification) {
        var entity = uniNotifications.getEntity(this.entityCollection, notification.entityId);
        if (entity) {
            if (entity.moreInfo.collectionName === 'Blog') {
                return window.location.origin + '/blog/' + entity.containerId;
            }

            if (entity.moreInfo.collectionName === 'Project') {
                return window.location.origin + '/project/' + entity.containerId;
            }

            if (entity.moreInfo.collectionName === 'Activities') {
                return window.location.origin + '/class';
            }
        }
    }
});


uniNotifications.register('mentionsInPost', {
    templateName: 'notificationPostMentionedItem',
    entityCollectionName: 'UniRiver.Activities',
    relatedUser: function (entity) {
        var res = entity.o.description;
        var match;
        var patt = /<a href="(.*profile[/]+[a-zA-Z0-9]+)"/g;
        var hrefs = [];
        var relatedUsers = [];

        while (match = patt.exec(res)) { //eslint-disable-line no-cond-assign
            hrefs.push(match[1]);
        }

        hrefs.forEach(function (href) {
            var data = href.split('/');
            if (typeof data[4] === 'string') {
                relatedUsers.push(data[4]);
            }
        });
        return relatedUsers;
    },
    getURL: function () {
        return window.location.origin + '/class';
    }
});

uniNotifications.register('mentionsInProject', {
    templateName: 'notificationProjectMentionedItem',
    entityCollectionName: 'Project',
    relatedUser: function (entity) {
        var res = entity.content;
        var match;
        var patt = /<a href="(.*profile[/]+[a-zA-Z0-9]+)"/g;
        var hrefs = [];
        var relatedUsers = [];

        while (match = patt.exec(res)) { //eslint-disable-line no-cond-assign
            hrefs.push(match[1]);
        }

        hrefs.forEach(function (href) {
            var data = href.split('/');
            if (typeof data[4] === 'string') {
                relatedUsers.push(data[4]);
            }
        });
        return relatedUsers;
    },
    getURL: function (notification) {
        return window.location.origin + '/project/' + notification.entityId;
    }
});


uniNotifications.register('mentionsInBlog', {
    templateName: 'notificationBlogMentionedItem',
    entityCollectionName: 'Blog',
    relatedUser: function (entity) {
        var res = entity.content;
        var match;
        var patt = /<a href="(.*profile[/]+[a-zA-Z0-9]+)"/g;
        var hrefs = [];
        var relatedUsers = [];

        while (match = patt.exec(res)) { //eslint-disable-line no-cond-assign
            hrefs.push(match[1]);
        }

        hrefs.forEach(function (href) {
            var data = href.split('/');
            if (typeof data[4] === 'string') {
                relatedUsers.push(data[4]);
            }
        });
        return relatedUsers;
    },
    getURL: function (notification) {
        return window.location.origin + '/blog/' + notification.entityId;
    }
});

//uniNotifications.register('commentCourse', {
//    templateName: 'notificationJointItem',
//    entityCollectionName: 'UniComments.Comments',
//    relatedUser: function (entity) {
//        var community = Colls.Communities.findOne({_id: entity.community_id});
//        return community.community_admins;
//    },
//    getURL: function (notification) {
//
//    }
//});

uniNotifications.register('reportedBlog', {
    templateName: 'notificationReportItem',
    entityCollectionName: 'Blog',
    relatedUser: function () {
        var admins = Meteor.users.find({'roles.__global_roles__.0': 'global_admin'}, {fields: {_id: 1}}).fetch();
        return admins[0]._id;
    },
    getURL: function (notification) {
        return window.location.origin + '/blog/' + notification.entityId;
    }
});

uniNotifications.register('reportedProject', {
    templateName: 'notificationReportItem',
    entityCollectionName: 'Project',
    relatedUser: function () {
        var admins = Meteor.users.find({'roles.__global_roles__.0': 'global_admin'}, {fields: {_id: 1}}).fetch();
        return admins[0]._id;
    },
    getURL: function (notification) {
        return window.location.origin + '/project/' + notification.entityId;
    }
});
