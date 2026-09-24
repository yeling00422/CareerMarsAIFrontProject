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
    return 'https://api-test.careermars-test.cn/api';
  } else if (hostname === 'www.careermars.cn') {
    return 'https://api-pro.careermars.cn/api';
  } else {
    return 'http://localhost:8184';
  }
}

export function getBackendApiURL() {
  const hostname = window.location.hostname;
  if (hostname === 'www.careermars-test.cn') {
    return 'https://api-test.careermars-test.cn/api';
  } else if (hostname === 'www.careermars.cn') {
    return 'https://api-pro.careermars.cn/api';
  } else {
    return 'http://localhost:8180';
  }
}

export function getBaseUrl() {
  const hostname = window.location.hostname;
  if (hostname === 'www.careermars-test.cn') {
    return 'https://www.careermars-test.cn';
  } else if (hostname === 'www.careermars.cn') {
    return 'https://www.careermars.cn';
  } else {
    return 'http://localhost:5174';
  }
}

export function getVXAppId() {
  const hostname = window.location.hostname
  if (hostname === 'localhost') {
    return 'wxa0558fc231cb79d0'
  } else if (hostname === 'www.careermars-test.cn') {
    return 'wxa0558fc231cb79d0'
  } else {
    return 'wx3ac13a15b8fd070e'
  }
}

export function getYXBUrl() {
  const hostname = window.location.hostname
  if (hostname === 'localhost') {
    // 本地开发，微信不会回调localhost，这里仅占位
    return 'https://www.careermars.cn/ai/user-login'
  } else if (hostname === 'www.careermars-test.cn') {
    return 'https://www.careermars-test.cn/ai/user-login'
  } else {
    return 'https://www.careermars.cn/ai/user-login'
  }
}


