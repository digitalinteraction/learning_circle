'use strict';

/*
 Project Entity
 */

var allowedStatuses = [
    'archived', // this means that project was "deleted"
    'draft', // only owners can see the project
    'draft-unpublished', // was published but then admin/mentor unpublish it
    'draft-pending', // was draft-unpublished and now owner wants to make it publish again
    'published' // visible for everyone
];

var autocomplete;
if (Meteor.isClient) {
    autocomplete = new AutocompleteUsers();
}

/* global Project: true */
(Meteor.isClient ? window : global).Project = new UniCMS.Entity('project', {
    title: UniCMS.component('text', {
        schema: {
            label: 'Title',
            optional: false
        }
    }),
    image: UniCMS.component('image', {
        schema: {
            optional: true
        },
        fsCollection: App.projectImagesCollection,
        fsSubName: 'projectImages'
    }),
    brief: UniCMS.component('textarea', {
        schema: {
            label: 'Brief',
            optional: true,
            max: 500
        }
    }),
    content: UniCMS.component('summernote', {
        schema: {
            label: 'Content',
            optional: false
        },
        summernoteOptions: {
            //airMode: true
            height: 300
        },
        events: {
            keyup: function () {
                var args = Array.prototype.slice.call(arguments);
                args.unshift(this);
                autocomplete.summernoteKeyUp.apply(autocomplete, args);
            },
            blur: function () {
                autocomplete.summernoteBlur.call(autocomplete);
            }
        }
    }),
    updateProject: UniCMS.component('textarea', {
        schema: {
            label: 'Update...',
            optional: true
        }
    }),
    status: UniCMS.component('metadata', {
        schema: {
            optional: true,
            allowedValues: allowedStatuses,
            defaultValue: 'draft'
        }
    }),
    '_joiningPolicy_project': UniCMS.component('metadata', {
        schema: {
            defaultValue: UniAnyJoin.TYPE_JOIN_OPEN
        }
    }),
    taskId: UniCMS.component('metadata', {
        schema: {
            optional: true,
            denyUpdate: true
        }
    }),
    courseId: UniCMS.component('metadata', {
        schema: {
            optional: true,
            denyUpdate: true
        }
    }),
    likes: UniCMS.component('metadata', {
        schema: {
            type: [String],
            optional: true
        }
    }),
    public: UniCMS.component('metadata', {
        schema: {
            type: Boolean,
            optional: true
        }
    })
}, {
    dynamicPubSub: false,
    dynamicRouter: {
        controller: {
            headerView: null,
            onAfterAction: function () {
                if (!Meteor.isClient) {
                    return;
                }
                var project = Project.findOne({_id: this.params._id});
                var imageURL;
                var image;

                if (project) {
                    image = App.projectImagesCollection.findOne(project.image);
                    if (image) {
                        imageURL = image.url();
                    }
                    SEO.set({
                        /*title: 'Learning Circle — ' + project.title,*/
                        meta: {
                            'description': project.brief
                        },
                        og: {
                            title: project.title,
                            'description': project.brief,
                            'image': window.location.origin + imageURL
                        }
                    });
                }

                this.render('menuContent', {
                    to: 'layoutSecondMenu'
                });
                Session.set('layoutSecondMenuShow', true);
            }
        },
        listing: {
            controller: {
                headerView: 'projectListingHeader'
            }
        }
    },
    docHelpers: {
        setStatus: function (status) {
            this.update({
                $set: {
                    status: status
                }
            });
        },
        canEdit: function (userId) {
            userId = userId || Meteor.userId();
            if (this.ownerId === userId) {
                return true;
            }
            return Roles.userIsInRole(userId, ['global_admin']);
        },
        canArchive: function (userId) {
            userId = userId || Meteor.userId();
            return Roles.userIsInRole(userId, ['global_admin']);
        },
        canFeatured: function (userId) {
            userId = userId || Meteor.userId();
            return Roles.userIsInRole(userId, ['global_admin', 'community_admin', 'course_mentor'], this.courseId);
        }
    }
});

Project.allow({
    publish: function () {
        return true;
    },
    insert: function (userId) {
        return !!userId;
    },
    update: function (userId, doc, fields) {
        return doc.canEdit(userId) || _(fields).contains('updateProject') && doc.joinIsJoined('project', userId);
    },
    remove: function (userId, doc) {
        return doc.canEdit(userId);
    }
});

Project.deny({
    update: function (userId, doc, fields, modifier) {
        var currentStatus, newStatus;
        if (_(fields).contains('status')) {
            currentStatus = doc.status;
            newStatus = modifier.$set.status;

            if (!_(allowedStatuses).contains(newStatus)) {
                // invalid status or modifier
                return true;
            }

            if (currentStatus === 'draft-unpublished') {
                // check if mentor/admin and allow only them
                return !Roles.userIsInRole(userId, ['global_admin']);
            }

            if ((currentStatus === 'archived' || newStatus === 'archived') && !doc.canArchive(userId)) {
                // cannot archive or un-archive
                return true;
            }

            // no more rules, don't deny
        }
        // // any joined user can update this field
        // if (_(fields).contains('updateProject') && doc.joinIsJoined('project', userId)) {
        //     return false;
        // }
        return false;
    }
});
//UniAnyJoin.TYPE_JOIN_OPEN
Project.getCollection().attachAnyJoin('project');

if (Meteor.isClient) {
    Project.Search = new SearchSource('projects', ['title', 'brief'], {
        //keepHistory: 1000 * 60 * 5,
        localSearch: true
    });

    // Prevent from double-posting
    Project.hooks.insert.beginSubmit = Project.hooks.update.beginSubmit = function () {
        Session.set('projectIsSubmitting', true);
    };
    Project.hooks.insert.endSubmit = Project.hooks.update.endSubmit = function () {
        Session.set('projectIsSubmitting', false);
    };
    Template.registerHelper('projectIsSubmitting', function(){
        return Session.get('projectIsSubmitting') || false;
    });
}
