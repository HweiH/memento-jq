/**
 * 加载器
 * @type {{getObj: loader.getObj}}
 */
var loader = {
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
        } else {                // 组件
            $.get(url, function (data) { temp = $(data); });
        }
        $.ajaxSettings.async = true;
        return temp;
    },
    /**
     * 获取舞台需要的元素 JSON对象
     * @param imageDatas
     * @returns {{imgFigures: Array, ctrlUnits: Array}}
     */
    getElements: function(imageDatas) {
        // 获取图片组件 jQuery对象
        var $imgFigure = loader.getObj('../components/ImgFigureComponent.html');
        // 获取控制单元组件 jQuery对象
        var $ctrlUnit = loader.getObj('../components/CtrlUnitComponent.html');
        // 构造元素集
        var imgFigures = [];    // 图片集
        var ctrlUnits = [];     // 控制按钮集
        // 根据加载的数据组装需要的组件
        $.each(imageDatas, function(index, value) {
            // 为每张图片、每个控制点添加属性等要素
            $imgFigure.find('img[alt="default.gif"]').attr('src', value.imageURL);
            $imgFigure.find('h2.img-title').html(value.title);
            $imgFigure.find('div.img-back p').html(value.desc);
            // 构造所有的图片框
            imgFigures.push($imgFigure.clone(true));
            // 添加控制单元
            ctrlUnits.push($ctrlUnit.clone(true));
        });
        // 构造需要的元素对象
        return {
            imgFigures: imgFigures,
            ctrlUnits: ctrlUnits
        };

        /* 辅助 */

    }
};

$(document).ready(function () {
    /* 定义需要的数据 */
    // 获取图片相关的数据 JSON对象数组
    var imageDatas = (function (url) {
        var imageDatasArr = loader.getObj(url, []);
        // 将图片名信息转成图片URL路径信息
        $.each(imageDatasArr, function (i, singleImageData) {
            singleImageData.imageURL = '../images/' + singleImageData.fileName;
            imageDatasArr[i] = singleImageData;
        });
        return imageDatasArr;
    })('../sources/datas/imageDatas.json');

    /* 定义需要的组件 */
    // 获取舞台组件  jQuery对象
    var $app = loader.getObj('../components/AppComponent.html');
    // 获取舞台元素  jQuery对象集
    var elementObj = loader.getElements(imageDatas);

    // 挂载元素
    $app.find('section.img-sec').empty().append(elementObj.imgFigures);
    $app.find('nav.controller-nav').empty().append(elementObj.ctrlUnits);

    $('#app').empty().css({
        'color': 'white'
    }).append($app);
});
