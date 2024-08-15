const https = require('https');
const fs = require('fs');

// 关于每个指标的Type和From的映射，根据输入的metric可以得知该metric的类型和数据来源
const typeList = {
    openrank: 'index',
    activity: 'index',
    attention: 'index',
    active_dates_and_times: 'metric',
    stars: 'metric',
    technical_fork: 'metric',
    participants: 'metric',
    new_contributors: 'metric',
    new_contributors_detail: 'metric',
    inactive_contributors: 'metric',
    bus_factor: 'metric',
    bus_factor_detail: 'metric',
    issues_new: 'metric',
    issues_closed: 'metric',
    issue_comments: 'metric',
    issue_response_time: 'metric',
    issue_resolution_duration: 'metric',
    issue_age: 'metric',
    code_change_lines_add: 'metric',
    code_change_lines_remove: 'metric',
    code_change_lines_sum: 'metric',
    change_requests: 'metric',
    change_requests_accepted: 'metric',
    change_requests_reviews: 'metric',
    change_request_response_time: 'metric',
    change_request_resolution_duration: 'metric',
    change_request_age:'metric',
    activity_details:'metric',
    developer_network:'network',
    repo_network:'network'
};
const formList = {
    openrank: 'xlab',
    activity: 'xlab',
    attention: 'xlab',
    active_dates_and_times: 'chaoss',
    stars: 'xlab',
    technical_fork: 'chaoss',
    participants: 'xlab',
    new_contributors: 'chaoss',
    new_contributors_detail: 'chaoss',
    inactive_contributors: 'chaoss',
    bus_factor: 'chaoss',
    bus_factor_detail: 'chaoss',
    issues_new: 'chaoss',
    issues_closed: 'chaoss',
    issue_comments: 'xlab',
    issue_response_time: 'chaoss',
    issue_resolution_duration: 'chaoss',
    issue_age: 'chaoss',
    code_change_lines_add: 'chaoss',
    code_change_lines_remove: 'chaoss',
    code_change_lines_sum: 'chaoss',
    change_requests: 'chaoss',
    change_requests_accepted: 'chaoss',
    change_requests_reviews: 'chaoss',
    change_request_response_time: 'chaoss',
    change_request_resolution_duration: 'chaoss',
    change_request_age:'chaoss',
    activity_details:'xlab',
    developer_network:'xlab',
    repo_network:'xlab'
};
// 获取值为指定类型的指标名称
const getTypeKeys = (type) => {
    const keys = Object.keys(typeList).filter(key => typeList[key] === type);
    return keys.join(', ');
};
// 获取数据来源为指定类型的指标名称
const getFormKeys = (form) => {
    const keys = Object.keys(formList).filter(key => formList[key] === form);
    return keys.join(', ');
};


function httpsGet(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(data);
            });
        }).on("error", (err) => {
            reject(err);
        });
    });
}

module.exports = async function queryAll(repo, metric, month, type, from, download) {

    const repoName = repo.split('/')[1];
    const repoNameStr = 'repo.name: ' + repoName;
    console.log(repoNameStr);
    const repoUrl = 'https://github.com/' + repo;
    const repoUrlStr = 'repo.url: '+ repoUrl;
    console.log(repoUrlStr);

    datas = {}
    if (type === 'index') {
        
    } else if (type === 'metric'){

    } else if (type === 'network'){

    } else {

    }

    const outputFilePath = 'outputAll.txt';
    const urls = [
        'https://oss.x-lab.info/open_digger/github/X-lab2017/open-digger/openrank.json',
        'https://oss.x-lab.info/open_digger/github/X-lab2017/open-digger/activity.json',
    ];
    const results = await Promise.all(urls.map(url => httpsGet(url)));
    let line = '';
    results.forEach((result) => {
    line = result;
    // 在这里对 line 进行其他操作
    console.log("test: " + line);
    });

    const text = results.join('\n');
    fs.writeFile(outputFilePath, text, (err) => {
        if (err) throw err;
        console.log(`Text saved to ${outputFilePath}`);
    });
}