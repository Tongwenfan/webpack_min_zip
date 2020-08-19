const { RawSource } = require('webpack-sources');
const JSZip = require('jszip');
const zip = new JSZip();
class WebpackPluginZip {
    constructor(options) {
        this.options = options|| { filename:'build'};
    }
    apply(compiler) {
        compiler.hooks.emit.tapAsync('WebpackPluginZip', (compilation, callback) => {
            console.log('Get ready to compress the file!');
            const folder = zip.folder(this.options.filename);
            for (let filename in compilation.assets) {
                let source = compilation.assets[filename].source();
                folder.file(filename, source);
            }
            zip
                .generateAsync({
                    type: 'nodebuffer'
                })
                .then(content => {
                    const outputPath = this.options.filename + '.zip';

                    compilation.assets[outputPath] = new RawSource(content);

                    callback();
                });
        })
    }
}

module.exports = WebpackPluginZip