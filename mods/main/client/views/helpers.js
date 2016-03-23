'use strict';

// time - moment helpers

Template.registerHelper('startsIn', function (startDate, range) {
    var momentValue;
    if (moment && startDate && range) {
        // http://momentjs.com/docs/#/displaying/difference/
        momentValue = moment(startDate).diff(moment(), range);
        if (momentValue < 0) {
            return false;
        }
        return momentValue;
    }
});

Template.registerHelper('formatDate', function (date, format) {
    if (date && format) {
        return moment(date).format(format);
    }
});

// returns particular date/day (in current timezone) in the week from which is date
// day values string : 1-7
// hour values string : 1-24
// timezone string like 'Europe/Warsaw'
// calculation of the hour in the day in other timezones
// rerurns day and time dddd HH:mm
// date - optional
// format - optional (returned moment format)

App.calcTzSessionsTime = function (day, hour, timezone, date, format) {
    var dateString;
    date = date || {};
    format = format || 'dddd HH:mm';
    if (day && hour && timezone) {
        dateString = moment(date).startOf('week').add(day, 'days').format('YYYY-MM-DD') + ' ' + hour + ':00';
        return dateString && moment.tz(dateString, timezone).utcOffset(-(new Date()).getTimezoneOffset()).format(format);
    }
};

Template.registerHelper('calcTzSessionsTime', function (day, hour, timezone, date, format) {
    return App.calcTzSessionsTime(day, hour, timezone, date, format);
});

App.sessionTimesSelectOptions = function (courseId) {
    var course = Colls.Courses.findOne({_id: courseId});
    var avaibleSessionTimes = course && course.avaibleSessionTimes;
    var avaibleSessionOptions = avaibleSessionTimes && avaibleSessionTimes.map(function (s) {
        return {
            label: App.calcTzSessionsTime(s.day, s.hour, s.timezone),
            value: s.sessionId
        };
    });
    return avaibleSessionOptions;
};

Template.registerHelper('sessionTimesSelectOptions', function (courseId) {
    return App.sessionTimesSelectOptions(courseId);
});


/**
 * Strip HTML and Trims strings
 * @param {string} s - string to trim
 * @param {number} n - length
 * @param {string} suffix - suffix after trimmed text
 */

Template.registerHelper('stripHTMLandTrim', function (s, n, suffix) {
    var temp;
    if (s) {
        temp = s.replace(/(<([^>]+)>)/ig, '');
        temp = temp.substr(0, n);
    }
    if (suffix && temp && temp.length > n) {
        return temp + suffix;
    }
    return temp;
});

/**
 * Trims strings with html tags
 * @param {string} s - string to trim
 * @param {number} n - length
 * @param {string} suffix - suffix after trimmed text
 */
// http://jsfiddle.net/danmana/5mNNU/
Template.registerHelper('trimHTMLString', function (s, n, suffix) {
    var m, r = /<([^>\s]*)[^>]*>/g,
        stack = [],
        lasti = 0,
        temp,
        result = '';
    //for each tag, while we don't have enough characters
    while ((m = r.exec(s)) && n) {
        //get the text substring between the last tag and this one
        temp = s.substring(lasti, m.index).substr(0, n);
        //append to the result and count the number of characters added
        result += temp;
        n -= temp.length;
        lasti = r.lastIndex;

        if (n) {
            result += m[0];
            if (m[1].indexOf('/') === 0) {
                //if this is a closing tag, than pop the stack (does not account for bad html)
                stack.pop();
            } else if (m[1].lastIndexOf('/') !== m[1].length - 1) {
                //if this is not a self closing tag than push it in the stack
                stack.push(m[1]);
            }
        }
    }
    //add the remainder of the string, if needed (there are no more tags in here)
    if (s) {
        result += s.substr(lasti, n);
    }
    //fix the unclosed tags
    while (stack.length) {
        result += '</' + stack.pop() + '>';
    }

    if (suffix && s && s.length > n) {
        result = result + suffix;
    }

    return result;
});


Template.registerHelper('currentCourseContextId', function () {
    return Session.get('activeCourseId');
});

// new routeIs with new Iron Router and simplified
Template.registerHelper('isActiveRoute', function (routeName) {
    var router;
    var currentRoute;
    if (_.isString(routeName)) {
        router = Router.current();
        currentRoute = router && router.route.getName();
        return currentRoute && currentRoute === routeName;
    }
});
