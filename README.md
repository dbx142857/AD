**1 ��Ŀ����ǰ��׼��**
===================

1 ��װnodejs����
-------------

2 ������������**node -v**��ʾnode��ǰ�汾����ʾ��װ�ɹ�
-------------

3 ʹ������**npm -g install supervisor**ȫ�ְ�װsupervisor��ع���
-------------

4 ʹ������**npm -g install gulp**��װgulp�Զ�����������
-------------

5 ʹ������**npm -g install express**ȫ�ְ�װexpress���
-------------

6 ʹ������**npm install**��װ������������Ҫ��npm��
-------------

˵����

	1 ��ȷ��vpn�������ݿ�����������ʵõ�
	2 gulp��װ��ɺ��Ȳ�Ҫ������gulp��ͷ���κ������Ϊgulp�Ļ�����û�д��ɣ�������ȫ��Ӱ�����ǵ���Ŀ��չ���Ժ�϶��õõ��� 
	3 ʹ���˺�dbx142857,����dbx142857���Ե�¼���ǵ���Ŀ����
	4 ��config/config.js�е�TEST_MODE����Ϊtrue���ǿ������¼��dbx142857����˻�����ϵͳ
	5 npm install����֮�����һ��node_modules��Ŀ¼�������Ǹ���package.json��������npm����ע�ⲻҪ������ļ��ύ��git��

**2 ������Ŀ**
===================
1 �������У���λ����Ŀ���ڵĸ��ļ���
-------------

2 ��������**supervisor app**������Ŀ
-------------

3 ���������ַ������**localhost:3000**�������ǵ���Ŀ
-------------

˵����

	ʹ������node bin/www�������ǵ���ĿҲ���ԣ�������վ�����ٶ�Ҳ�������,������վ���й����д��뷢���䶯���ǲ�����������Ч����ʹ��supervisor���п��Խ���������



**3 ��ĿĿ¼�ṹ��֯˵��**
===================
˵�������ǵ���Ŀʹ��express3������ٰ�װ����˺�˵�Ŀ¼��֯�͹ٷ��Ļ�������һ��
```
{
    "app.js�ļ�":"��binĿ¼�µ�web-server����ʱ���Զ����õ��ļ�ȥ�������ǵ���Ŀ",
    "gulpfile.js":"gulp�Զ����������ߵ������ļ��������޹�",
    "package.json":"�ڴ��������ǵ�node��Ŀ��Ҫ��Щnpm����ͨ��npm install����һ����װ",
    "binĿ¼":"ֻ����һ���ļ�www,��һ���򵥵�web server�������������ǵ���Ŀ",
    "configĿ¼":{//������Ŀ����Ҫ�õ�������
        "databse.js":"���ݿ������ļ�",
        "config.js":"��Ŀȫ������,��˺�ǰ�˹�����ȫ�������ļ�,�Լ���ǰ�����ĳЩ�����������"
    },
    "modelsĿ¼":{//���һЩģ�ͣ��������ݿ����ģ��,�Ժ������Ҫ���ݿ��curdģ�Ϳ����ڴ��ļ��м������������ݿ�������Գ���ģ����
        "database.js":"���ݿ�����ģ��",
        "lib.js":"һЩ�����ķ��������ڴˣ����統ǰ��tpl������������sqlƴ��ʱ�������źͼӺŵ���д��ɵ�ʹ��",
        "start.js":"��һ��get������ʱ�������Ҫ��Ⱦģ�嵽ҳ����ʹ�ø�ģ��ȥ��Ⱦ������express���õ�render����,�������ǿ������һЩȫ�ֵ�js����"
    },
    "viewsĿ¼":{//�����Ŀ��ģ���ļ�����Ϊ���ǵ���Ŀ��һ��webapp������������ֻ��Ҫindex.htmlȥ��Ⱦ���ɣ���������ģ������ͨ������ķ�ʽע�뵽��վ����ҳ��
        "index.html":"��վ�����ʹ�õ�ģ���ļ�",
        "error.html":"�����һ�������ڵ�·�ɷ����ͻ���Ⱦ��ģ�壬Ҳ������ν��404ҳ��"
    },
    "routesĿ¼":"�൱��mvc�ܹ��е�controllerһ�㣬��һ��������ʱ���������е���������ļ���Ȼ��ģ��ű���Ⱦ",
    "publicĿ¼":{//���һЩjs,css,images��һЩ������components�ȶ���
        "componentsĿ¼":"���һЩǰ�˵����������layer������",
        "imagesĿ¼":"ͼƬ",
        "stylesheetsĿ¼":"�����ʽ��",
        "tplĿ¼":{//ģ���ļ�
            "loading.html":"һ��loading�Ķ����ļ���css3д��,��·�ɷ����仯ʱ����loading�Ķ�����ʾ�û����ڼ��ز�ͬ��ģ��",
            "home.html":"ҳ����ҳʹ�õ�ģ��"
        },
        "javascriptsĿ¼":{//js�ļ�
            "libĿ¼":"һЩ�������Ĳ��",
            "***Controller.js":"***��ʾģ�����ƣ����ļ��Ǹ�ģ���ǰ�˵Ŀ�����",
            "***Service.js":"һЩservice",
            "***Filter.js":"һЩfilter",
            "main.js":"angular��Ŀ����ļ�",
            "config.js":"��Ŀ��CONFIG��Ϊһ��serviceע�뵽����controller����",
            "common.js":"��Ÿ��������Զ���Ĺ��ߣ������Զ���ļ򵥵�jquery�����",
            "baseController.js":"����һ�������controller,��ͬʱ��Ϊҳ��header��footer��controller��ͬʱ�ٸ���ģ���controller����֮ǰ���������и�controller������ڸ�ģ�������һЩ����û��Ƿ��¼�Ĳ���"
        }
    }
```