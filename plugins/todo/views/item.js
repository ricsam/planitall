(function() {
  var ItemView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ItemView = (function(_super) {
    __extends(ItemView, _super);

    function ItemView() {
      return ItemView.__super__.constructor.apply(this, arguments);
    }

    ItemView.prototype.tagName = 'li';

    ItemView.prototype.initialize = function() {};

    ItemView.prototype.render = function() {
      this.$el.append("<p>" + (this.model.get('title')) + "</p>");
      return this.$el.append('<button class="delete">Delete</button>');
    };

    ItemView.prototype.events = {
      'click': 'edit',
      'blur p': 'save',
      'keydown p': function(ev) {
        if (ev.keyCode === 13) {
          ev.preventDefault();
          return this.save();
        }
      },
      'click button': 'remove'
    };

    ItemView.prototype.edit = function() {
      return this.$('p').attr('contenteditable', true).focus();
    };

    ItemView.prototype.save = function() {
      this.model.set('title', this.$('p').attr('contenteditable', false).text());
      if (!this.model.hasChanged()) {
        return this.model.save();
      }
    };

    ItemView.prototype.remove = function() {
      this.model.destroy();
      return this.$el.remove();
    };

    return ItemView;

  })(Backbone.View);

  window.itemviewshit = 123;

  app.get('plugin').get('todo').get('imports').set('views/item.js', [
    {
      local: true,
      global: false,
      "import": ItemView
    }
  ]);

}).call(this);
