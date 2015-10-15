define(['./toolbar'], function(toolbar) {

  function Editor() {
    toolbar.init({
      afterAction: function() { updatePropertiesPanel($('.active').data()); }
    });

    $(".content").mousedown(function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (e.which !== 1)
        return;
      var $target = $(e.target);
      if (e.ctrlKey)
        toggleActiveElement($target);
      else
        setActiveElement($target);
    });
  }

  function setActiveElement($element) {
    $('.active').removeClass('active');
    var data = $element.data();
    while (!Boolean(data.is_selectable)) {
      $element = $element.parent();
      data = $element.data();
    }
    $element.addClass('active');
    updatePropertiesPanel(data);
  }

  function updatePropertiesPanel(data) {
    if (!data)
      return;
    $('.active-element').text(data.name || $('.active').prop('tagName'));
    var $props = $('.properties-main fieldset');
    $props.html('');
    var properties = data.properties || [];
    for (var i=0; i<properties.length; i++)
      $props.append(properties[i].getWidget());
  }

  function toggleActiveElement($element) {
    $element.toggleClass('active');
  }

  return Editor;

});