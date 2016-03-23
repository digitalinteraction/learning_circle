'use strict';

var schema = new SimpleSchema({
    title: {
        type: String,
        label: i18n('community.titleLabel')
    },
    description: {
        type: String,
        label: i18n('community.descriptionLabel'),
        optional: true
    },
    image: {
        type: String,
        optional: true,
        label: ' ',
        autoform: {
            type: 'hidden',
            'class': 'js-community-image-id'
        }
    },
    community_admins: {
        type: [String],
        optional: true,
        autoform: {
            type: 'universe-select',
            options: function () {
                return _getUsersOptions();
            },
            multiple: true
        }
    }
});

Colls.Communities = new UniCollection('Communities');
Colls.Communities.Schema = schema;
Colls.Communities.attachSchema(schema);

// default sorting (you can overwrite it in calls)
Colls.Communities.setDefaultSort({startDate: -1});

// init search for community
// see more: http://matteodem.github.io/meteor-easy-search/
Colls.Communities.initEasySearch(['title', 'description'], {
    'limit': 10,
    'use': 'mongo-db'
});

if (Meteor.isClient) {
    Colls.Communities.addErrorSupportToAllWriteMethods();
}

if (Meteor.isServer) {
    Colls.Communities.allow({
        insert: function (userId, doc) {
            if (!userId) {
                return false;
            }
            if (Roles.userIsInRole(userId, ['global_admin'])) {
                return true;
            }
            if (Roles.userIsInRole(userId, 'community_admin', doc._id)) {
                return true;
            }
            return false;
        },
        update: function (userId, doc) {
            if (!userId) {
                return false;
            }
            if (Roles.userIsInRole(userId, ['global_admin'])) {
                return true;
            }
            if (Roles.userIsInRole(userId, 'community_admin', doc._id)) {
                return true;
            }
            return false;
        },
        remove: function (userId, doc) {
            if (!userId) {
                return false;
            }
            if (Roles.userIsInRole(userId, ['global_admin'])) {
                return true;
            }
            if (Roles.userIsInRole(userId, 'community_admin', doc._id)) {
                return true;
            }
            return false;
        }
    });
}

var _getUsersOptions = function () {
    var options = [];
    Meteor.users.find({}, {sort: {name: 1, surname: 1}}).forEach(function (user) {
        options.push({
            value: user._id,
            label: user.name + ' ' + user.surname
        });
    });

    return options;
};
