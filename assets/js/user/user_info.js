$(function() {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间'
            }
        }
    })
    initUser_info()
        //初始化用户信息函数
    function initUser_info() {
        //发起ajax请求
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                form.val('form_userinfo', res.data)
            }
        })
    }

    //表单重置效果
    $('#btnReset').on('click', function(e) {
            //1.阻止表单默认重置效果
            e.preventDefault()
                //2.重新调用一次初始化用户信息函数
            initUser_info()
        })
        //更新用户基本信息
    $('.layui-form').on('submit', function(e) {
        //1.阻止默认提交行为
        e.preventDefault()
            //2.发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！')
                window.parent.getUserInfo()
            }
        })
    })
})