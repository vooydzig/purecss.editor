$(document).ready(function() {
    //inspiration: http://www.layoutit.com/build
    function isInt(n) { return (n%1 === 0); }

    var TOOLBAR_CALLBACKS = {
      'clear': function (e) {
        $('.content').empty().show();
        $('.code').hide();
      },
      'code': function(e) {
        var data = $('.content').toggle().html();
        var $code = $('.code');
        $code.toggle().find('code').text(formatCode(data));
        hljs.highlightBlock($code[0]);
      },
      'grid-add-row': function(e) {
        $('.content').append('<div class="pure-g row"><div class="pure-u-24-24 box">24/24</div></div>');
      },
      'grid-split-cell': onCellSplit,
      'grid-remove-cell': onCellRemove,
      'grid-clear-cell': function(e) { $('.active').text(''); }
    };

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

    $('.pure-menu-heading').click(function(e) {
      $('.pure-menu-list').hide();
      $('.pure-menu-heading').removeClass('active').find('i.fa').addClass('fa-caret-down');
      $(this).find('i.fa').removeClass('fa-caret-down');
      $(this).addClass('active').next().show();
    });

    $('.pure-menu-item').click(function(e) {
      e.preventDefault();
      e.stopPropagation();
      var id = $(this).find('a').attr('id');
      if (TOOLBAR_CALLBACKS[id])
        TOOLBAR_CALLBACKS[id](e);
      else
        console.log('Not implemented yet!');
    });

    function setActiveElement($element) {
        $('.active').removeClass('active');
        $element.addClass('active');
    }

    function addActiveElement($element) {
        $element.toggleClass('active');
    }

    function onCellSplit(e) {
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
    }

    function onCellRemove(e) {
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
    }

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
    
    function formatCode(source) {
        var opts = {
            indent_size: 4,
            indent_char: ' ',
            end_with_newline: true,
            wrap_line_length: 80,
            indent_inner_html: true
        };
        return html_beautify(source, opts);
    }
    
});