'use strict';

var schema = new SimpleSchema({
    createdAt: {
        type: Date,
        autoValue: function () {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date()};
            }
            this.unset();
        }
    },
    title: {
        type: String,
        label: i18n('tasks.titleLabel'),
        autoform: {
            type: 'text',
            placeholder: i18n('tasks.titleLabel')
        }
    },
    description: {
        type: String,
        label: i18n('tasks.descriptionLabel'),
        autoform: {
            type: 'textarea',
            placeholder: i18n('tasks.descriptionLabel')
        }
    },
    course: { //id
        type: String
    },
    type: { // blog or project
        type: String,
        label: i18n('tasks.typeLabel'),
        autoform: {
            type: 'select',
            options: {
                'blog': 'Blog',
                'project': 'Project',
                'reading': 'Reading Assignment'
            }
        },
        defaultValue: 'blog'
    },
    deadline: {
        type: Date,
        label: i18n('tasks.deadlineLabel'),
        autoform: {
            type: 'text',
            'class': 'datetimepicker',
            placeholder: i18n('tasks.deadlineLabel')
        }
    }
});

Colls.Tasks = new UniCollection('Tasks');
Colls.Tasks.Schema = schema;
Colls.Tasks.attachSchema(schema);

if (Meteor.isServer) {
    Colls.Tasks.allow({
        insert: function (userId) {
            return userId && Roles.userIsInRole(userId, ['global_admin']);
        },
        update: function (userId, doc) {
            if (userId && Roles.userIsInRole(userId, ['global_admin'])) {
                return true;
            }
            return userId && doc && doc.course && Roles.userIsInRole(userId, ['course_student'], doc.course);
        },
        remove: function (userId) {
            return userId && Roles.userIsInRole(userId, ['global_admin']);
        }
    });
}
