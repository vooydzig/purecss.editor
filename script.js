$(document).ready(function() {
    function isInt(n) { return (n%1 === 0); }

    $('.content').mousedown(function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.which !== 1 || $(e.target).hasClass('content'))
            return;
        if (e.ctrlKey)
            addActiveElement($(e.target));
        else
            setActiveElement($(e.target));
    });

    function setActiveElement($element) {
        $('.active').removeClass('active');
        $element.addClass('active');
    }

    function addActiveElement($element) {
        $element.toggleClass('active');
    }

    $('#reset').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        $('.content').empty();
        $activeElement = null;
    });

    $('#add-row').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        $('.content').append('<div class="pure-g row"><div class="pure-u-24-24 box">24/24</div></div>');
    });

    $('#split').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        var activeElements = $('.active');
        if (!activeElements.length)
            return;

        for (var i=0; i<activeElements.length; i++) {
            var $activeElement = $(activeElements[i]);
            var width = getElementWidth($activeElement);
            if (width <= 1)
                continue;

            var new_widths = [];
            if (isInt(width/2))
                new_widths = [width/2, width/2];
            else
                new_widths = [(width+1)/2, (width-1)/2];

            $activeElement.removeClass('pure-u-'+width+'-24').addClass('pure-u-'+new_widths[0]+'-24').text(new_widths[0]+'/24');
            $activeElement.after('<div class="pure-u-'+new_widths[1]+'-24 box">'+new_widths[1]+'/24</div>');
        }
    });

    $('#remove').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        var activeElements = $('.active');
        if (!activeElements.length)
            return;

        for (var i=0; i<activeElements.length; i++) {
            var $activeElement = $(activeElements[i]); 
            var width = getElementWidth($activeElement);
            if (width == 24)
                removeRow($activeElement);
            else
                removeColumn($activeElement, width);
        }
    });

    function removeRow($activeElement) {
        $activeElement.parent().remove();
    }

    function removeColumn($activeElement, width) {
        var $elem = $activeElement.prev();
        if (!$elem.length)
            $elem = $activeElement.next();
        var elemWidth = getElementWidth($elem);
        $elem.removeClass('pure-u-'+elemWidth+'-24').addClass('pure-u-'+(elemWidth + width)+'-24').text((elemWidth + width)+'/24');

        $activeElement.remove();
    }

    function getElementWidth($activeElement) {
        var check = 'pure-u-';
        var classes = $activeElement.attr('class').split(' ');
        for (var i=0; i<classes.length; i++) {
            var cls = classes[i];
            if (cls.indexOf(check) > -1)
                return parseInt(cls.slice(check.length, cls.length).split('-')[0]);
        }
        return 0;
    }
});