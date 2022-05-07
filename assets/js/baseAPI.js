//导入ajax.prefilter()用于拼接根路径和请求地址
$.ajaxPrefilter(function(options) {
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
        //如果请求路径中有/my   就设置headers请求头  HEADERS
    if (options.url.indexOf('/my') !== -1) {
        options.headers = { Authorization: localStorage.getItem('token') || '' }
    }
    //在ajaxPrefilter函数中给options挂载一个complete
    //在complete中通过res.responseJSON的属性判断是否失败
    options.complete = function(res) {
        // console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token') //清空当前
            location.href = '/login.html' //强制跳转
        }

    }
})