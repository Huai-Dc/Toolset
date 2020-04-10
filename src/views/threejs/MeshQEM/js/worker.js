import { Module } from './lib/a.out';


onmessage = function (e) {
    console.log(e);
    const file = e.data.blob;
    const percentage = e.data.percentage;
    const simplify_name = e.data.simplify_name;
    const agressiveness = e.data.agressiveness;

    prepare_and_simplify(file, percentage, simplify_name, agressiveness);
};

// let Module = {
//     'print': (text) => {
//         self.postMessage({ 'log': text });
//     }
// };

let last_file_name = undefined;

function prepare_and_simplify(file, percentage, simplify_name, agressiveness) {
    let filename = file.name;

    if (filename === last_file_name) {
        console.log('skipping load and create data file');
        simplify(filename, percentage, simplify_name);
        return;
    } else {
        if (last_file_name !== undefined) {
            Module.FS_unlink(last_file_name);
        }
    }
    last_file_name = filename;
    let fr = new FileReader();
    fr.readAsArrayBuffer(file);
    fr.onloadend = function (e) {
        let data = new Uint8Array(fr.result);
        Module.FS_createDataFile('.', filename, data, true, true);
        simplify(filename, percentage, simplify_name, agressiveness);
    };
}

function simplify(filename, percentage, simplify_name, agressiveness) {
    let t = Date.now();
    Module.ccall('simplify', undefined,
        ['string', 'number', 'string', 'number'],
        [filename, percentage, simplify_name, agressiveness]);
    let out_bin = Module.FS_readFile(simplify_name);
    // sla 适用于 stl
    let file = new Blob([out_bin], { type: 'application/sla' });
    let took = Date.now() - t;

    self.postMessage({
        'blob': file,
        took: took
    });
}
