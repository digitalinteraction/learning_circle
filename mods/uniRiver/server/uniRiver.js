'use strict';

var _shouldAddUpdateActivity = function (userId, doc, fieldNames, modifier) {
    var activity;
    try {
        if (!doc.courseId) {
            // not assigned to course
            return false;
        }

        // check if updated field is like or public
        if (_.contains(fieldNames, 'likes') || _.contains(fieldNames, 'public')) {
            return false;
        }

        // check if status is draft
        if (
            (_.contains(fieldNames, 'status') && UniUtils.get(modifier, '$set.status') === 'draft') ||
            UniUtils.get(doc, 'status') === 'draft'
        ) {
            return false;
        }

        // check if new status is published
        if (UniUtils.get(doc, 'status') === 'published') {
            activity = UniRiver.Activities.findOne({'o._id': doc._id});
            if (activity) {
                activity.update({
                    $set: {
                        'o.what': 'update',
                        'o.lastAction': new Date(),
                        'o.brief': doc.brief,
                        'o.image': doc.image,
                        'o.title': doc.title
                    }
                });
            }
        }

        return false;
    } catch (e) {
        console.error(e);
        return false;
    }
};

var _shouldAddPublishActivity = function (userId, doc, fieldNames, modifier) {
    var activity;
    try {
        if (!doc.courseId) {
            // not assigned to course
            return false;
        }

        // check if updated field is like or public
        if (_.contains(fieldNames, 'likes') || _.contains(fieldNames, 'public')) {
            return false;
        }

        // check if status is draft
        if (
            (_.contains(fieldNames, 'status') && UniUtils.get(modifier, '$set.status') === 'draft') ||
            UniUtils.get(doc, 'status') === 'draft'
        ) {
            return false;
        }

        // check if new status is published
        if (UniUtils.get(doc, 'status') === 'published' && this.previous.status === 'draft' && UniUtils.get(modifier, '$set.status') === 'published') {
            activity = UniRiver.Activities.findOne({'o._id': doc._id});
            if (activity) {
                activity.update({
                    $set: {
                        'o.what': 'update',
                        'o.lastAction': new Date(),
                        'o.brief': doc.brief,
                        'o.title': doc.title
                    }
                });
                return false;
            }
            return true;
        }

        return false;
    } catch (e) {
        console.error(e);
        return false;
    }
};

var _shouldAddCreateActivity = function (userId, doc) {
    try {

        if (!doc.courseId) {
            return false;
        }

        if (doc.status !== 'published') {
            return false;
        }

        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};

// =========================================================
// Tasks River
// =========================================================

var riverTasksSchema = new SimpleSchema({
    _id: {
        type: String
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    deadline: {
        type: Date
    },
    type: {
        type: String
    },
    courseId: {
        type: String
    },
    lastAction: {
        type: Date,
        autoValue: function () {
            if (!this.value) {
                return new Date();
            }
        }
    }
});

UniRiver.registerAction('taskDeadline', {
    schema: riverTasksSchema
});

// =========================================================
// Blogs River
// =========================================================

var riverBlogsSchema = new SimpleSchema({
    _id: {
        type: String
    },
    title: {
        type: String
    },
    brief: {
        type: String
    },
    courseId: {
        type: String,
        optional: true
    },
    image: {
        type: String,
        optional: true
    },
    likes: {
        type: [String],
        optional: true
    },
    what: {
        type: String,
        defaultValue: 'published'
    },
    lastAction: {
        type: Date,
        autoValue: function () {
            if (!this.value) {
                return new Date();
            }
        }
    },
    public: {
        type: Boolean,
        optional: true
    }
});

UniRiver.registerAction('createdBlog', {
    schema: riverBlogsSchema
});

UniRiver.registerAction('updatedBlog', {
    schema: riverBlogsSchema
});

UniRiver.registerAction('removedBlog', {
    schema: riverBlogsSchema
});

UniRiver.observeCollection(Blog.getCollection(), {
    insert: {
        action: 'createdBlog',
        predicate: _shouldAddCreateActivity
    },
    update: [{
        action: 'createdBlog',
        predicate: _shouldAddPublishActivity
    }, {
        action: 'updatedBlog',
        predicate: _shouldAddUpdateActivity
    }]
});

// =========================================================
// Projects River
// =========================================================

var riverProjectsSchema = new SimpleSchema({
    _id: {
        type: String
    },
    title: {
        type: String
    },
    brief: {
        type: String
    },
    courseId: {
        type: String,
        optional: true
    },
    image: {
        type: String,
        optional: true
    },
    likes: {
        type: [String],
        optional: true
    },
    what: {
        type: String,
        defaultValue: 'published'
    },
    lastAction: {
        type: Date,
        autoValue: function () {
            if (!this.value) {
                return new Date();
            }
        }
    },
    public: {
        type: Boolean,
        optional: true
    }
});

UniRiver.registerAction('createdProject', {
    schema: riverProjectsSchema
});

UniRiver.registerAction('updatedProject', {
    schema: riverProjectsSchema
});

UniRiver.registerAction('removedProject', {
    schema: riverProjectsSchema
});

UniRiver.observeCollection(Project.getCollection(), {
    insert: {
        action: 'createdProject',
        predicate: _shouldAddCreateActivity
    },
    update: [{
        action: 'createdProject',
        predicate: _shouldAddPublishActivity
    }, {
        action: 'updatedProject',
        predicate: _shouldAddUpdateActivity
    }]
});

// =========================================================
// unconnected comments on River
// =========================================================

var riverCommentsSchema = new SimpleSchema({
    description: {
        type: String
    },
    courseId: {
        type: String
    },
    likes: {
        type: [String],
        optional: true
    },
    lastAction: {
        type: Date,
        autoValue: function () {
            if (!this.value) {
                return new Date();
            }
        }
    }
});

UniRiver.registerAction('unconnectedComment', {
    schema: riverCommentsSchema
});
