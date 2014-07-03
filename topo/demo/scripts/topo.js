/**
 * @module
 * @requires Backbone,_
 */
(function (exports, undefined) {

    var graph;

    var klass = function (Parent, props) {

        var Child = function () {
            if (Child.uber && Child.uber.hasOwnProperty("__construct")) {
                Child.uber.__construct.apply(this, arguments);
            }
            if (Child.prototype.hasOwnProperty("__construct")) {
                Child.prototype.__construct.apply(this, arguments);
            }
        };

        Parent = Parent || Object;
        var F = function () {
        };
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.uber = Parent.prototype;
        Child.prototype.constructor = Child;

        for (i in props) {
            if (props.hasOwnProperty(i)) {
                Child.prototype[i] = props[i];
            }
        }
        return Child;
    };

    /**
     * @class TopoCom
     * @constructor
     */
    var TopoCom = klass(null, {

        /**
         * 新建attachment
         * @method createAttachment
         * @param node  {Object} 节点
         * @param attch {Object} attch 数据对象
         * @param index {Number}
         * @return {LabelUI}
         */

        createAttachment: function (node, attch, index) {

            var label = new Q.LabelUI();

            label.position = Q.Position.CENTER_TOP;
            label.anchorPosition = Q.Position.LEFT_BOTTOM;
            label.border = 1;

            label.padding = new Q.Insets(2, 5);
            label.showPointer = true;

            label.offsetY = attch.dy || -5;
            label.offsetX = attch.dx || 0;

            label.backgroundColor = attch.bgcolor || '#fff82e';
            label.fontSize = 10;
            label.zIndex = 50;

            attch.rotate && (label.showPointer = false, label.rotate = Math.PI / 180 * attch.rotate || 0);

            label.fontStyle = "italic 100";
            label.text = attch.text;

            node.addUI(label, [
                {
                    property: node.nid.toString() + '_' + index,
                    propertyType: Q.Consts.PROPERTY_TYPE_CLIENT,
                    bindingProperty: "data"
                }
            ]);

            node.set((node.nid.toString() + '_' + index), attch.text);
            node.attachment.push(label);
            return label;
        },



        createLable: function (obj) {

            var _this = this;
            var arr = _.union(obj.nodes, obj.groups, obj.edges);
            var node;

            _.each(arr, function (a) {
                if (a.highlight) {
                    Topo.highlightNode(Topo.getByNid(a.nid), a.highlight);
                }
                if (a.attachment) {
                    node = Topo.getByNid(a.nid);
                    node.attachment = [];
                    _.each(a.attachment, function (attch, index) {
                        _this.createAttachment(node, attch, index);
                    });
                }

            });
        },

        /**
         * 新建title
         * @param title {string}
         * @param x {number} x轴
         * @param y {number} y轴
         * @returns {object}
         */
        createTitle: function (title, x, y) {

            var tNode = graph.createText();
            tNode.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, null);
            tNode.setStyle(Q.Styles.LABEL_BACKGROUND_GRADIENT, null);
            tNode.setStyle(Q.Styles.LABEL_BORDER, null);
            tNode.setStyle(Q.Styles.LABEL_FONT_SIZE, 20);
            tNode.name = title;
            tNode.x = x || 50;
            tNode.y = y || -50;
            tNode.nid = _.uniqueId("title");
            return tNode;
        },

        addInteraction: function () {

            graph.addCustomInteraction({
                onclick: $.proxy(this.interaction, this),
                enddrag: $.proxy(this.interaction, this)
            });
        },

        interaction: function (evt) {

            var ui = graph.getUIByMouseEvent(evt);
            if (!ui) {
                this.model.clear();

            } else {
                var info = {
                    x: parseInt(ui.x),
                    y: parseInt(ui.y),
                    nid: ui.data.nid ? ui.data.nid : ''
                };
                this.model.set(info);
            }
        }
    });


    /**
     * @class  Topo
     * @constructor
     */

    var Topo = klass(null, {

        /**
         * Topo 构造函数
         * @method __construct
         * @param wrap {string} 外部容器id
         * @param data {string}  data数据地址
         * @param [callback = undefined] {function} ajax获取数据后回调
         * @private
         */
        __construct: function (wrap, data, callback) {

            var _this = this;

            /**
             * queen Graph组件引用
             * @property graph
             * @type {Graph}
             */
            this.graph = graph = new Q.Graph(wrap);
            /**
             * 操作栏引用
             * @property bar
             * @type {object}
             */
            this.bar = Topo.createOptBar();



            $.getJSON(data, function (obj) {

                /**
                 * 布局类实例引用 ，但需要实例化时回调中引用 以确保以获取数据
                 * @property TopoModel
                 * @type {TopoSpring|TopoTree|TopoUser}
                 */
                switch (obj.config.layoutType) {
                    case 1:
                        _this.TopoModel = new TopoSpring(obj, _this.bar.model);
                        break;
                    case 2:
                        _this.TopoModel = new TopoTree(obj, _this.bar.model);
                        break;
                    case  3:
                        _this.TopoModel = new TopoUser(obj, _this.bar.model);
                        break;
                    default :
                        _this.TopoModel = new TopoSpring(obj, _this.bar.model);
                }

                /**
                 * ajax获取json数据后json.parse的对象，但需要实例化时回调中引用 以确保以获取数据
                 * @property data
                 * @type {object}
                 * @example
                 *      new Topo(‘’，‘’，function(obj,data){
                 *          console.log(data);
                 *          console.log(this.data);
                 *      })
                 */
                _this.data = obj;

                callback && callback(_this.TopoModel,obj);


            });
        }
    });

    //Topo 静态方法/属性扩展
    _.extend(Topo, {

        /**
         * TopoCom 类实例引用
         * @property tc
         * @static
         * @type {object}
         */
        tc: new TopoCom(),

        /**
         * 通过nid 获取画布元素
         * @method getByNid
         * @param nid {number|string}
         * @returns {object} node/group/edge 对象
         */
        getByNid: function (nid) {
            var selectedNode = null;
            graph.graphModel.forEach(function (node) {
                if (node.nid == nid) {
                    selectedNode = node;
                }
            });
            return  selectedNode;

        },

        isType: function (type) {
            return function (obj) {
                return Object.prototype.toString.call(obj) === "[object " + type + "]"
            }
        },

        /**
         * 高亮某node节点
         * @param node {object}  node
         * @param bdcolor {string} 高亮边框颜色
         * @returns {object} node
         */
        highlightNode: function (node, bdcolor) {
            node.setStyle(Q.Styles.BORDER, 1);
            node.setStyle(Q.Styles.BORDER_COLOR, bdcolor || '#AABBEE');
            node.setStyle(Q.Styles.PADDING, 5);
            return node;
        },

        createImgDialog: function () {
            var wrap = $('<div id="imgcon">');
            wrap.closeBtn = $('<a id="imgcon-close">关闭</a>');
            wrap.con = $('<div class="con">');
            wrap.append(wrap.closeBtn);
            wrap.append(wrap.con);
            $('body').append(wrap);
            wrap.hide();
            wrap.css({
                width: '90%',
                height: '90%',
                'boxShadow': '0 0 5px rgba(0,0,0,.4)',
                background: '#fff',
                border: '1px solid #999',
                position: 'fixed',
                left: "5%",
                top: "5%",
                'zIndex': 100
            });
            return wrap;
        },

        showDialog: function (img) {
            var _this = this;

            if (this.imgcon) {

                this.imgcon.show();
                this.imgcon.con.empty().append(img);
            } else {
                var wrap = this.imgcon = this.createImgDialog();

                this.imgcon.show();
                this.imgcon.con.empty().append(img);
                wrap.closeBtn.on('click', function () {
                    _this.hideDialog();
                })
            }
        },

        hideDialog: function () {
            this.imgcon.hide();
        },

        createOptBar: function () {
            var _this = this;

            var OpsModel = Backbone.Model.extend({

            });

            var opsModel = new OpsModel();

            var OpsBar = Backbone.View.extend({
                el: 'body',
                initialize: function () {
                    var _this = this;
                    this.tmpl = '<div id="opt" class="opt"><a  class="btn disabled">恢复默认</a><a  class="btn disabled">保存修改</a><a id="exportimg" class="btn">导出图片</a><div class="info"></div></div>';
                    this.render();
                    this.domInfo = this.$('.info');

                    _.bindAll(this, 'changeInfo');
                    opsModel.bind('change', this.changeInfo);
                },
                render: function () {
                    var dom = _.template(this.tmpl, {});
                    this.$el.append(dom);
                },
                events: {
                    'click #exportimg ': 'exportImg'
                },

                exportImg: function () {

                    var imageInfo = graph.exportImage(1);
                    if (!imageInfo || !imageInfo.data) {
                        return false;
                    }
                    var img = document.createElement("img");
                    img.src = imageInfo.data;
                    _this.showDialog(img);
                },
                changeInfo: function () {
                    var obj = opsModel.toJSON();
                    var html = '';
                    _.each(obj, function (v, k) {
                        html += '<span>' + k + ':' + v + '</span>';
                    });
                    this.domInfo.html(html);
                }
            });

            return{
                view: new OpsBar(),
                model: opsModel
            }
        }
    });

    /**
     * 弹性布局
     * @class TopoSpring
     * @extends TopoCom
     * @constructor
     */
    var TopoSpring = klass(TopoCom, {

        /**
         * TopoSpring 构造函数
         * @method __construcor
         * @param obj {object} json数据对象
         * @param model {object} opsbar数据模型
         * @private
         */
        __construct: function (obj, model) {

            var _this = this;
            this.model = model;
            this.repulsion = obj.config.repulsion || 100;
            this.attractive = obj.config.attractive || 0.5;
            this.elastic = obj.config.elastic || 5;

            /**
             * node集合
             * @property
             * @type {Array}
             */
            this.nodes = [];
            /**
             * edge集合
             * @property
             * @type {Array}
             */
            this.edges = [];

            this.setStyle();
            this.createSpring(obj);
            this.createLayouter(obj);

            this.addInteraction();
            graph.enableTooltip = false;
            this.addInteraction();

            graph.callLater(function () {

                _this.createLable(obj);
                graph.zoomToOverview();
                //_this.createTitle(obj.title);
            });

        },

        createSpring: function (obj) {

            var _this = this;

            _.each(obj.nodes, function (nodeData) {
                _this.createNode(nodeData);
            });

            if (obj.groups) {
                _.each(obj.groups, function (group) {
                    _this.createGroup(group);
                });
            }

            _.each(obj.edges, function (edgeData) {
                _this.createEdge(edgeData);
            });

        },

        createNode: function (nodeData) {

            var node = graph.createNode();
            var _this = this;
            node.name = nodeData.name;
            node.nid = nodeData.nid;
            node.size = {width: 30};
            node.attachment = [];

            node.image = /\//g.test(nodeData.icon) ? nodeData.icon : icons[nodeData.icon];
            node.zIndex = 20;
            this.nodes.push(node);

            return  node;
        },
        createEdge: function (edgeData) {

            var from = Topo.getByNid(edgeData.form);
            var to = Topo.getByNid(edgeData.to);
            var edge = graph.createEdge(from, to);
            edge.nid = edgeData.nid;
            if (edgeData.name) {
                edge.name = edgeData.name;
            }
            this.edges.push(edge);
            return edge;

        },

        setStyle: function () {

            var defaultStyles = {};
            /*  graph.originAtCenter = false;
             graph.scale = 1;*/
            defaultStyles[Q.Styles.EDGE_WIDTH] = 1;
            defaultStyles[Q.Styles.EDGE_COLOR] = "#999";
            defaultStyles[Q.Styles.ARROW_TO_SIZE] = 5;
            defaultStyles[Q.Styles.ARROW_TO_STROKE] = 1;
            defaultStyles[Q.Styles.LABEL_OFFSET_Y] = 5;

            //lable
            defaultStyles[Q.Styles.LABEL_FONT_SIZE] = 5;
            defaultStyles[Q.Styles.LABEL_FONT_FAMILY] = 'microsoft yahei';

            graph.styles = defaultStyles;

        },
        createLayouter: function () {

            var layouter = new Q.SpringLayouter(graph);
            layouter.repulsion = this.repulsion;
            layouter.attractive = this.attractive;
            layouter.elastic = this.elastic;
            layouter.doLayout();


        },
        createGroup: function (data) {

            var group = graph.createGroup();
            group.nid = data.nid;
            group.setStyle(Q.Styles.GROUP_BACKGROUND_COLOR, data.bgColor);
            //group.setStyle()
            switch (data.groupType) {
                case 1:
                    group.groupType = Q.Consts.GROUP_TYPE_RECT;
                    break;
                case 2:
                    group.groupType = Q.Consts.GROUP_TYPE_ELLIPSE;
                    break;
                case  3:
                    group.groupType = Q.Consts.GROUP_TYPE_CIRCLE;
                    break;
                default :
                    group.groupType = Q.Consts.GROUP_TYPE_ELLIPSE;
            }
            _.each(data.member, function (nid) {
                var node = Topo.getByNid(nid);
                group.addChild(node);
            });
            return group;
        }

    });

    /**
     * 树形布局
     * @class TopoTree
     * @extends TopoCom
     * @constructor
     */
    var TopoTree = klass(TopoCom, {

        /**
         * TopoTree 构造函数
         * @method __construcor
         * @param obj {object} json数据对象
         * @param model {object} opsbar数据模型
         * @private
         */
        __construct: function (obj, model) {

            /**
             * node集合
             * @property
             * @type {Array}
             */
            this.nodes = [];
            this.model = model;
            this.createTree(obj);
            this.setStyle();
            this.addInteraction();
            this.createLayouter(obj);
        },

        createLayouter: function (obj) {

            var _this = this;
            var grps = obj.groups;
            var layouter = new Q.TreeLayouter(graph);

            layouter.doLayout({x: 10, y: 10});

            layouter.parentChildrenDirection = Q.Consts['DIRECTION_' + (obj.config.direction.toUpperCase())];
            graph.html.style.background = obj.config.bgColor ? obj.config.bgColor : '#fff';

            //group show
            graph.callLater(function () {
                graph.zoomToOverview();
                if (grps) {
                    _.each(grps, function (grpData) {
                        _this.createGroup(grpData);
                    });
                }
                if (obj.title) {
                    _this.createTitle(obj.title);
                }

                _this.createLable(obj);
            });

        },

        setStyle: function () {

            var defaultStyles = {};
            /*  graph.originAtCenter = false;
             graph.scale = 1;*/
            defaultStyles[Q.Styles.EDGE_WIDTH] = 2;
            defaultStyles[Q.Styles.EDGE_CORNER_RADIUS] = 10;

            //lable
            defaultStyles[Q.Styles.LABEL_FONT_SIZE] = 9;
            defaultStyles[Q.Styles.LABEL_PADDING] = new Q.Insets(2, 5);
            defaultStyles[Q.Styles.LABEL_BACKGROUND_COLOR] = '#eee';
            defaultStyles[Q.Styles.LABEL_BACKGROUND_GRADIENT] = Q.Gradient.LINEAR_GRADIENT_VERTICAL;
            defaultStyles[Q.Styles.LABEL_FONT_FAMILY] = 'microsoft yahei';
            defaultStyles[Q.Styles.LABEL_POINTER_WIDTH] = 4;
            defaultStyles[Q.Styles.LABEL_RADIUS] = 6;
            defaultStyles[Q.Styles.LABEL_OFFSET_Y] = 2;
            defaultStyles[Q.Styles.LABEL_BORDER] = 0.5;
            defaultStyles[Q.Styles.LABEL_BORDER_STYLE] = '#666';

            graph.styles = defaultStyles;
        },

        createTree: function (obj) {
            var nds = obj.nodes;
            /*  var rootData = _.where(nds, {root: true})[0];
             var root = this.createNode(rootData.name, rootData.icon, rootData.nid);*/
            var _this = this;
            _.each(nds, function (nodeData, index) {
                var dataFrom = _.where(nds, {from: nodeData.from})[0];
                var nodeFrom = Topo.getByNid(dataFrom.from);
                _this.createNode(nodeData, nodeFrom);
            });
        },

        createNode: function (nodeData, from) {
            var node = graph.createNode(nodeData.name);
            var _this = this;
            var edge;
            // node.parentChildrenDirection = Q.Consts.DIRECTION_TOP;
            node.nid = nodeData.nid;
            if (nodeData.direction) {
                node.parentChildrenDirection = Q.Consts['DIRECTION_' + nodeData.direction.toUpperCase()];
            }
            if (nodeData.layoutType) {
                switch (nodeData.layoutType) {
                    case 1:
                        node.layoutType = Q.Consts.LAYOUT_TYPE_EVEN_VERTICAL;
                        break;
                    case 2:
                        node.layoutType = Q.Consts.LAYOUT_TYPE_TWO_SIDE;
                        break;
                    default :
                        node.layoutType = Q.Consts.LAYOUT_TYPE_EVEN_VERTICAL;
                }
            }
            this.nodes.push(node);
            node.image = /\//g.test(nodeData.icon) ? nodeData.icon : icons[nodeData.icon];

            if (from) {
                if (Topo.isType('Array')(from)) {
                    _.each(from, function (fm) {
                        edge = graph.createEdge(from, node);
                        _this.setEgedStyle(edge, nodeData);
                    });

                } else {
                    edge = graph.createEdge(from, node);
                    this.setEgedStyle(edge, nodeData);
                }
            }

            node.zIndex = 20;
            return node;
        },
        createGroup: function (data) {

            var group = graph.createGroup();
            group.nid = data.nid;

            group.setStyle(Q.Styles.GROUP_BACKGROUND_COLOR, data.bgColor);
            //group.setStyle()
            switch (data.groupType) {
                case 1:
                    group.groupType = Q.Consts.GROUP_TYPE_RECT;
                    break;
                case 2:
                    group.groupType = Q.Consts.GROUP_TYPE_ELLIPSE;
                    break;
                case  3:
                    group.groupType = Q.Consts.GROUP_TYPE_CIRCLE;
                    break;
                default :
                    group.groupType = Q.Consts.GROUP_TYPE_RECT;
            }

            _.each(data.member, function (nid) {
                var node = Topo.getByNid(nid);
                group.addChild(node);
            });
        },
        setEgedStyle: function (edge, nodeData) {

            if (nodeData.edgeType) {
                switch (nodeData.edgeType) {
                    case 1:
                        edge.edgeType = Q.Consts.EDGE_TYPE_HORIZONTAL_VERTICAL;

                        break;
                    case 2:
                        edge.edgeType = Q.Consts.EDGE_TYPE_DEFAULT;
                        break;
                    case 3:
                        edge.edgeType = Q.Consts.EDGE_TYPE_ELBOW_VERTICAL;
                        break;
                    case 4:
                        edge.edgeType = Q.Consts.EDGE_TYPE_ORTHOGONAL;
                        break;
                    default :
                        edge.edgeType = Q.Consts.EDGE_TYPE_HORIZONTAL_VERTICAL;
                }
            } else {
                edge.edgeType = Q.Consts.EDGE_TYPE_HORIZONTAL_VERTICAL
            }
            edge.setStyle(Q.Styles.ARROW_TO_SIZE, 3);
        }
    });

    /**
     * 自定义布局
     * @class TopoUser
     * @extends TopoCom
     * @constructor
     */
    var TopoUser = klass(TopoCom, {


    });

    exports.Topo = Topo;

}(window));

