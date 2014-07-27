(function() {
  var App, AppView, Clearer, GetSet, Navigation, Plugin, PluginBluepint, Plugins, Router, Views, fs, gui, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  gui = require('nw.gui');

  path = './';

  fs = require('fs');

  fs.watch(path, function() {
    return typeof location !== "undefined" && location !== null ? location.reload() : void 0;
  });

  GetSet = (function(_super) {
    __extends(GetSet, _super);

    function GetSet() {
      return GetSet.__super__.constructor.apply(this, arguments);
    }

    GetSet.prototype.initialize = function() {
      return this.on('change', function() {
        var attrs, key, val, _results;
        attrs = this.changedAttributes();
        if (attrs) {
          _results = [];
          for (key in attrs) {
            val = attrs[key];
            _results.push(this.trigger('loaded:' + key, val, this.model));
          }
          return _results;
        }
      });
    };

    return GetSet;

  })(Backbone.Model);

  Plugins = (function(_super) {
    __extends(Plugins, _super);

    function Plugins() {
      return Plugins.__super__.constructor.apply(this, arguments);
    }

    Plugins.prototype.initialize = function() {};

    return Plugins;

  })(Backbone.Collection);

  PluginBluepint = (function(_super) {
    __extends(PluginBluepint, _super);

    function PluginBluepint() {
      return PluginBluepint.__super__.constructor.apply(this, arguments);
    }

    PluginBluepint.prototype.initialize = function() {
      this.set('model', this.bpm);
      return this.set('view', this.bpv);
    };

    PluginBluepint.prototype.bpm = (function(_super1) {
      __extends(_Class, _super1);

      _Class.prototype['default-blueprint-properties'] = {
        navigatable: false,
        imports: new GetSet
      };

      function _Class() {
        var dbp, id, number_of_plugins;
        number_of_plugins = app.get('plugin').collection.length;
        id = "" + (Math.random().toString(36).substr(2, 6)) + "-" + number_of_plugins;
        dbp = this['default-blueprint-properties'];
        dbp.title = "Plugin#" + id;
        dbp.id = id;
        dbp.imports.model = this;
        _.defaults(this.defaults, dbp);
        delete this['default-blueprint-properties'];
        Backbone.Model.apply(this, arguments);
      }

      return _Class;

    })(Backbone.Model);

    PluginBluepint.prototype.bpv = (function(_super1) {
      __extends(_Class, _super1);

      function _Class() {
        return _Class.__super__.constructor.apply(this, arguments);
      }

      _Class.prototype.el = '.plugin';

      return _Class;

    })(Backbone.View);

    return PluginBluepint;

  })(Backbone.Model);

  Plugin = (function(_super) {
    __extends(Plugin, _super);

    function Plugin() {
      return Plugin.__super__.constructor.apply(this, arguments);
    }

    Plugin.prototype.local = {};

    Plugin.prototype.global = {};

    Plugin.prototype.localAssets = {
      js: {},
      image: {},
      stylesheet: {}
    };

    Plugin.prototype.Blueprint = new PluginBluepint;

    Plugin.prototype["import"] = function(data) {
      var clear;
      if (!data.local && !data.global) {
        data.local = true;
      }
      if (data.local) {
        this.local[data["import"].name] = data["import"];
        clear = {};
        clear[data["import"].name] = this.local;
        return app.clearer.add('remove', 'object', clear);
      } else if (data.global) {
        return this.global[data["import"].name] = data["import"];
      }
    };

    Plugin.prototype.initialize = function() {
      this.collection = new Plugins;
      this.collection.on('add', this.memorize, this);
      this.on('pre-render', this.preRender, this);
      return this.on('post-render', this.postRender, this);
    };

    Plugin.prototype["new"] = function(model) {
      var instance;
      instance = new model;
      this.collection.add(instance);
      return {
        view: this.view,
        model: instance
      };
    };

    Plugin.prototype.view = function(view) {
      var instance, model, ref;
      model = this.model;
      instance = new view({
        model: model
      });
      ref = instance.render || null;
      instance.render = (function(ref, instance, model) {
        return function() {
          var retu;
          app.get('plugin').trigger('pre-render', model);
          retu = ref != null ? ref.apply(instance, arguments) : void 0;
          app.get('plugin').trigger('post-render', model);
          return retu;
        };
      })(ref, instance, model);
      model.view = instance;
      return model.view.model = model;
    };

    Plugin.prototype.memorize = function(model) {
      var ev, id;
      id = model.get('id');
      this.set(id, model);
      ev = 'new';
      if (model.get('navigatable')) {
        ev += ':navigatable';
      }
      return this.trigger(ev, model);
    };

    Plugin.prototype.preRender = function(model) {
      $('.plugin').loading().hide();
      app.clearer.clear();
      return this.loadAssets(model);
    };

    Plugin.prototype.postRender = function(model) {
      return app.clearer.add('unset', 'html', '.plugin');
    };

    Plugin.prototype.loadAssets = function(model) {
      var args, assets, fname, type, value, _results;
      assets = model.get('assets');
      model.set('assetsLength', 0);
      model.set('loadedAssetsCount', 0);
      _results = [];
      for (type in assets) {
        value = assets[type];
        args = [type, model];
        if (Array.isArray(value)) {
          _results.push((function() {
            var _i, _len, _results1;
            _results1 = [];
            for (_i = 0, _len = value.length; _i < _len; _i++) {
              fname = value[_i];
              _results1.push(this.load.apply(this, [fname].concat(__slice.call(args))));
            }
            return _results1;
          }).call(this));
        } else {
          _results.push(this.load.apply(this, [value].concat(__slice.call(args))));
        }
      }
      return _results;
    };

    Plugin.prototype.parseImport = function(properties, model) {
      var arrdata, _i, _len;
      model.set('loadedAssetsCount', model.get('loadedAssetsCount') + 1);
      if (Array.isArray(properties)) {
        for (_i = 0, _len = properties.length; _i < _len; _i++) {
          arrdata = properties[_i];
          this["import"](arrdata);
        }
      } else {
        this["import"](properties);
      }
      if (model.get('assetsLength') === model.get('loadedAssetsCount')) {
        return this.assetsLoaded(model);
      }
    };

    Plugin.prototype.assetsLoaded = function(model) {
      model.trigger('assetsLoaded');
      return $('.plugin').loading(false).show();
    };

    Plugin.prototype.load = function(path, type, model) {
      var ext, id, parse, types_parse, xhr;
      model.set('assetsLength', model.get('assetsLength') + 1);
      ext = path.split('.');
      ext = ext[ext.length - 1].toLowerCase();
      types_parse = {
        'js': {
          dataType: 'text',
          mime: 'text/javascript',
          parent: 'head',
          template: _.template("<script type='text/javascript' src='<%= url %>' id='plugin-script#<%= id %>'></script>"),
          "return": 'element'
        },
        'stylesheet': {
          dataType: 'text',
          mime: 'text/css',
          parent: 'head',
          template: _.template("<link rel='stylesheet' href='<%= url %>' id='plugin-stylesheet#<%= id %>'>"),
          "return": 'element'
        },
        'image': {
          dataType: '',
          mime: 'image/' + ext,
          parent: null,
          "return": 'url'
        }
      };
      parse = types_parse[type];
      id = model.get('id');
      return xhr = $.ajax({
        success: (function(_this) {
          return function(path, id, model, type, parse) {
            return function(data, status, jqXHR) {
              var blob, html, values;
              blob = new Blob([data], {
                type: parse.mime
              });
              values = {
                id: id
              };
              values.url = URL.createObjectURL(blob);
              if (parse.parent) {
                html = parse.template(values);
                values.element = $(html);
                $.ajaxSetup({
                  cache: true
                });
                $(parse.parent).append(values.element);
                $.ajaxSetup({
                  cache: false
                });
                app.clearer.add('remove', 'html', values.element);
              }
              model.get('imports').on('loaded:' + path, _this.parseImport, _this);
              if (type !== 'js') {
                model.set('loadedAssetsCount', model.get('loadedAssetsCount') + 1);
              }
              _this.localAssets[type][path] = values[parse["return"]];
              return app.clearer.add('remove', 'object', {
                base: _this.localAssets[type],
                key: path
              }, true);
            };
          };
        })(this)(path, id, model, type, parse),
        url: "./plugins/" + id + "/" + path,
        context: this,
        dataType: parse.dataType,
        isLocal: true,
        cache: false
      });
    };

    return Plugin;

  })(Backbone.Model);

  Navigation = (function(_super) {
    __extends(Navigation, _super);

    function Navigation() {
      return Navigation.__super__.constructor.apply(this, arguments);
    }

    Navigation.prototype.el = '.navigation';

    Navigation.prototype.initialize = function() {
      return app.get('plugin').on('new:navigatable', this.addPluginItem, this);
    };

    Navigation.prototype.events = {
      'click li': function(ev) {
        if (ev.target.tagName === 'LI') {
          return window.location.hash = $(ev.currentTarget).find('a').attr('href').substr(1);
        }
      }
    };

    Navigation.prototype.select = function(page, params) {
      var el, first, last;
      params = _.without(params, null);
      this.$('ul li').each(function() {
        return $(this).removeClass('selected');
      });
      first = params[0], last = params[params.length - 1];
      if (page === 'plugins' && first === 'view') {
        page = 'plugin-' + last;
      } else {
        $('.plugin').html('');
      }
      el = this.$("li[data-id='" + page + "']");
      return el.addClass('selected');
    };

    Navigation.prototype.addItem = function(attrs) {
      if (attrs.link == null) {
        attrs.link = attrs.id;
      }
      return this.$('ul').append("<li data-id='" + attrs.id + "'><a href='#" + attrs.link + "'>" + attrs.title + "</a></li>");
    };

    Navigation.prototype.addPluginItem = function(model) {
      return this.addItem({
        id: 'plugin-' + model.get('id'),
        title: model.get('title'),
        link: 'plugin/view/' + model.get('id')
      });
    };

    return Navigation;

  })(Backbone.View);

  Views = (function(_super) {
    __extends(Views, _super);

    function Views() {
      return Views.__super__.constructor.apply(this, arguments);
    }

    Views.prototype.initialize = function() {
      var name, ref, view, _ref, _results;
      this.set('home', new View.Home);
      this.set('plugins', new View.Plugins);
      this.set('calendar', new View.Calendar);
      _ref = this.attributes;
      _results = [];
      for (name in _ref) {
        view = _ref[name];
        ref = view.render || null;
        _results.push(view.render = (function(ref, view) {
          return function() {
            app.get('views').trigger('will-render', view);
            app.clearer.add('unset', 'html', '.content');
            return ref != null ? ref.apply(view, arguments) : void 0;
          };
        })(ref, view));
      }
      return _results;
    };

    return Views;

  })(Backbone.Model);

  Clearer = (function() {
    function Clearer() {
      this.clear = __bind(this.clear, this);
      this.add = __bind(this.add, this);
    }

    Clearer.prototype.toclear = [];

    Clearer.prototype.add = function() {
      var action, additional, value, what;
      action = arguments[0], what = arguments[1], value = arguments[2], additional = 4 <= arguments.length ? __slice.call(arguments, 3) : [];
      return this.toclear.push({
        what: what,
        value: value,
        action: action,
        additional: additional
      });
    };

    Clearer.prototype.clear = function() {
      var ob, whachado, _i, _len, _ref;
      whachado = {
        html: this.removeHTML,
        object: this.removeObject
      };
      _ref = this.toclear;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ob = _ref[_i];
        whachado[ob.what].apply(whachado, [ob.value, ob.action].concat(__slice.call(ob.additional)));
      }
      return this.toclear = [];
    };

    Clearer.prototype.removeHTML = function(element, action) {
      switch (action) {
        case 'remove':
          return $(element).remove();
        case 'unset':
          return $(element).html('');
        case 'show':
          return $(element).show();
      }
    };

    Clearer.prototype.removeObject = function(value, action, keys) {
      var key, val, _results;
      if (keys == null) {
        keys = false;
      }
      if (keys) {
        switch (action) {
          case 'remove':
            return delete value.base[value.key];
          case 'unset':
            return value.base[value.key] = null;
        }
      } else {
        _results = [];
        for (key in value) {
          val = value[key];
          switch (action) {
            case 'remove':
              _results.push(delete val[key]);
              break;
            case 'unset':
              _results.push(val[key] = null);
              break;
            default:
              _results.push(void 0);
          }
        }
        return _results;
      }
    };

    return Clearer;

  })();

  App = (function(_super) {
    __extends(App, _super);

    function App() {
      return App.__super__.constructor.apply(this, arguments);
    }

    App.prototype.initialize = function() {};

    App.prototype.start = function() {
      this.set('plugin', new Plugin);
      this.set('navigation', new Navigation);
      return this.set('views', new Views);
    };

    App.prototype['clearer'] = new Clearer;

    return App;

  })(Backbone.Model);

  Router = (function(_super) {
    __extends(Router, _super);

    function Router() {
      return Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.initialize = function() {
      return this.on('route', function(page, params) {
        return app.get('navigation').select(page, params);
      });
    };

    Router.prototype.routes = {
      'calendar': 'calendar',
      'plugins': 'plugins',
      'plugin/:action/:id': 'plugins',
      '*anything': 'home'
    };

    Router.prototype['calendar'] = function() {
      return app.get('views').get('calendar').render();
    };

    Router.prototype['plugins'] = function(action, id) {
      if (action == null) {
        action = false;
      }
      if (action === false) {
        return app.get('views').get('plugins').render();
      } else if (action === 'view') {
        return app.get('plugin').get(id).view.render();
      }
    };

    Router.prototype['home'] = function() {
      return app.get('views').get('home').render();
    };

    return Router;

  })(Backbone.Router);

  AppView = (function(_super) {
    __extends(AppView, _super);

    function AppView() {
      this.setupnav = __bind(this.setupnav, this);
      return AppView.__super__.constructor.apply(this, arguments);
    }

    AppView.prototype.el = '.app';

    AppView.prototype.initialize = function() {
      window.router = new Router;
      window.app = new App({});
      app.view = this;
      app.start();
      this.$('.side[type="text/template"]').each(this.setupnav);
      return app.get('views').on('will-render', app.clearer.clear, this);
    };

    AppView.prototype.setupnav = function(index, elm) {
      var id;
      id = elm.id;
      return app.get('navigation').addItem({
        id: id,
        title: elm.dataset.hasOwnProperty('title') ? elm.dataset.title : id.substr(0, 1).toUpperCase() + id.substr(1)
      });
    };

    return AppView;

  })(Backbone.View);

  new AppView();

  $(window).on('load', function() {
    return Backbone.history.start();
  });

}).call(this);
