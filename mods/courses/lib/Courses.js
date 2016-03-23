'use strict';

var avaibleSessionsSchema = new SimpleSchema({
    sessionId: {
        type: String
    },
    day: {
        type: String,
        allowedValues: ['1', '2', '3', '4', '5', '6', '7']
    },
    hour: {
        type: String
    },
    timezone: {
        type: String
    }
});

// for live testing - only one group avaible
// var avaibleSessionTimes = [{
//     sessionId: Random.hexString(16),
//     day: '4',
//     hour: '20',
//     timezone: 'Europe/Warsaw'
// }];

// for now hardcoded - do not delete
var avaibleSessionTimes = [{
    sessionId: Random.hexString(16),
    day: '4',
    hour: '17',
    timezone: 'America/New_York'
}, {
    sessionId: Random.hexString(16),
    day: '4',
    hour: '18',
    timezone: 'America/New_York'
}, {
    sessionId: Random.hexString(16),
    day: '4',
    hour: '19',
    timezone: 'America/New_York'
}, {
    sessionId: Random.hexString(16),
    day: '4',
    hour: '17',
    timezone: 'Europe/Warsaw'
}, {
    sessionId: Random.hexString(16),
    day: '4',
    hour: '18',
    timezone: 'Europe/Warsaw'
}, {
    sessionId: Random.hexString(16),
    day: '4',
    hour: '19',
    timezone: 'Europe/Warsaw'
}, {
    sessionId: Random.hexString(16),
    day: '4',
    hour: '17',
    timezone: 'Asia/Hong_Kong'
}, {
    sessionId: Random.hexString(16),
    day: '4',
    hour: '18',
    timezone: 'Asia/Hong_Kong'
}, {
    sessionId: Random.hexString(16),
    day: '4',
    hour: '19',
    timezone: 'Asia/Hong_Kong'
}];

var schema = new SimpleSchema({
    title: {
        type: String,
        label: i18n('courses.titleLabel')
    },
    community_id: {
        type: String,
        defaultValue: function () {
            var router = Router.current();
            var communityId = router && router.params && router.params.communityId;

            return communityId;
        },
        autoform: {
            type: 'hidden'
        }
    },
    topic: {
        type: String,
        label: i18n('courses.topicLabel')
    },
    description: {
        type: String,
        label: i18n('courses.descriptionLabel')
    },
    brief: {
        type: String,
        optional: true,
        autoform: {
            type: 'hidden'
        }
    },
    startDate: {
        type: Date,
        label: i18n('courses.startingDateLabel'),
        autoform: {
            type: 'text',
            'class': 'datetimepicker'
        }
    },
    endDate: {
        type: Date,
        label: i18n('courses.endingDateLabel'),
        autoform: {
            type: 'text',
            'class': 'datetimepicker'
        }
    },
    age: {
        type: Object,
        label: i18n('courses.participantAgeFrameLabel')
    },
    'age.min': {
        type: Number
    },
    price: {
        type: Number,
        label: 'Price'
    },
    certification: {
        type: String,
        label: i18n('courses.certificationTypeLabel')
    },
    avaibleSessionTimes: {
        type: [avaibleSessionsSchema],
        optional: true,
        autoValue: function () {
            if (this.isInsert) {
                return avaibleSessionTimes;
            } else if (this.isUpsert) {
                return {$setOnInsert: avaibleSessionTimes};
            }
            this.unset();
        }
    },
    syllabus: {
        type: String,
        optional: true
    },
    image: {
        type: String,
        optional: true,
        label: ' ',
        autoform: {
            type: 'hidden',
            'class': 'js-course-image-id'
        }
    }
});

Colls.Courses = new UniCollection('Courses');
Colls.Courses.Schema = schema;
Colls.Courses.attachSchema(schema);

// default sorting (you can overwrite it in calls)
Colls.Courses.setDefaultSort({startDate: -1});

// init search for courses
// see more: http://matteodem.github.io/meteor-easy-search/
Colls.Courses.initEasySearch(['title', 'description'], {
    'limit': 10,
    'use': 'mongo-db'
});

if (Meteor.isClient) {
    Colls.Courses.addErrorSupportToAllWriteMethods();
}

if (Meteor.isServer) {
    Colls.Courses.allow({
        insert: function (userId) {
            return userId && Roles.userIsInRole(userId, ['global_admin']);
        },
        update: function (userId) {
            return userId && Roles.userIsInRole(userId, ['global_admin']);
        },
        remove: function (userId) {
            return userId && Roles.userIsInRole(userId, ['global_admin']);
        }
    });
}
