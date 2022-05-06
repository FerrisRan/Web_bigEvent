$(function() {
    //点击去注册账号链接  显示去登录模块
    $('#link-reg').on('click', function() {
            $('.reg-box').show()
            $('.login-box').hide()
        })
        //点击去登陆链接  显示去注册模块
    $('#link-login').on('click', function() {
            $('.reg-box').hide()
            $('.login-box').show()
        })
        //从layUi中获取layer对象
    var layer = layui.layer
        //自定义表单校验规则
        //从layUi中获取form对象  调用verify（）方法进行自定义
    var form = layui.form
    form.verify({
            //自定义pwd的校验规则
            pwd: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            //定义repwd规则
            repwd: function(value) {
                //获取密码框的文本值（父盒子里面name为password的元素的值）
                var pwd = $('.reg-box [name=password]').val()
                if (pwd !== value) {
                    return '两次密码不一致' //return出去 弹出一个文本
                }
            }
        })
        //调用接口发起注册的请求 监听注册表单提交事件
    $('#reg_form').on('submit', function(e) {
            //1.阻止注册表单默认提交事件
            e.preventDefault()
                //2.发起ajax的post请求
                //优化代码将data单独打包
            var data = {
                username: $('#reg_form [name=username]').val(),
                password: $('#reg_form [name=password]').val()
            }
            $.post('/api/reguser', data,
                function(res) {
                    if (res.status !== 0) {
                        layer.msg(res.message) //调用layer
                    }
                    layer.msg('注册成功！请您登陆')
                        //注册成功后 调用点击事件自动跳转登陆页面
                    $('#link-login').click()
                })
        })
        //监听登陆表单提交事件  并发起POST请求
    $('#login_form').submit(function(e) {
        //阻止表单默认提交行为
        e.preventDefault()
            //发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(), //快速获取表单文本内容 
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登陆失败')
                }
                layer.msg('登陆成功')
                    //将登陆成功的token存储到locationStorage
                localStorage.setItem('token', res.token)
                    //跳转到后台页面
                location.href = '/index.html'
            }
        })
    })
})