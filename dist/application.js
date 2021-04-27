function toInteger(dirtyNumber) {
    if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
        return NaN;
    }
    var number = Number(dirtyNumber);
    if (isNaN(number)) {
        return number;
    }
    return number < 0 ? Math.ceil(number) : Math.floor(number);
}
function requiredArgs(required, args) {
    if (args.length < required) {
        throw new TypeError(required + ' argument' + (required > 1 ? 's' : '') + ' required, but only ' + args.length + ' present');
    }
}
function toDate(argument) {
    requiredArgs(1, arguments);
    const argStr = Object.prototype.toString.call(argument);
    if (argument instanceof Date || typeof argument === 'object' && argStr === '[object Date]') {
        return new Date(argument.getTime());
    } else if (typeof argument === 'number' || argStr === '[object Number]') {
        return new Date(argument);
    } else {
        if ((typeof argument === 'string' || argStr === '[object String]') && typeof console !== 'undefined') {
            console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as arguments. Please use `parseISO` to parse strings. See: https://git.io/fjule");
            console.warn(new Error().stack);
        }
        return new Date(NaN);
    }
}
function addMilliseconds(dirtyDate, dirtyAmount) {
    requiredArgs(2, arguments);
    var timestamp = toDate(dirtyDate).getTime();
    var amount = toInteger(dirtyAmount);
    return new Date(timestamp + amount);
}
var MILLISECONDS_IN_MINUTE = 60000;
function getDateMillisecondsPart(date) {
    return date.getTime() % MILLISECONDS_IN_MINUTE;
}
function getTimezoneOffsetInMilliseconds(dirtyDate) {
    var date = new Date(dirtyDate.getTime());
    var baseTimezoneOffset = Math.ceil(date.getTimezoneOffset());
    date.setSeconds(0, 0);
    var hasNegativeUTCOffset = baseTimezoneOffset > 0;
    var millisecondsPartOfTimezoneOffset = hasNegativeUTCOffset ? (MILLISECONDS_IN_MINUTE + getDateMillisecondsPart(date)) % MILLISECONDS_IN_MINUTE : getDateMillisecondsPart(date);
    return baseTimezoneOffset * MILLISECONDS_IN_MINUTE + millisecondsPartOfTimezoneOffset;
}
function isValid(dirtyDate) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    return !isNaN(date);
}
var formatDistanceLocale = {
    lessThanXSeconds: {
        one: 'less than a second',
        other: 'less than {{count}} seconds'
    },
    xSeconds: {
        one: '1 second',
        other: '{{count}} seconds'
    },
    halfAMinute: 'half a minute',
    lessThanXMinutes: {
        one: 'less than a minute',
        other: 'less than {{count}} minutes'
    },
    xMinutes: {
        one: '1 minute',
        other: '{{count}} minutes'
    },
    aboutXHours: {
        one: 'about 1 hour',
        other: 'about {{count}} hours'
    },
    xHours: {
        one: '1 hour',
        other: '{{count}} hours'
    },
    xDays: {
        one: '1 day',
        other: '{{count}} days'
    },
    aboutXWeeks: {
        one: 'about 1 week',
        other: 'about {{count}} weeks'
    },
    xWeeks: {
        one: '1 week',
        other: '{{count}} weeks'
    },
    aboutXMonths: {
        one: 'about 1 month',
        other: 'about {{count}} months'
    },
    xMonths: {
        one: '1 month',
        other: '{{count}} months'
    },
    aboutXYears: {
        one: 'about 1 year',
        other: 'about {{count}} years'
    },
    xYears: {
        one: '1 year',
        other: '{{count}} years'
    },
    overXYears: {
        one: 'over 1 year',
        other: 'over {{count}} years'
    },
    almostXYears: {
        one: 'almost 1 year',
        other: 'almost {{count}} years'
    }
};
function formatDistance(token, count, options) {
    options = options || {
    };
    var result;
    if (typeof formatDistanceLocale[token] === 'string') {
        result = formatDistanceLocale[token];
    } else if (count === 1) {
        result = formatDistanceLocale[token].one;
    } else {
        result = formatDistanceLocale[token].other.replace('{{count}}', count);
    }
    if (options.addSuffix) {
        if (options.comparison > 0) {
            return 'in ' + result;
        } else {
            return result + ' ago';
        }
    }
    return result;
}
function buildFormatLongFn(args) {
    return function(dirtyOptions) {
        var options = dirtyOptions || {
        };
        var width = options.width ? String(options.width) : args.defaultWidth;
        var format = args.formats[width] || args.formats[args.defaultWidth];
        return format;
    };
}
var dateFormats = {
    full: 'EEEE, MMMM do, y',
    long: 'MMMM do, y',
    medium: 'MMM d, y',
    short: 'MM/dd/yyyy'
};
var timeFormats = {
    full: 'h:mm:ss a zzzz',
    long: 'h:mm:ss a z',
    medium: 'h:mm:ss a',
    short: 'h:mm a'
};
var dateTimeFormats = {
    full: "{{date}} 'at' {{time}}",
    long: "{{date}} 'at' {{time}}",
    medium: '{{date}}, {{time}}',
    short: '{{date}}, {{time}}'
};
var formatLong = {
    date: buildFormatLongFn({
        formats: dateFormats,
        defaultWidth: 'full'
    }),
    time: buildFormatLongFn({
        formats: timeFormats,
        defaultWidth: 'full'
    }),
    dateTime: buildFormatLongFn({
        formats: dateTimeFormats,
        defaultWidth: 'full'
    })
};
var formatRelativeLocale = {
    lastWeek: "'last' eeee 'at' p",
    yesterday: "'yesterday at' p",
    today: "'today at' p",
    tomorrow: "'tomorrow at' p",
    nextWeek: "eeee 'at' p",
    other: 'P'
};
function formatRelative(token, _date, _baseDate, _options) {
    return formatRelativeLocale[token];
}
function buildLocalizeFn(args) {
    return function(dirtyIndex, dirtyOptions) {
        var options = dirtyOptions || {
        };
        var context = options.context ? String(options.context) : 'standalone';
        var valuesArray;
        if (context === 'formatting' && args.formattingValues) {
            const defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
            const width = options.width ? String(options.width) : defaultWidth;
            valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
        } else {
            const defaultWidth = args.defaultWidth;
            const width = options.width ? String(options.width) : args.defaultWidth;
            valuesArray = args.values[width] || args.values[defaultWidth];
        }
        var index = args.argumentCallback ? args.argumentCallback(dirtyIndex) : dirtyIndex;
        return valuesArray[index];
    };
}
var eraValues = {
    narrow: [
        'B',
        'A'
    ],
    abbreviated: [
        'BC',
        'AD'
    ],
    wide: [
        'Before Christ',
        'Anno Domini'
    ]
};
var quarterValues = {
    narrow: [
        '1',
        '2',
        '3',
        '4'
    ],
    abbreviated: [
        'Q1',
        'Q2',
        'Q3',
        'Q4'
    ],
    wide: [
        '1st quarter',
        '2nd quarter',
        '3rd quarter',
        '4th quarter'
    ]
};
var monthValues = {
    narrow: [
        'J',
        'F',
        'M',
        'A',
        'M',
        'J',
        'J',
        'A',
        'S',
        'O',
        'N',
        'D'
    ],
    abbreviated: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ],
    wide: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ]
};
var dayValues = {
    narrow: [
        'S',
        'M',
        'T',
        'W',
        'T',
        'F',
        'S'
    ],
    short: [
        'Su',
        'Mo',
        'Tu',
        'We',
        'Th',
        'Fr',
        'Sa'
    ],
    abbreviated: [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
    ],
    wide: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ]
};
var dayPeriodValues = {
    narrow: {
        am: 'a',
        pm: 'p',
        midnight: 'mi',
        noon: 'n',
        morning: 'morning',
        afternoon: 'afternoon',
        evening: 'evening',
        night: 'night'
    },
    abbreviated: {
        am: 'AM',
        pm: 'PM',
        midnight: 'midnight',
        noon: 'noon',
        morning: 'morning',
        afternoon: 'afternoon',
        evening: 'evening',
        night: 'night'
    },
    wide: {
        am: 'a.m.',
        pm: 'p.m.',
        midnight: 'midnight',
        noon: 'noon',
        morning: 'morning',
        afternoon: 'afternoon',
        evening: 'evening',
        night: 'night'
    }
};
var formattingDayPeriodValues = {
    narrow: {
        am: 'a',
        pm: 'p',
        midnight: 'mi',
        noon: 'n',
        morning: 'in the morning',
        afternoon: 'in the afternoon',
        evening: 'in the evening',
        night: 'at night'
    },
    abbreviated: {
        am: 'AM',
        pm: 'PM',
        midnight: 'midnight',
        noon: 'noon',
        morning: 'in the morning',
        afternoon: 'in the afternoon',
        evening: 'in the evening',
        night: 'at night'
    },
    wide: {
        am: 'a.m.',
        pm: 'p.m.',
        midnight: 'midnight',
        noon: 'noon',
        morning: 'in the morning',
        afternoon: 'in the afternoon',
        evening: 'in the evening',
        night: 'at night'
    }
};
function ordinalNumber(dirtyNumber, _dirtyOptions) {
    var number = Number(dirtyNumber);
    var rem100 = number % 100;
    if (rem100 > 20 || rem100 < 10) {
        switch(rem100 % 10){
            case 1:
                return number + 'st';
            case 2:
                return number + 'nd';
            case 3:
                return number + 'rd';
        }
    }
    return number + 'th';
}
var localize = {
    ordinalNumber: ordinalNumber,
    era: buildLocalizeFn({
        values: eraValues,
        defaultWidth: 'wide'
    }),
    quarter: buildLocalizeFn({
        values: quarterValues,
        defaultWidth: 'wide',
        argumentCallback: function(quarter) {
            return Number(quarter) - 1;
        }
    }),
    month: buildLocalizeFn({
        values: monthValues,
        defaultWidth: 'wide'
    }),
    day: buildLocalizeFn({
        values: dayValues,
        defaultWidth: 'wide'
    }),
    dayPeriod: buildLocalizeFn({
        values: dayPeriodValues,
        defaultWidth: 'wide',
        formattingValues: formattingDayPeriodValues,
        defaultFormattingWidth: 'wide'
    })
};
function buildMatchPatternFn(args) {
    return function(dirtyString, dirtyOptions) {
        var string = String(dirtyString);
        var options = dirtyOptions || {
        };
        var matchResult = string.match(args.matchPattern);
        if (!matchResult) {
            return null;
        }
        var matchedString = matchResult[0];
        var parseResult = string.match(args.parsePattern);
        if (!parseResult) {
            return null;
        }
        var value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
        value = options.valueCallback ? options.valueCallback(value) : value;
        return {
            value: value,
            rest: string.slice(matchedString.length)
        };
    };
}
function buildMatchFn(args) {
    return function(dirtyString, dirtyOptions) {
        var string = String(dirtyString);
        var options = dirtyOptions || {
        };
        var width = options.width;
        var matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
        var matchResult = string.match(matchPattern);
        if (!matchResult) {
            return null;
        }
        var matchedString = matchResult[0];
        var parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
        var value;
        if (Object.prototype.toString.call(parsePatterns) === '[object Array]') {
            value = findIndex(parsePatterns, function(pattern) {
                return pattern.test(matchedString);
            });
        } else {
            value = findKey(parsePatterns, function(pattern) {
                return pattern.test(matchedString);
            });
        }
        value = args.valueCallback ? args.valueCallback(value) : value;
        value = options.valueCallback ? options.valueCallback(value) : value;
        return {
            value: value,
            rest: string.slice(matchedString.length)
        };
    };
}
function findKey(object, predicate) {
    for(var key in object){
        if (object.hasOwnProperty(key) && predicate(object[key])) {
            return key;
        }
    }
}
function findIndex(array, predicate) {
    for(var key = 0; key < array.length; key++){
        if (predicate(array[key])) {
            return key;
        }
    }
}
var matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
var parseOrdinalNumberPattern = /\d+/i;
var matchEraPatterns = {
    narrow: /^(b|a)/i,
    abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
    wide: /^(before christ|before common era|anno domini|common era)/i
};
var parseEraPatterns = {
    any: [
        /^b/i,
        /^(a|c)/i
    ]
};
var matchQuarterPatterns = {
    narrow: /^[1234]/i,
    abbreviated: /^q[1234]/i,
    wide: /^[1234](th|st|nd|rd)? quarter/i
};
var parseQuarterPatterns = {
    any: [
        /1/i,
        /2/i,
        /3/i,
        /4/i
    ]
};
var matchMonthPatterns = {
    narrow: /^[jfmasond]/i,
    abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
    wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
};
var parseMonthPatterns = {
    narrow: [
        /^j/i,
        /^f/i,
        /^m/i,
        /^a/i,
        /^m/i,
        /^j/i,
        /^j/i,
        /^a/i,
        /^s/i,
        /^o/i,
        /^n/i,
        /^d/i
    ],
    any: [
        /^ja/i,
        /^f/i,
        /^mar/i,
        /^ap/i,
        /^may/i,
        /^jun/i,
        /^jul/i,
        /^au/i,
        /^s/i,
        /^o/i,
        /^n/i,
        /^d/i
    ]
};
var matchDayPatterns = {
    narrow: /^[smtwf]/i,
    short: /^(su|mo|tu|we|th|fr|sa)/i,
    abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
    wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
};
var parseDayPatterns = {
    narrow: [
        /^s/i,
        /^m/i,
        /^t/i,
        /^w/i,
        /^t/i,
        /^f/i,
        /^s/i
    ],
    any: [
        /^su/i,
        /^m/i,
        /^tu/i,
        /^w/i,
        /^th/i,
        /^f/i,
        /^sa/i
    ]
};
var matchDayPeriodPatterns = {
    narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
    any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
};
var parseDayPeriodPatterns = {
    any: {
        am: /^a/i,
        pm: /^p/i,
        midnight: /^mi/i,
        noon: /^no/i,
        morning: /morning/i,
        afternoon: /afternoon/i,
        evening: /evening/i,
        night: /night/i
    }
};
var match = {
    ordinalNumber: buildMatchPatternFn({
        matchPattern: matchOrdinalNumberPattern,
        parsePattern: parseOrdinalNumberPattern,
        valueCallback: function(value) {
            return parseInt(value, 10);
        }
    }),
    era: buildMatchFn({
        matchPatterns: matchEraPatterns,
        defaultMatchWidth: 'wide',
        parsePatterns: parseEraPatterns,
        defaultParseWidth: 'any'
    }),
    quarter: buildMatchFn({
        matchPatterns: matchQuarterPatterns,
        defaultMatchWidth: 'wide',
        parsePatterns: parseQuarterPatterns,
        defaultParseWidth: 'any',
        valueCallback: function(index) {
            return index + 1;
        }
    }),
    month: buildMatchFn({
        matchPatterns: matchMonthPatterns,
        defaultMatchWidth: 'wide',
        parsePatterns: parseMonthPatterns,
        defaultParseWidth: 'any'
    }),
    day: buildMatchFn({
        matchPatterns: matchDayPatterns,
        defaultMatchWidth: 'wide',
        parsePatterns: parseDayPatterns,
        defaultParseWidth: 'any'
    }),
    dayPeriod: buildMatchFn({
        matchPatterns: matchDayPeriodPatterns,
        defaultMatchWidth: 'any',
        parsePatterns: parseDayPeriodPatterns,
        defaultParseWidth: 'any'
    })
};
var locale = {
    code: 'en-US',
    formatDistance: formatDistance,
    formatLong: formatLong,
    formatRelative: formatRelative,
    localize: localize,
    match: match,
    options: {
        weekStartsOn: 0,
        firstWeekContainsDate: 1
    }
};
function subMilliseconds(dirtyDate, dirtyAmount) {
    requiredArgs(2, arguments);
    var amount = toInteger(dirtyAmount);
    return addMilliseconds(dirtyDate, -amount);
}
function addLeadingZeros(number, targetLength) {
    var sign = number < 0 ? '-' : '';
    var output = Math.abs(number).toString();
    while(output.length < targetLength){
        output = '0' + output;
    }
    return sign + output;
}
var formatters = {
    y: function(date, token) {
        var signedYear = date.getUTCFullYear();
        var year = signedYear > 0 ? signedYear : 1 - signedYear;
        return addLeadingZeros(token === 'yy' ? year % 100 : year, token.length);
    },
    M: function(date, token) {
        var month = date.getUTCMonth();
        return token === 'M' ? String(month + 1) : addLeadingZeros(month + 1, 2);
    },
    d: function(date, token) {
        return addLeadingZeros(date.getUTCDate(), token.length);
    },
    a: function(date, token) {
        var dayPeriodEnumValue = date.getUTCHours() / 12 >= 1 ? 'pm' : 'am';
        switch(token){
            case 'a':
            case 'aa':
            case 'aaa':
                return dayPeriodEnumValue.toUpperCase();
            case 'aaaaa':
                return dayPeriodEnumValue[0];
            case 'aaaa':
            default:
                return dayPeriodEnumValue === 'am' ? 'a.m.' : 'p.m.';
        }
    },
    h: function(date, token) {
        return addLeadingZeros(date.getUTCHours() % 12 || 12, token.length);
    },
    H: function(date, token) {
        return addLeadingZeros(date.getUTCHours(), token.length);
    },
    m: function(date, token) {
        return addLeadingZeros(date.getUTCMinutes(), token.length);
    },
    s: function(date, token) {
        return addLeadingZeros(date.getUTCSeconds(), token.length);
    },
    S: function(date, token) {
        var numberOfDigits = token.length;
        var milliseconds = date.getUTCMilliseconds();
        var fractionalSeconds = Math.floor(milliseconds * Math.pow(10, numberOfDigits - 3));
        return addLeadingZeros(fractionalSeconds, token.length);
    }
};
var MILLISECONDS_IN_DAY = 86400000;
function getUTCDayOfYear(dirtyDate) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    var timestamp = date.getTime();
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
    var startOfYearTimestamp = date.getTime();
    var difference = timestamp - startOfYearTimestamp;
    return Math.floor(difference / MILLISECONDS_IN_DAY) + 1;
}
function startOfUTCISOWeek(dirtyDate) {
    requiredArgs(1, arguments);
    var weekStartsOn = 1;
    var date = toDate(dirtyDate);
    var day = date.getUTCDay();
    var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
    date.setUTCDate(date.getUTCDate() - diff);
    date.setUTCHours(0, 0, 0, 0);
    return date;
}
function getUTCISOWeekYear(dirtyDate) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    var year = date.getUTCFullYear();
    var fourthOfJanuaryOfNextYear = new Date(0);
    fourthOfJanuaryOfNextYear.setUTCFullYear(year + 1, 0, 4);
    fourthOfJanuaryOfNextYear.setUTCHours(0, 0, 0, 0);
    var startOfNextYear = startOfUTCISOWeek(fourthOfJanuaryOfNextYear);
    var fourthOfJanuaryOfThisYear = new Date(0);
    fourthOfJanuaryOfThisYear.setUTCFullYear(year, 0, 4);
    fourthOfJanuaryOfThisYear.setUTCHours(0, 0, 0, 0);
    var startOfThisYear = startOfUTCISOWeek(fourthOfJanuaryOfThisYear);
    if (date.getTime() >= startOfNextYear.getTime()) {
        return year + 1;
    } else if (date.getTime() >= startOfThisYear.getTime()) {
        return year;
    } else {
        return year - 1;
    }
}
function startOfUTCISOWeekYear(dirtyDate) {
    requiredArgs(1, arguments);
    var year = getUTCISOWeekYear(dirtyDate);
    var fourthOfJanuary = new Date(0);
    fourthOfJanuary.setUTCFullYear(year, 0, 4);
    fourthOfJanuary.setUTCHours(0, 0, 0, 0);
    var date = startOfUTCISOWeek(fourthOfJanuary);
    return date;
}
var MILLISECONDS_IN_WEEK = 604800000;
function getUTCISOWeek(dirtyDate) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    var diff = startOfUTCISOWeek(date).getTime() - startOfUTCISOWeekYear(date).getTime();
    return Math.round(diff / MILLISECONDS_IN_WEEK) + 1;
}
function startOfUTCWeek(dirtyDate, dirtyOptions) {
    requiredArgs(1, arguments);
    var options = dirtyOptions || {
    };
    var locale1 = options.locale;
    var localeWeekStartsOn = locale1 && locale1.options && locale1.options.weekStartsOn;
    var defaultWeekStartsOn = localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn);
    var weekStartsOn = options.weekStartsOn == null ? defaultWeekStartsOn : toInteger(options.weekStartsOn);
    if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
        throw new RangeError('weekStartsOn must be between 0 and 6 inclusively');
    }
    var date = toDate(dirtyDate);
    var day = date.getUTCDay();
    var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
    date.setUTCDate(date.getUTCDate() - diff);
    date.setUTCHours(0, 0, 0, 0);
    return date;
}
function getUTCWeekYear(dirtyDate, dirtyOptions) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate, dirtyOptions);
    var year = date.getUTCFullYear();
    var options = dirtyOptions || {
    };
    var locale1 = options.locale;
    var localeFirstWeekContainsDate = locale1 && locale1.options && locale1.options.firstWeekContainsDate;
    var defaultFirstWeekContainsDate = localeFirstWeekContainsDate == null ? 1 : toInteger(localeFirstWeekContainsDate);
    var firstWeekContainsDate = options.firstWeekContainsDate == null ? defaultFirstWeekContainsDate : toInteger(options.firstWeekContainsDate);
    if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
        throw new RangeError('firstWeekContainsDate must be between 1 and 7 inclusively');
    }
    var firstWeekOfNextYear = new Date(0);
    firstWeekOfNextYear.setUTCFullYear(year + 1, 0, firstWeekContainsDate);
    firstWeekOfNextYear.setUTCHours(0, 0, 0, 0);
    var startOfNextYear = startOfUTCWeek(firstWeekOfNextYear, dirtyOptions);
    var firstWeekOfThisYear = new Date(0);
    firstWeekOfThisYear.setUTCFullYear(year, 0, firstWeekContainsDate);
    firstWeekOfThisYear.setUTCHours(0, 0, 0, 0);
    var startOfThisYear = startOfUTCWeek(firstWeekOfThisYear, dirtyOptions);
    if (date.getTime() >= startOfNextYear.getTime()) {
        return year + 1;
    } else if (date.getTime() >= startOfThisYear.getTime()) {
        return year;
    } else {
        return year - 1;
    }
}
function startOfUTCWeekYear(dirtyDate, dirtyOptions) {
    requiredArgs(1, arguments);
    var options = dirtyOptions || {
    };
    var locale1 = options.locale;
    var localeFirstWeekContainsDate = locale1 && locale1.options && locale1.options.firstWeekContainsDate;
    var defaultFirstWeekContainsDate = localeFirstWeekContainsDate == null ? 1 : toInteger(localeFirstWeekContainsDate);
    var firstWeekContainsDate = options.firstWeekContainsDate == null ? defaultFirstWeekContainsDate : toInteger(options.firstWeekContainsDate);
    var year = getUTCWeekYear(dirtyDate, dirtyOptions);
    var firstWeek = new Date(0);
    firstWeek.setUTCFullYear(year, 0, firstWeekContainsDate);
    firstWeek.setUTCHours(0, 0, 0, 0);
    var date = startOfUTCWeek(firstWeek, dirtyOptions);
    return date;
}
var MILLISECONDS_IN_WEEK1 = 604800000;
function getUTCWeek(dirtyDate, options) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    var diff = startOfUTCWeek(date, options).getTime() - startOfUTCWeekYear(date, options).getTime();
    return Math.round(diff / MILLISECONDS_IN_WEEK1) + 1;
}
var dayPeriodEnum = {
    am: 'am',
    pm: 'pm',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'morning',
    afternoon: 'afternoon',
    evening: 'evening',
    night: 'night'
};
var formatters1 = {
    G: function(date, token, localize1) {
        var era = date.getUTCFullYear() > 0 ? 1 : 0;
        switch(token){
            case 'G':
            case 'GG':
            case 'GGG':
                return localize1.era(era, {
                    width: 'abbreviated'
                });
            case 'GGGGG':
                return localize1.era(era, {
                    width: 'narrow'
                });
            case 'GGGG':
            default:
                return localize1.era(era, {
                    width: 'wide'
                });
        }
    },
    y: function(date, token, localize1) {
        if (token === 'yo') {
            var signedYear = date.getUTCFullYear();
            var year = signedYear > 0 ? signedYear : 1 - signedYear;
            return localize1.ordinalNumber(year, {
                unit: 'year'
            });
        }
        return formatters.y(date, token);
    },
    Y: function(date, token, localize1, options) {
        var signedWeekYear = getUTCWeekYear(date, options);
        var weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear;
        if (token === 'YY') {
            var twoDigitYear = weekYear % 100;
            return addLeadingZeros(twoDigitYear, 2);
        }
        if (token === 'Yo') {
            return localize1.ordinalNumber(weekYear, {
                unit: 'year'
            });
        }
        return addLeadingZeros(weekYear, token.length);
    },
    R: function(date, token) {
        var isoWeekYear = getUTCISOWeekYear(date);
        return addLeadingZeros(isoWeekYear, token.length);
    },
    u: function(date, token) {
        var year = date.getUTCFullYear();
        return addLeadingZeros(year, token.length);
    },
    Q: function(date, token, localize1) {
        var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);
        switch(token){
            case 'Q':
                return String(quarter);
            case 'QQ':
                return addLeadingZeros(quarter, 2);
            case 'Qo':
                return localize1.ordinalNumber(quarter, {
                    unit: 'quarter'
                });
            case 'QQQ':
                return localize1.quarter(quarter, {
                    width: 'abbreviated',
                    context: 'formatting'
                });
            case 'QQQQQ':
                return localize1.quarter(quarter, {
                    width: 'narrow',
                    context: 'formatting'
                });
            case 'QQQQ':
            default:
                return localize1.quarter(quarter, {
                    width: 'wide',
                    context: 'formatting'
                });
        }
    },
    q: function(date, token, localize1) {
        var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);
        switch(token){
            case 'q':
                return String(quarter);
            case 'qq':
                return addLeadingZeros(quarter, 2);
            case 'qo':
                return localize1.ordinalNumber(quarter, {
                    unit: 'quarter'
                });
            case 'qqq':
                return localize1.quarter(quarter, {
                    width: 'abbreviated',
                    context: 'standalone'
                });
            case 'qqqqq':
                return localize1.quarter(quarter, {
                    width: 'narrow',
                    context: 'standalone'
                });
            case 'qqqq':
            default:
                return localize1.quarter(quarter, {
                    width: 'wide',
                    context: 'standalone'
                });
        }
    },
    M: function(date, token, localize1) {
        var month = date.getUTCMonth();
        switch(token){
            case 'M':
            case 'MM':
                return formatters.M(date, token);
            case 'Mo':
                return localize1.ordinalNumber(month + 1, {
                    unit: 'month'
                });
            case 'MMM':
                return localize1.month(month, {
                    width: 'abbreviated',
                    context: 'formatting'
                });
            case 'MMMMM':
                return localize1.month(month, {
                    width: 'narrow',
                    context: 'formatting'
                });
            case 'MMMM':
            default:
                return localize1.month(month, {
                    width: 'wide',
                    context: 'formatting'
                });
        }
    },
    L: function(date, token, localize1) {
        var month = date.getUTCMonth();
        switch(token){
            case 'L':
                return String(month + 1);
            case 'LL':
                return addLeadingZeros(month + 1, 2);
            case 'Lo':
                return localize1.ordinalNumber(month + 1, {
                    unit: 'month'
                });
            case 'LLL':
                return localize1.month(month, {
                    width: 'abbreviated',
                    context: 'standalone'
                });
            case 'LLLLL':
                return localize1.month(month, {
                    width: 'narrow',
                    context: 'standalone'
                });
            case 'LLLL':
            default:
                return localize1.month(month, {
                    width: 'wide',
                    context: 'standalone'
                });
        }
    },
    w: function(date, token, localize1, options) {
        var week = getUTCWeek(date, options);
        if (token === 'wo') {
            return localize1.ordinalNumber(week, {
                unit: 'week'
            });
        }
        return addLeadingZeros(week, token.length);
    },
    I: function(date, token, localize1) {
        var isoWeek = getUTCISOWeek(date);
        if (token === 'Io') {
            return localize1.ordinalNumber(isoWeek, {
                unit: 'week'
            });
        }
        return addLeadingZeros(isoWeek, token.length);
    },
    d: function(date, token, localize1) {
        if (token === 'do') {
            return localize1.ordinalNumber(date.getUTCDate(), {
                unit: 'date'
            });
        }
        return formatters.d(date, token);
    },
    D: function(date, token, localize1) {
        var dayOfYear = getUTCDayOfYear(date);
        if (token === 'Do') {
            return localize1.ordinalNumber(dayOfYear, {
                unit: 'dayOfYear'
            });
        }
        return addLeadingZeros(dayOfYear, token.length);
    },
    E: function(date, token, localize1) {
        var dayOfWeek = date.getUTCDay();
        switch(token){
            case 'E':
            case 'EE':
            case 'EEE':
                return localize1.day(dayOfWeek, {
                    width: 'abbreviated',
                    context: 'formatting'
                });
            case 'EEEEE':
                return localize1.day(dayOfWeek, {
                    width: 'narrow',
                    context: 'formatting'
                });
            case 'EEEEEE':
                return localize1.day(dayOfWeek, {
                    width: 'short',
                    context: 'formatting'
                });
            case 'EEEE':
            default:
                return localize1.day(dayOfWeek, {
                    width: 'wide',
                    context: 'formatting'
                });
        }
    },
    e: function(date, token, localize1, options) {
        var dayOfWeek = date.getUTCDay();
        var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
        switch(token){
            case 'e':
                return String(localDayOfWeek);
            case 'ee':
                return addLeadingZeros(localDayOfWeek, 2);
            case 'eo':
                return localize1.ordinalNumber(localDayOfWeek, {
                    unit: 'day'
                });
            case 'eee':
                return localize1.day(dayOfWeek, {
                    width: 'abbreviated',
                    context: 'formatting'
                });
            case 'eeeee':
                return localize1.day(dayOfWeek, {
                    width: 'narrow',
                    context: 'formatting'
                });
            case 'eeeeee':
                return localize1.day(dayOfWeek, {
                    width: 'short',
                    context: 'formatting'
                });
            case 'eeee':
            default:
                return localize1.day(dayOfWeek, {
                    width: 'wide',
                    context: 'formatting'
                });
        }
    },
    c: function(date, token, localize1, options) {
        var dayOfWeek = date.getUTCDay();
        var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
        switch(token){
            case 'c':
                return String(localDayOfWeek);
            case 'cc':
                return addLeadingZeros(localDayOfWeek, token.length);
            case 'co':
                return localize1.ordinalNumber(localDayOfWeek, {
                    unit: 'day'
                });
            case 'ccc':
                return localize1.day(dayOfWeek, {
                    width: 'abbreviated',
                    context: 'standalone'
                });
            case 'ccccc':
                return localize1.day(dayOfWeek, {
                    width: 'narrow',
                    context: 'standalone'
                });
            case 'cccccc':
                return localize1.day(dayOfWeek, {
                    width: 'short',
                    context: 'standalone'
                });
            case 'cccc':
            default:
                return localize1.day(dayOfWeek, {
                    width: 'wide',
                    context: 'standalone'
                });
        }
    },
    i: function(date, token, localize1) {
        var dayOfWeek = date.getUTCDay();
        var isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
        switch(token){
            case 'i':
                return String(isoDayOfWeek);
            case 'ii':
                return addLeadingZeros(isoDayOfWeek, token.length);
            case 'io':
                return localize1.ordinalNumber(isoDayOfWeek, {
                    unit: 'day'
                });
            case 'iii':
                return localize1.day(dayOfWeek, {
                    width: 'abbreviated',
                    context: 'formatting'
                });
            case 'iiiii':
                return localize1.day(dayOfWeek, {
                    width: 'narrow',
                    context: 'formatting'
                });
            case 'iiiiii':
                return localize1.day(dayOfWeek, {
                    width: 'short',
                    context: 'formatting'
                });
            case 'iiii':
            default:
                return localize1.day(dayOfWeek, {
                    width: 'wide',
                    context: 'formatting'
                });
        }
    },
    a: function(date, token, localize1) {
        var hours = date.getUTCHours();
        var dayPeriodEnumValue = hours / 12 >= 1 ? 'pm' : 'am';
        switch(token){
            case 'a':
            case 'aa':
            case 'aaa':
                return localize1.dayPeriod(dayPeriodEnumValue, {
                    width: 'abbreviated',
                    context: 'formatting'
                });
            case 'aaaaa':
                return localize1.dayPeriod(dayPeriodEnumValue, {
                    width: 'narrow',
                    context: 'formatting'
                });
            case 'aaaa':
            default:
                return localize1.dayPeriod(dayPeriodEnumValue, {
                    width: 'wide',
                    context: 'formatting'
                });
        }
    },
    b: function(date, token, localize1) {
        var hours = date.getUTCHours();
        var dayPeriodEnumValue;
        if (hours === 12) {
            dayPeriodEnumValue = dayPeriodEnum.noon;
        } else if (hours === 0) {
            dayPeriodEnumValue = dayPeriodEnum.midnight;
        } else {
            dayPeriodEnumValue = hours / 12 >= 1 ? 'pm' : 'am';
        }
        switch(token){
            case 'b':
            case 'bb':
            case 'bbb':
                return localize1.dayPeriod(dayPeriodEnumValue, {
                    width: 'abbreviated',
                    context: 'formatting'
                });
            case 'bbbbb':
                return localize1.dayPeriod(dayPeriodEnumValue, {
                    width: 'narrow',
                    context: 'formatting'
                });
            case 'bbbb':
            default:
                return localize1.dayPeriod(dayPeriodEnumValue, {
                    width: 'wide',
                    context: 'formatting'
                });
        }
    },
    B: function(date, token, localize1) {
        var hours = date.getUTCHours();
        var dayPeriodEnumValue;
        if (hours >= 17) {
            dayPeriodEnumValue = dayPeriodEnum.evening;
        } else if (hours >= 12) {
            dayPeriodEnumValue = dayPeriodEnum.afternoon;
        } else if (hours >= 4) {
            dayPeriodEnumValue = dayPeriodEnum.morning;
        } else {
            dayPeriodEnumValue = dayPeriodEnum.night;
        }
        switch(token){
            case 'B':
            case 'BB':
            case 'BBB':
                return localize1.dayPeriod(dayPeriodEnumValue, {
                    width: 'abbreviated',
                    context: 'formatting'
                });
            case 'BBBBB':
                return localize1.dayPeriod(dayPeriodEnumValue, {
                    width: 'narrow',
                    context: 'formatting'
                });
            case 'BBBB':
            default:
                return localize1.dayPeriod(dayPeriodEnumValue, {
                    width: 'wide',
                    context: 'formatting'
                });
        }
    },
    h: function(date, token, localize1) {
        if (token === 'ho') {
            var hours = date.getUTCHours() % 12;
            if (hours === 0) hours = 12;
            return localize1.ordinalNumber(hours, {
                unit: 'hour'
            });
        }
        return formatters.h(date, token);
    },
    H: function(date, token, localize1) {
        if (token === 'Ho') {
            return localize1.ordinalNumber(date.getUTCHours(), {
                unit: 'hour'
            });
        }
        return formatters.H(date, token);
    },
    K: function(date, token, localize1) {
        var hours = date.getUTCHours() % 12;
        if (token === 'Ko') {
            return localize1.ordinalNumber(hours, {
                unit: 'hour'
            });
        }
        return addLeadingZeros(hours, token.length);
    },
    k: function(date, token, localize1) {
        var hours = date.getUTCHours();
        if (hours === 0) hours = 24;
        if (token === 'ko') {
            return localize1.ordinalNumber(hours, {
                unit: 'hour'
            });
        }
        return addLeadingZeros(hours, token.length);
    },
    m: function(date, token, localize1) {
        if (token === 'mo') {
            return localize1.ordinalNumber(date.getUTCMinutes(), {
                unit: 'minute'
            });
        }
        return formatters.m(date, token);
    },
    s: function(date, token, localize1) {
        if (token === 'so') {
            return localize1.ordinalNumber(date.getUTCSeconds(), {
                unit: 'second'
            });
        }
        return formatters.s(date, token);
    },
    S: function(date, token) {
        return formatters.S(date, token);
    },
    X: function(date, token, _localize, options) {
        var originalDate = options._originalDate || date;
        var timezoneOffset = originalDate.getTimezoneOffset();
        if (timezoneOffset === 0) {
            return 'Z';
        }
        switch(token){
            case 'X':
                return formatTimezoneWithOptionalMinutes(timezoneOffset);
            case 'XXXX':
            case 'XX':
                return formatTimezone(timezoneOffset);
            case 'XXXXX':
            case 'XXX':
            default:
                return formatTimezone(timezoneOffset, ':');
        }
    },
    x: function(date, token, _localize, options) {
        var originalDate = options._originalDate || date;
        var timezoneOffset = originalDate.getTimezoneOffset();
        switch(token){
            case 'x':
                return formatTimezoneWithOptionalMinutes(timezoneOffset);
            case 'xxxx':
            case 'xx':
                return formatTimezone(timezoneOffset);
            case 'xxxxx':
            case 'xxx':
            default:
                return formatTimezone(timezoneOffset, ':');
        }
    },
    O: function(date, token, _localize, options) {
        var originalDate = options._originalDate || date;
        var timezoneOffset = originalDate.getTimezoneOffset();
        switch(token){
            case 'O':
            case 'OO':
            case 'OOO':
                return 'GMT' + formatTimezoneShort(timezoneOffset, ':');
            case 'OOOO':
            default:
                return 'GMT' + formatTimezone(timezoneOffset, ':');
        }
    },
    z: function(date, token, _localize, options) {
        var originalDate = options._originalDate || date;
        var timezoneOffset = originalDate.getTimezoneOffset();
        switch(token){
            case 'z':
            case 'zz':
            case 'zzz':
                return 'GMT' + formatTimezoneShort(timezoneOffset, ':');
            case 'zzzz':
            default:
                return 'GMT' + formatTimezone(timezoneOffset, ':');
        }
    },
    t: function(date, token, _localize, options) {
        var originalDate = options._originalDate || date;
        var timestamp = Math.floor(originalDate.getTime() / 1000);
        return addLeadingZeros(timestamp, token.length);
    },
    T: function(date, token, _localize, options) {
        var originalDate = options._originalDate || date;
        var timestamp = originalDate.getTime();
        return addLeadingZeros(timestamp, token.length);
    }
};
function formatTimezoneShort(offset, dirtyDelimiter) {
    var sign = offset > 0 ? '-' : '+';
    var absOffset = Math.abs(offset);
    var hours = Math.floor(absOffset / 60);
    var minutes = absOffset % 60;
    if (minutes === 0) {
        return sign + String(hours);
    }
    var delimiter = dirtyDelimiter || '';
    return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2);
}
function formatTimezoneWithOptionalMinutes(offset, dirtyDelimiter) {
    if (offset % 60 === 0) {
        var sign = offset > 0 ? '-' : '+';
        return sign + addLeadingZeros(Math.abs(offset) / 60, 2);
    }
    return formatTimezone(offset, dirtyDelimiter);
}
function formatTimezone(offset, dirtyDelimiter) {
    var delimiter = dirtyDelimiter || '';
    var sign = offset > 0 ? '-' : '+';
    var absOffset = Math.abs(offset);
    var hours = addLeadingZeros(Math.floor(absOffset / 60), 2);
    var minutes = addLeadingZeros(absOffset % 60, 2);
    return sign + hours + delimiter + minutes;
}
function dateLongFormatter(pattern, formatLong1) {
    switch(pattern){
        case 'P':
            return formatLong1.date({
                width: 'short'
            });
        case 'PP':
            return formatLong1.date({
                width: 'medium'
            });
        case 'PPP':
            return formatLong1.date({
                width: 'long'
            });
        case 'PPPP':
        default:
            return formatLong1.date({
                width: 'full'
            });
    }
}
function timeLongFormatter(pattern, formatLong1) {
    switch(pattern){
        case 'p':
            return formatLong1.time({
                width: 'short'
            });
        case 'pp':
            return formatLong1.time({
                width: 'medium'
            });
        case 'ppp':
            return formatLong1.time({
                width: 'long'
            });
        case 'pppp':
        default:
            return formatLong1.time({
                width: 'full'
            });
    }
}
function dateTimeLongFormatter(pattern, formatLong1) {
    var matchResult = pattern.match(/(P+)(p+)?/);
    var datePattern = matchResult[1];
    var timePattern = matchResult[2];
    if (!timePattern) {
        return dateLongFormatter(pattern, formatLong1);
    }
    var dateTimeFormat;
    switch(datePattern){
        case 'P':
            dateTimeFormat = formatLong1.dateTime({
                width: 'short'
            });
            break;
        case 'PP':
            dateTimeFormat = formatLong1.dateTime({
                width: 'medium'
            });
            break;
        case 'PPP':
            dateTimeFormat = formatLong1.dateTime({
                width: 'long'
            });
            break;
        case 'PPPP':
        default:
            dateTimeFormat = formatLong1.dateTime({
                width: 'full'
            });
            break;
    }
    return dateTimeFormat.replace('{{date}}', dateLongFormatter(datePattern, formatLong1)).replace('{{time}}', timeLongFormatter(timePattern, formatLong1));
}
var longFormatters = {
    p: timeLongFormatter,
    P: dateTimeLongFormatter
};
var protectedDayOfYearTokens = [
    'D',
    'DD'
];
var protectedWeekYearTokens = [
    'YY',
    'YYYY'
];
function isProtectedDayOfYearToken(token) {
    return protectedDayOfYearTokens.indexOf(token) !== -1;
}
function isProtectedWeekYearToken(token) {
    return protectedWeekYearTokens.indexOf(token) !== -1;
}
function throwProtectedError(token, format, input) {
    if (token === 'YYYY') {
        throw new RangeError(`Use \`yyyy\` instead of \`YYYY\` (in \`${format}\`) for formatting years to the input \`${input}\`; see: https://git.io/fxCyr`);
    } else if (token === 'YY') {
        throw new RangeError(`Use \`yy\` instead of \`YY\` (in \`${format}\`) for formatting years to the input \`${input}\`; see: https://git.io/fxCyr`);
    } else if (token === 'D') {
        throw new RangeError(`Use \`d\` instead of \`D\` (in \`${format}\`) for formatting days of the month to the input \`${input}\`; see: https://git.io/fxCyr`);
    } else if (token === 'DD') {
        throw new RangeError(`Use \`dd\` instead of \`DD\` (in \`${format}\`) for formatting days of the month to the input \`${input}\`; see: https://git.io/fxCyr`);
    }
}
var formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
var longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
var escapedStringRegExp = /^'([^]*?)'?$/;
var doubleQuoteRegExp = /''/g;
var unescapedLatinCharacterRegExp = /[a-zA-Z]/;
function format(dirtyDate, dirtyFormatStr, dirtyOptions) {
    requiredArgs(2, arguments);
    var formatStr = String(dirtyFormatStr);
    var options = dirtyOptions || {
    };
    var locale1 = options.locale || locale;
    var localeFirstWeekContainsDate = locale1.options && locale1.options.firstWeekContainsDate;
    var defaultFirstWeekContainsDate = localeFirstWeekContainsDate == null ? 1 : toInteger(localeFirstWeekContainsDate);
    var firstWeekContainsDate = options.firstWeekContainsDate == null ? defaultFirstWeekContainsDate : toInteger(options.firstWeekContainsDate);
    if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
        throw new RangeError('firstWeekContainsDate must be between 1 and 7 inclusively');
    }
    var localeWeekStartsOn = locale1.options && locale1.options.weekStartsOn;
    var defaultWeekStartsOn = localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn);
    var weekStartsOn = options.weekStartsOn == null ? defaultWeekStartsOn : toInteger(options.weekStartsOn);
    if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
        throw new RangeError('weekStartsOn must be between 0 and 6 inclusively');
    }
    if (!locale1.localize) {
        throw new RangeError('locale must contain localize property');
    }
    if (!locale1.formatLong) {
        throw new RangeError('locale must contain formatLong property');
    }
    var originalDate = toDate(dirtyDate);
    if (!isValid(originalDate)) {
        throw new RangeError('Invalid time value');
    }
    var timezoneOffset = getTimezoneOffsetInMilliseconds(originalDate);
    var utcDate = subMilliseconds(originalDate, timezoneOffset);
    var formatterOptions = {
        firstWeekContainsDate: firstWeekContainsDate,
        weekStartsOn: weekStartsOn,
        locale: locale1,
        _originalDate: originalDate
    };
    var result = formatStr.match(longFormattingTokensRegExp).map(function(substring) {
        var firstCharacter = substring[0];
        if (firstCharacter === 'p' || firstCharacter === 'P') {
            var longFormatter = longFormatters[firstCharacter];
            return longFormatter(substring, locale1.formatLong, formatterOptions);
        }
        return substring;
    }).join('').match(formattingTokensRegExp).map(function(substring) {
        if (substring === "''") {
            return "'";
        }
        var firstCharacter = substring[0];
        if (firstCharacter === "'") {
            return cleanEscapedString(substring);
        }
        var formatter = formatters1[firstCharacter];
        if (formatter) {
            if (!options.useAdditionalWeekYearTokens && isProtectedWeekYearToken(substring)) {
                throwProtectedError(substring, dirtyFormatStr, dirtyDate);
            }
            if (!options.useAdditionalDayOfYearTokens && isProtectedDayOfYearToken(substring)) {
                throwProtectedError(substring, dirtyFormatStr, dirtyDate);
            }
            return formatter(utcDate, substring, locale1.localize, formatterOptions);
        }
        if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
            throw new RangeError('Format string contains an unescaped latin alphabet character `' + firstCharacter + '`');
        }
        return substring;
    }).join('');
    return result;
}
function cleanEscapedString(input) {
    return input.match(escapedStringRegExp)[1].replace(doubleQuoteRegExp, "'");
}
const componentWith = ({ customWindow , dateGenerator  })=>{
    class BCDateComponent extends customWindow.HTMLElement {
        constructor(){
            super();
            this.date = dateGenerator();
        }
        static componentName() {
            return "bc-date";
        }
        set date(date) {
            this.innerHTML = format(date, "dd MMMM yyyy HH:mm:ss", {
            });
        }
    }
    customWindow.customElements.define(BCDateComponent.componentName(), BCDateComponent);
    return BCDateComponent;
};
const componentWith1 = ({ customWindow  })=>{
    class BCBirthdayTable extends customWindow.HTMLElement {
        constructor(){
            super();
            this.attachShadow({
                mode: "open"
            });
            this.shadowRoot.appendChild(template.content.cloneNode(true));
            this.birthdateComponent = this.shadowRoot.querySelector("[data-test=birthdate]");
        }
        static componentName() {
            return "bc-birthday-table";
        }
        set birthdate(birthdate) {
            this.birthdateComponent.date = birthdate;
        }
    }
    const template = customWindow.document.createElement("template");
    template.innerHTML = `\n    <div><bc-date data-test="today"></bc-date></div>\n    <div><bc-date data-test="birthdate"></bc-date></div>\n  `;
    customWindow.customElements.define(BCBirthdayTable.componentName(), BCBirthdayTable);
    return BCBirthdayTable;
};
componentWith({
    customWindow: window,
    dateGenerator: ()=>new Date()
});
componentWith1({
    customWindow: window
});
