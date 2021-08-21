"use script"; //开发环境建议开启严格模式

//对应widget.js中MyWidget实例化后的对象
var thisWidget;

//当前页面业务
function initWidgetView(_thisWidget) {
  thisWidget = _thisWidget;

  //测试:调用了【index页面对应widg.js】 中的方法
  // thisWidget.testFun();
}

//测试
// function testIframeFun() {
//     toastr.error('我是弹窗中的方法');
// }
