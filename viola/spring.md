### springlayerout 弹性布局json说明

```javascript
	{
    "config": {
    	 // 自动布局类型 {Number} [1=>springlayerout,2=>treelayerout]
        "layoutType": 1, 
        //(可选) 斥力系数 {Number}
        // 数值越大，节点之间的间距越大，参考值0-100
        "repulsion": 120,
        //(可选)中心吸引力系数 {Number}
        //数值越大，整体分布越密集，参考值0-1
        "attractive": 0.4,
        //(可选)弹性系数 {Number}
        //数值越大，连线收缩越短，参考值0-10
        "elastic": 6,       
        //(可选)背景颜色 {String}
        "bgColor": "#fff" 
    },  
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
            "name": "长安",
           	//icon图片{String} 可以为默认图标或自定义图片地址
           	//默认图标可选值[apple,cloud,exchanger,exchanger2,group,group_cloud,iphone,node,server,skype,subnetwork,twitter,windows]
            "icon": "node",
            //唯一id{Number/String}
            "nid": 1, 
            //(可选)高光强调边框颜色{String}
            "highlight":"#f00",  
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
    ],

    //连接线{Array} 可以为多条
    "edges":[
    	{
    		//连接线起始节点nid{String/Number}
            "form": 1,
            //连接线终点nid{String/Number}
            "to": 18,
             //唯一id{Number/String}
            "nid": 127,
            //(可选){String}
            "name": "直道直道"
        }
    ]
}


```