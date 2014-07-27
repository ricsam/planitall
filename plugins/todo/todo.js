(function() {
  var Item, Items, ItemsView, Plugin, Todo, TodoView, items, itemsView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Plugin = app.get('plugin');

  Todo = (function(_super) {
    __extends(Todo, _super);

    function Todo() {
      return Todo.__super__.constructor.apply(this, arguments);
    }

    Todo.prototype.defaults = {
      id: 'todo',
      title: "Todo list",
      navigatable: true,
      assets: {
        'stylesheet': 'todo.css',
        'js': ['views/item.js']
      }
    };

    return Todo;

  })(Plugin.Blueprint.get('model'));

  TodoView = (function(_super) {
    __extends(TodoView, _super);

    function TodoView() {
      return TodoView.__super__.constructor.apply(this, arguments);
    }

    TodoView.prototype.events = {
      'click .add': 'addone'
    };

    TodoView.prototype.addone = function() {
      return items.push({});
    };

    TodoView.prototype.render = function() {
      this.$el.html("\n	<div class=\"new\"><button class=\"add\">Add New</button></div>\n	<ol class=\"items\"></ol>\n");
      return this.listenToOnce(this.model, 'assetsLoaded', function() {
        return itemsView.render();
      });
    };

    return TodoView;

  })(Plugin.Blueprint.get('view'));

  Plugin["new"](Todo).view(TodoView);

  Item = (function(_super) {
    __extends(Item, _super);

    function Item() {
      return Item.__super__.constructor.apply(this, arguments);
    }

    Item.prototype.initialize = function() {
      return this.on('change', (function(_this) {
        return function() {
          return _this.save();
        };
      })(this));
    };

    Item.prototype.defaults = {
      title: ''
    };

    return Item;

  })(Backbone.Model);

  Items = (function(_super) {
    __extends(Items, _super);

    function Items() {
      return Items.__super__.constructor.apply(this, arguments);
    }

    Items.prototype.localStorage = new Store('items');

    Items.prototype.model = Item;

    Items.prototype.initialize = function() {
      return this.fetch();
    };

    return Items;

  })(Backbone.Collection);

  ItemsView = (function(_super) {
    __extends(ItemsView, _super);

    function ItemsView() {
      return ItemsView.__super__.constructor.apply(this, arguments);
    }

    ItemsView.prototype.initialize = function() {
      return this.collection.on('add', (function(_this) {
        return function(model) {
          return _this.renderOne(model, true);
        };
      })(this));
    };

    ItemsView.prototype.render = function() {
      this.setElement($('.plugin .items'));
      return this.collection.each((function(_this) {
        return function(model) {
          return _this.renderOne(model);
        };
      })(this));
    };

    ItemsView.prototype.renderOne = function(model, focus) {
      var ItemView, view;
      if (focus == null) {
        focus = false;
      }
      ItemView = Plugin.local.ItemView;
      view = new ItemView({
        model: model
      });
      this.$el.prepend(view.render());
      if (focus) {
        return view.edit();
      }
    };

    return ItemsView;

  })(Backbone.View);

  items = new Items;

  itemsView = new ItemsView({
    collection: items
  });

}).call(this);
