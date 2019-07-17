$(function() {
    layui.use(['layer', 'form', 'element', 'tree'], function() {
        var layer = layui.layer,
            form = layui.form,
            element = layui.element,
            tree = layui.tree;

        // 点击切换展示模式
        $('#switch_model_box').click(function() {
            switch_model(1)

        })

        // 点击切换搜索模式
        $('#switch_search_box').click(function() {
            switch_search(1)
        })

        // 先判断用户偏好
        switch_search()
        switch_model()



        function switch_search(_switch = 0) {
            // 判断是否有值
            chrome.storage.local.get({ isGoogle: 0 }, function(items) {
                if (items.isGoogle == 1) {
                    if (_switch == 1) {
                        chrome.storage.local.set({ isGoogle: 0 }, function() {
                            $('#baidu').show()
                            $('#google').hide()
                            $('#switch_search').html('谷歌')
                            console.log('搜索模式切换到百度成功')
                        });
                    } else {
                        $('#baidu').hide()
                        $('#google').show()
                        $('#switch_search').html('百度')
                    }


                } else {
                    if (_switch == 1) {
                        chrome.storage.local.set({ isGoogle: 1 }, function() {
                            $('#baidu').hide()
                            $('#google').show()
                            $('#switch_search').html('百度')
                            console.log('搜索模式切换到谷歌成功')
                        });
                    } else {
                        $('#baidu').show()
                        $('#google').hide()
                        $('#switch_search').html('谷歌')
                    }

                }


            });
        }


        function switch_model(_switch = 0) {
            // 判断是否有值
            chrome.storage.local.get({ isDoBetter: 0 }, function(items) {
                if (items.isDoBetter == 1) {
                    if (_switch == 1) {
                        chrome.storage.local.set({ isDoBetter: 0 }, function() {
                            $('.week-plan-box').show()
                            $('.do-better-box').hide()
                            $('#switch_model').html('Do Better')
                            $('.normal-tools').removeClass('colorf2f2f2')
                            $('.the-row').removeClass('colorf2f2f2')
                            $('form').removeClass('colorf2f2f2')
                        });
                    } else {
                        $('.normal-tools').addClass('colorf2f2f2')
                        $('.the-row').addClass('colorf2f2f2')
                        $('form').addClass('colorf2f2f2')
                        $('.week-plan-box').hide()
                        $('.do-better-box').show()
                        $('#switch_model').html('周计划')
                        refresh()
                    }


                } else {
                    if (_switch == 1) {
                        chrome.storage.local.set({ isDoBetter: 1 }, function() {
                            $('.normal-tools').addClass('colorf2f2f2')
                            $('.the-row').addClass('colorf2f2f2')
                            $('form').addClass('colorf2f2f2')
                            $('.week-plan-box').hide()
                            $('.do-better-box').show()
                            $('#switch_model').html('周计划')
                            refresh()
                        });
                    } else {
                        $('.week-plan-box').show()
                        $('.do-better-box').hide()
                        $('#switch_model').html('Do Better')
                        $('.normal-tools').removeClass('colorf2f2f2')
                        $('.the-row').removeClass('colorf2f2f2')
                        $('form').removeClass('colorf2f2f2')
                    }

                }


            });
        }

        // 日期列表
        function getDates() {
            var date_list = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
            var new_Date = new Date()
            var timesStamp = new_Date.getTime();
            var currenDay = new_Date.getDay();
            var date = date_list[currenDay] + '(' + (new Date(timesStamp).toLocaleDateString().replace(/[年月]/g, '-').replace(/[日上下午]/g, '').substring(5)) + ')'
            return date
        }



        function refresh() {
            refresh_tabs()
            refresh_history()
            get_bookmarkTree()
            var today_total = 0,
                today_done = 0,
                week_total = 0,
                week_done = 0,
                big_done_total = 0,
                big_done_done = 0,
                q2_total = 0,
                q2_done = 0;
            chrome.storage.local.get({ isNextWeek: 0 }, function(it) {
                if (it.isNextWeek == 0) {
                    chrome.storage.local.get({ planData: {} }, function(items) {
                        var planData = items.planData
                        var date = getDates()
                        $('#today_plan').html('')
                        $.each(planData, function(i, v) {
                            $.each(v['date_plan'], function(idx, val) {

                                if (val.length > 0) {
                                    $.each(val, function(index, value) {
                                        week_total++
                                        if (idx == date) {
                                            // 开始分析当天数据
                                            today_total++
                                            data_plan = i
                                            data_plan_week = date
                                            // data_plan_index = _data['data_plan_index']

                                            _today = '<div class="layui-card" data-alert-title="修改计划状态" data-alert-noalert="1" data-plan="' + data_plan + '" data-index="' + index + '" data-parent-index="' + data_plan_week + '"><div class="layui-card-header today-plan" style="color:#01AAED;font-weight:bold;">'
                                            if (value['open'] == 0) {
                                                _today += '<i class="plan-check layui-icon layui-icon-ok-circle" style="color: #5FB878;"></i> '
                                                today_done++
                                            } else {
                                                _today += '<i class="plan-check layui-icon layui-icon-circle" style="font-size:20px;color: #5FB878;cursor:pointer;" title="改变计划状态"></i> '
                                            }
                                            _today += value['title'] + '</div> '
                                            _today += '</div>'
                                            $('#today_plan').append(_today)
                                        }
                                        if (value['open'] == 0) {
                                            week_done++
                                        }
                                        if (value['big_stone'] == 1) {
                                            big_done_total++
                                        }

                                        if (value['big_stone'] == 1 && value['open'] == 0) {
                                            big_done_done++
                                        }

                                        if (value['time_q'] == 2) {
                                            q2_total++
                                        }

                                        if (value['time_q'] == 2 && value['open'] == 0) {
                                            q2_done++
                                        }
                                    })


                                }


                            })
                        })


                        $('#t-1-1').html(today_done)
                        $('#t-1-2').html(today_total)
                        $('#t-2-1').html(week_done)
                        $('#t-2-2').html(week_total)
                        $('#t-3-1').html(big_done_done)
                        $('#t-3-2').html(big_done_total)
                        $('#t-4-1').html(q2_done)
                        $('#t-4-2').html(q2_total)

                    });
                } else { // 如果是下周
                    chrome.storage.local.get({ theweek: {} }, function(items) {
                        var planData = items.theweek
                        console.log('refresh....')
                        console.log(planData)
                        var date = getDates()
                        $('#today_plan').html('')
                        $.each(planData, function(i, v) {
                            $.each(v['date_plan'], function(idx, val) {

                                if (val.length > 0) {
                                    $.each(val, function(index, value) {
                                        week_total++
                                        if (idx == date) {
                                            console.log(val)
                                            // 开始分析当天数据
                                            today_total++
                                            data_plan = i
                                            data_plan_week = date
                                            // data_plan_index = _data['data_plan_index']

                                            _today = '<div class="layui-card" data-alert-title="修改计划状态" data-alert-noalert="1" data-plan="' + data_plan + '" data-index="' + index + '" data-parent-index="' + data_plan_week + '"><div class="layui-card-header today-plan" style="color:#01AAED;font-weight:bold;">'
                                            if (value['open'] == 0) {
                                                _today += '<i class="plan-check layui-icon layui-icon-ok-circle" style="color: #FF5722;"></i>'
                                                today_done++
                                            } else {
                                                _today += '<i class="plan-check layui-icon layui-icon-circle" style="font-size:20px;color: #FF5722;cursor:pointer;" title="改变计划状态"></i>'
                                            }
                                            _today += value['title'] + '</div> '
                                            _today += '</div>'
                                            $('#today_plan').append(_today)
                                        }
                                        if (value['open'] == 0) {
                                            week_done++
                                        }
                                        if (value['big_stone'] == 1) {
                                            big_done_total++
                                        }

                                        if (value['big_stone'] == 1 && value['open'] == 0) {
                                            big_done_done++
                                        }

                                        if (value['time_q'] == 2) {
                                            q2_total++
                                        }

                                        if (value['time_q'] == 2 && value['open'] == 0) {
                                            q2_done++
                                        }
                                    })


                                }


                            })
                        })


                        $('#t-1-1').html(today_done)
                        $('#t-1-2').html(today_total)
                        $('#t-2-1').html(week_done)
                        $('#t-2-2').html(week_total)
                        $('#t-3-1').html(big_done_done)
                        $('#t-3-2').html(big_done_total)
                        $('#t-4-1').html(q2_done)
                        $('#t-4-2').html(q2_total)

                    });
                }


            })

        }




        // // 展示修改和删除
        // $('body').on('click', '.today-plan', function() {
        //     data_plan_week = $(this).attr('date-week')
        //     date_time = $(this).parent('tr').attr('date-time')
        //     _title = data_plan_week + ' ' + date_time + ' 计划'
        //     data_plan = $(this).attr('data-plan')

        //     // 展示plan
        //     chrome.storage.local.get({ planData: {} }, function(items) {
        //         var planData = items.planData
        //         // 弹窗
        //         plan_alert(planData, data_plan, data_plan_week, _title)

        //     });

        // })

        // 获取是哪种搜索引擎
        function get_tab() {
            chrome.storage.local.get({ isGoogle: 0 }, function(items) {
                if (items.isGoogle == 1) {
                    if (_switch == 1) {
                        chrome.storage.local.set({ isGoogle: 0 }, function() {
                            $('#baidu').show()
                            $('#google').hide()
                            $('#switch_search').html('谷歌')
                            console.log('搜索模式切换到百度成功')
                        });
                    } else {
                        $('#baidu').hide()
                        $('#google').show()
                        $('#switch_search').html('百度')
                    }


                } else {
                    if (_switch == 1) {
                        chrome.storage.local.set({ isGoogle: 1 }, function() {
                            $('#baidu').hide()
                            $('#google').show()
                            $('#switch_search').html('百度')
                            console.log('搜索模式切换到谷歌成功')
                        });
                    } else {
                        $('#baidu').show()
                        $('#google').hide()
                        $('#switch_search').html('谷歌')
                    }

                }


            });
        }



        // 获取书签
        function get_bookmarkTree() {
            // 展示书签
            chrome.bookmarks.getTree(function(bookmarkArray) {
                all_bookmark = bookmarkArray[0]['children']
                tree_bookmark1 = []
                tree_bookmark2 = []
                count = 0
                $.each(all_bookmark, function(index, value) {
                    value['spread'] = true
                    if (count == 0) {
                        tree_bookmark1.push(set_link(value))
                        count++
                    } else {
                        tree_bookmark2.push(set_link(value))
                    }

                })
                //渲染
                var bookmark1 = tree.render({
                    elem: '#bookmark1', //绑定元素
                    data: tree_bookmark1,
                    // accordion:true,
                    edit: true,
                    isJump: true,
                    showLine: false,
                    id: 'bookmarkTree',
                    operate: function(obj) {
                        var type = obj.type; //得到操作类型：add、edit、del
                        var data = obj.data; //得到当前节点的数据
                        var elem = obj.elem; //得到当前节点元素

                        //Ajax 操作
                        var id = data.id; //得到节点索引
                        console.log(id)
                        if (type === 'add') { //增加节点
                            //返回 key 值
                            console.log(elem);
                        } else if (type === 'update') { //修改节点
                            var txt = elem.find('.layui-tree-txt').html()
                            chrome.bookmarks.update(id, { title: txt }, function(result) {
                                layer.msg('修改成功')
                            })
                        } else if (type === 'del') { //删除节点
                            // 如果有子节点
                            if (data.hasOwnProperty('children') && data.children.length > 0) {
                                layer.msg('有子节点')
                                layer.open({
                                    content: '『' + data.title + '』是个文件夹，要将文件夹和其中内容全部删除？',
                                    closeBtn: 0,
                                    btn: ['确认删除', '取消'],
                                    yes: function(index, layero) {
                                        // save_this(_type = 1)
                                        chrome.bookmarks.removeTree(id, function() {
                                            layer.msg('删除成功')
                                        })
                                        layer.close(index)

                                    },
                                    btn2: function(index, layero) {
                                        tree.reload('bookmarkTree', {
                                            data: tree_bookmark1,
                                            //新的参数
                                        });

                                        layer.close(index)
                                    }
                                });
                            } else {
                                layer.open({
                                    content: '确定要删除『' + data.title + '』吗？',
                                    closeBtn: 0,
                                    btn: ['确认删除', '取消'],
                                    yes: function(index, layero) {
                                        // save_this(_type = 1)
                                        chrome.bookmarks.remove(id, function() {
                                            layer.msg('删除成功')
                                        })
                                        layer.close(index)

                                    },
                                    btn2: function(index, layero) {
                                        tree.reload('bookmarkTree', {
                                            data: tree_bookmark1,
                                            //新的参数
                                        });

                                        layer.close(index)
                                    }
                                });
                            }
                            // console.log(data)

                        };
                    }

                });
                var bookmark2 = tree.render({
                    elem: '#bookmark2', //绑定元素
                    data: tree_bookmark2,
                    // accordion:true,
                    edit: true,
                    isJump: true,
                    showLine: false,
                    id: 'bookmarkTree2',
                    operate: function(obj) {
                        var type = obj.type; //得到操作类型：add、edit、del
                        var data = obj.data; //得到当前节点的数据
                        var elem = obj.elem; //得到当前节点元素

                        //Ajax 操作
                        var id = data.id; //得到节点索引
                        if (type === 'add') { //增加节点
                            //返回 key 值
                            console.log(elem);
                        } else if (type === 'update') { //修改节点
                            var txt = elem.find('.layui-tree-txt').html()
                            chrome.bookmarks.update(id, { title: txt }, function(result) {
                                layer.msg('修改成功')
                            })
                        } else if (type === 'del') { //删除节点
                            // 如果有子节点
                            if (data.hasOwnProperty('children') && data.children.length > 0) {
                                layer.msg('有子节点')
                                layer.open({
                                    content: '『' + data.title + '』是个文件夹，要将文件夹和其中内容全部删除？',
                                    closeBtn: 0,
                                    btn: ['确认删除', '取消'],
                                    yes: function(index, layero) {
                                        // save_this(_type = 1)
                                        chrome.bookmarks.removeTree(id, function() {
                                            layer.msg('删除成功')
                                        })
                                        layer.close(index)

                                    },
                                    btn2: function(index, layero) {
                                        tree.reload('bookmarkTree2', {
                                            data: tree_bookmark2,
                                            //新的参数
                                        });

                                        layer.close(index)
                                    }
                                });
                            } else {
                                layer.open({
                                    content: '确定要删除『' + data.title + '』吗？',
                                    closeBtn: 0,
                                    btn: ['确认删除', '取消'],
                                    yes: function(index, layero) {
                                        // save_this(_type = 1)
                                        chrome.bookmarks.remove(id, function() {
                                            layer.msg('删除成功')
                                        })
                                        layer.close(index)

                                    },
                                    btn2: function(index, layero) {
                                        tree.reload('bookmarkTree2', {
                                            data: tree_bookmark2,
                                            //新的参数
                                        });

                                        layer.close(index)
                                    }
                                });
                            }
                            // console.log(data)

                        };
                    }

                });
            });
        }

        // 将书签里的添加href属性
        function set_link(obj) {
            // console.log(obj)
            // 如果有下级
            if (obj.hasOwnProperty('children') && obj['children'].length != 0) {
                $.each(obj['children'], function(i, v) {
                    obj['children'][i] = set_link(v)
                })
            } else if (obj.hasOwnProperty('url')) {
                obj['href'] = obj['url']
            }
            return obj
        }


        // 更新标签页
        function refresh_tabs() {
            $('#do-better-tabs-box').html('')
            chrome.tabs.getAllInWindow(function(tabs) {
                $.each(tabs, function(i, v) {
                    var _html = ''
                    if (!v.hasOwnProperty('favIconUrl') || v['favIconUrl'] == '') {
                        v['favIconUrl'] = './img/icon.png'
                    }
                    // console.log(v)
                    _html += '<div class="layui-col-xs11 tab-item-box">'
                    _html += '<blockquote t-id="' + v['id'] + '" class="do-better-tabs do-1 layui-elem-quote tab-item" style="cursor: pointer;" title="' + v['title'] + '"><img class="tabs-icon" src="' + v['favIconUrl'] + '" alt="" />' + v['title'] + '</blockquote>'
                    _html += '<span class="layui-badge do-1 layui-bg-cyan tab-close" t-type="2" style="display: none;">X</span></div>'
                    $('#do-better-tabs-box').append(_html)
                })

                console.log('更新标签页成功....')

            })
        }


        // 标签页
        $('body').on('mouseover', '.do-1', function() {
            $(this).parent().children('.do-better-tabs').addClass('color-green')
            $(this).parent().children('.tab-close').show()
        })
        $('body').on('mouseout', '.do-1', function() {
            $(this).parent().children('.do-better-tabs').removeClass('color-green')
            $(this).parent().children('.tab-close').hide()
        })

        // 跳转标签页
        $('body').on('click', '.do-better-tabs', function() {
            var id = $(this).attr('t-id')
            chrome.tabs.update(parseInt(id), { active: true }, function() {
                console.log('切换标签页成功')
            })
        })

        // 删除标签页
        $('body').on('click', '.tab-close', function() {
            if ($(this).attr('t-type') == 1) { // 删除标签页
                var id = $(this).parent().children('.do-better-tabs').attr('t-id')
                // console.log(id)
                chrome.tabs.remove(parseInt(id), function() {
                    console.log('移除标签页成功')
                })
            } else if ($(this).attr('t-type') == 2) { // 删除历史记录
                // console.log($(this).attr('t-url'))
                chrome.history.deleteUrl({ url: $(this).attr('t-url') }, function() {
                    console.log('删除历史记录成功')
                })
            }

        })

        //tab页相关
        // chrome.tabs.onCreated.addListener(function(tab) {
        //     if (tab['status'] == "complete") {
        //         refresh_tabs()
        //     }
        // });




        // 历史记录
        function refresh_history() {
            $('#do-better-history-box').html('')
            var _search = {
                text: ''
            }
            chrome.history.search(_search, function(history) {
                var html = ''
                var today = new Date()
                var today_d = today.getDate()
                var today_m = today.getMonth()
                $.each(history, function(i, v) {
                    if (v['title'] != '') {
                        var n = new Date(v['lastVisitTime'])
                        var mon = suit_num(n.getMonth())
                        var d = suit_num(n.getDate())
                        var h = suit_num(n.getHours())
                        var min = suit_num(n.getMinutes())
                        var _time = h + ':' + min
                        var _date = mon + '-' + d + ' '
                        if (!(today_m == mon && today_d == d)) {
                            _time = _date + _time
                        }


                        html += '<div class="layui-col-xs6 tab-item-box">'
                        html += '<blockquote t-url="' + v['url'] + '" class="do-better-history do-1 layui-elem-quote layui-quote-nm tab-item" style="border-left:1px;cursor: pointer;" title="' + v['title'] + '">'
                        html += '<span class="layui-badge do-1 layui-bg-gray tab-close-history">' + _time + '</span>' + v['title'] + '</blockquote><span class="layui-badge do-1 layui-bg-cyan tab-close" t-type="2" t-url="' + v['url'] + '" style="display: none;">X</span></div></div>'
                        // html += ''

                    }
                })
                $('#do-better-history-box').html(html)
                console.log('更新历史记录成功....')
            })
        }

        // 历史记录被点击
        $('body').on('click', '.do-better-history', function() {
            var url = $(this).attr('t-url')
            var item = {
                url: url
            }
            chrome.tabs.create(item, function() {
                console.log('打开历史记录' + url + '成功')
            })
        })


        //tab页相关
        chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
            if (changeInfo['status'] == "complete") {
                refresh_tabs()
            }
        });


        // 标签页被关闭时
        chrome.tabs.onRemoved.addListener(function(tab) {
            refresh_tabs()
        });

        // 当标签页在窗口中移动时产生
        chrome.tabs.onMoved.addListener(function(tabId, moveInfo) {
            refresh_tabs()
        });

        // 当标签页由于预呈现或即搜即得而被另一个标签页替换时产生
        chrome.tabs.onReplaced.addListener(function(addedTabId, removedTabId) {
            refresh_tabs()
        });
        // 历史记录被删除时
        chrome.history.onVisitRemoved.addListener(function() {
            refresh_history()
        })


        // 新增历史记录时
        chrome.history.onVisited.addListener(function() {
            refresh_history()
        })


        // 美化时间
        function suit_num(num) {
            if (num < 10) {
                return '0' + num
            } else {
                return num
            }
        }




    });

});