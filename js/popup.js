$(function() {
    
    var _list = [
        {
            'title': '百度',
            'url': 'http://.baidu.com/'
        },
        {
            'title': '百度',
            'url': 'http://.baidu.com/'
        },
        {
            'title': '百度',
            'url': 'http://.baidu.com/'
        },
        {
            'title': '百度',
            'url': 'http://.baidu.com/'
        },
        {
            'title': '百度',
            'url': 'http://.baidu.com/'
        },
        {
            'title': '百度',
            'url': 'http://.baidu.com/'
        },
        {
            'title': '百度',
            'url': 'http://.baidu.com/'
        }
    ]
    var html = ''
    $.each(_list, function(i,v){
        html += '<div class="layui-col-xs3"><div class="layui-card-header" style="cursor: pointer;" ><a class="popup-a" style="cursor: pointer;" href="' + v['url'] + '">' + v['title'] + '</a></div></div>'
    })
    $('.layui-row').append(html)

});