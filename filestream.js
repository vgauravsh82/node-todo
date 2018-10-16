var fs = require("fs");

function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}


async function main() {

    var stream;
    readstream = fs.createReadStream("D://apps/todo-app/todo-express/fileupload/big.txt");

    await sleep(10000);
    
    var dataLength = 0;
    readstream
        .on('data', function (chunk) {
            dataLength += 1;
            console.log('Chunk writing ', dataLength);
        });
    
    var writestream;
    writestream = fs.createWriteStream("D://apps/todo-app/todo-express/fileupload/writebig.txt");

    readstream.pipe(writestream);

}



exports.read = function () {
    console.log('file copy request start');
    main();
    console.log('file copy request end ');
}

