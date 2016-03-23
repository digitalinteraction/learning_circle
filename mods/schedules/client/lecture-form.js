'use strict';

AutoForm.hooks({
    insertLectureScheduleForm: {
        formToDoc: function (doc) {
            doc.courseId = Session.get('activeCourseId');
            doc.date = new Date(doc.date);
            doc.lectureType = true;
            return doc;
        }
    },
    updateLectureScheduleForm: {
        formToModifier: function (modifier) {
            var date = UniUtils.get(modifier, '$set.date');

            if (date) {
                UniUtils.set(modifier, '$set.date', new Date(date));
            }

            UniUtils.set(modifier, '$set.courseId', Session.get('activeCourseId'));
            UniUtils.set(modifier, '$set.lectureType', true);

            return modifier;
        },
        docToForm: function (doc) {
            if (doc.date) {
                doc.date = moment(doc.date).format('ll');
            }
            return doc;
        },
        onSuccess: function () {
            Session.set('currentScheduleLectureState', false);
        }
    }
});

Template.schedulesLectureInsertForm.onRendered(function () {
    this.$('.datetimepicker').datetimepicker({
        format: 'llll',
        sideBySide: true,
        useCurrent: false
    });
});

Template.schedulesLectureInsertForm.onDestroyed(function () {
    if (this.lectureDatepicker) {
        this.lectureDatepicker.datetimepicker('destroy');
    }
});

Template.schedulesLectureUpdateForm.onRendered(function () {
    this.lectureDatepicker = this.$('.datetimepicker').datetimepicker({
        format: 'llll',
        sideBySide: true,
        useCurrent: false
    });
});

Template.schedulesLectureUpdateForm.helpers({
    scheduleLecture: function () {
        var currentScheduleLectureId = Session.get('currentScheduleLectureId');
        if (currentScheduleLectureId) {
            return Colls.Schedules.findOne({_id: currentScheduleLectureId});
        }
    }
});

Template.schedulesLectureUpdateForm.onDestroyed(function () {
    if (this.lectureDatepicker) {
        this.lectureDatepicker.datetimepicker('destroy');
    }
});
