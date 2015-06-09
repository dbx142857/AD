**1 项目运行前的准备**
===================

1 安装nodejs环境
-------------

2 在命令行输入**node -v**显示node当前版本即表示安装成功
-------------

3 使用命令**npm -g install supervisor**全局安装supervisor监控工具
-------------

4 使用命令**npm -g install gulp**安装gulp自动化管理工具
-------------

5 使用命令**npm -g install express**全局安装express框架
-------------

6 使用命令**npm install**安装程序运行所需要的npm包
-------------

说明：

	1 请确保vpn开启数据库可以正常访问得到
	2 gulp安装完成后先不要运行以gulp开头的任何命令，因为gulp的环境还没有搭建完成，不过完全不影响我们的项目进展，以后肯定用得到。 
	3 使用账号dbx142857,密码dbx142857可以登录我们的项目测试
	4 将config/config.js中的TEST_MODE设置为true我们可以免登录以dbx142857这个账户进入系统
	5 npm install运行之后会多出一个node_modules的目录，里面是各种package.json里声明的npm包，注意不要将这个文件提交到git中

**2 运行项目**
===================
1 打开命令行，定位到项目所在的根文件夹
-------------

2 运行命令**supervisor app**启动项目
-------------

3 在浏览器地址栏输入**localhost:3000**运行我们的项目
-------------

说明：

	使用命令node bin/www运行我们的项目也可以，这样网站进入速度也许会更快,但是网站运行过程中代码发生变动我们不会立即看到效果，使用supervisor运行可以解决这个问题



**3 项目目录结构组织说明**
===================
说明：我们的项目使用express3命令快速安装，因此后端的目录组织和官方的基本保持一致
```
{
    "app.js文件":"当bin目录下的web-server启动时会自动调用的文件去启动我们的项目",
    "gulpfile.js":"gulp自动化管理工具的配置文件，与后端无关",
    "package.json":"在此声明我们的node项目需要哪些npm包，通过npm install进行一键安装",
    "bin目录":"只包含一个文件www,是一个简单的web server，用于启动我们的项目",
    "config目录":{//包含项目中需要用到的配置
        "databse.js":"数据库配置文件",
        "config.js":"项目全局配置,后端和前端共享该全局配置文件,以减少前后端在某些变量的耦合性"
    },
    "models目录":{//存放一些模型，比如数据库操作模型,以后如果需要数据库的curd模型可以在此文件夹加入而且最好数据库操作可以抽象到模型里
        "database.js":"数据库连接模型",
        "lib.js":"一些公共的方法存在于此，比如当前的tpl方法有助于在sql拼接时减少引号和加号的书写造成的痛苦",
        "start.js":"当一个get请求发生时，如果需要渲染模板到页面中使用该模型去渲染而不是express内置的render方法,这样我们可以输出一些全局的js变量"
    },
    "views目录":{//存放项目的模板文件，因为我们的项目是一个webapp，所以理论上只需要index.html去渲染即可，其它的字模板我们通过请求的方式注入到网站所在页面
        "index.html":"网站入口所使用的模板文件",
        "error.html":"当后端一个不存在的路由发生就会渲染该模板，也就是所谓的404页面"
    },
    "routes目录":"相当于mvc架构中的controller一层，当一个请求发生时，首先运行的是这里的文件，然后模板才被渲染",
    "public目录":{//存放一些js,css,images和一些公共的components等东西
        "components目录":"存放一些前端的组件，比如layer弹出层",
        "images目录":"图片",
        "stylesheets目录":"层叠样式表",
        "tpl目录":{//模板文件
            "loading.html":"一个loading的动画文件，css3写的,当路由发生变化时出现loading的动画提示用户正在加载不同的模块",
            "home.html":"页面首页使用的模板"
        },
        "javascripts目录":{//js文件
            "lib目录":"一些第三方的插件",
            "***Controller.js":"***表示模块名称，该文件是该模块的前端的控制器",
            "***Service.js":"一些service",
            "***Filter.js":"一些filter",
            "main.js":"angular项目入口文件",
            "config.js":"项目中CONFIG作为一个service注入到各个controller当中",
            "common.js":"存放各种我们自定义的工具，比如自定义的简单的jquery插件等",
            "baseController.js":"这是一个特殊的controller,它同时作为页面header和footer的controller，同时再各个模块的controller运行之前会首先运行该controller，因此在该模块可以做一些检测用户是否登录的操作"
        }
    }
```
