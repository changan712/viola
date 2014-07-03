### treelayerout 树形布局json说明

```javascript
	{
    "config": {
    	 // 自动布局类型 {Number} [1=>springlayerout,2=>treelayerout]
        "layoutType": 2, 
         // 布局方向 {String} [bottom,top,left,right]
        "direction": "bottom",
        //(可选)背景颜色
        "bgColor": "#fff" 
    },
    //（可选）标题
    "title": "测试测试", 
     //（可选）组 {Array}
    "groups": [ 
        {	
        	//成员nid数组{Array}
            "member": [4, 5],           
            //唯一id{Number/String}
            "nid":101,
             //(可选)组类型{Number} [1=>矩形，2=>椭圆形]
            "groupType": 2,
            //(可选)背景颜色{String}
            "bgColor": "#ffeeee",
            //（可选）附件 {Array}       
            "attachment":[...]
        }      
    ],
    //节点{Array}
    "nodes": [
        {	
        	//{String}
            "name": "test1",
           	//icon图片{String} 可以为默认图标或自定义图片地址
           	//默认图标可选值[apple,cloud,exchanger,exchanger2,group,group_cloud,iphone,node,server,skype,subnetwork,twitter,windows]
            "icon": "node",
            //唯一id{Number/String}
            "nid": 1,
            //父级节点nid{Number/String}  根元素不存在父级节点无from
            "from": 1,
            //(可选)子元素布局方向 {String} [bottom,top,left,right]
            "direction": "left",
           	//(可选)子元素布局类型{Number} [1=>LAYOUT_TYPE_EVEN_VERTICAL,2=>LAYOUT_TYPE_TWO_SIDE]
            "layoutType": 2,
            //(可选)高光强调边框颜色{String}
            "highlight":"#f00",    
            //(可选)连接线样式{Number}
            //[1=>EDGE_TYPE_HORIZONTAL_VERTICAL,2=>EDGE_TYPE_DEFAULT,3=>EDGE_TYPE_ELBOW_VERTICAL,4=>EDGE_TYPE_ORTHOGONAL]         
            "edgeType": 1,
            //（可选）附件 {Array}           
            "attachment": [
                {	
                	//附件文字 {String}
                    "text": "长安城的面积达83.1平中轴对称布局，古典范。",
                    //(可选)y轴相对平移 {Number}
                    "dy": -20,
                    //(可选)x轴相对平移 {Number}
                    "dx": -20,
                    //(可选)旋转角度 {Number}
                    "rotate": 5,
                    //(可选)背景颜色{String}
                	"bgColor": "#fff"
                }
            ]
        }    
    ]
}


```