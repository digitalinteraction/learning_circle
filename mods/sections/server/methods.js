'use strict';

App.runSectionsCreation = function (courseId, sectionMax) {
    var groups;
    var i;
    var sectionGroupsArr = [];
    var sectionStudentsArr = [];
    var sectionId;
    var maxGroupsInSection = sectionMax || 20;
    if (_.isString(courseId)) {
        groups = Colls.Groups.find({course: courseId}).fetch();
        while (groups.length) {
            for (i = 0; i < maxGroupsInSection; i++) {
                if (groups[i]) {
                    sectionGroupsArr.push(groups[i]._id);
                    sectionStudentsArr.push(groups[i].users);
                }
            }
            sectionId = Colls.Sections.insert({course: courseId, groups: sectionGroupsArr, users: _.flatten(sectionStudentsArr)});
            Roles.addUsersToRoles(_.flatten(sectionStudentsArr), 'section_student', sectionId);
            sectionGroupsArr = [];
            sectionStudentsArr = [];
            groups.splice(0, maxGroupsInSection);
        }
        console.log('Sections for course id: "' + courseId + '" created!');
    }

};

Meteor.methods({
    // diferentiate countries // 200 students for now
    formStudentsSections: function (courseId) {
        check(courseId, String);
        if (this.userId && Roles.userIsInRole(this.userId, 'global_admin')) {
            App.runSectionsCreation(courseId, 20);
        }
    }
});
