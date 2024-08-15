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
const fromList = {
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

// 通过url获得数据
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

// 特定指标查询
async function queryCertain(repo, metric, month, download, path) {

    const repoName = repo.split('/')[1];
    const repoNameStr = 'repo.name: ' + repoName;
    console.log(repoNameStr);
    const repoUrl = 'https://github.com/' + repo;
    const repoUrlStr = 'repo.url: '+ repoUrl;
    console.log(repoUrlStr);

    const dataUrl = `https://oss.x-lab.info/open_digger/github/${repo}/${metric}.json`;
    // console.log(dataUrl);
    const urls = [
        dataUrl,
    ];
    const results = await Promise.all(urls.map(url => httpsGet(url)));
    data = results[0];
    jsonData = JSON.parse(data);

    // 是否查询某个自然月的指标，默认为查询全部时间
    if (month === 'all') {
        console.log('repo.' + typeList[metric] + '.' + fromList[metric] + '.' + metric + ': ' + data);
    } else {
        console.log('month: ' + month);
        console.log('repo.' + typeList[metric] + '.' + fromList[metric] + '.' + metric + ': ' + jsonData[month])
        // console.log(jsonData);
    }

    // 是否下载
    if (download) {
        const outputFilePath = path;
        let lines = {};
        lines['repoName'] = repoNameStr;
        lines['repoUrl'] = repoUrlStr;
        if (month === 'all') {
            lines['metric'] = 'repo.' + typeList[metric] + '.' + fromList[metric] + '.' + metric + ': ' + data;
        } else {
            lines['month'] = 'month: ' + month;
            lines['metric'] = 'repo.' + typeList[metric] + '.' + fromList[metric] + '.' + metric + ': ' + jsonData[month];
        }
        // 保存到文件
        const text = Object.values(lines).join('\n');
        fs.writeFile(outputFilePath, text, (err) => {
            if (err) throw err;
            console.log(`Text saved to ${outputFilePath}`);
        });
    }

}

module.exports = async function query(repo, metric, month, download, path){

    await queryCertain(repo, metric, month, download, path);

}