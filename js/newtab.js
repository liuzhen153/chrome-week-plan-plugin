$(function() {
    layui.use(['layer', 'form', 'element'], function() {
        var layer = layui.layer,
            form = layui.form,
            element = layui.element;

        // 日期列表
        function getDates(_type = "this_week") {
            var date_list = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            var new_Date = new Date()
            var timesStamp = new_Date.getTime();
            if (_type == 'next_week') {
                timesStamp = timesStamp + 24 * 60 * 60 * 1000 * 7
            }
            var currenDay = new_Date.getDay();
            var dates = [];
            for (var i = 0; i < 7; i++) {
                dates.push(date_list[i] + '(' + new Date(timesStamp + 24 * 60 * 60 * 1000 * (i - (currenDay + 6) % 7)).toLocaleDateString().replace(/[年月]/g, '-').replace(/[日上下午]/g, '').substring(5) + ')');
            }
            return dates
        }

        // 获取下周周一凌晨0点时间戳
        function get_next_week_0() {
            var new_Date = new Date()
            var currenDay = new_Date.getDay();
            var timesStamp = new_Date.getTime();
            _t = new Date(timesStamp + 24 * 60 * 60 * 1000 * (7 - (currenDay + 6) % 7)).setHours(0, 0, 0, 0)
            return _t
        }
        var date_list, date_list = [],
            _planData, bigStoneAlert, _alert_index, view_list_index, loop_plan_index, _edit_plan_index




        // 设置表头
        function set_table_title(date_list) {
            $('#table_title').html('')
            _html = ''
            _html = '<th style="text-align:center;border-top: none;border: none; background: #fff; position: relative;"><div class="week-time" style="color:#009688">上午</div></th>'
            _html += '<th style="text-align:center;border-top: none;border-left: none;border-right: none; background: #fff;"></th>'

            $.each(date_list, function(i, v) {
                _html += '<th style="text-align:center;border-top: none; border-left: none;border-right: none; background: #fff;color:#009688;font-weight: bold;">' + v + '</th>'
            })
            $('#table_title').append(_html)
        }


        function get_date_list_planData(_type = "this_week") {
            date_list = getDates()
            if (_type == 'next_week') {
                date_list_old = date_list
                date_list = getDates(_type = _type)
            }

            set_table_title(date_list)

            // 添加起始数据
            date_plan = {}
            date_plan[date_list[0]] = []
            date_plan[date_list[1]] = []
            date_plan[date_list[2]] = []
            date_plan[date_list[3]] = []
            date_plan[date_list[4]] = []
            date_plan[date_list[5]] = []
            date_plan[date_list[6]] = []
            _planData = {
                'time_100': {
                    date_time: '上午 5:00~6:00',
                    time: '6',
                    date_plan: date_plan
                },
                'time_101': {
                    date_time: '上午 6:00~7:00',
                    time: '7',
                    date_plan: date_plan
                },
                'time_102': {
                    date_time: '上午 7:00~8:00',
                    time: '8',
                    date_plan: date_plan
                },
                'time_103': {
                    date_time: '上午 8:00~9:00',
                    time: '9',
                    date_plan: date_plan
                },
                'time_104': {
                    date_time: '上午 9:00~10:00',
                    time: '10',
                    date_plan: date_plan
                },
                'time_105': {
                    date_time: '上午 10:00~11:00',
                    time: '11',
                    date_plan: date_plan
                },
                'time_106': {
                    date_time: '上午 11:00~12:00',
                    time: '<span style="color:#009688">中午</span>',
                    date_plan: date_plan
                },
                'time_107': {
                    date_time: '中午 12:00~13:00',
                    time: '13',
                    date_plan: date_plan
                },
                'time_108': {
                    date_time: '下午 13:00~14:00',
                    time: '14',
                    date_plan: date_plan
                },
                'time_109': {
                    date_time: '下午 14:00~15:00',
                    time: '15',
                    date_plan: date_plan
                },
                'time_110': {
                    date_time: '下午 15:00~16:00',
                    time: '16',
                    date_plan: date_plan
                },
                'time_111': {
                    date_time: '下午 16:00~17:00',
                    time: '17',
                    date_plan: date_plan
                },
                'time_112': {
                    date_time: '下午 17:00~18:00',
                    time: '<span style="color:#009688">晚上</span>',
                    date_plan: date_plan
                },
                'time_113': {
                    date_time: '下午 18:00~19:00',
                    time: '19',
                    date_plan: date_plan
                },
                'time_114': {
                    date_time: '晚上 19:00~20:00',
                    time: '20',
                    date_plan: date_plan
                },
                'time_115': {
                    date_time: '晚上 20:00~21:00',
                    time: '21',
                    date_plan: date_plan
                },
                'time_116': {
                    date_time: '晚上 21:00~22:00',
                    time: '22',
                    date_plan: date_plan
                },
                'time_117': {
                    date_time: '晚上 22:00~23:00',
                    time: '23',
                    date_plan: date_plan
                },
                'time_118': {
                    date_time: '晚上 23:00~24:00',
                    time: '24',
                    date_plan: date_plan
                }

            }
        }




        function is_empty_dict(obj) {
            if (Object.keys(obj).length == 0) {
                return true
            }
            return false
        }

        // 先刷新下日期和内容
        chrome.storage.local.get({ isNextWeek: 0 }, function(items) {

            _now = parseInt((new Date()).getTime())
            console.log(items.isNextWeek, _now)
            if (items.isNextWeek > _now) {
                console.log('下周')
                get_date_list_planData('next_week')
            } else {
                // 如果不为0，则置为0
                if (items.isNextWeek != 0) {
                    chrome.storage.local.set({ isNextWeek: 0 }, function() {
                        console.log('重置为本周成功')
                    })
                }
                console.log('本周')
                get_date_list_planData()
            }
            // 判断是否有值
            chrome.storage.local.get({ planData: {} }, function(items) {
                if (is_empty_dict(items.planData)) {
                    // 模拟数据
                    edit_planData(_planData)
                }
                // 先刷新一遍数据
                refresh()

            });
        })




        // 数据修改后需要刷新数据
        function refresh() {
            // 查询本周
            chrome.storage.local.get({ isHistory: 0 }, function(items) {
                var isHistory = items.isHistory
                if (isHistory != 0) {
                    // 历史条目提示
                    $('#history-msg').show()
                    $('#history_list').html(isHistory)
                }

            })
            console.log('数据刷新中...')
            // 展示plan
            chrome.storage.local.get({ planData: {} }, function(items) {
                $('#big_stone_box').html('')
                $('#tbody').html('')
                var planData = items.planData
                $.each(planData, function(i, v) {
                    // console.log(i)
                    html = ''

                    html += '<tr date-time="' + v['date_time'] + '"><td style="border: none; background: #fff; width: 15px; position: relative;"><div class="week-time">' + v['time'] + '</div></td><td style="border-left: none; background: #fff; width: 15px;"></td>'
                    var date_plan = v['date_plan']
                    $.each(date_list, function(index, value) {

                        var title = '<ul>'
                        open_count = 0
                        big_stone_count = 0
                        $.each(date_plan[value], function(idx, val) {
                            open_count++
                            // 只有开启状态才展示
                            if (val['open'] == 1) {

                                title += '<li><span class="layui-badge-dot layui-bg-orange"></span> ' + val['title'] + '<li/>'
                            }
                            if (val['big_stone'] == 1) {
                                big_stone_count++
                                var html_ = '<div class="layui-card"><div class="layui-card-header" style="color:#01AAED;font-weight:bold;">'
                                if (val['open'] == 0) {
                                    html_ += '<i class="layui-icon layui-icon-ok-circle" style="color: #FF5722;"></i>'
                                }
                                html_ += val['title'] + '</div> '
                                // html_ += '<div class="layui-card-body">' + val['desc'] + '   </div>'
                                html_ += '</div>'
                                $('#big_stone_box').append(html_)

                            }

                            if (val['open'] == 0) {
                                // 大石头也展示
                                title += '<li><i class="layui-icon layui-icon-ok-circle" '
                                if (val['big_stone'] == 1) {
                                    title += 'style="color: #fff;font-size:18px;"'
                                } else {
                                    title += 'style="color: #5FB878;font-size:18px;"'
                                }
                                title += '></i> ' + val['title'] + '<li/>'
                            }
                        })
                        title += '</ul>'
                        if (open_count == 0 && big_stone_count == 0) {
                            title = '<i class="layui-icon layui-icon-add-circle-fine" style="font-size: 30px; color: #e2e2e2;"></i> '
                            html += '<td class="td-plan" style="cursor:pointer;text-align:center;" title="添加计划" date-week="' + value + '" data-plan="' + i + '">' + title + '</td>'
                        } else {
                            // console.log('hi')
                            // console.log(big_stone_count)
                            if (big_stone_count > 0) {
                                html += '<td class="td-plan is-big-stone" style="cursor:pointer;" date-week="'
                            } else {
                                html += '<td class="td-plan" style="cursor:pointer;" date-week="'
                            }
                            html += value + '" data-plan="' + i + '">' + title + '</td>'
                        }


                    })

                    $('#tbody').append(html)
                })


            });
        }



        // 修改计划状态
        function edit_planData(planData) {
            console.log('修改计划中')
            chrome.storage.local.set({ planData: planData }, function() {
                console.log('修改成功')
            });

        }





        // 展示修改和删除
        $('body').on('click', '.td-plan', function() {
            data_plan_week = $(this).attr('date-week')
            date_time = $(this).parent('tr').attr('date-time')
            _title = data_plan_week + ' ' + date_time + ' 计划'
            data_plan = $(this).attr('data-plan')

            // 展示plan
            chrome.storage.local.get({ planData: {} }, function(items) {
                var planData = items.planData
                // 弹窗
                plan_alert(planData, data_plan, data_plan_week, _title)

            });

        })


        // 修改计划状态，如果这项计划已完成，则清除
        $('body').on('click', '.plan-check', function() {
            var _this = $(this)
            chrome.storage.local.get({ isHistory: 0 }, function(items) {
                var isHistory = items.isHistory
                if (isHistory != 0) {
                    layer.msg("正在展示历史计划，此功能不可用！")
                    return false
                } else {

                    console.log(_this.hasClass('layui-icon-circle'))

                    // 完成操作
                    if (_this.hasClass('layui-icon-circle')) {
                        // check
                        _this.removeClass('layui-icon-circle').addClass('layui-icon-ok-circle')

                        // 修改plan
                        chrome.storage.local.get({ planData: {} }, function(items) {
                            _card = _this.parent().parent('.layui-card')
                            data_plan = _card.attr('data-plan')
                            data_plan_week = _card.attr('data-parent-index')
                            data_plan_index = _card.attr('data-index')
                            _title = _card.attr('data-alert-title')
                            _no_alert = _card.attr('data-alert-noalert')
                            var planData = items.planData
                            console.log(_no_alert)
                            planData[data_plan]['date_plan'][data_plan_week][data_plan_index]['open'] = 0
                            // 修改状态
                            edit_planData(planData)

                            if (typeof(_no_alert) == 'undefined') {
                                // 弹窗
                                plan_alert(planData, data_plan, data_plan_week, _title)

                            } else if (_no_alert == 2) {
                                todo_alert()
                            } else {
                                layer.msg('更新计划状态成功')
                            }
                            refresh()

                        });
                    } else {
                        _this.removeClass('layui-icon-ok-circle').addClass('layui-icon-circle')

                        // 修改plan
                        chrome.storage.local.get({ planData: {} }, function(items) {
                            _card = _this.parent().parent('.layui-card')
                            data_plan = _card.attr('data-plan')
                            data_plan_week = _card.attr('data-parent-index')
                            data_plan_index = _card.attr('data-index')
                            _title = _card.attr('data-alert-title')
                            _no_alert = _card.attr('data-alert-noalert')
                            var planData = items.planData
                            console.log(planData[data_plan]['date_plan'])
                            planData[data_plan]['date_plan'][data_plan_week][data_plan_index]['open'] = 1

                            // 修改状态
                            edit_planData(planData)
                            // 弹窗
                            if (typeof(_no_alert) == 'undefined') {
                                // 弹窗
                                plan_alert(planData, data_plan, data_plan_week, _title)
                                // refresh()
                            } else if (_no_alert == 2) {
                                todo_alert()
                            } else {
                                layer.msg('更新计划状态成功')
                            }
                            refresh()


                        });
                    }
                }

            })


        })

        // 编辑计划
        $('body').on('click', '.plan-edit-btn', function() {
            var _this = $(this)
            chrome.storage.local.get({ isHistory: 0 }, function(items) {
                var isHistory = items.isHistory
                if (isHistory != 0) {
                    layer.msg("正在展示历史计划，此功能不可用！")
                    return false
                } else {


                    // 修改plan
                    chrome.storage.local.get({ planData: {} }, function(items) {
                        _card = _this.parent().parent('.layui-card')
                        // console.log(_card)
                        data_plan = _card.attr('data-plan')
                        data_plan_week = _card.attr('data-parent-index')
                        data_plan_index = _card.attr('data-index')
                        _title = _card.attr('data-alert-title')
                        var planData = items.planData
                        this_p = planData[data_plan]['date_plan'][data_plan_week][data_plan_index]
                        console.log(this_p)
                        checked_big_stone_1 = ''
                        checked_big_stone_2 = ''
                        checked_time_q_1 = ''
                        checked_time_q_2 = ''
                        checked_time_q_3 = ''
                        checked_time_q_4 = ''
                        if (this_p['big_stone'] == 0) {
                            checked_big_stone_2 = 'checked'
                        } else {
                            checked_big_stone_1 = 'checked'
                        }

                        if (this_p['time_q'] == 1) {
                            checked_time_q_1 = 'checked'
                        } else if (this_p['time_q'] == 2) {
                            checked_time_q_2 = 'checked'
                        } else if (this_p['time_q'] == 3) {
                            checked_time_q_3 = 'checked'
                        } else if (this_p['time_q'] == 4) {
                            checked_time_q_4 = 'checked'
                        }

                        _edit_plan_index = layer.open({
                            area: ['600px', '600px'],
                            title: '修改 - ' + _title,
                            content: '<div class="layui-form" action=""><div class="layui-form-item"><label class="layui-form-label">简要名称</label><div class="layui-input-block"><input type="text" name="title" required="" lay-verify="required" value="' + this_p['title'] + '" placeholder="请输入标题" autocomplete="off" class="layui-input" /></div></div><div class="layui-form-item"><label class="layui-form-label">大石头</label><div class="layui-input-block"><input class="radio-normal" type="radio" name="big_stone" value="1" style="display:inline-block;" ' + checked_big_stone_1 + ' /> 是<input class="radio-normal" type="radio" name="big_stone" value="0" style="display:inline-block;" ' + checked_big_stone_2 + '/> 否</div></div><div class="layui-form-item"><label class="layui-form-label">所属象限</label><div class="layui-input-block"><input class="radio-normal" type="radio" name="time_q" value="1" style="display:inline-block;"  ' + checked_time_q_1 + ' /> Q1<input class="radio-normal" type="radio" name="time_q" value="2" style="display:inline-block;"  ' + checked_time_q_2 + '/> Q2<input class="radio-normal" type="radio" name="time_q" value="3" style="display:inline-block;"  ' + checked_time_q_3 + '/> Q3<input class="radio-normal" type="radio" name="time_q" value="4" style="display:inline-block;"  ' + checked_time_q_4 + '/> Q4</div></div><input type="hidden" name="data_plan" value="' + data_plan + '"/><input type="hidden" name="data_plan_week" value="' + data_plan_week + '"/><input type="hidden" name="data_plan_index" value="' + data_plan_index + '"/><div class="layui-form-item layui-form-text"><label class="layui-form-label">详细内容</label><div class="layui-input-block"><textarea name="desc" placeholder="请输入内容" class="layui-textarea">' + this_p['desc'] + '</textarea></div></div><div class="layui-form-item"><div class="layui-input-block"><button class="layui-btn" lay-submit="" lay-filter="editPlan">立即提交</button></div></div></div>',
                            closeBtn: 0,
                            shadeClose: true,
                            btn: []
                        });
                    });

                }

            })


        })

        //  计划提交存储
        form.on('submit(addPlan)', function(data) {
            chrome.storage.local.get({ isHistory: 0 }, function(items) {
                var isHistory = items.isHistory
                if (isHistory != 0) {
                    layer.msg("正在展示历史计划，此功能不可用！")
                    return false
                } else {
                    console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
                    _data = data.field
                    item = { title: _data['title'], desc: _data['desc'], open: 1, big_stone: _data['big_stone'], time_q: _data['time_q'] }
                    console.log(item)
                    // // 修改plan
                    chrome.storage.local.get({ planData: {} }, function(items) {
                        data_plan = _data['data_plan']
                        data_plan_week = _data['data_plan_week']
                        _title = _data['_title']
                        var planData = items.planData
                        console.log(planData[data_plan]['date_plan'])
                        planData[data_plan]['date_plan'][data_plan_week].push(item)
                        chrome.storage.local.set({ planData: planData }, function() {
                            console.log('添加新计划成功')
                        });

                        // 弹窗
                        plan_alert(planData, data_plan, data_plan_week, _title)
                        refresh()

                    });
                }

            })

        });


        //  计划修改存储
        form.on('submit(editPlan)', function(data) {
            chrome.storage.local.get({ isHistory: 0 }, function(items) {
                var isHistory = items.isHistory
                if (isHistory != 0) {
                    layer.msg("正在展示历史计划，此功能不可用！")
                    return false
                } else {
                    console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
                    _data = data.field
                    item = { title: _data['title'], desc: _data['desc'], open: 1, big_stone: _data['big_stone'], time_q: _data['time_q'] }
                    console.log(item)

                    // // 修改plan
                    chrome.storage.local.get({ planData: {} }, function(items) {
                        data_plan = _data['data_plan']
                        data_plan_week = _data['data_plan_week']
                        data_plan_index = _data['data_plan_index']
                        var planData = items.planData
                        console.log(planData[data_plan]['date_plan'])
                        planData[data_plan]['date_plan'][data_plan_week][data_plan_index] = item
                        chrome.storage.local.set({ planData: planData }, function() {
                            console.log('修改计划成功')
                        });

                        // 弹窗
                        plan_alert(planData, data_plan, data_plan_week, _title)
                        refresh()

                    });
                }

            })

        });




        // 计划弹窗
        function plan_alert(planData, data_plan, data_plan_week, _title) {
            _plan = planData[data_plan]['date_plan'][data_plan_week]
            var _html = '',
                _html_close = ''
            var _count = 0,
                _count_close = 0
            $.each(_plan, function(index, value) {
                _html += '<div class="layui-card" data-alert-title="' + _title + '" data-plan="' + data_plan + '" data-index="' + index + '" data-parent-index="' + data_plan_week
                _html += '">    <div class="layui-card-header" style="color:#01AAED;font-weight:bold;cursor:pointer;">'

                if (value.open == 1) {
                    _count++
                    _html += '<i class="plan-check layui-icon layui-icon-circle" style="font-size:20px;color: #FF5722;cursor:pointer;" title="改变计划状态"></i><i class="layui-icon layui-icon-edit plan-edit-btn" title="修改计划"></i> '

                } else {
                    _count_close++
                    // _html_close += '<div class="layui-card" data-alert-title="' + _title + '" data-plan="' + data_plan + '" data-index="' + index + '" data-parent-index="' + data_plan_week
                    // _html_close += '">   <div class="layui-card-header" style="color:#01AAED;font-weight:bold;">'
                    _html += '<i class="plan-check layui-icon layui-icon-ok-circle" style="font-size:20px;color: #FF5722;cursor:pointer;" title="改变计划状态"></i>  '
                    // _html_close += value.title + '</div> <div class="layui-card-body">       ' + value.desc + '</div></div>'
                }
                _html += value.title + '</div>  '
                if (value.desc != '') {
                    _html += '<div class="layui-card-body">       ' + value.desc + '</div>'
                }
                _html += '</div>'
            })

            _alert_index = layer.open({
                area: ['600px', '600px'],
                title: _title,
                content: '<div class="layui-tab layui-tab-brief" style="margin:0;" lay-filter="planTabBrief"><ul class="layui-tab-title"><li class="layui-this" style="cursor:pointer;">计划列表 ' + _count_close + '/' + parseInt(_count + _count_close) + '</li><li style="cursor:pointer;">新增计划</li></ul><div class="layui-tab-content"><div class="layui-tab-item layui-show">            ' + _html + '</div><div class="layui-tab-item"><div class="layui-form" action=""><div class="layui-form-item"><label class="layui-form-label">简要名称</label><div class="layui-input-block"><input type="text" name="title" required="" lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input" /></div></div><div class="layui-form-item"><label class="layui-form-label">大石头</label><div class="layui-input-block"><input class="radio-normal" type="radio" name="big_stone" value="1" style="display:inline-block;" /> 是<input class="radio-normal" type="radio" name="big_stone" value="0" style="display:inline-block;" checked="" /> 否</div><input type="hidden" name="data_plan_week" value="' + data_plan_week + '" /><input type="hidden" name="data_plan" value="' + data_plan + '" /><input type="hidden" name="_title" value="' + _title + '" /></div><div class="layui-form-item"><label class="layui-form-label">所属象限</label><div class="layui-input-block"><input class="radio-normal" type="radio" name="time_q" value="1" style="display:inline-block;" checked /> Q1<input class="radio-normal" type="radio" name="time_q" value="2" style="display:inline-block;"/> Q2<input class="radio-normal" type="radio" name="time_q" value="3" style="display:inline-block;" /> Q3<input class="radio-normal" type="radio" name="time_q" value="4" style="display:inline-block;" /> Q4</div></div><div class="layui-form-item layui-form-text"><label class="layui-form-label">详细内容</label><div class="layui-input-block"><textarea name="desc" placeholder="请输入内容" class="layui-textarea"></textarea></div></div><div class="layui-form-item"><div class="layui-input-block"><button class="layui-btn" lay-submit="" lay-filter="addPlan">立即提交</button></div></div></div></div></div></div>',
                closeBtn: 0,
                shadeClose: true,
                btn: []
            });
        }

        // 重置所有
        $('#refresh').click(function() {

            chrome.storage.local.get({ isHistory: 0 }, function(items) {
                var isHistory = items.isHistory
                if (isHistory != 0) {
                    console.log()
                    layer.msg("正在展示历史计划，此功能不可用！")
                    return false
                } else {
                    do_refresh_now()
                }

            })


        })



        // 所有标注为完成
        function do_all(open, msg) {
            // 修改plan
            chrome.storage.local.get({ planData: {} }, function(items) {
                var planData = items.planData
                // console.log(planData)
                $.each(planData, function(i, v) {
                    var _plan = planData[i]['date_plan']
                    $.each(_plan, function(idx, val) {
                        $.each(planData[i]['date_plan'][idx], function(index, value) {
                            planData[i]['date_plan'][idx][index]['open'] = open
                        })
                    })

                })
                edit_planData(planData)
                refresh()


            });
        }
        // 全部完成
        $('#done_all').click(function() {
            chrome.storage.local.get({ isHistory: 0 }, function(items) {
                var isHistory = items.isHistory
                if (isHistory != 0) {
                    layer.msg("正在展示历史计划，此功能不可用！")
                    return false
                } else {
                    do_all(0, '已将所有任务标注为已完成！')
                }

            })

        })

        // 全部完成
        $('#open_all').click(function() {
            chrome.storage.local.get({ isHistory: 0 }, function(items) {
                var isHistory = items.isHistory
                if (isHistory != 0) {
                    layer.msg("正在展示历史计划，此功能不可用！")
                    return false
                } else {
                    do_all(1, '已将所有任务置为开启状态！')
                }

            })

        })

        // 全部完成
        $('#export').click(function() {
            chrome.storage.local.get({ isHistory: 0 }, function(items) {
                var isHistory = items.isHistory
                if (isHistory != 0) {
                    layer.msg("正在展示历史计划，此功能不可用！")
                    return false
                } else {
                    layer.msg('待完善，请先使用截图保存~')
                }

            })

        })

        // 访问代码库
        $('#visit_code').click(function() {
            window.location.href = 'https://github.com/liuzhen153/chrome-week-plan-plugin'
        })


        // 时间象限展示
        $('.v_time_q').click(function() {
            chrome.storage.local.get({ planData: {} }, function(items) {
                var html_1 = '<ul>'
                var html_2 = '<ul>'
                var html_3 = '<ul>'
                var html_4 = '<ul>'
                var _del_1 = '',
                    _del_2 = '',
                    _del_3 = '',
                    _del_4 = ''
                var planData = items.planData
                $.each(planData, function(index, value) {
                    $.each(value['date_plan'], function(idx, val) {
                        $.each(val, function(i, v) {
                            var time_q = 1
                            if (v.hasOwnProperty('time_q')) {
                                time_q = v['time_q']
                            }

                            if (v['open'] == 1) {
                                _li = '<li><span class="layui-badge-dot layui-bg-orange"></span> '
                            } else {
                                _li = '<li><span class="layui-badge-dot layui-bg-orange"></span> <del>'
                            }


                            if (time_q == 1) {
                                html_1 += _li + v['title']
                                if (v['open'] == 1) {
                                    _del_1 = ''
                                } else {
                                    _del_1 = '</del>'
                                }
                            }
                            if (time_q == 2) {
                                html_2 += _li + v['title']
                                if (v['open'] == 1) {
                                    _del_2 = ''
                                } else {
                                    _del_2 = '</del>'
                                }
                            }
                            if (time_q == 3) {
                                html_3 += _li + v['title']
                                if (v['open'] == 1) {
                                    _del_3 = ''
                                } else {
                                    _del_3 = '</del>'
                                }
                            }
                            if (time_q == 4) {
                                html_4 += _li + v['title']
                                if (v['open'] == 1) {
                                    _del_4 = ''
                                } else {
                                    _del_4 = '</del>'
                                }
                            }

                        })
                    })

                })


                _content = '<table class="layui-table" style="width:460px;height:410px;border:none;"><colgroup><col width="230"><col width="230"></colgroup><thead><tbody><tr style="border:none;border-bottom:1px solid #009688;">'
                _content += '<td style="border:none;border-right:1px solid #009688;padding:0;"><div class="time-q-1-d">'
                _content += html_1 + _del_1 + '</div></li></ul>'
                _content += '<div class="time-q-t time-q-1">Q1 <span>必要之事</span></div></td><td style="border:none;"><div class="time-q-2-d">'
                _content += html_2 + _del_2 + '</div></li></ul>'
                _content += '<div class="time-q-t time-q-2">Q2 <span>非凡的效能</span></div></td></tr><tr style="border:none;"><td style="border:none;border-right:1px solid #009688;"><div class="time-q-3-d">'
                _content += html_3 + _del_3 + '</li></ul>'
                _content += '</div><div class="time-q-t time-q-3">Q3 <span>分心之事</span></div></td><td style="border:none;"><div class="time-q-4-d">'
                _content += html_4 + _del_4 + '</li></ul>'
                _content += '</div><div class="time-q-t time-q-4">Q4 <span>无关紧要之事</span></div></td></tr></tbody></table>'

                v_time_q_index = layer.open({
                    area: ['500px', '500px'],
                    title: false,
                    content: _content,
                    closeBtn: 0,
                    shadeClose: true,
                    btn: []
                });

            });

        })


        // 日期列表
        function getDates_today() {
            var date_list = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
            var new_Date = new Date()
            var timesStamp = new_Date.getTime();
            var currenDay = new_Date.getDay();
            var date = date_list[currenDay] + '(' + (new Date(timesStamp).toLocaleDateString().replace(/[年月]/g, '-').replace(/[日上下午]/g, '').substring(5)) + ')'
            return date
        }

        // todo list展示
        $('#v_todo_list').click(function() {
            // layer.msg('敬请期待')

            todo_alert()

        })

        function todo_alert() {
            chrome.storage.local.get({ planData: {} }, function(items) {
                var planData = items.planData
                var date = getDates_today()
                var _today = ''
                var _total = ''
                var _done = '',
                    _nodone = '',
                    _q1 = '',
                    _q2 = '',
                    _q3 = '',
                    _q4 = '',
                    item1 = '',
                    item2 = ''
                var today_total = 0,
                    done_total = 0,
                    week_total = 0,
                    nodone_total = 0,
                    q1_total = 0,
                    q2_total = 0,
                    q3_total = 0,
                    q4_total = 0
                $.each(planData, function(i, v) {
                    $.each(v['date_plan'], function(idx, val) {

                        if (val.length > 0) {
                            $.each(val, function(index, value) {
                                console.log(idx)
                                week_total++
                                data_plan = i
                                data_plan_week = idx

                                item1 = '<div class="layui-card" data-alert-title="修改计划状态" data-alert-noalert="2" data-plan="' + data_plan + '" data-index="' + index + '" data-parent-index="' + data_plan_week + '"><div class="layui-card-header today-plan" style="color:#01AAED;font-weight:bold;">'
                                if (value['open'] == 0) {
                                    item1 += '<i class="plan-check layui-icon layui-icon-ok-circle" style="color: #FF5722;"></i> '
                                } else {
                                    item1 += '<i class="plan-check layui-icon layui-icon-circle" style="font-size:20px;color: #FF5722;cursor:pointer;" title="改变计划状态"></i> '
                                }
                                item1 += value['title'] + '</div> '
                                item1 += '</div>'


                                item2 = '<div class="layui-card" data-alert-title="修改计划状态" data-alert-noalert="2" data-plan="' + data_plan + '" data-index="' + index + '" data-parent-index="' + data_plan_week + '"><div class="layui-card-header today-plan" style="color:#01AAED;font-weight:bold;">'
                                if (value['open'] == 0) {
                                    item2 += '<i class="plan-check layui-icon layui-icon-ok-circle" style="color: #FF5722;"></i> '
                                } else {
                                    item2 += '<i class="plan-check layui-icon layui-icon-circle" style="font-size:20px;color: #FF5722;cursor:pointer;" title="改变计划状态"></i> '
                                }
                                item2 += '<span class="layui-badge do-1 layui-bg-gray tab-close-history" style="background:#fff;">' + idx + '</span>' + value['title'] + '</div> '
                                item2 += '</div>'


                                if (idx == date) {
                                    _today += item1
                                    today_total++
                                    // 开始分析当天数据
                                } else {
                                    _total += item2
                                }
                                if (value['open'] == 0) {
                                    done_total++
                                    _done += item2
                                } else {
                                    nodone_total++
                                    _nodone += item2
                                }

                                if (value['time_q'] == 1) {
                                    q1_total++
                                    _q1 += item2
                                }
                                if (value['time_q'] == 2) {
                                    q2_total++
                                    _q2 += item2
                                }
                                if (value['time_q'] == 3) {
                                    q3_total++
                                    _q3 += item2
                                }

                                if (value['time_q'] == 4) {
                                    q4_total++
                                    _q4 += item2
                                }


                            })


                        }


                    })
                })

                var _h = '<div class="layui-tab layui-tab-brief" lay-filter="tabHistoryBrief"><ul class="layui-tab-title"><li class="layui-this">所有(' + week_total + ')</li><li>今日(' + today_total + ')</li><li>已完成(' + done_total + ')</li><li>未完成(' + nodone_total + ')</li><li>Q1象限(' + q1_total + ')</li><li>Q2象限(' + q2_total + ')</li><li>Q3象限(' + q3_total + ')</li><li>Q4象限(' + q4_total + ')</li></ul><div class="layui-tab-content" style="min-height: 400px;"><div class="layui-tab-item layui-show">            ' + _total + '</div><div class="layui-tab-item">            ' + _today + '</div><div class="layui-tab-item">             ' + _done + '</div><div class="layui-tab-item">             ' + _nodone + '</div><div class="layui-tab-item">             ' + _q1 + '</div><div class="layui-tab-item">             ' + _q2 + '</div><div class="layui-tab-item">             ' + _q3 + '</div><div class="layui-tab-item">             ' + _q4 + '</div></div></div>'

                var doto_index = layer.open({
                    area: ['800px', '600px'],
                    title: 'TODO List',
                    content: _h,
                    closeBtn: 0,
                    shadeClose: true,
                    btn: []
                });
            })
        }

        chrome.storage.local.get({ allowAlert: 0 }, function(items) {
            var text = ''
            var allowAlert = items.allowAlert
            if (allowAlert == 0) {
                text = '开启'
            } else {
                text = '关闭'
            }
            $('#alert_text').html(text)
        })


        // 开关设置
        $('#control_alert').click(function() {
            chrome.storage.local.get({ isHistory: 0 }, function(items) {
                var isHistory = items.isHistory
                if (isHistory != 0) {
                    layer.msg("正在展示历史计划，此功能不可用！")
                    return false
                } else {
                    control_alert()
                }

            })

        })

        // 实际控制通知
        function control_alert() {
            chrome.storage.local.get({ allowAlert: 0 }, function(items) {
                var text = ''
                var allowAlert = items.allowAlert
                if (allowAlert == 0) {
                    allowAlert = 1
                    text = '关闭'
                } else {
                    allowAlert = 0
                    text = '开启'
                }
                $('#alert_text').html(text)
                chrome.storage.local.set({ allowAlert: allowAlert }, function() {
                    console.log('修改通知开关成功')
                });
            })
        }

        // 保存本周
        $('#save_this').click(function() {
            chrome.storage.local.get({ isHistory: 0 }, function(items) {
                var isHistory = items.isHistory
                if (isHistory != 0) {
                    layer.msg("正在展示历史计划，此功能不可用！")
                    return false
                } else {
                    save_this()
                }

            })


        })

        // 重置操作
        function do_refresh_now() {
            layer.open({
                area: ['500px', '200px'],
                content: '『开启下一周』会自动保存本周，其他操作建议先保存再重置哦~',
                closeBtn: 0,
                btn: ['开启下一周', '保存并重置', '直接重置', '取消'],
                yes: function(index, layero) {
                    chrome.storage.local.set({ isNextWeek: get_next_week_0() }, function() {
                        console.log('开启下一周...')

                    });
                    get_date_list_planData('next_week')
                    save_this(_type = 1, 'old')
                    layer.close(index)
                    //按钮【按钮一】的回调
                },
                btn2: function(index, layero) {
                    //按钮【按钮二】的回调
                    get_date_list_planData()
                    save_this(_type = 1)
                    layer.close(index)
                },
                btn3: function(index, layero) {
                    //按钮【按钮二】的回调
                    edit_planData(_planData)
                    refresh()
                    //return false 开启该代码可禁止点击该按钮关闭
                },
                btn4: function(index, layero) {
                    //按钮【按钮三】的回调
                    // console.log('3')
                    //return false 开启该代码可禁止点击该按钮关闭
                }
            });
        }

        // 保存本周
        function save_this(_type = 0, date_list_chioce = 'new') {


            chrome.storage.local.get({ allPlanData: {} }, function(items) {

                var allPlanData = items.allPlanData
                console.log(allPlanData)
                var titles = Object.keys(allPlanData)
                console.log(titles)
                var theweek = 'plan_' + (10000 - (titles.length))
                // date_list_chioce为OLD说明是下周
                if (date_list_chioce == 'old') {
                    _date_list = date_list_old

                } else {
                    _date_list = date_list
                }

                chrome.storage.local.get({ planData: {} }, function(items1) {
                    var planData = items1.planData
                    // 弹窗写周计划标题
                    layer.prompt({
                        formType: 0,
                        closeBtn: 0,
                        value: _date_list[0] + '~' + _date_list[_date_list.length - 1],
                        title: '请输入周计划标题',
                        area: ['500px', '350px'] //自定义文本域宽高
                    }, function(value, index, elem) {
                        var item = {
                            'title': value,
                            'planData': planData
                        }
                        // 新增本周内容
                        allPlanData[theweek] = item
                        console.log(allPlanData)
                        if (date_list_chioce == 'old') {
                            // 如果是开启下一周，将本周数据保存在theweek里
                            chrome.storage.local.set({ theweek: planData }, function() {
                                setAllPlanData(allPlanData, _type)
                            })

                        } else {
                            setAllPlanData(allPlanData, _type)
                        }





                        layer.close(index);
                    });

                })

            })


        }

        // 历史记录被保存
        function setAllPlanData(allPlanData, _type) {
            // 更新历史记录
            chrome.storage.local.set({ allPlanData: allPlanData }, function() {
                if (_type == 1) {
                    edit_planData(_planData)
                    refresh()
                }
                console.log('保存成功')
            });
        }

        // 查看历史
        $('#view_list').click(function() {
            html = '<div class="layui-card"><div class="layui-card-header">周计划历史</div>'
            chrome.storage.local.get({ allPlanData: {} }, function(items) {
                var allPlanData = items.allPlanData
                var titles = Object.keys(allPlanData)
                $.each(titles, function(i, v) {
                    html += '<div class="layui-card-body"><div class="history-li" style="cursor:pointer;color:#01AAED;" id="' + v + '"><span class="layui-badge-dot layui-bg-green"></span> ' + allPlanData[v]['title'] + '</div></div>'
                })
                html += '</div>'
                view_list_index = layer.open({
                    area: ['500px', '500px'],
                    title: false,
                    content: html,
                    closeBtn: 0,
                    shadeClose: true,
                    btn: []
                });

            })

        })

        // 历史记录查看
        $('body').on('click', '.history-li', function() {
            var id = $(this).attr('id')
            chrome.storage.local.get({ allPlanData: {} }, function(items) {
                var allPlanData = items.allPlanData
                _this = allPlanData[id]
                planData_ = _this['planData']
                title = _this['title']



                // 查询本周
                chrome.storage.local.get({ planData: _planData }, function(items) {
                    var thisPlanData = items.planData

                    chrome.storage.local.get({ isHistory: 0 }, function(items) {
                        var isHistory = items.isHistory

                        if (isHistory == 0) {
                            // 将本周记录下来
                            chrome.storage.local.set({ thisPlanData: thisPlanData }, function() {

                                console.log('记录本周')

                            });
                        }

                        // 记录当前是历史
                        chrome.storage.local.set({ isHistory: title }, function() {
                            var _date_list = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

                            set_table_title(_date_list)

                            // 开始展示点击的历史记录
                            $('#history-msg').show()
                            $('#history_list').html(title)
                            layer.close(view_list_index)
                            edit_planData(planData_)
                            refresh()

                        });

                    })

                })


            })
        })

        // 返回本周
        $('#go_back_this').click(function() {
            // 查询本周
            chrome.storage.local.get({ thisPlanData: {} }, function(items) {
                var thisPlanData = items.thisPlanData
                console.log(thisPlanData)
                chrome.storage.local.set({ isHistory: 0 }, function() {
                    set_table_title(date_list)
                    $('#history-msg').hide()
                    $('#history_list').html('')
                    edit_planData(thisPlanData)
                    refresh()

                });


            })
        })


        // 周期性计划制定
        $('#loop_p').click(function() {
            // 查询本周
            layer.msg('敬请期待')
            chrome.storage.local.get({ loopPlan: {} }, function(items) {
                var loopPlan = items.loopPlan
                console.log(loopPlan)
                // _html = ''
                // loop_plan_index = layer.open({
                //     area: ['600px', '600px'],
                //     title: '周期性计划管理',
                //     content: '<div class="layui-tab layui-tab-brief" style="margin:0;" lay-filter="planTabBrief"><ul class="layui-tab-title"><li class="layui-this" style="cursor:pointer;">计划列表 ' + _count_close + '/' + parseInt(_count + _count_close) + '</li><li style="cursor:pointer;">新增计划</li></ul><div class="layui-tab-content"><div class="layui-tab-item layui-show">            ' + _html + '</div><div class="layui-tab-item"><div class="layui-form" action=""><div class="layui-form-item"><label class="layui-form-label">简要名称</label><div class="layui-input-block"><input type="text" name="title" required="" lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input" /></div></div><div class="layui-form-item"><label class="layui-form-label">大石头</label><div class="layui-input-block"><input class="radio-normal" type="radio" name="big_stone" value="1" style="display:inline-block;" /> 是<input class="radio-normal" type="radio" name="big_stone" value="0" style="display:inline-block;" checked="" /> 否</div><input type="hidden" name="data_plan_week" value="' + data_plan_week + '" /><input type="hidden" name="data_plan" value="' + data_plan + '" /><input type="hidden" name="_title" value="' + _title + '" /></div><div class="layui-form-item"><label class="layui-form-label">所属象限</label><div class="layui-input-block"><input class="radio-normal" type="radio" name="time_q" value="1" style="display:inline-block;" checked /> Q1<input class="radio-normal" type="radio" name="time_q" value="2" style="display:inline-block;"/> Q2<input class="radio-normal" type="radio" name="time_q" value="3" style="display:inline-block;" /> Q3<input class="radio-normal" type="radio" name="time_q" value="4" style="display:inline-block;" /> Q4</div></div><div class="layui-form-item layui-form-text"><label class="layui-form-label">详细内容</label><div class="layui-input-block"><textarea name="desc" placeholder="请输入内容" class="layui-textarea"></textarea></div></div><div class="layui-form-item"><div class="layui-input-block"><button class="layui-btn" lay-submit="" lay-filter="addPlan">立即提交</button></div></div></div></div></div></div>',
                //     closeBtn: 0,
                //     shadeClose: true,
                //     btn: []
                // });
                // chrome.storage.local.set({ isHistory: 0 }, function() {
                //     set_table_title(date_list)
                //     $('#history-msg').hide()
                //     $('#history_list').html('')
                //     edit_planData(thisPlanData)
                //     refresh()

                // });
                // 
                // 
                // '<div class="layui-tab layui-tab-brief" style="margin:0;" lay-filter="loopPlanTabBrief">
                //  <ul class="layui-tab-title">
                //   <li class="layui-this" style="cursor:pointer;">计划列表</li>
                //   <li style="cursor:pointer;">新增计划</li>
                //  </ul>
                //  <div class="layui-tab-content">
                //   <div class="layui-tab-item layui-show">
                //     ' + _html + '
                //   </div>
                //   <div class="layui-tab-item">
                //    <div class="layui-form" action="">
                //     <div class="layui-form-item">
                //      <label class="layui-form-label">简要名称</label>
                //      <div class="layui-input-block">
                //       <input type="text" name="title" required="" lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input" />
                //      </div>
                //     </div>
                //     <div class="layui-form-item">
                //      <label class="layui-form-label">大石头</label>
                //      <div class="layui-input-block">
                //       <input class="radio-normal" type="radio" name="big_stone" value="1" style="display:inline-block;" /> 是
                //       <input class="radio-normal" type="radio" name="big_stone" value="0" style="display:inline-block;" checked="" /> 否
                //      </div>
                //     </div>
                //     <div class="layui-form-item">
                //      <label class="layui-form-label">所属象限</label>
                //      <div class="layui-input-block">
                //       <input class="radio-normal" type="radio" name="time_q" value="1" style="display:inline-block;" checked="" /> Q1
                //       <input class="radio-normal" type="radio" name="time_q" value="2" style="display:inline-block;" /> Q2
                //       <input class="radio-normal" type="radio" name="time_q" value="3" style="display:inline-block;" /> Q3
                //       <input class="radio-normal" type="radio" name="time_q" value="4" style="display:inline-block;" /> Q4
                //      </div>
                //     </div>
                //     <div class="layui-form-item layui-form-text">
                //      <label class="layui-form-label">详细内容</label>
                //      <div class="layui-input-block">
                //       <textarea name="desc" placeholder="请输入内容" class="layui-textarea"></textarea>
                //      </div>
                //     </div>
                //     <div class="layui-form-item">
                //      <div class="layui-input-block">
                //       <button class="layui-btn" lay-submit="" lay-filter="addPlan">立即提交</button>
                //      </div>
                //     </div>
                //    </div>
                //   </div>
                //  </div>
                // </div>',


            })
        })






    });



});