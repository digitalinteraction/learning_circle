'use strict';

// common schema

App.applyCommonSchema = new SimpleSchema({
    name: {
        type: String,
        label: i18n('apply.firstNameLabel'),
        max: 50,
        autoform: {
            type: 'text',
            placeholder: i18n('apply.firstNameLabel')
        }
    },
    surname: {
        type: String,
        label: i18n('apply.lastNameLabel'),
        max: 50,
        autoform: {
            type: 'text',
            placeholder: i18n('apply.lastNameLabel')
        }
    },
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        label: i18n('apply.emailLabel'),
        autoform: {
            type: 'email',
            placeholder: i18n('apply.emailLabel')
        }
    },
    nationality: {
        type: String,
        label: i18n('apply.nationalityLabel'),
        autoform: {
            type: 'text',
            placeholder: i18n('apply.nationalityLabel')
        }
    },
    country: {
        type: String,
        label: i18n('apply.countryLabel'),
        autoform: {
            type: 'text',
            placeholder: i18n('apply.countryLabel')
        }
    },
    city: {
        type: String,
        label: i18n('apply.cityLabel'),
        autoform: {
            type: 'text',
            placeholder: i18n('apply.cityLabel')
        }
    },
    school: {
        type: String,
        label: i18n('apply.schoolLabel'),
        autoform: {
            type: 'text',
            placeholder: i18n('apply.schoolLabel')
        }
    },
    gender: {
        type: String,
        label: i18n('apply.genderLabel'),
        autoform: {
            type: 'select',
            firstOption: i18n('apply.genderLabel'),
            options: {
                'm': i18n('common.male'),
                'f': i18n('common.female'),
                'n': i18n('common.notDisclosed')
            }
        },
        defaultValue: ''
    },
    birthday: {
        type: Date,
        label: i18n('apply.birthdayLabel'),
        autoform: {
            type: 'text',
            placeholder: i18n('apply.birthdayLabel')
        }
    },
    englishLevel: {
        type: String,
        label: i18n('apply.englishLevelLabelQuestion'),
        autoform: {
            type: 'select',
            firstOption: i18n('apply.englishLevelLabelQuestion'),
            options: {
                '1': '1 (Beginner/Elementary)',
                '2': '2 (Intermediate)',
                '3': '3 (Advanced)',
                '4': '4 (Semi-fluent)',
                '5': '5 (Fluent/native speaker)'
            }
        },
        defaultValue: ''
    },
    terms: {
        type: String,
        label: i18n('apply.termsInfo')
    },
    privacyPolicy: {
        type: String,
        label: i18n('apply.privacyPolicyInfo')
    },
    howDidYouHear: {
        optional: true,
        type: String,
        label: 'How did you hear about this course?',
        autoform: {
            type: 'select',
            firstOption: 'How did you hear about this course?',
            options: {
                'facebook': 'Facebook',
                'twitter': 'Twitter',
                'lerningCircle': 'I have taken a Learning Circle course before',
                'friend': 'A friend/family member recommended it to me',
                'other': 'Other (please specify)'
            }
        },
        defaultValue: ''
    },
    mentorQuestion4Other: {
        type: String,
        optional: true,
        label: 'Please specify',
        autoform: {
            type: 'text'
        }
    }
});

// student schema

App.applyFormSchema = new SimpleSchema([App.applyCommonSchema, {
    courseId: {
        type: String,
        label: i18n('courses.viewTitle'),
        autoform: {
            type: 'text',
            placeholder: i18n('courses.viewTitle')
        }
    },
    whyThisCourse: { // max 500 chars
        type: String,
        label: i18n('apply.courseMotivationQuestion'),
        autoform: {
            type: 'textarea'
        }
    },
    groupProjectIdea: { // max 500 chars
        type: String,
        label: i18n('apply.courseIdeaQuestion'),
        autoform: {
            type: 'textarea'
        }
    },
    coursePaid: {
        type: String,
        label: i18n('apply.haveYouPaidQuestion'),
        optional: true
    },
    groupSessionTime1: {
        type: String,
        label: i18n('apply.groupSessionTime1Label'),
        autoform: { // Pre-populated with 1 hour slots that are between 6-9pm in their time zone on Thursdays and Fridays (defined by city where they will be during the course)
            type: 'select',
            firstOption: i18n('apply.groupSessionTime1Label'),
            options: {
                'test1': 'test1',
                'test2': 'test2',
                'test3': 'test3'
            }
        },
        defaultValue: ''
    },
    groupSessionTime2: {
        type: String,
        label: i18n('apply.groupSessionTime2Label'),
        autoform: { // Pre-populated with 1 hour slots that are between 6-9pm in their time zone on Thursdays and Fridays (defined by city where they will be during the course)
            type: 'select',
            firstOption: i18n('apply.groupSessionTime2Label'),
            options: {
                'test1': 'test1',
                'test2': 'test2',
                'test3': 'test3'
            }
        },
        defaultValue: ''
    },
    groupSessionTime3: {
        type: String,
        label: i18n('apply.groupSessionTime3Label'),
        autoform: { // Pre-populated with 1 hour slots that are between 6-9pm in their time zone on Thursdays and Fridays (defined by city where they will be during the course)
            type: 'select',
            firstOption: i18n('apply.groupSessionTime3Label'),
            options: {
                'test1': 'test1',
                'test2': 'test2',
                'test3': 'test3'
            }
        },
        defaultValue: ''
    }
}]);

// mentor schema

App.applyMentorFormSchema = new SimpleSchema([App.applyCommonSchema, {
    mentorshipCourseId: {
        type: String,
        label: i18n('courses.viewTitle'),
        autoform: {
            type: 'text',
            placeholder: i18n('courses.viewTitle')
        }
    },
    mentorQuestion1: {
        type: String,
        label: i18n('apply.mentorQuestion1'),
        autoform: {
            type: 'textarea'
        }
    },
    mentorQuestion2: {
        type: String,
        label: i18n('apply.mentorQuestion2'),
        autoform: {
            type: 'textarea'
        }
    },
    whatRole: {
        type: String,
        label: i18n('apply.mentorWhatRoleWouldYouLike'),
        autoform: {
            type: 'select',
            options: {
                '1': 'Help us draft the curriculum',
                '2': 'Be an expert lecturer',
                '3': 'Mentor a group of students',
                '4': 'Be a ‘coach’'
            }
        },
        defaultValue: '',
        optional: true
    },
    whatRoleAnswer: {
        type: String,
        optional: true,
        label: 'Please state in which field(s) you would like to be a coach e.g. “social media” “running a business” etc.:',
        autoform: {
            type: 'textarea'
        }
    },
    groupSessionTime1: {
        optional: true,
        type: String,
        label: i18n('apply.groupSessionTime1Label'),
        autoform: { // Pre-populated with 1 hour slots that are between 6-9pm in their time zone on Thursdays and Fridays (defined by city where they will be during the course)
            type: 'select',
            firstOption: i18n('apply.groupSessionTime1Label'),
            options: {
                'test1': 'test1',
                'test2': 'test2',
                'test3': 'test3'
            }
        },
        defaultValue: ''
    },
    groupSessionTime2: {
        optional: true,
        type: String,
        label: i18n('apply.groupSessionTime2Label'),
        autoform: { // Pre-populated with 1 hour slots that are between 6-9pm in their time zone on Thursdays and Fridays (defined by city where they will be during the course)
            type: 'select',
            firstOption: i18n('apply.groupSessionTime2Label'),
            options: {
                'test1': 'test1',
                'test2': 'test2',
                'test3': 'test3'
            }
        },
        defaultValue: ''
    },
    groupSessionTime3: {
        optional: true,
        type: String,
        label: i18n('apply.groupSessionTime3Label'),
        autoform: { // Pre-populated with 1 hour slots that are between 6-9pm in their time zone on Thursdays and Fridays (defined by city where they will be during the course)
            type: 'select',
            firstOption: i18n('apply.groupSessionTime3Label'),
            options: {
                'test1': 'test1',
                'test2': 'test2',
                'test3': 'test3'
            }
        },
        defaultValue: ''
    }
}]);
