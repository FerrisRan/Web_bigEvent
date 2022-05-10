$(function() {
    //为密码项添加验证规则
    var form = layui.form
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function(value) {
            if (value == $('[name = newPwd]').val()) {
                return '新密码不能与旧密码相同！'
            }
        },
        rePwd: function(value) {
            if (value !== $('[name = newPwd]').val()) {
                return '两次密码不一致！'
            }
        }
    })



    //监听重置密码表单提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
            //发起请求实现密码的重置功能
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('重置密码失败！')
                    console.log(res);
                }
                layui.layer.msg('重置密码成功！')
                    //重置表单
                $('.layui-form')[0].reset()
            }
        })
    })
})