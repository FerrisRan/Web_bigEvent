$(function() {
    //获取用户信息函数
    getUserInfo()
        //退出登录功能
    $('#btn_Loginout').on('click', function() {
        layui.layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function(index) {
            //1.清楚本地的token存储
            localStorage.removeItem('token')
                //2.重新跳转到登陆页面
            location.href = '/login.html'

            layer.close(index)
        })
    })



})

function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            // console.log(res.data);
            renderAvatar(res.data) //将结果带对象的参数传入渲染头像的函数中
        }
    })
}
//渲染头像函数
function renderAvatar(user) {
    //name为获取的昵称或者名字
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp' + name) //渲染span标签
        //如果用户没有设置头像
    if (user.user_pic !== null) {
        //用户头像设置src 文本头像隐藏
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        //否则 用户头像隐藏  文本头像显示为用户名称的首字母大写
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase() //获取用户名的首字母转化为大写
        $('.text-avatar').html(first).show()
    }
}