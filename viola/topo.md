#拓扑图说明：

####[`树形布局`](啊)  

####[`弹性布局`](啊)

####[`官方文档`](http://doc.qunee.com/pages/viewpage.action?pageId=557061)

##调用方式
```javascript
	/**
	 * 实例化Topo；
	 * @param {String} id 外部容器id
	 * @param {String} data 数据地址
	 * @param {Function} 回调
	 * @constructor
	 */
	new Topo('canvas', '../data/tree.json');


```

##代码解析
### Topo
```javascript
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
	     __construct: function(wrap, data, callback) {

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

	         $.getJSON(data, function(obj) {

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
	                 case 3:
	                     _this.TopoModel = new TopoUser(obj, _this.bar.model);
	                     break;
	                 default:
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

	             callback && callback(_this.TopoModel, obj);

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
	      * @static
	      * @param nid {number|string}
	      * @returns {object} node/group/edge 对象
	      */
	     getByNid: function(nid) {
	             ...
	     },

	     /**
	      * 判断基本数据类型
	      * @method isType
	      * @static
	      * @param type {string}
	      */

	     isType: function(type) {
	             ...
	     },

	     /**
	      * 高亮某node节点
	      * @param node {object}  node
	      * @static
	      * @param bdcolor {string} 高亮边框颜色
	      * @returns {object} node
	      */
	     highlightNode: function(node, bdcolor) {
	             ...
	     }
	     ...

	 });

```

### TopoCom
```javascript
	
	/**
	 * TopoSpring TopoTree TopoUser 父类
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
        	....	           
        },  

         /**
         * 新建title
         * @param title {string}
         * @param x {number} x轴
         * @param y {number} y轴
         * @returns {object} 
         */
        createTitle: function (title, x, y) {
    		..
        }, 
        ... 
    });

```

### TopoSpring
```javascript	
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
            ...
        },
        ...
    });

```

### TopoTree
```javascript		
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
      	    ...
        },
        ...
    });

```
### TopoUser待续..
```javascript		

    /**
     * 自定义布局
     * @class TopoUser
     * @extends TopoCom
     * @constructor
     */
    var TopoUser = klass(TopoCom, {
    	...

    });

   ```