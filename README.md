# translate-json

文件为i18n对应的json格式，目前版本只支持读取要翻译的单一json文件，例如`locales/en.json`

![image-20211112150815199](README.assets/image-20211112150815199-16367008969761.png)



## usage

例如源文件为en.json，目标语言文件为ja.json，执行下面命令

```
node ./utils/spiderGoogleTranslate.js en ja
```

命令行输出如下

![image-20211112152336026](README.assets/image-20211112152336026-16367018174572.png)

![image-20211112152835770](README.assets/image-20211112152835770-16367021173813.png)

