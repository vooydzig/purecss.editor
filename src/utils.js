define(function() {
  function isInt(n) {
    return (n % 1 === 0);
  }

  function getElementWidth($activeElement) {
    var check = 'pure-u-';
    var classes = $activeElement.attr('class').split(' ');
    for (var i = 0; i < classes.length; i++) {
      var cls = classes[i];
      if (cls.indexOf(check) > -1)
        return parseInt(cls.slice(check.length, cls.length).split('-')[0]);
    }
    return 0;
  }

  return {
    isInt: isInt,
    getElementWidth: getElementWidth
  }
});