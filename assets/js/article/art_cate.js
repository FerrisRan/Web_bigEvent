$(function() {
    var layer = layui.layer
    var form = layui.form
    initArt_cateList()



    //定义分类列表初始化函数
    function initArt_cateList() {
        //发起请求获取数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                //调用模板引擎
                var htmlStr = template('tel-table', res)
                $('tbody').html(htmlStr) //写入到结构中
            }
        })
    }
    var addIndex = null
        //给添加分类绑定点击事件
    $('#btnaddCate').on('click', function() {
            //调用弹出层
            addIndex = layer.open({
                type: 1,
                title: '添加文章分类',
                area: ['500px', '250px'],
                content: $('#add-area').html() //这里content是一个普通的String
            })
        })
        //为添加分类表单设置代理事件
    $('body').on('submit', '#add-form', function(e) {
        e.preventDefault() //阻止默认提交
            //发起接口的POST请求
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('添加分类失败！')
                }
                initArt_cateList() //重新渲染分类页面
                    // console.log(res);
                layer.msg('添加分类成功！')
                layer.close(addIndex) //关闭弹出层

            }
        })
    })
    var editIndex = null
        //为编辑按钮添加代理点击事件
    $('tbody').on('click', '#edit_btn', function() {
            //调用弹出层
            editIndex = layer.open({
                    type: 1,
                    title: '修改文章分类',
                    area: ['500px', '250px'],
                    content: $('#edit-area').html() //这里content是一个普通的String
                })
                //通过自定义属性拿到当前的ID值
            var id = $(this).attr('data-id')
            $.ajax({
                method: 'GET',
                url: '/my/article/cates/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('获取文章分类数据失败！')
                    }
                    //快速填充表单的信息
                    form.val('formEdit', res.data)
                        // console.log(res);
                }
            })
        })
        //编辑分类表单的提交事件（代理的方式）
    $('body').on('submit', '#edit-form', function(e) {
            e.preventDefault() //阻止默认提交
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('更新分类失败！')
                    }
                    layer.msg('更新分类成功！')
                    layer.close(editIndex) //关闭弹出层
                    initArt_cateList() //重新渲染页面
                }
            })
        })
        //删除文章分类
    $('body').on('click', '#del_btn', function() {
        var id = $(this).attr('data-id') //不能写在confirm中因为确定按钮没有自定义属性的绑定  所以没有this
        layer.confirm('确定删除吗？', { icon: 3, title: '提示' }, function(index) {
            //发请求
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！')
                    }
                    layer.msg('删除文章分类成功！')
                    layer.close(index)
                    initArt_cateList()
                }
            })
        })
    })
})