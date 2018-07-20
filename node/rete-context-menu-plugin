(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('alight')) :
  typeof define === 'function' && define.amd ? define(['exports', 'alight'], factory) :
  (factory((global.ContextMenuPlugin = {}),global.alight));
}(this, (function (exports,alight) { 'use strict';

  function ___$insertStyle(css) {
    if (!css) {
      return;
    }
    if (typeof window === 'undefined') {
      return;
    }

    var style = document.createElement('style');

    style.setAttribute('type', 'text/css');
    style.innerHTML = css;
    document.head.appendChild(style);

    return css;
  }

  ___$insertStyle("@charset \"UTF-8\";\n.context-menu {\n  left: 0;\n  top: 0;\n  position: fixed;\n  padding: 10px;\n  margin-top: -20px; }\n  .context-menu > .item {\n    margin-left: -80%;\n    padding-right: 16px; }\n    .context-menu > .item .subitems {\n      position: absolute;\n      display: none;\n      left: 100%;\n      top: 0;\n      border-radius: 5px;\n      overflow: overlay; }\n    .context-menu > .item:hover .subitems {\n      display: block; }\n    .context-menu > .item.have-subitems:after {\n      content: '►';\n      position: absolute;\n      opacity: 0.6;\n      right: 5px;\n      top: 5px; }\n  .context-menu .search input {\n    color: white;\n    padding: 1px 8px;\n    border: 1px solid white;\n    border-radius: 10px;\n    font-size: 16px;\n    font-family: serif;\n    width: 100%;\n    box-sizing: border-box;\n    background: transparent; }\n  .context-menu .item {\n    padding: 4px;\n    border-bottom: 1px solid rgba(69, 103, 255, 0.8);\n    color: #fff;\n    background-color: rgba(110, 136, 255, 0.8);\n    cursor: pointer;\n    width: 100px;\n    position: relative; }\n    .context-menu .item:first-child {\n      border-top-left-radius: 5px;\n      border-top-right-radius: 5px; }\n    .context-menu .item:last-child {\n      border-bottom-left-radius: 5px;\n      border-bottom-right-radius: 5px; }\n    .context-menu .item:hover {\n      background-color: rgba(130, 153, 255, 0.8); }\n");

  function template(locals) {var pug_html = "";var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {};
  pug_html = pug_html + "\u003Cdiv class=\"context-menu\" :style.left=\"contextMenu.x+&quot;px&quot;\" :style.top=\"contextMenu.y+&quot;px&quot;\" @mouseleave=\"contextMenu.hide()\" al-if=\"contextMenu.visible\"\u003E";
  pug_html = pug_html + "\u003Cdiv class=\"search item\" al-if=\"contextMenu.searchBar\"\u003E";
  pug_html = pug_html + "\u003Cinput al-value=\"filter\"\u003E\u003C\u002Fdiv\u003E";
  pug_html = pug_html + "\u003Cdiv class=\"item\" al-repeat=\"(name,item) in contextMenu.searchItems(filter)\" al-item\u003E";
  pug_html = pug_html + "{{name}}";
  pug_html = pug_html + "\u003Cdiv class=\"subitems\" al-if=\"contextMenu.haveSubitems(item)\"\u003E";
  pug_html = pug_html + "\u003Cdiv class=\"item\" al-repeat=\"(name,subitem) in item\" al-item\u003E";
  pug_html = pug_html + "{{name}}\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";} catch (err) {pug.rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);}return pug_html;}

  function Item(scope, el, expression, env) {
      var l = env.changeDetector.locals;
      var item = l.subitem || l.item;
      var haveSubitems = item.constructor === Object;

      el.addEventListener('click', e => {
          if (!haveSubitems)
              this.onClick(item);
          e.stopPropagation();
      });
      // .classed('have-subitems', haveSubitems);
  }

  class ContextMenu {

      constructor() {
          this.visible = false;
          this.x = 0;
          this.y = 0;
          this.default = {
              searchBar: false,
              onClick() { throw new TypeError('onClick should be overrided');}
          };

          this.bindTemplate();
      }

      bindTemplate() {
          this.el = document.createElement('div');
          this.el.setAttribute('tabindex', 1);
          this.el.innerHTML = template();

          const al = alight.makeInstance();

          al.directives.al.item = Item.bind(this);
          this.$cd = al(this.el, { contextMenu: this });
      }

      searchItems(filter) {
          var regex = new RegExp(filter, 'i'); 
          var items = {};

          Object.keys(this.items).forEach(key => {
              var item = this.items[key];

              if (item.constructor === Object) {
                  var subitems = Object.keys(item).filter(subitem => regex.test(subitem));

                  if (subitems.length > 0) {
                      items[key] = {};
                      subitems.forEach(sumitem => {
                          items[key][sumitem] = item[sumitem];
                      });
                  }
              }
              
              if (regex.test(key))
                  items[key] = item;
          });

          return items;
      }

      haveSubitems(item) {
          return item.constructor === Object;
      }

      isVisible() {
          return this.visible;
      }

      show(x, y, items = null, searchBar = null, onClick = null) {
          if (this.disabled) return;
          
          this.visible = true;
          this.items = items || this.default.items;
          this.searchBar = searchBar || this.default.searchBar;
          this.onClick = onClick || this.default.onClick;
          this.x = x;
          this.y = y;
          this.$cd.scan();
      }

      hide() {
          this.visible = false;
          this.$cd.scan();
      }
  }

  class NodeItems {
      constructor(editor) {
          this.editor = editor;
          this.items = {
              'Remove': 'remove'
          };
      }

      onClick(node, item) {
          switch (item) {
          case 'remove': this.editor.removeNode(node); break;    
          default: break;    
          }
      }
  }

  class ComponentItems {
      constructor(editor) {
          this.editor = editor;
          this.items = {};
      }

      async onClick({x, y}, item) {
          const node = await item.createNode();

          node.position[0] = x;
          node.position[1] = y;
          this.editor.addNode(node);
      }
  }

  function install(editor, { searchBar = true }) {
      const nodeItems = new NodeItems(editor);
      const compItems = new ComponentItems(editor);
      const menu = new ContextMenu;
      const mouse = { x: 0, y: 0 };

      document.body.appendChild(menu.el);

      editor.on('componentregister', component => {
          compItems.items[component.name] = component;
      });

      editor.on('mousemove', ({ x, y }) => {
          mouse.x = x;
          mouse.y = y;
      });

      editor.on('contextmenu', ({ e, node, view }) => {
          e.preventDefault();
          e.stopPropagation();
          const [x, y] = [e.clientX, e.clientY];
          
          if (node)
              menu.show(x, y, nodeItems.items, false, item => (menu.hide(), nodeItems.onClick(node, item)));
          else
              menu.show(x, y, compItems.items, searchBar, item => (menu.hide(), compItems.onClick(mouse, item)));
      });

      editor.on('click', ({ e, container }) => {
          const [x, y] = [e.clientX, e.clientY];

          menu.hide();
      });
  }

  exports.install = install;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
