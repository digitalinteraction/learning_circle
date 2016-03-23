'use strict';

/*
 Blog Entity
 */

App.withoutTagsList = ['img', 'p', 'span', 'a', 'em', 'table', 'tbody', 'tr', 'th', 'td', 'br/', 'br', 'b', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7'];
App.clearText = function (text) {
    return UniHTML.purify(text.replace(/\<xml\>.*?\<\/xml\>/gmi, '').replace(/\<style\>.*?\<\/style\>/gmi, '').replace(/<(?:.|\n)*?>/gm, ''), {withoutTags: App.withoutTagsList}).replace(/&nbsp;/g, ' ');
};

var allowedStatuses = [
    'archived', // this means that post was "deleted"
    'draft', // working version, only owner can see it
    'draft-unpublished', // was published but then admin/mentor unpublish it
    'draft-pending', // was draft-unpublished and now owner wants to make it publish again
    'published' // everybody can see it
];

var autocomplete;
if (Meteor.isClient) {
    autocomplete = new AutocompleteUsers();
}

/* global Blog: true */
(Meteor.isClient ? window : global).Blog = new UniCMS.Entity('blog', {
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
        fsCollection: App.blogImagesCollection,
        fsSubName: 'blogImages'
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
    status: UniCMS.component('metadata', {
        schema: {
            optional: true,
            allowedValues: allowedStatuses,
            defaultValue: 'draft'
        }
    }),
    groupId: UniCMS.component('metadata', {
        schema: {
            optional: true,
            denyUpdate: true,
            autoValue: function () {
                if (this.isInsert && this.userId) {
                    // get user group id
                    return 'groupId';
                }
                this.unset();
            }
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
                var blog = Blog.findOne({_id: this.params._id});
                var imageURL;
                var image;

                if (blog) {
                    image = App.projectImagesCollection.findOne(blog.image);
                    if (image) {
                        imageURL = image.url();
                    }
                    SEO.set({
                        /*title: 'Learning Circle — ' + blog.title,*/
                        meta: {
                            'description': blog.brief
                        },
                        og: {
                            'title': blog.title,
                            'description': blog.brief,
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
                headerView: 'blogListingHeader'
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

Blog.allow({
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

Blog.deny({
    update: function (userId, doc, fields, modifier) {
        var newStatus;
        // var currentStatus, newStatus;
        if (_(fields).contains('status')) {
            // currentStatus = doc.status;
            newStatus = modifier.$set.status;

            if (!_(allowedStatuses).contains(newStatus)) {
                // invalid status or modifier
                return true;
            }

            // if (currentStatus === 'draft-unpublished') {
            //     // check if mentor/admin and allow only them
            //     return !Roles.userIsInRole(userId, ['global_admin']);
            // }

            if (userId === doc.ownerId || Roles.userIsInRole(userId, ['global_admin'])) {
                // owner or global mentor/admin, allow him to make the change
                return false;
            }

            //otherwise deny
            return true;

        }
        return false;
    }
});

if (Meteor.isClient) {
    Blog.Search = new SearchSource('blogs', ['title', 'brief'], {
        //keepHistory: 1000 * 60 * 5,
        localSearch: true
    });

    // Prevent from double-posting
    Blog.hooks.insert.beginSubmit = Blog.hooks.update.beginSubmit = function () {
        Session.set('blogIsSubmitting', true);
    };
    Blog.hooks.insert.endSubmit = Blog.hooks.update.endSubmit = function () {
        Session.set('blogIsSubmitting', false);
    };
    Template.registerHelper('blogIsSubmitting', function () {
        return Session.get('blogIsSubmitting') || false;
    });
}
