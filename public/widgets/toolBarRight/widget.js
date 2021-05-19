;(function (window, mars3d) {
  //创建widget类，需要继承BaseWidget
  class MyWidget extends mars3d.widget.BaseWidget {
    //外部资源配置
    get resources() {
      return ['view.css']
    }

    //弹窗配置
    get view() {
      return { type: 'append', url: 'view.html', parent: 'body' }
    }

    //初始化[仅执行1次]
    create() {
      //此数据也可以放在widget.json的配置中，但是发现很多人容易引起同名误解，所以还是放在这里
      this.data = this.config.data || [
        { name: '底图', icon: 'fa fa-map', widget: 'widgets/manageBasemaps/widget.js' },
        { name: '图层', icon: 'fa fa-tasks', widget: 'widgets/manageLayers/widget.js' },
        {
          name: '工具',
          icon: 'fa fa-cubes',
          children: [
            { name: '坐标定位', icon: 'fa fa-map-pin', widget: 'widgets/centerXY/widget.js' },
            { name: '视角书签', icon: 'fa fa-tags', widget: 'widgets/bookmark/widget.js' },
          ],
        },
      ]
    }

    //每个窗口创建完成后调用
    winCreateOK(viewopt, html) {
      if (viewopt.type != 'append') {
        return
      }

      var arr = this.data

      //移动设备上，处理下菜单层次
      if (!haoutil.system.isPCBroswer() && arr.length == 3 && arr[0].children) {
        var item1 = arr.shift()
        var item2 = arr.shift()
        arr[0].children.insert(item2, 0)
        arr[0].children.insert(item1, 0)
      }

      this.initMenu(arr)
    }
    //构造 菜单
    initMenu(arr) {
      var widgetObj = {}

      var inhtml = ''
      for (var i = 0, len = arr.length; i < len; i++) {
        var item = arr[i]
        if (item.hasOwnProperty('visible') && !item.visible) {
          continue
        }
        if (item.children) {
          //分组

          inhtml += `<div class="btn-group">
            <button type="button" class="btn btn-link toolBarRight-btn dropdown-toggle" data-toggle="dropdown" aria-expanded="false" >
                <i class="${item.icon}"></i>${item.name}<span class="caret"></span>
            </button>
            <ul class="dropdown-menu dropdown-menu-right toolBarRight-dropdown-menu" >`

          for (let j = 0, jlen = item.children.length; j < jlen; j++) {
            let children_item = item.children[j]
            if (children_item.hasOwnProperty('visible') && !children_item.visible) {
              continue
            }

            let ex = ''
            if (children_item.onclick) {
              ex = 'onclick="' + children_item.onclick + '"'
            } else if (children_item.widget) {
              ex = 'data-widget="' + children_item.widget + '"'
            }

            inhtml += `<li class="widget-btn" ${ex} >
                          <a href="javascript:void(0)"><i class="${children_item.icon}"></i>${children_item.name}</a>
                       </li>`
            widgetObj[children_item.widget] = children_item
          }
          inhtml += ' </ul></div>'
        } else {
          //不是分组
          let ex = ''
          if (item.onclick) {
            ex = 'onclick="' + item.onclick + '"'
          } else if (item.widget) {
            ex = 'data-widget="' + item.widget + '"'
          }

          inhtml += `<button type="button" class="widget-btn btn btn-link toolBarRight-btn " ${ex} >\
                       <i class="${item.icon}"></i>${item.name}
                    </button>`
          widgetObj[item.widget] = item
        }
      }
      $('.toolBarRight').html(inhtml)

      $('.toolBarRight .widget-btn').click(function () {
        var uri = $(this).attr('data-widget')
        if (haoutil.isutil.isNull(uri)) {
          return
        }
        // console.log('单击了工具栏：' + uri);

        if (mars3d.widget.isActivate(uri)) {
          mars3d.widget.disable(uri)
        } else {
          var opt = {
            ...(widgetObj[uri] || {}),
            uri: uri,
          }
          mars3d.widget.activate(opt)
        }
      })
    }
    //激活插件
    activate() {}
    //释放插件
    disable() {}
  }

  //注册到widget管理器中。
  mars3d.widget.bindClass(MyWidget)

  //每个widet之间都是直接引入到index.html中，会存在彼此命名冲突，所以闭包处理下。
})(window, mars3d)
