define(function() {

  function Property(name, initialValue, onUpdate) {
    this.name = name;
    this.value = initialValue;
    this.onUpdate = onUpdate || null;
  }

  (function () {
    Property.prototype.update = function (value) {
      if (this.onUpdate)
        this.onUpdate(this.value, value);
      this.value = value;
    };

    Property.prototype.getWidget = function () {
      var that = this;
      var $widget = this._getWidget();
      $widget.change(function() {
        that.update(this.value);
      });

      return $widget;
    };

    Property.prototype._getWidget = function() {
      return $('<label for="'+this.name+'">' + this.name.toUpperCase()+'</label>' +
            '<input class="pure-input-1" ' + 'id="'+this.name+'" ' + 'type="text" ' +
            'value="' + this.value+ '" />');
    };
  })();

  function ReadOnlyProperty(name, initialValue) {
    Property.call(this, name,  initialValue);
  }

  (function () {
    ReadOnlyProperty.prototype = Object.create(Property.prototype);

    ReadOnlyProperty.prototype._getWidget = function() {
      return $('<span class="pure-u-1"><span class="property-name">' + this.name.toUpperCase()+': </span>' +
          '<span class="property-value">' + this.value+ '</span></span>');
    };
  })();


  function BooleanProperty(name, initialValue, onUpdate) {
    Property.call(this, name,  initialValue, onUpdate);
  }

  (function () {

    BooleanProperty.prototype = Object.create(Property.prototype);

    BooleanProperty.prototype._getWidget = function () {
      return $('<span class="property-name">' + this.name.toUpperCase() + ': </span>' +
        '<input ' + 'id="' + this.name + '" ' + 'type="checkbox" ' +
        (Boolean(this.value) ? 'checked' : '') + '/>');
    };
  })();


  function ListProperty(name, values, onUpdate) {
    Property.call(this, name, values[0], onUpdate);
    this.values = values;
  }

  (function () {
    ListProperty.prototype = Object.create(Property.prototype);

    ListProperty.prototype._getWidget = function () {
      var html = '<label for="' + this.name + '">' + this.name.toUpperCase() + '</label>';
      html += '<select class="pure-input-1"' + 'id="' + this.name + '">';
      for (var i=0; i<this.values.length; i++)
        html += '<option value="'+this.values[i]+'" >'+this.values[i].toUpperCase()+'</option>';
      html += '</select>';
      return $(html);
    };
  })();

  return {
    Property: Property,
    ReadOnlyProperty: ReadOnlyProperty,
    BooleanProperty: BooleanProperty,
    ListProperty: ListProperty,
  }
});