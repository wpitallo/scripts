(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('alight')) :
  typeof define === 'function' && define.amd ? define(['exports', 'alight'], factory) :
  (factory((global.AlightRenderPlugin = {}),global.alight));
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

  ___$insertStyle(".node {\n  background: rgba(110, 136, 255, 0.8);\n  border: 2px solid #4e58bf;\n  border-radius: 10px;\n  cursor: pointer;\n  min-width: 180px;\n  height: auto;\n  padding-bottom: 6px;\n  box-sizing: content-box;\n  position: relative;\n  user-select: none; }\n  .node:hover {\n    background: rgba(130, 153, 255, 0.8); }\n  .node.selected {\n    background: #ffd92c;\n    border-color: #e3c000; }\n  .node .title {\n    color: white;\n    font-family: sans-serif;\n    font-size: 18px;\n    padding: 8px; }\n  .node .socket {\n    display: inline-block;\n    cursor: pointer;\n    border: 1px solid white;\n    border-radius: 12px;\n    width: 24px;\n    height: 24px;\n    margin: 6px;\n    vertical-align: middle;\n    background: #96b38a;\n    z-index: 2;\n    box-sizing: border-box; }\n    .node .socket:hover {\n      border-width: 4px; }\n    .node .socket.multiple {\n      border-color: yellow; }\n    .node .socket.output {\n      margin-right: -12px; }\n    .node .socket.input {\n      margin-left: -12px; }\n  .node .input-title, .node .output-title {\n    vertical-align: middle;\n    color: white;\n    display: inline-block;\n    font-family: sans-serif;\n    font-size: 14px;\n    margin: 6px;\n    line-height: 24px; }\n  .node .input-control {\n    z-index: 1;\n    width: calc(100% - 36px);\n    vertical-align: middle;\n    display: inline-block; }\n  .node .control {\n    padding: 6px 18px; }\n  .node select, .node input {\n    width: 100%;\n    border-radius: 30px;\n    background-color: white;\n    padding: 2px 6px;\n    border: 1px solid #999;\n    font-size: 110%;\n    width: 170px; }\n");

  function defaultTemplate(locals) {var pug_html = "";var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {};
  pug_html = pug_html + "\u003Cdiv class=\"node\" :class.selected=\"isSelected(node)\"\u003E";
  pug_html = pug_html + "\u003Cdiv class=\"title\"\u003E";
  pug_html = pug_html + "{{node.name}}\u003C\u002Fdiv\u003E";
  pug_html = pug_html + "\u003C!-- Outputs--\u003E";
  pug_html = pug_html + "\u003Cdiv al-repeat=\"output in node.outputs\" style=\"text-align: right\"\u003E";
  pug_html = pug_html + "\u003Cdiv class=\"output-title\"\u003E";
  pug_html = pug_html + "{{output.name}}\u003C\u002Fdiv\u003E";
  pug_html = pug_html + "\u003Cdiv class=\"socket output {{output.socket.name.toLowerCase().replace(' ','-')}}\" al-socket=\"output\" title=\"{{output.socket.name}}\n{{output.socket.hint}}\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
  pug_html = pug_html + "\u003C!-- Controls--\u003E";
  pug_html = pug_html + "\u003Cdiv class=\"control\" al-repeat=\"control in node.controls\" al-control\u003E\u003C\u002Fdiv\u003E";
  pug_html = pug_html + "\u003C!-- Inputs--\u003E";
  pug_html = pug_html + "\u003Cdiv al-repeat=\"input in node.inputs\" style=\"text-align: left\"\u003E";
  pug_html = pug_html + "\u003Cdiv class=\"socket input {{input.socket.name.toLowerCase().replace(' ','-')}} {{input.multipleConnections?'multiple':''}}\" al-socket=\"input\" title=\"{{input.socket.name}}\"\u003E\u003C\u002Fdiv\u003E";
  pug_html = pug_html + "\u003Cdiv class=\"input-title\" al-if=\"!input.showControl()\"\u003E";
  pug_html = pug_html + "{{input.name}}\u003C\u002Fdiv\u003E";
  pug_html = pug_html + "\u003Cdiv class=\"input-control\" al-if=\"input.showControl()\" al-control\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";} catch (err) {pug.rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);}return pug_html;}

  function install(editor, params) {

      const nodeAl = alight.makeInstance();
      const controlAl = alight.makeInstance();

      nodeAl.directives.al.socket = (scope, el, expression, env) => {
          const { locals } = env.changeDetector;
          const type = expression;

          scope.bindSocket(el, type, locals[type]);
      };

      nodeAl.directives.al.control = (scope, el, expression, env) => {
          const { locals } = env.changeDetector;
          const control = locals.input ? locals.input.control : locals.control;

          scope.bindControl(el, control);
      };

      function isSelected(node) {
          return editor.selected.contains(node);
      }

      editor.on('rendernode', ({ el, node, component, bindSocket, bindControl }) => {
          if (component.render && component.render !== 'alight') return;
          
          el.innerHTML = component.template || params.template || defaultTemplate();

          node._alight = nodeAl.bootstrap(el, { node, isSelected, bindSocket, bindControl });
      });

      editor.on('rendercontrol', ({ el, control }) => {
          if (control.render && control.render !== 'alight') return;

          const child = document.createElement('div');
          const html = control.template || '';
          const scope = control.scope || {};
          const mounted = control.mounted || function () { };
          
          el.appendChild(child);
          child.innerHTML = html;

          control.render = 'alight';
          control._alight = controlAl.bootstrap(child, scope);
          mounted.call(control);
      });

      editor.on('connectioncreated connectionremoved', connection => {
          connection.input.node._alight.scan();
      });

      editor.on('nodeselected', node => {
          editor.nodes.map(n => n._alight.scan());
          node._alight.scan();
      });
  }

  exports.install = install;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
