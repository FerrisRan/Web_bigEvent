//导入ajax.prefilter()用于拼接根路径和请求地址
$.ajaxPrefilter(function(options) {
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    console.log(options.url)
})