define(['./utils', './widgets'], function(utils, widgets) {

  var OPTIONS = {
    beforeAction: function() {},
    afterAction: function() {}
  };

  function init(options) {
    if (options !== undefined)
      OPTIONS = $.extend({}, OPTIONS, options);
    initCollapsableHeaders();
    initToolbarOptions();
  }

  function initCollapsableHeaders() {
    $('.pure-menu-heading').click(function (e) {
      $('.pure-menu-list').hide();
      $('.pure-menu-heading').removeClass('menu-active').find('i.fa').addClass('fa-caret-down');
      $(this).find('i.fa').removeClass('fa-caret-down');
      $(this).addClass('menu-active').next().show();
    });
  }

  function initToolbarOptions() {
    $('.pure-menu-item').click(function (e) {
      e.preventDefault();
      e.stopPropagation();

      OPTIONS.beforeAction();
      var id = $(this).find('a').attr('id');
      if (!TOOLBAR_CALLBACKS[id])
        return;
      TOOLBAR_CALLBACKS[id](e);
      OPTIONS.afterAction();
    });
  }

  var TOOLBAR_CALLBACKS = {
    'clear': function (e) {
      $('.content').empty().show();
      $('.code').hide();
    },
    'code': function (e) {
      var data = $('.content').toggle().html();
      var $code = $('.code');
      $code.toggle().find('code').text(formatCode(data));
      hljs.highlightBlock($code[0]);
    },
    'grid-add-row': function (e) {
      $('.content').append(widgets.build('row'));
    },
    'grid-split-cell': onCellSplit,
    'grid-remove-cell': onCellRemove,
    'grid-clear-cell': function (e) { $('.active').text(''); },
    'add-form': onFormAdd,
    'add-input': onInputAdd,
  };

  function onCellSplit(e) {
    var activeElements = $('.active');
    if (!activeElements.length)
      return;

    for (var i = 0; i < activeElements.length; i++) {
      var $activeElement = $(activeElements[i]);
      var widthProp = $activeElement.data('properties')[0];
      var width = utils.getElementWidth($activeElement);
      if (width <= 1)
        continue;

      var new_widths = [];
      if (utils.isInt(width / 2))
        new_widths = [width / 2, width / 2];
      else
        new_widths = [(width + 1) / 2, (width - 1) / 2];
      widthProp.update(new_widths[0])
      $activeElement.removeClass('pure-u-' + width + '-24').addClass('pure-u-' + new_widths[0] + '-24');
      $activeElement.after(widgets.build('cell', new_widths[1]));
    }
  }

  function onCellRemove(e) {
    var activeElements = $('.content .active');
    if (!activeElements.length)
      return;

    for (var i = 0; i < activeElements.length; i++) {
      var $activeElement = $(activeElements[i]);
      var width = utils.getElementWidth($activeElement);
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
    var elemWidth = utils.getElementWidth($elem);
    $elem.removeClass('pure-u-' + elemWidth + '-24').addClass('pure-u-' + (elemWidth + width) + '-24');
    $activeElement.remove();
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

  function onFormAdd(e) {
    var activeElements = $('.active');
    if (!activeElements.length)
      return;
    var $form = widgets.build('form', 'inline');
    for (var i = 0; i < activeElements.length; i++)
      $(activeElements[i]).html('').append($form);
  }

  function onInputAdd(e) {
    var activeElements = $('.active');
    if (!activeElements.length)
      return;
    var $input = widgets.build('input', 'text');
    for (var i = 0; i < activeElements.length; i++) {
      var $active = $(activeElements[i]);
      if ($active.prop('tagName').toLowerCase() === 'form')
        $active.find('fieldset').append($input);
    }
  }

  return {
    init: init
  }

});
