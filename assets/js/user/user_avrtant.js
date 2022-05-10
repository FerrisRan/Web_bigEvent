$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)
        //给上传按钮添加绑定事件  相当于点击文件上传
    $('#btnChooseImg').on('click', function() {
            $('#file').click() //手动调用
        })
        //给选择文件绑定一个change事件
    $('#file').on('change', function(e) {
            //通过e.target.files[0]获取文件
            var fileList = e.target.files
            if (fileList.length == 0) {
                return layui.layer.msg('请选择照片！')
            }
            var file = e.target.files[0]
            var imgURL = URL.createObjectURL(file)
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', imgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        })
        //为确定按钮绑定事件
    $('#btnUpload').on('click', function() {
        //拿到裁剪后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            //发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新头像失败！')
                }
                layui.layer.msg('更新头像成功！')
                    //调用父级页面渲染函数
                window.parent.getUserInfo()
            }
        })
    })
})