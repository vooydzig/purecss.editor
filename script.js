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
      $('.content').append('<div class="pure-g row"><div class="pure-u-24-24 box"></div></div>');
    },
    'grid-split-cell': onCellSplit,
    'grid-remove-cell': onCellRemove,
    'grid-clear-cell': function(e) { $('.active').text(''); },
    'form-inline': onFormClick,
    'form-stacked': onFormClick,
    'form-aligned': onFormClick
  };

  $( ".content" ).mousedown(function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.which !== 1 || $(e.target).hasClass('content'))
      return;
    var $box = $(e.target);

    if (!$box.hasClass('box'))
      $box = $box.parents('.box');
    if (e.ctrlKey)
      addActiveElement($box);
    else
      setActiveElement($box);
  });

  $('.pure-menu-heading').click(function(e) {
    $('.pure-menu-list').hide();
    $('.pure-menu-heading').removeClass('menu-active').find('i.fa').addClass('fa-caret-down');
    $(this).find('i.fa').removeClass('fa-caret-down');
    $(this).addClass('menu-active').next().show();
  });

  $('.pure-menu-item').click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    var id = $(this).find('a').attr('id');
    if (!TOOLBAR_CALLBACKS[id])
      return;
    TOOLBAR_CALLBACKS[id](e);
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
      $activeElement.removeClass('pure-u-'+width+'-24').addClass('pure-u-'+new_widths[0]+'-24');
      $activeElement.after('<div class="pure-u-'+new_widths[1]+'-24 box"></div>');
    }
  }

  function onCellRemove(e) {
    var activeElements = $('.content .active');
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
    $elem.removeClass('pure-u-'+elemWidth+'-24').addClass('pure-u-'+(elemWidth + width)+'-24');
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

  function onFormClick(e) {
    var activeElements = $('.active');
    if (!activeElements.length)
      return;
    var type = $(e.target).attr('id').split('-')[1];
    var $form;
    if (type == 'inline')
      $form = _buildInlineForm();
    else if (type == 'stacked')
      $form = _buildStackedForm();
    else if (type == 'aligned')
      $form = _buildAlignedForm();
    for (var i=0; i<activeElements.length; i++)
      $(activeElements[i]).html('').append($form);
  }

  function _buildInlineForm() {
    var $form = $('<form class="pure-form"></form>');
    $form.append('<fieldset></fieldset>');
    var $fieldset = $form.find('fieldset');
    $fieldset.append('<legend>A compact inline form</legend>');
    $fieldset.append('<input type="email" placeholder="Email">');
    $fieldset.append('<input type="password" placeholder="Password">');
    $fieldset.append('<label for="remember"><input id="remember" type="checkbox"> Remember me</label>');
    $fieldset.append('<button type="submit" class="pure-button pure-button-primary">Sign in</button>');
    return $form;
  }

  function _buildStackedForm() {
    var $form = $('<form class="pure-form pure-form-stacked"></form>');
    $form.append('<fieldset></fieldset>');
    var $fieldset = $form.find('fieldset');
    $fieldset.append('<legend>A Stacked Form</legend>');
    $fieldset.append('<label for="email">Email</label><input id="email" type="email" placeholder="Email">');
    $fieldset.append('<label for="password">Password</label><input id="password" type="password" placeholder="Password">');
    $fieldset.append('<label for="state">State</label>');
    $fieldset.append('<select id="state"><option>AL</option><option>CA</option><option>IL</option></select>');
    $fieldset.append('<label for="remember" class="pure-checkbox"><input id="remember" type="checkbox"> Remember me</label>');
    $fieldset.append('<button type="submit" class="pure-button pure-button-primary">Sign in</button>');
    return $form;
  }

  function _buildAlignedForm() {
    var $form = $('<form class="pure-form pure-form-aligned"></form>');
    $form.append('<fieldset></fieldset>');
    var $fieldset = $form.find('fieldset');
    $fieldset.append('<legend>A Aligned Form</legend>');
    return $form;
  }
});