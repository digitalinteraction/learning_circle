'use strict';

Router.map(function () {
    this.route('/course/:courseId/tasks/add', {
        name: 'tasksAdd'
    });
});

Router.map(function () {
    this.route('/course/:courseId/tasks/edit/:_id', {
        name: 'tasksEdit'
    });
});
