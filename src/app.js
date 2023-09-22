const gdal = require('gdal-async');
/**
* @function 栅格重投影
* @description 输入一个源数据，设置投影输出数据文件路径和投影坐标系的epsg编码，设置采样参数，输出栅格重投影文件
* @param src_ds {string} 输入的栅格文件路径。
* @param reproject_path {string} 输出的重投影后的栅格文件路径。
* @param t_epsg {number} 重投影的坐标系epsg编码。
* @param resampling {number} 重投影后的采样参数，默认是0。 0:average,1:bilinear,2:cubic,3:cubicspline,4:lanczos,5:mode,6:nearestNeighbor。
* @return void
* @author freegis
*/
function reprojectImage(src_path, reproject_path, t_epsg, resampling = 0, encoding) {
    let s_ds = gdal.open(src_path);
    // 获取源数据集的 坐标系
    const s_srs = s_ds.srs;
    // 投影的目标坐标系
    const t_srs = gdal.SpatialReference.fromEPSGA(t_epsg);
    // 输入源数据，源坐标系，目标坐标系，智能计算出输出的栅格像元分辨率和仿射变换参数
    const { rasterSize, geoTransform } = gdal.suggestedWarpOutput({
        src: s_ds,
        s_srs: s_srs,
        t_srs: t_srs
    });
    const dataType = s_ds.bands.get(1).dataType;
    // 使用源数据的驱动，保持文件格式不变
    const t_driver = s_ds.driver;
    if (encoding == undefined)
        encoding = dataType;
    else {
        switch (encoding) {
            case 'u8':
                encoding = gdal.GDT_Byte;
                break;
            case 'int16':
                encoding = gdal.GDT_Int16;
                break;
            case 'int32':
                encoding = gdal.GDT_Int32;
                break;
            case 'float32':
                encoding = gdal.GDT_Float32;
                break;
            case 'float64':
                encoding = gdal.GDT_Float64;
                break;
            default:
                console.error('设置的编码无效，投影后编码将与原始影像一致！')
                break;
        }
    }
    //创建输出图像
    const t_ds = t_driver.create(reproject_path, rasterSize.x, rasterSize.y, s_ds.bands.count(), encoding, {
        COMPRESS: 'LZW',
        PHOTOMETRIC: 'RGB',
        COPY_SRC_DOMAINS: 'NO'
    });
    //重置索引和仿射变换参数
    t_ds.srs = t_srs;
    t_ds.geoTransform = geoTransform;
    //重采样方法
    let gdal_resampling;
    switch (resampling) {
        case 0:
            gdal_resampling = gdal.GRA_Average;
            break;
        case 1:
            gdal_resampling = gdal.GRA_Bilinear;
            break;
        case 2:
            gdal_resampling = gdal.GRA_Cubic;
            break;
        case 3:
            gdal_resampling = gdal.GRA_CubicSpline;
            break;
        case 4:
            gdal_resampling = gdal.GRA_Lanczos;
            break;
        case 5:
            gdal_resampling = gdal.GRA_Mode;
            break;
        case 6:
            gdal_resampling = gdal.GRA_NearestNeighbor;
            break;
        default:
            gdal_resampling = gdal.GRA_Average;
            break;
    }
    gdal.reprojectImage({ src: s_ds, dst: t_ds, s_srs, t_srs, resampling: gdal_resampling });
    // 关闭退出
    t_ds.close();
    s_ds.close();
}
module.exports = {
    reprojectImage
}