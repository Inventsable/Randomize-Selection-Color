var options = {
  /**
   * Maximum delta difference from current color. Smaller = less change, larger = more change
   *   - Should always be a number between 0 and 255 (this is the min/max of RGB colors)
   *   - Should probably never be above 100
   */
  threshold: 10, // You can change this number
};

RGBColor.prototype.create = function (red, green, blue) {
  this.red = red;
  this.green = green;
  this.blue = blue;
  return this;
};
RGBColor.prototype.getArray = function () {
  return [this.red, this.green, this.blue];
};
Array.prototype.forEach = function (callback) {
  for (var i = 0; i < this.length; i++) callback(this[i], i, this);
};
Array.prototype.filter = function (callback) {
  var filtered = [];
  for (var i = 0; i < this.length; i++)
    if (callback(this[i], i, this)) filtered.push(this[i]);
  return filtered;
};
Array.prototype.map = function (callback) {
  var mappedParam = [];
  for (var i = 0; i < this.length; i++)
    mappedParam.push(callback(this[i], i, this));
  return mappedParam;
};
Number.prototype.isBetween = function (min, max) {
  return (!min && min !== 0) || (!max && max !== 0) || arguments.length < 2
    ? false
    : this >= min && this <= max;
};
Number.prototype.clamp = function (min, max) {
  if (this.isBetween(min, max)) return this.valueOf();
  else if (this < min) return min;
  else if (this > max) return max;
};
function randomNumber(max) {
  return Math.floor(Math.random() * max + 1);
}
function get(type, parent, deep) {
  if (arguments.length == 1 || !parent) {
    parent = app.activeDocument;
    deep = false;
  }
  var result = [];
  if (!parent[type]) return [];
  for (var i = 0; i < parent[type].length; i++) {
    result.push(parent[type][i]);
    if (parent[type][i][type] && deep)
      result = [].concat(result, get(type, parent[type][i]));
  }
  return result || [];
}

function randomizeColorsInSelection() {
  try {
    if (!app.selection.length) {
      alert("Must have a selection to use this script");
      return null;
    }
    get("selection")
      .filter(function (item) {
        return /path/i.test(item.typename);
      })
      .forEach(function (item) {
        if (/rgb/i.test("" + item.fillColor)) {
          var newChannels = [];
          item.fillColor.getArray().forEach(function (channel) {
            var deltaShift =
              randomNumber(options.threshold || 10) *
              (Math.round(Math.random()) ? -1 : 1);
            newChannels.push(channel + deltaShift);
          });
          newChannels = newChannels.map(function (channel) {
            return channel.clamp(0, 255);
          });
          item.fillColor = new RGBColor().create(
            newChannels[0],
            newChannels[1],
            newChannels[2]
          );
        }
      });
  } catch (err) {
    alert(err);
  }
}

randomizeColorsInSelection();
