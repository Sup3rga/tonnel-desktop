import React, { Component } from 'react';
import PropTypes from 'prop-types';

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".styles_eternalList__1EYoi {\n  float: left;\n  height: 100%;\n  width: 100%;\n  overflow: auto;\n}\n\n.styles_ilParent__hKA7u {\n  float: left;\n  width: 100%;\n  height: 100%;\n}\n\n.styles_ilDummy__2BcAM{\n  position: absolute;\n  width: 0;\n  height: 0;\n  overflow: hidden;\n  top:-100%;\n  left: -100%;\n}\n\n.styles_dummyContainer__FyJNC {\n  float: left;\n}\n\n.styles_ilParent__hKA7u{\n  float: left;\n  width: 100%;\n}";
var styles = { "eternalList": "styles_eternalList__1EYoi", "ilParent": "styles_ilParent__hKA7u", "ilDummy": "styles_ilDummy__2BcAM", "dummyContainer": "styles_dummyContainer__FyJNC" };
styleInject(css);

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var containerRef = React.createRef();
var dummyELRef = React.createRef();

var ReactEternalList = function (_Component) {
  inherits(ReactEternalList, _Component);

  function ReactEternalList() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, ReactEternalList);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = ReactEternalList.__proto__ || Object.getPrototypeOf(ReactEternalList)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      list: []
    }, _this.listItemHeightShouldUpdate = true, _this.minimumStackSize = 10, _this.scrollTop = 0, _this.containerHeight = window.innerHeight, _this.updateeternalList = function () {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.props;

      var shoudUpdate = _this.isComponentUpdated(props);
      shoudUpdate = _this.setList(props) || shoudUpdate;
      if (shoudUpdate) {
        _this.updateListDimension();
        _this.updateListVisibility();
      }
    }, _this.isComponentUpdated = function (props) {
      if (!_this.componentSign || _this.componentSign !== props.component.sign) {
        props.component.sign = Date.now();
        _this.componentSign = props.component.sign;
        _this.listItemHeightShouldUpdate = true;
        return true;
      }
      return false;
    }, _this.updateNodeDimension = function (node) {
      if (node.parent) {
        node.height = 0;
        var temp = void 0;
        for (var idx = 0; idx < node.data.length; idx++) {
          temp = _this.updateNodeDimension(node.data[idx]);
          node.height += temp.height;
        }
        node.top = node.data[0] ? node.data[0].top : 0;
        node.bottom = node.top + node.height;
      } else {
        node.height = (node.data || []).length * _this.listItemHeight;
        node.top = _this.totalTop;
        node.bottom = node.top + node.height;
        _this.totalTop += node.height;
      }
      return node;
    }, _this.updateListDimension = function () {
      _this.totalTop = 0;
      _this.updateNodeDimension(_this.list);
    }, _this.isNodeVisible = function (node) {
      return node.top <= _this.scrollTop + _this.containerHeight * 1.5 && node.bottom - _this.containerHeight * -0.5 >= _this.scrollTop;
    }, _this.updateNodeVisibility = function (node) {
      node.visible = _this.isNodeVisible(node);
      if (node.visible && node.parent) {
        for (var idx = 0; idx < node.data.length; idx++) {
          _this.updateNodeVisibility(node.data[idx]);
        }
      }
    }, _this.updateListItemHeight = function () {
      if (_this.listItemHeightShouldUpdate === true) {
        _this.listItemHeight = dummyELRef.current.clientHeight;
        _this.component = _this.props.component;
        _this.listItemHeightShouldUpdate = false;
        return true;
      }
      return false;
    }, _this.updateListVisibility = function () {
      var time = window.performance.now();
      _this.updateNodeVisibility(_this.list);
      _this.visibilityCheckTime = window.performance.now() - time;
      _this.setState({ list: _this.list || [] }, function () {
        if (_this.props.onUpdate) {
          _this.props.onUpdate({
            renderedComponentCount: _this.renderedComponentCount,
            renderedContainerCount: _this.renderedContainerCount,
            renderedDivCount: _this.renderedContainerCount + _this.renderedComponentCount,
            visibilityCheckTime: _this.visibilityCheckTime
          });
        }
        if (_this.updateListItemHeight()) {
          _this.updateListDimension();
          _this.updateListVisibility();
        }
      });
    }, _this.setList = function () {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.props;

      if (!_this.list || _this.list.sign !== props.list.sign) {
        _this.list = props.list || [];
        _this.list = _this.recursiveSplit(_this.list);
        _this.list.sign = props.list.sign = Date.now();
        containerRef.current.scrollTop = 0;
        return true;
      }
      return false;
    }, _this.recursiveSplit = function (data) {
      if (data.length / 2 > _this.minimumStackSize) {
        var mid = Math.floor(data.length / 2, 10);
        var node = {
          parent: true,
          getParent: function getParent() {
            return data;
          },
          data: [_this.recursiveSplit(data.slice(0, mid)), _this.recursiveSplit(data.slice(mid, data.length + 1))]
        };
        return node;
      }
      return {
        parent: false,
        data: data
      };
    }, _this.getList = function () {
      return _this.state.list || {};
    }, _this.renderList = function () {
      var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.getList();

      if (node.parent) {
        _this.renderedContainerCount += (node.data || []).length;
        return (node.data || []).map(function (item, index) {
          return React.createElement(
            'div',
            { className: styles.ilParent, key: index, style: { height: item.height } },
            item.visible ? _this.renderList(item) : ''
          );
        });
      } else {
        _this.renderedComponentCount += (node.data || []).length;
        return (node.data || []).map(function (item, index) {
          return _this.component(item, index);
        });
      }
    }, _this.handleScroll = function (e) {
      _this.scrollTop = e.target.scrollTop;
      clearTimeout(_this.updationDebounce);
      if (!_this.updationInterval) {
        _this.updationInterval = setInterval(function () {
          _this.updateListVisibility();
        }, _this.props.updateRate || 100);
      }
      _this.updationDebounce = setTimeout(function () {
        _this.updateListVisibility();
        clearInterval(_this.updationInterval);
        _this.updationInterval = null;
      }, _this.props.updateRate || 100);
    }, _this.renderDummy = function () {
      return React.createElement(
        'div',
        { className: styles.dummyContainer, ref: dummyELRef },
        _this.props.component((_this.props.list || [])[0] || {})
      );
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(ReactEternalList, [{
    key: 'UNSAFE_componentWillReceiveProps',
    value: function UNSAFE_componentWillReceiveProps(props) {
      this.updateeternalList(props);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.containerHeight = parseInt(containerRef.current.clientHeight, 10);
      this.updateListItemHeight();
      this.updateeternalList();
    }
  }, {
    key: 'render',
    value: function render() {
      this.renderedComponentCount = 0;
      this.renderedContainerCount = 0;
      var renderedList = this.renderList();

      return React.createElement(
        'div',
        { className: styles.eternalList, onScroll: this.handleScroll, ref: containerRef },
        React.createElement(
          'div',
          { className: styles.ilDummy },
          React.createElement(this.renderDummy, null)
        ),
        React.createElement(
          'div',
          { className: styles.ilContainer },
          renderedList
        )
      );
    }
  }]);
  return ReactEternalList;
}(Component);

ReactEternalList.propTypes = {
  list: PropTypes.array,
  component: PropTypes.func
};

export default ReactEternalList;