#!/usr/bin/env node
const program = require('commander');
const { reprojectImage } = require('../src/app');
program
    .name('node-reproject')
    .description('基于node-gdal的影像重投影工具')
    .argument('<source file path>', '源影像的文件路径')
    .argument('<reproject file path>', '投影后的影像文件路径')
    .version('1.0.0', '-v,--vers', '当前版本号');

program.requiredOption('-e, --epsg <number>', '重投影坐标系的epsg编码');
// 定义可选条件
program.option('-r, --resampling <number>', '重采样方法，数值0-6', '0');

// 解析参数
program.parse();

if (program.args.length !== 2) {
    console.log('重投影的影像的源和目标文件位置必填！');
    process.exit();
}

let options = program.opts();
let epsg, resampling;
if (options['epsg']) {
    epsg = Number(options['epsg']);
}
if (options['resampling'])
    resampling = Number(options['resampling']);
else
    resampling = 0;
const src_path = program.args[0];
const reproject_path = program.args[1];
reprojectImage(src_path, reproject_path, epsg, resampling);