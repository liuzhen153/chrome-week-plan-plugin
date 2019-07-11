$(function() {
    layui.use(['layer', 'form', 'element', 'tree'], function() {
        var layer = layui.layer,
            form = layui.form,
            element = layui.element,
            tree = layui.tree;




        // 先判断用户偏好
        switch_search()
        switch_model()
        refresh()
        refresh_tabs()
        refresh_history()

        // 点击切换展示模式
        $('#switch_model_box').click(function() {
            switch_model(1)

        })

        // 点击切换搜索模式
        $('#switch_search_box').click(function() {
            switch_search(1)
        })


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
            var date_list = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            var new_Date = new Date()
            var timesStamp = new_Date.getTime();
            var currenDay = new_Date.getDay();
            date = date_list[currenDay - 1] + '(' + (new Date(timesStamp).toLocaleDateString().replace(/[年月]/g, '-').replace(/[日上下午]/g, '').substring(5)) + ')'
            console.log(date)
            return date
        }

        

        function refresh() {
            var today_total = 0,
                today_done = 0,
                week_total = 0,
                week_done = 0,
                big_done_total = 0,
                big_done_done = 0,
                q2_total = 0,
                q2_done = 0;
            chrome.storage.local.get({ planData: {} }, function(items) {
                var planData = items.planData
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
                // edit:true,
                isJump: true,
                showLine: false

            });
            var bookmark2 = tree.render({
                elem: '#bookmark2', //绑定元素
                data: tree_bookmark2,
                // accordion:true,
                // edit:true,
                isJump: true,
                showLine: false

            });
        });
        // 将书签里的添加href属性
        function set_link(obj) {
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
            chrome.tabs.query({}, function(tabs) {
                $.each(tabs, function(i, v) {
                    var _html = ''
                    if (v['favIconUrl'] == '') {
                        v['favIconUrl'] = './img/icon.png'
                    }
                    // console.log(v)
                    _html += '<div class="layui-col-xs6 tab-item-box">'
                    _html += '<blockquote t-id="' + v['id'] + '" class="do-better-tabs do-1 layui-elem-quote layui-quote-nm tab-item" style="border-left:1px;cursor: pointer;" title="' + v['title'] + '"><img class="tabs-icon" src="' + v['favIconUrl'] + '" alt="" />' + v['title'] + '</blockquote>'
                    _html += '<span class="layui-badge do-1 layui-bg-cyan tab-close" style="display: none;">X</span></div>'
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
            var id = $(this).parent().children('.do-better-tabs').attr('t-id')
            // console.log(id)
            chrome.tabs.remove(parseInt(id), function() {
                console.log('移除标签页成功')
            })
        })

        //tab页相关
        // chrome.tabs.onCreated.addListener(function(tab) {
        //     if (tab['status'] == "complete") {
        //         refresh_tabs()
        //     }
        // });

        //tab页相关
        chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
            if (changeInfo['status'] == "complete") {
                refresh_tabs()
            }
        });

        chrome.tabs.onRemoved.addListener(function(tab) {
            refresh_tabs()
        });


        // 历史记录
        function refresh_history() {
            $('#do-better-history-box').html('')
            var _search = {
                text: ''
            }
            chrome.history.search(_search, function(history) {
                console.log(history)
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
                        html += '<span class="layui-badge do-1 layui-bg-gray tab-close-history">' + _time + '</span>' + v['title'] + '</blockquote></div>'
                        // html += ''

                    }
                })
                $('#do-better-history-box').html(html)
                console.log('更新标签页成功....')
                console.log(history)
            })
        }

        // 历史记录被点击
        $('body').on('click', '.do-better-history', function(){
            var url = $(this).attr('t-url')
            var item = {
                url: url
            }
            chrome.tabs.create(item,function(){
                console.log('打开历史记录' + url + '成功')
            })
        })

        // 美化时间
        function suit_num(num){
            if (num < 10) {
                return '0' + num
            } else {
                return num
            }
        }


    });

});