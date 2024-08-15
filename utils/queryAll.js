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
// 获取值为指定类型的指标名称
const getTypeKeys = (type) => {
    const keys = Object.keys(typeList).filter(key => typeList[key] === type);
    return keys;
};
// 获取数据来源为指定类型的指标名称
const getFormKeys = (from) => {
    const keys = Object.keys(fromList).filter(key => fromList[key] === from);
    return keys;
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

module.exports = async function queryAll(repo, metric, month, type, from, download, path) {

    const lines = [];
    const repoName = repo.split('/')[1];
    const repoNameStr = 'repo.name: ' + repoName;
    console.log(repoNameStr);
    lines.push(repoNameStr);
    const repoUrl = 'https://github.com/' + repo;
    const repoUrlStr = 'repo.url: '+ repoUrl;
    console.log(repoUrlStr);
    lines.push(repoUrlStr);
    if (month !== 'all') {
        console.log('month: ' + month);
        lines.push('month: ' + month);
    }

    // 根据type和from条件选择要查询的指标
    datas = {};
    typeKeys = null;
    if (type === 'all') {
        typeKeys = Object.keys(typeList);
    } else {
        typeKeys = getTypeKeys(type);
    }
    fromKeys = null;
    if (from === 'all') {
        fromKeys = Object.keys(fromList);
    } else {
        fromKeys = getFormKeys(from);
    }
    dataKeys = typeKeys.filter(item => fromKeys.includes(item));
    console.log('information included in this query: ' + dataKeys + '\n');
    lines.push('information included in this query: ' + dataKeys + '\n');
    // 构建需要的https urls并访问获取数据
    const urls = [];
    for (const key of dataKeys) {
        const url = `https://oss.x-lab.info/open_digger/github/${repo}/${key}.json`;
        urls.push(url);
    }
    const results = await Promise.all(urls.map(url => httpsGet(url)));

    i = 0;
    results.forEach((result) => {
        // 输出每一项指标的详细值，冒号前面标出了指标名和对应的type和from
        jsonResult = JSON.parse(result);
        if (month === 'all') {
            console.log(`repo.${typeList[dataKeys[i]]}.${fromList[dataKeys[i]]}.${dataKeys[i]}: ${result}\n`);
            lines.push(`repo.${typeList[dataKeys[i]]}.${fromList[dataKeys[i]]}.${dataKeys[i]}: ${result}\n`)
        } else {
            if (jsonResult[month] === undefined) {
                console.log(`repo.${typeList[dataKeys[i]]}.${fromList[dataKeys[i]]}.${dataKeys[i]}: 
                this metric should be estimated with full time-line, try query it by an individual command using "--metric"\n`);
                lines.push(`repo.${typeList[dataKeys[i]]}.${fromList[dataKeys[i]]}.${dataKeys[i]}: 
                this metric should be estimated with full time-line, try query it by an individual command using "--metric"\n`);
            } else {
                console.log(`repo.${typeList[dataKeys[i]]}.${fromList[dataKeys[i]]}.${dataKeys[i]}: ${jsonResult[month]}\n`);
                lines.push(`repo.${typeList[dataKeys[i]]}.${fromList[dataKeys[i]]}.${dataKeys[i]}: ${jsonResult[month]}\n`);
            }
        }
        i++;
    });

    //是否需要下载
    if (download) {
        const outputFilePath = path;
        fs.writeFile(outputFilePath, lines.join('\n'), (err) => {
            if (err) throw err;
            console.log(`Survey saved to ${outputFilePath}`);
        });
    }
}