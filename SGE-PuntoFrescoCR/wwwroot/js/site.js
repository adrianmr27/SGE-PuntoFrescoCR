// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

(function () {
    const TARGET_OFFSET_MINUTES = (window.APP_TIMEZONE_OFFSET_MINUTES !== undefined) ? window.APP_TIMEZONE_OFFSET_MINUTES : -360;

    function toTargetDate(d) {
        // Convert any Date instance to the target timezone by using UTC as pivot
        const utc = d.getTime() + d.getTimezoneOffset() * 60000;
        return new Date(utc + TARGET_OFFSET_MINUTES * 60000);
    }

    function pad(n) { return n < 10 ? '0' + n : n; }

    function formatForDateInput(d) {
        return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    }

    function formatForDateTimeLocalInput(d) {
        return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    }

    // On page load, adjust existing date / datetime-local inputs to display in target timezone
    $(function () {
        $('input[type="date"], input[type="datetime-local"]').each(function () {
            var $el = $(this);
            var val = $el.val();
            if (!val) return;
            var d = new Date(val);
            if (isNaN(d)) return;
            var td = toTargetDate(d);
            if ($el.attr('type') === 'date') {
                $el.val(formatForDateInput(td));
            } else {
                $el.val(formatForDateTimeLocalInput(td));
            }
        });
    });

    // Before form submit convert marked inputs (data-as-utc) to UTC ISO strings so server receives consistent UTC
    $(document).on('submit', 'form', function () {
        $(this).find('input[data-as-utc]').each(function () {
            var $el = $(this);
            var val = $el.val();
            if (!val) return;
            var type = $el.attr('type');
            if (type === 'date') {
                var parts = val.split('-');
                if (parts.length < 3) return;
                var y = parseInt(parts[0], 10);
                var m = parseInt(parts[1], 10) - 1;
                var day = parseInt(parts[2], 10);
                // treat as midnight in target timezone, convert to UTC
                var localMidnight = Date.UTC(y, m, day, 0, 0, 0);
                var utcMillis = localMidnight - TARGET_OFFSET_MINUTES * 60000;
                $el.val(new Date(utcMillis).toISOString());
            } else if (type === 'datetime-local') {
                // input like 2026-07-27T13:45
                var d = new Date(val);
                if (isNaN(d)) return;
                var utcMillis = d.getTime() - TARGET_OFFSET_MINUTES * 60000;
                $el.val(new Date(utcMillis).toISOString());
            }
        });
    });

    // Expose utilities
    window.AppDateUtils = {
        toTargetDateString: function (iso) {
            var d = new Date(iso);
            if (isNaN(d)) return null;
            return formatForDateTimeLocalInput(toTargetDate(d));
        },
        toUtcIsoFromInput: function (val, type) {
            if (!val) return null;
            if (type === 'date') {
                var parts = val.split('-');
                var y = parseInt(parts[0], 10);
                var m = parseInt(parts[1], 10) - 1;
                var day = parseInt(parts[2], 10);
                var localMidnight = Date.UTC(y, m, day, 0, 0, 0);
                var utcMillis = localMidnight - TARGET_OFFSET_MINUTES * 60000;
                return new Date(utcMillis).toISOString();
            } else {
                var d = new Date(val);
                if (isNaN(d)) return null;
                var utcMillis = d.getTime() - TARGET_OFFSET_MINUTES * 60000;
                return new Date(utcMillis).toISOString();
            }
        }
    };

})();
