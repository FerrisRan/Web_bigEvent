$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage; //导入laypage
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: '', //文章的状态，可选值有：已发布、草稿
    }
    initTable()
    initCate()
        //格式化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
            const dt = new Date(date)



            var y = dt.getFullYear()
            var m = padZero(dt.getMonth() + 1)
            var d = padZero(dt.getDate())


            var hh = padZero(dt.getHours())
            var mm = padZero(dt.getMinutes())
            var ss = padZero(dt.getSeconds())

            return y + '-' + m + '-' + d + '-' + '' + hh + ':' + mm + ':' + ss

        }
        //定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    //初始化表格
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }
    //初始化分类选项
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('分类选项获取失败！')
                }
                var htmlStr = template('tel-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()

            }
        })
    }
    //实现筛选分类功能
    //监听表单提交事件
    $('#form_search').submit(function(e) {
            e.preventDefault()
                //获取两个选项框的value值
            var cate_id = $('[name=cate_id]').val()
            var state = $('[name=state]').val()
                //重新赋值给q对象
            q.cate_id = cate_id
            q.state = state
            initTable() //更新页面表格数据
        })
        //渲染分页的函数
    function renderPage(total) {
        //调用laypage.render渲染分页UI
        laypage.render({
            elem: 'page-Box', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示的条数
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //自定义分页的功能项
            limits: [2, 3, 6, 5], //自定义分页显示的条目数
            //调用jump回调有两种方式
            //1.手动点击页码更改选项
            //2.只要调用laypage.render()方法就会触发  first为true是第二种方式
            jump: function(obj, first) {
                // console.log(obj.curr); 得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit) 得到当前每页的条目数，以便向服务器请求数据
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                    //为了防止死循环  ！first为手动点击触发  
                if (!first) {
                    initTable()
                }
            }
        })
    }
    //通过代理方式为动态添加的删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        var len = $('.btn-delete').length //获取当前删除按钮的个数
        var id = $(this).attr('data-id') //获取当前删除对应的Id

        //询问用户是否要删除数据
        layer.confirm('确定删除吗?', { icon: 3, title: '提示' }, function(index) {
            //发起请求
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')

                    //如果len=1就说明删除之后当前没有数据再此页面中
                    if (len === 1) {
                        //更新q.pagenum的值减1  限定条件最少为1 （三元表达式）
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable() //根据新的q.pagenum值重新渲染表格数据
                }
            })
            layer.close(index) //关闭当前弹出层
        })
    })
    $('tbody').on('click', '.btn-edit', function() {
        var id = $(this).attr('data-id')
        location.href = '/article/art_edit.html'
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取信息失败！')
                }
                console.log(res);
            }
        })
    })
})