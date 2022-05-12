$(function() {
    var layer = layui.layer
    var form = layui.form


    initCate()
    initEditor()
        //获取下拉分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()

            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
        //给选择图片绑定弹出的点击框
    $('#btnchooseImg').on('click', function() {
            $('#fileCover').click()
        })
        //为隐藏的文件域绑定change事件
    $('#fileCover').on('change', function(e) {
        var file = e.target.files[0] //拿到用户选择的文件
        var newImgURL = URL.createObjectURL(file) //根据选择的文件，创建一个对应的 URL 地址
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    var art_state = '已发布'
        //为存为草稿按钮绑定点击事件改变值
    $('#art-save').on('click', function() {
        art_state = '草稿'
    })


    $('#form-pub').submit(function(e) {
        e.preventDefault()

        var fd = new FormData($(this)[0])
        fd.append('state', art_state)
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                publishArt(fd)
            })
    })

    function publishArt(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            processData: false, // jQuery不要去处理发送的数据
            contentType: false, // jQuery不要去设置Content-Type请求头
            success: function(res) {
                if (res.status !== 0) {
                    return layer('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                location.href = '/article/art_list.html' //跳转页面到文章列表
            }
        })
    }
})