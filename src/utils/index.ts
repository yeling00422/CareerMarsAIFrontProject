export function getIp() {
  const hostname = window.location.hostname;
  if (hostname === 'www.careermars-test.cn') {
    return '124.222.187.150';
  } else if (hostname === 'www.careermars.cn') {
    return '47.103.141.114';
  } else {
    return '127.0.0.1';
  }
}

export function getAiURL() {
  const hostname = window.location.hostname;
  if (hostname === 'www.careermars-test.cn') {
    return 'http://api-test.careermars-test.cn/api';
  } else if (hostname === 'www.careermars.cn') {
    return 'https://api-pro.careermars.cn/api';
  } else {
    return 'http://localhost:8184';
  }
}

export function getBackendApiURL() {
  const hostname = window.location.hostname;
  if (hostname === 'www.careermars-test.cn') {
    return 'http://api-test.careermars-test.cn/api';
  } else if (hostname === 'www.careermars.cn') {
    return 'https://api-pro.careermars.cn/api';
  } else {
    return 'http://localhost:8180';
  }
}

export function getBaseUrl() {
  const hostname = window.location.hostname;
  if (hostname === 'www.careermars-test.cn') {
    return 'http://www.careermars-test.cn';
  } else if (hostname === 'www.careermars.cn') {
    return 'https://www.careermars.cn';
  } else {
    return 'http://localhost:5174';
  }
}



// export function getAiURL() {
//   // 临时直接返回测试环境 API 地址，绕过域名判断
//   return 'http://api-test.careermars-test.cn/api/ai';
// }

