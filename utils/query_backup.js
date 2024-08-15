const https = require('https');
const fs = require('fs');

// 无下载查询
function queryWithoutDownload() {
    jsonData = null;
    date = '2023-05';
    console.log("NO download query test");
    https.get('https://oss.x-lab.info/open_digger/github/X-lab2017/open-digger/openrank.json', 
    (res) => {
        let data = '';
      
        res.on('data', (chunk) => {
            data += chunk;
        });
      
        res.on('end', () => {
            jsonData = JSON.parse(data)
            // console.log(jsonData);
            console.log(data);
            console.log(jsonData[date]);
        });
      
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
}

//有下载查询
function queryWithDownload() {
    const outputFilePath = 'output.txt';
    let lines = {};
    jsonData = null;
    date = '2023-05';
    console.log("With download query test");
    https.get('https://oss.x-lab.info/open_digger/github/X-lab2017/open-digger/openrank.json', 
    (res) => {
        let data = '';
      
        res.on('data', (chunk) => {
            data += chunk;
        });
      
        res.on('end', () => {
            jsonData = JSON.parse(data);
            // console.log(jsonData);
            console.log(data);
            console.log(jsonData[date]);
            lines[1] = 'this is a save test';
            lines[2] = 'openrank: ' + jsonData[date];
            // 保存到文件
            const text = Object.values(lines).join('\n');
            fs.writeFile(outputFilePath, text, (err) => {
                if (err) throw err;
                console.log(`Text saved to ${outputFilePath}`);
            });
        });
      
    }).on("error", (err) => {
            console.log("Error: " + err.message);
    }); 

      
    
}

module.exports = async function query(){
    // queryWithoutDownload();   
    queryWithDownload(); 
}