define(['./properties'], function(properties) {

  var widgets = {  };

  (function() {
    widgets['row'] = {
      build: function() {
        var $row = $('<div class="pure-g row"></div>');
        var $cell = widgets['cell'].build(24);
        $row.append($cell);
        return $row;
      },
      clear: function($widget) { $widget.html('<div class="pure-g row"></div>'); }
    };
  })();

  (function() {
    widgets['cell'] = {
      build: function(width) {
        var $cell = $('<div class="pure-u-' + width.toString() + '-24 box"></div>');
        $cell.data('name', 'Pure cell');
        $cell.data('is_selectable', true);
        $cell.data('properties', [
          new properties.ReadOnlyProperty('width', width)
        ]);
        return $cell;
      },
      clear: function($widget) { $widget.text(''); }
    }
  })();

  (function() {
    widgets['form'] = {
      build: function (type) {
        var $form = getWidget(type);
        $form.data('type', type);
        $form.data('name', 'Pure Form');
        $form.data('is_selectable', true);
        $form.data('properties', [
          new properties.ListProperty('type', ['inline', 'stacked' /*, 'aligned'*/], function(oldVal, newVal) {
            onTypePropertyChanged($form, oldVal, newVal);
          })
        ]);
        return $form;
      },
      clear: function($widget) { $widget.find('fieldset').html(''); }
    };

    function onTypePropertyChanged ($form, oldVal, newVal) {
      $form.data('type', newVal);
      $form.removeClass('pure-form-stacked pure-form-aligned');
      if (newVal === 'inline')
        return;
      $form.addClass('pure-form-'+newVal);
    }

    function getWidget(type) {
      var $form = $('<form class="pure-form"></form>');
      $form.append('<fieldset></fieldset>');
      var $fieldset = $form.find('fieldset');
      $fieldset.append('<legend>A compact '+type+' form</legend>');
      $fieldset.append(widgets['input'].build('text'));
      $fieldset.append(widgets['input'].build('password'));
      return $form
    }
  })();

  (function() {
    widgets['input'] = {
      build: function (type) {
        var $input = getWidget(type);
        $input.data('name', 'Input');
        $input.data('is_selectable', true);
        $input.data('properties', [
          new properties.ListProperty('type', ['text', 'password', 'select'], function(oldVal, newVal) {
            $input.data('type', newVal);
            //TODO: replace ONE widget with anther
            // possibly wrap $input in some div
            $input.after(widgets['input'].build(newVal));
            $input.remove();
          })
        ]);
        return $input;

      },
      clear: function($widget) {
        if ($widget.prop('tagName').toLowerCase() !== 'input')
          return;
        $widget.val('');
      }
    };

    function getWidget(type) {
      if (type === 'select')
        return getSelect();
      return getInput(type);
    }

    function getInput(type) {
      return $('<label>Input</label><input type="'+type+'" placeholder="'+type+' input" />');
    }

    function getSelect() {
      return $('<select><option>Option 1</option><option>Option 2</option><option>Option 3</option></select>');
    }
  })();

  return {
    build: function(widget, data) {
      return widgets[widget].build(data);
    },
    clear: function($widget) {
      widgets[widget].clear($widget);
    }
  }
});