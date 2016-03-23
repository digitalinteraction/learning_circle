'use strict';

/*
 ProjectPost Entity
 */

/* global Project: true */
(Meteor.isClient ? window : global).ProjectPost = new UniCMS.Entity('projectPost', {
    content: UniCMS.component('summernote', {
        schema: {
            label: 'Content',
            optional: false
        },
        summernoteOptions: {
            //airMode: true
            height: 300
        }
    }),
    projectId: UniCMS.component('metadata', {
        schema: {
            type: String
        }
    })
}, {
    docHelpers: {
        canEdit: function (userId) {
            userId = userId || Meteor.userId();
            if (this.ownerId === userId) {
                return true;
            }
            var project = Project.findOne({_id: this.projectId});
            if (project.ownerId === userId) {
                return true;
            }
            return Roles.userIsInRole(userId, ['global_admin']);
        }
    }
});

ProjectPost.allow({
    publish: function () {
        return true;
    },
    insert: function (userId) {
        return !!userId;
    },
    update: function (userId, doc) {
        return doc.canEdit(userId);
    },
    remove: function (userId, doc) {
        return doc.canEdit(userId);
    }
});
