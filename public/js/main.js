/**
 * 加载器
 * @type {{getObj: helper.getObj}}
 */
var helper = {
    // 常量参数
    Constant: {
        //imageDatas: [],  // 数据
        imgFigures: [],  // 图片
        ctrlUnits: [],   // 控制点
        centerPos: {  // 中心点
            left: 0,
            right: 0
        },
        hPosRange: {  // 水平方向的取值范围
            leftSecX: [0, 0],
            rightSecX: [0, 0],
            y: [0, 0]
        },
        vPosRange: {  // 垂直方向的取值范围
            x: [0, 0],
            topY: [0, 0]
        }
    },
    // 状态
    State: {
        imgsArrangeArr: [
            /*{
                 pos: {
                     left: '0',
                     top: '0'
                 },
                 rotate: 0,         // 旋转角度
                 isInverse: false,  // 图片正反面, 正：false
                 isCenter: false    // 图片是否居中
             }*/
        ]
    },
    /**
     * 对象加载的公共方法
     * @param url
     * @returns {Array}
     */
    getObj: function(url, container) {
        var temp = container;
        // 加载本地对象
        $.ajaxSettings.async = false;
        if(temp && $.isArray(temp)) {   // 数据
            $.getJSON(url, function (data) { temp = data; });
        } else {                        // 组件
            $.get(url, function (data) { temp = $(data); });
        }
        $.ajaxSettings.async = true;
        return temp;
    },
    renderImgFigure: function(index, $imgFigure, data) {

        if(data) {
            // 为每张图片、每个控制点添加属性等要素
            $imgFigure.find('img[alt="default.gif"]').attr({
                'src': data.imageURL,
                'alt': data.title
            });
            $imgFigure.find('h2.img-title').html(data.title);
            $imgFigure.find('div.img-back p').html(data.desc);
        }

        var indexImgsArrangeArr = helper.State.imgsArrangeArr[index];
        var styleObj = {};
        // 如果指定了这张图片的位置，则使用
        if(indexImgsArrangeArr.pos) {
            styleObj = indexImgsArrangeArr.pos;
        }
        // 如果图片的旋转角度有值并且不为0，添加旋转角度
        if(indexImgsArrangeArr.rotate) {
            (['MozTransform', 'msTransfrom', 'WebkitTransform', 'transform']).forEach(function(value) {
                styleObj[value] = 'rotate(' + indexImgsArrangeArr.rotate + 'deg)';
            });
        }
        // 图片如果居中
        if(indexImgsArrangeArr.isCenter) {
            styleObj.zIndex = 11;
        }
        // 默认
        $imgFigure.addClass('img-figure');
        // 图片如果翻转
        if(indexImgsArrangeArr.isInverse) {
            $imgFigure.addClass('is-inverse');
        }
        $imgFigure.css(styleObj);
        return $imgFigure;
    },
    renderCtrlUnit: function(index, $ctrlUnit, data) {

        var indexImgsArrangeArr = helper.State.imgsArrangeArr[index];
        // 默认
        $ctrlUnit.addClass('controller-unit');
        // 如果对应的是居中的图片，显示控制按钮的状态
        if(indexImgsArrangeArr.isCenter) {
            $ctrlUnit.addClass('is-center');
            // 如果同时对应的是翻转图片，显示控制按钮的翻转状态
            if(indexImgsArrangeArr.isInverse) {
                $ctrlUnit.addClass('is-inverse');
            }
        }
        return $ctrlUnit;
    },
    /**
     * 获取舞台需要的元素 JSON对象
     * @param imageDatas
     * @returns {{imgFigures: Array, ctrlUnits: Array}}
     */
    getElements: function(imageDatas) {
        // 获取图片组件 jQuery对象
        var $imgFigure = helper.getObj('../components/ImgFigureComponent.html');
        // 获取控制单元组件 jQuery对象
        var $ctrlUnit = helper.getObj('../components/CtrlUnitComponent.html');
        // 构造元素集
        var imgFigures = [];    // 图片集
        var ctrlUnits = [];     // 控制按钮集
        // 根据加载的数据组装需要的组件
        $.each(imageDatas, function(index, value) {
            // 初始化 helper.State
            if(!helper.State.imgsArrangeArr[index]) {
                helper.State.imgsArrangeArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate: 0,
                    isInverse: false,
                    isCenter: false
                };
            }
            // 渲染
            var $imgFigureTemp = helper.renderImgFigure(index, $imgFigure.clone(true), value);
            var $ctrlUnitTemp = helper.renderCtrlUnit(index, $ctrlUnit.clone(true), value);
            // 构造所有的图片框
            imgFigures.push($imgFigureTemp);
            // 添加控制单元
            ctrlUnits.push($ctrlUnitTemp);
        });
        // 缓存
        helper.Constant.imgFigures = imgFigures;
        helper.Constant.ctrlUnits = ctrlUnits;
        //helper.Constant.imageDatas = imageDatas;
        // 构造需要的元素对象
        return {
            imgFigures: imgFigures,
            ctrlUnits: ctrlUnits
        };
    },
    /**
     * 挂载元素
     * @param $parent
     * @param $children
     * @param mountedCallback
     */
    mounting: function($parent, $children, mountedCallback) {
        $parent.empty().append($children);
        mountedCallback(helper.Constant);
    },
    /**
     * 获取 0~30° 之间的一个任意正负值
     * @returns {string}
     */
    get30DegRandom: function() {
        return (Math.random() > 0.5 ? '' : '-' ) + Math.ceil(Math.random() * 30);
    },
    /**
     * 给定上下限的值，取出他们之间的随机值
     * @param low
     * @param high
     * @returns {number}
     */
    getRangeRandom: function(low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    },
    /**
     * 重新排布
     * @param centerIndex
     */
    rearrange: function(centerIndex) {
        var imgsArrangeArr = helper.State.imgsArrangeArr,
            Constant = helper.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,
            vPosRangeTopY = vPosRange.topY,
            vPosRangeX = vPosRange.x,
            imgsArrangeTopArr = [],
            topImgNum = Math.floor(Math.random() * 2),  // 取一个或者不取
            topImgSpliceIndex = 0,
            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

        // 首先居中 centerIndex 的图片
        imgsArrangeCenterArr[0] = {
            pos: centerPos,
            rotate: 0,
            isInverse: false,
            isCenter: true
        };
        // 取出要布局上侧图片的状态信息
        topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
        // 布局位于上侧的图片
        imgsArrangeTopArr.forEach(function(value, index) {
            imgsArrangeTopArr[index] = {
                pos: {
                    top: helper.getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                    left: helper.getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                },
                rotate: helper.get30DegRandom(),
                isInverse: false,
                isCenter: false
            };
        });
        // 布局左右两侧的图片
        for(var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; ++i) {
            var hPosRangeLORX = null;
            // 前半部分布局左边，右半部分布局右边
            if(i < k) {
                hPosRangeLORX = hPosRangeLeftSecX;
            } else {
                hPosRangeLORX = hPosRangeRightSecX;
            }
            imgsArrangeArr[i] = {
                pos: {
                    top: helper.getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                    left: helper.getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                },
                rotate: helper.get30DegRandom(),
                isInverse: false,
                isCenter: false
            };
        }
        // 合并上边
        if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }
        // 合并中间
        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
        // 更新数据，重新排布
        helper.State.imgsArrangeArr = imgsArrangeArr;
        $.each(imgsArrangeArr, function(i, data) {
            var $singleImgFigure = Constant.imgFigures[i];
            var $singleCtrlUnit = Constant.ctrlUnits[i];
            // 移除附加的Class
            $singleImgFigure.removeClass('is-center').removeClass('is-inverse');
            $singleCtrlUnit.removeClass('is-center').removeClass('is-inverse');
            helper.renderImgFigure(i, $singleImgFigure);
            helper.renderCtrlUnit(i, $singleCtrlUnit);
        });
    }
};

$(document).ready(function () {

    /* 定义需要的数据 */
    // 获取图片相关的数据 JSON对象数组
    var imageDatas = (function (url) {
        var imageDatasArr = helper.getObj(url, []);
        // 将图片名信息转成图片URL路径信息
        $.each(imageDatasArr, function (i, singleImageData) {
            singleImageData.imageURL = '../images/' + singleImageData.fileName;
            imageDatasArr[i] = singleImageData;
        });
        return imageDatasArr;
    })('../sources/datas/imageDatas.json');

    /* 定义需要的组件 */
    // 获取舞台组件  jQuery对象
    var $app = (function(url) {
        var $appTemp = helper.getObj(url);
        // 获取舞台元素  jQuery对象集
        var elementObj = helper.getElements(imageDatas);
        // 挂载元素
        $appTemp.find('section.img-sec').empty().append(elementObj.imgFigures);
        $appTemp.find('nav.controller-nav').empty().append(elementObj.ctrlUnits);
        return $appTemp;
    })('../components/AppComponent.html');

    /* 构建APP */
    // 挂载组件
    helper.mounting($('#app'), $app, function(constant) {
        var Constant = constant;
        // 首先拿到舞台大小
        var stageDOM = $app.get(0),
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);
        // 拿到一个 imageFigure 的大小
        var imgFigureDOM = constant.imgFigures[0].get(0),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH / 2);
        // 计算出偏移量 => 防止中心图片旋转时的 transform 使用致使 z-index 失效
        //var temp = Math.sqrt(Math.pow(imgW, 2) + Math.pow(imgH, 2));
        //var deltaH = temp - imgH;
        //var deltaW = temp - imgW;
        // 计算中心图片的位置点
        Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        };
        // 计算左侧、右侧区域的位置点
        Constant.hPosRange.leftSecX[0] = -halfImgW;// - deltaW
        Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;// - deltaW
        Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;// + deltaW
        Constant.hPosRange.rightSecX[1] = stageW - halfImgW;// + deltaW
        Constant.hPosRange.y[0] = -halfImgH;
        Constant.hPosRange.y[1] = stageH - halfImgH;
        // 计算上区域的位置点
        Constant.vPosRange.topY[0] = -halfImgH;// - deltaH
        Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;// - deltaH
        Constant.vPosRange.x[0] = halfStageW - imgW;
        Constant.vPosRange.x[1] = halfStageW;
        // 重新排布
        helper.rearrange(0);
    });
});
