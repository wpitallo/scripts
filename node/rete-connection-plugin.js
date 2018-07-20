(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.ConnectionPlugin = {})));
}(this, (function (exports) { 'use strict';

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

  ___$insertStyle(".connection {\n  overflow: visible !important;\n  pointer-events: none; }\n  .connection path {\n    fill: none;\n    stroke-width: 5px;\n    stroke: steelblue; }\n");

  function toTrainCase(str) {
      return str.toLowerCase().replace(/ /g, '-');
  }

  function renderConnection({ el, x1, y1, x2, y2, connection }, curvature) {
      const hx1 = x1 + Math.abs(x2 - x1) * curvature;
      const hx2 = x2 - Math.abs(x2 - x1) * curvature;
      const classed = !connection?[]:[
          'input-' + toTrainCase(connection.input.name),
          'output-' + toTrainCase(connection.output.name),
          'socket-input-' + toTrainCase(connection.input.socket.name),
          'socket-output-' + toTrainCase(connection.output.socket.name)
      ];

      el.innerHTML = `<svg class="connection ${classed.join(' ')}">
        <path d="M ${x1} ${y1} C ${hx1} ${y1} ${hx2} ${y2} ${x2} ${y2}"/>
    </svg>`;
  }

  class Picker {

      constructor(editor) {
          this.el = document.createElement('div');
          this.editor = editor;
          this._output = null;
      }

      get output() {
          return this._output;
      }

      set output(val) {
          const { area } = this.editor.view;

          this._output = val;
          if (val !== null)
              area.appendChild(this.el);
          else if (this.el.parentElement) {
              area.removeChild(this.el);
              this.el.innerHTML = '';
          }
      }

      renderConnection({ x, y }, curvature) {
          if (!this.output) return;
      
          const node = this.editor.view.nodes.get(this.output.node);
          const [x1, y1] = node.getSocketPosition(this.output);
      
          renderConnection({ el: this.el, x1, y1, x2: x, y2: y, connection: null }, curvature);
      }

  }

  function install(editor, { curvature = 0.4 }) {
      var mousePosition = [0, 0];
      var picker = new Picker(editor);

      function pickOutput({ output, node }) {
          if (output) {
              picker.output = output;
              return;
          }
      }

      function pickInput({ input, node }) {
          if (picker.output === null) {
              if (input.hasConnection()) {
                  picker.output = input.connections[0].output;
                  editor.removeConnection(input.connections[0]);
                  picker.renderConnection(mousePosition, curvature);
              }
              return true;
          }

          if (!input.multipleConnections && input.hasConnection())
              editor.removeConnection(input.connections[0]);
          
          if (!picker.output.multipleConnections && picker.output.hasConnection())
              editor.removeConnection(picker.output.connections[0]);
          
          if (picker.output.connectedTo(input)) {
              var connection = input.connections.find(c => c.output === picker.output);

              editor.removeConnection(connection);
          }

          editor.connect(picker.output, input);
          picker.output = null;
      }

      editor.on('rendersocket', ({ el, input, output, socket }) => {

          var prevent = false;

          function mouseHandle(e) {
              if (prevent) return;
              e.stopPropagation();
              e.preventDefault();
              
              if (input)
                  pickInput({ input, socket });
              else if (output)
                  pickOutput({ output, socket });
          }

          el.addEventListener('mousedown', e => (mouseHandle(e), prevent = true));
          el.addEventListener('mouseup', mouseHandle);
          el.addEventListener('click', e => (mouseHandle(e), prevent = false));
          el.addEventListener('mousemove', () => (prevent = false));
      });

      editor.on('mousemove', arg => { mousePosition = arg; picker.renderConnection(mousePosition, curvature); });

      editor.on('click', () => { picker.output = null; });

      editor.on('renderconnection', arg => renderConnection(arg, curvature));
  }

  exports.install = install;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
