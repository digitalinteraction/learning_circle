'use strict';
//UniTools.setConfigs({
//    connection: {
//        url: 'http://localhost:3000',
//        token: '7y2389dhoh34534as4ind8013'
//    },
//    diagrams: {
//        collections: {
//            Communities: Colls.Communities.Schema.schema(),
//            Courses: Colls.Courses.Schema.schema(),
//            CourseImages: {},
//            Groups: Colls.Groups.Schema.schema(),
//            Tasks: Colls.Tasks.Schema.schema(),
//            Readings: Colls.Reading.Schema.schema(),
//            Reports: Colls.Reports.Schema.schema(),
//            Blogs: Blog._collection.simpleSchema().schema(),
//            BlogImages: {},
//            Projects: Blog._collection.simpleSchema().schema(),
//            ProjectImages: {},
//            Schedules: Colls.Schedules.Schema.schema(),
//            Sections: Colls.Sections.Schema.schema(),
//            Notifications: UniNotifications.simpleSchema().schema(),
//            Comments: UniComments.Comments.simpleSchema().schema()
//        },
//        relations: [
//            {
//                from: {name: 'Courses', field: '_id'},
//                to: {name: 'Blogs', field: 'courseId'},
//                type: 'Association'
//            },
//            {
//                from: {name: 'Courses', field: '_id'},
//                to: {name: 'Projects', field: 'courseId'},
//                type: 'Association'
//            },
//            {
//                from: {name: 'Blogs', field: 'image'},
//                to: {name: 'BlogImages', field: '_id'},
//                type: 'Association'
//            },
//            {
//                from: {name: 'Projects', field: 'image'},
//                to: {name: 'ProjectImages', field: '_id'},
//                type: 'Association'
//            },
//            {
//                from: {name: 'Courses', field: '_id'},
//                to: {name: 'Sections', field: 'course'},
//                type: 'Association'
//            },
//            {
//                from: {name: 'Courses', field: 'image'},
//                to: {name: 'CourseImages', field: '_id'},
//                type: 'Association'
//            },
//            {
//                from: {name: 'Courses', field: '_id'},
//                to: {name: 'Schedules', field: 'courseId'},
//                type: 'Association'
//            },
//            {
//                from: {name: 'Communities', field: '_id'},
//                to: {name: 'Courses', field: 'community_id'},
//                type: 'Association'
//            },
//            {
//                from: {name: 'Reports', field: 'docId'},
//                to: {name: 'Blogs', field: '_id'},
//                type: 'Association'
//            },
//            {
//                from: {name: 'Reports', field: 'docId'},
//                to: {name: 'Projects', field: '_id'},
//                type: 'Association'
//            },
//            {
//                from: {name: 'Courses', field: '_id'},
//                to: {name: 'Tasks', field: 'course'},
//                type: 'Association'
//            },
//            {
//                from: {name: 'Courses', field: '_id'},
//                to: {name: 'Readings', field: 'courseId'},
//                type: 'Association'
//            },
//            {
//                from: {name: 'Courses', field: '_id'},
//                to: {name: 'Groups', field: 'course'},
//                type: 'Association'
//            },
//            {
//                from: {name: 'Notifications', field: 'entityId'},
//                to: {name: 'Courses', field: '_id'},
//                type: 'Association'
//            },
//            {
//                from: {name: 'Notifications', field: 'entityId'},
//                to: {name: 'Projects', field: '_id'},
//                type: 'Association'
//            },
//            {
//                from: {name: 'Notifications', field: 'entityId'},
//                to: {name: 'Comments', field: '_id'},
//                type: 'Association'
//            },
//            {
//                from: {name: 'Notifications', field: 'entityId'},
//                to: {name: 'Blogs', field: '_id'},
//                type: 'Association'
//            }
//        ]
//    }
//});
