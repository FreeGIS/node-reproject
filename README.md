# node-reproject
基于node-gdal的栅格重投影工具。
由于gdal中内置重投影工具，qgis中也集成该工具，所以本仓库工具主要用于学习使用，当然用户如果不想装这些软件，也可以直接使用该工具进行影像数据重投影。
# 用法
## 安装
```
npm i node-reproject -g

```

## 参数说明
指定输入影像和重投影输出影像位置，使用-e参数指定重投影的坐标系的epsg编码，-r参数指定重采样策略。
```
node-reproject sourcefile targetfile -e 3857 -r 1
```

-r重采样参数是0-6之一的整型，分别代表以下重采样策略：

* 0：Average
* 1：Bilinear
* 2：Cubic
* 3：CubicSpline
* 4：Lanczos
* 5：Mode
* 6：NearestNeighbor

-r参数不指定，默认值是0，即Average策略。

