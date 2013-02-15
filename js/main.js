(function(window, undefined) {

  /* Define our menus */

  var mainMenu = [
    {id:'movies', iconClass:'gen', iconChar:'&#xf01f;', target: 'template'},
    {id:'music', iconClass:'access', iconChar:'&#xf001;', target: 'template'},
    {id:'photos', iconClass:'gen', iconChar:'&#xf021;', target: 'template'},
    {id:'games', iconClass:'gen', iconChar:'&#xf02d;', target: 'template'},
    {id:'video chat', iconClass:'social', iconChar:'&#xf01b;', target: 'template'},
    {id:'messages', iconClass:'gen', iconChar:'&#xf007;', target: 'template'},
    {id:'store', iconClass:'gen', iconChar:'&#xf024;', target: 'template'},
    {id:'settings', iconClass:'gen', iconChar:'&#xf000;', target: 'settings'}
  ];

  var settingsMenu = [
    {id:'back', iconClass:'gen', iconChar:'&#xf015;', target: 'main'},
    {id:'profile', iconClass:'social', iconChar:'&#xf019;', target: 'template'},
    {id:'cloud sync', iconClass:'gen', iconChar:'&#xf012;', target: 'template'},
    {id:'wifi settings', iconClass:'social', iconChar:'&#xf002;', target: 'template'},
    {id:'date / time', iconClass:'gen', iconChar:'&#xf029;', target: 'template'},
    {id:'reload', iconClass:'gen', iconChar:'&#xf01d;', target: 'reload'}
  ];

  var menuCache = {};

  /* Our media center object */

  var MC = {

    init: function(){
      MC.Ui.init();
    },

    /* All UI components go here */

    Ui: {

      init: function(){
        this.createBackground();
        this.createMainMenu();
        this.currentScreen = document.getElementById('main');
        this.createSettingsMenu(); // TODO: defer this until this is needed
        this.createPageTemplate(); // TODO: defer this until this is needed
      },

      currentScreen: null,

      toggleScreen: function(menuId, screenId){
        if (this.currentScreen && this.currentScreen.id === screenId) {
          return;
        }

        var newScreen = document.getElementById(screenId);

        if (newScreen) {
          if (menuId && !/menu/.test(newScreen.className)) {
            newScreen.getElementsByTagName('li')[1].innerHTML = '<span class="icon-' + menuCache[menuId].iconClass + '">' + menuCache[menuId].iconChar + "</span>&nbsp;<strong>" + menuId.toUpperCase() + "</strong>";
            newScreen.getElementsByTagName('a')[0].dataset.target = this.currentScreen.id;
          }
          if (this.currentScreen) {
            this.currentScreen.className = this.currentScreen.className.replace(/ ?current ?/, '');
          }
          newScreen.className += ' current';
          this.currentScreen = newScreen;
        } else {
          console.error('No screen found with that id');
        }
      },

      createBackground: function(){
        document.body.innerHTML = '<div class="background"></div>';
      },

      createMainMenu: function(){
        this.createMenu('main', mainMenu, true);
      },

      createSettingsMenu: function(){
        this.createMenu('settings', settingsMenu, false);
      },

      createPageTemplate: function(){
        var div = document.createElement('div');
        div.id = 'template';
        div.className = 'content';
        div.innerHTML = '<ul class="header menu"><li><a data-target="main" class="icon-gen" href="#">&#xf015;</a></li><li></li></ul>';
        document.body.appendChild(div);
      },

      createMenu: function(id, items, current) {
        var menu = document.createElement('ul'), html = [];
        menu.className = 'menu screen';
        if (current) {
          menu.className += ' current';
        }
        menu.id = id;
        for (var i=0, len=items.length; i<len; i++) {
          menuCache[items[i].id] = items[i];
          html.push('<li><a data-id="'+items[i].id+'" data-target="'+items[i].target+'" class="icon-'+items[i].iconClass+'" href="#">'+items[i].iconChar+'</li>');
        }
        menu.innerHTML = html.join('');
        document.body.appendChild(menu);
      }
    },

    Actions: {
      reload: function(){
        location.reload(true);
      }
    },

    Events: {
      handle: function (target, event) {
        // Only care about interactions on <a> tags for now
        // TODO: add pulse effect to notify user of click?
        if (target.tagName.toLowerCase() !== 'a') {
          event.preventDefault();
          return false;
        }

        // We rely on data attributes to figure out what to do
        var data = false;
        for (attributes in target.dataset) {
          data = target.dataset;
          break;
        }
        if (data === false) {
          event.preventDefault();
          return false;
        }

        // Dispatch a specific action if exists
        if (data.target && typeof MC.Actions[data.target] === 'function') {
          event.preventDefault();
          MC.Actions[data.target]();
          return;
        }

        // Handle changing screens as a fallback
        if (data.target) {
          event.preventDefault();
          MC.Ui.toggleScreen(data.id, data.target);
          return;
        }
      },

      trigger: function(){
        // TODO
      }
    }
  };

  /* Bind events to the window for event delegation once and for all */

  window.addEventListener('click', function(event){
    if (event.button === 0) {
      MC.Events.handle(event.target, event);
    }
  });

  window.addEventListener('touchstart', function(event){
    MC.Events.handle(event.target, event);
  });

  /* Export the init function */

  window.MC = {
    init: MC.init,
    reload: MC.Actions.reload
  };

})(window);