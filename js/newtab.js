$(function() {
    layui.use(['layer', 'form', 'element'], function() {
        var layer = layui.layer,
            form = layui.form,
            element = layui.element;

        // 日期列表
        function getDates() {
            var date_list = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            var new_Date = new Date()
            var timesStamp = new_Date.getTime();
            var currenDay = new_Date.getDay();
            var dates = [];
            for (var i = 0; i < 7; i++) {
                dates.push(date_list[i] + '(' + new Date(timesStamp + 24 * 60 * 60 * 1000 * (i - (currenDay + 6) % 7)).toLocaleDateString().replace(/[年月]/g, '-').replace(/[日上下午]/g, '').substring(5) + ')');
            }
            return dates
        }

        var date_list = getDates()

        // 设置表头
        function set_table_title(date_list) {
            _html = ''
            _html = '<th style="text-align:center;border-top: none;border: none; background: #fff; position: relative;"><div class="week-time" style="color:#009688">上午</div></th>'
            _html += '<th style="text-align:center;border-top: none;border-left: none;border-right: none; background: #fff;"></th>'

            $.each(date_list, function(i, v) {
                _html += '<th style="text-align:center;border-top: none; border-left: none;border-right: none; background: #fff;color:#009688;font-weight: bold;">' + v + '</th>'
            })
            $('#table_title').append(_html)
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
        var _planData = {
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



        // 判断是否有值
        chrome.storage.sync.get({ planData: {} }, function(items) {
            console.log(items.planData)
            if (items.planData == {}) {
                // 模拟数据
                edit_planData(_planData)
            }
        });

        // 数据修改后需要刷新数据
        function refresh() {
            console.log('数据刷新中...')
            // 展示plan
            chrome.storage.sync.get({ planData: {} }, function(items) {
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
                                html_ += val['title'] + '</div>	'
                                // html_ += '<div class="layui-card-body">' + val['desc'] + '	</div>'
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

        // 先刷新一遍数据
        refresh()

        // document.f.q.focus();


        var bigStoneAlert, _alert_index


        // 展示修改和删除
        $('table').on('click', '.td-plan', function() {
            data_plan_week = $(this).attr('date-week')
            date_time = $(this).parent('tr').attr('date-time')
            _title = data_plan_week + ' ' + date_time + ' 计划'
            data_plan = $(this).attr('data-plan')

            // 展示plan
            chrome.storage.sync.get({ planData: {} }, function(items) {
                var planData = items.planData
                // 弹窗
                plan_alert(planData,data_plan,data_plan_week,_title)
                
            });

        })


        // 如果这项计划已完成，则清除
        $('body').on('click', '.plan-check', function() {
            var _this = $(this)
            console.log(_this.hasClass('layui-icon-circle'))

            // 完成操作
            if (_this.hasClass('layui-icon-circle')) {
                // check
                _this.removeClass('layui-icon-circle').addClass('layui-icon-ok-circle')

                // 修改plan
                chrome.storage.sync.get({ planData: {} }, function(items) {
                    _card = _this.parent().parent('.layui-card')
                    data_plan = _card.attr('data-plan')
                    data_plan_week = _card.attr('data-parent-index')
                    data_plan_index = _card.attr('data-index')
                    _title = _card.attr('data-alert-title')
                    var planData = items.planData
                    planData[data_plan]['date_plan'][data_plan_week][data_plan_index]['open'] = 0
                    // 修改状态
                    edit_planData(planData)

                    // 弹窗
                    plan_alert(planData,data_plan,data_plan_week,_title)
                    refresh()
                });
            } else {
                _this.removeClass('layui-icon-ok-circle').addClass('layui-icon-circle')

                // 修改plan
                chrome.storage.sync.get({ planData: {} }, function(items) {
                    _card = _this.parent().parent('.layui-card')
                    data_plan = _card.attr('data-plan')
                    data_plan_week = _card.attr('data-parent-index')
                    data_plan_index = _card.attr('data-index')
                    _title = _card.attr('data-alert-title')
                    var planData = items.planData
                    console.log(planData[data_plan]['date_plan'])
                    planData[data_plan]['date_plan'][data_plan_week][data_plan_index]['open'] = 1
                    
                    // 修改状态
                    edit_planData(planData)
                    // 弹窗
                    plan_alert(planData,data_plan,data_plan_week,_title)
                    refresh()


                });
            }

        })

        //  计划提交存储
        form.on('submit(addPlan)', function(data) {
            console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
            _data = data.field
            // console.log(_data)
            // time_q = 1
            // if (_data.hasOwnProperty('time_q')) {
            //     time_q = _data['time_q']
            // }
            item = { title: _data['title'], desc: _data['desc'], open: 1, big_stone: _data['big_stone'], time_q: _data['time_q'] }
            console.log(item)
            // _this = $(this)
            // // 修改plan
            chrome.storage.sync.get({ planData: {} }, function(items) {
                data_plan = _data['data_plan']
                data_plan_week = _data['data_plan_week']
                _title = _data['_title']
                var planData = items.planData
                console.log(planData[data_plan]['date_plan'])
                planData[data_plan]['date_plan'][data_plan_week].push(item)
                chrome.storage.sync.set({ planData: planData }, function() {
                    console.log('修改成功')
                });

                // 弹窗
                plan_alert(planData,data_plan,data_plan_week,_title)
                refresh()

            });
        });

        // 修改计划状态
        function edit_planData(planData){
        	chrome.storage.sync.set({ planData: planData }, function() {
                console.log('修改成功')
            });
        }


        // 计划弹窗
        function plan_alert(planData,data_plan,data_plan_week,_title){
        	_plan = planData[data_plan]['date_plan'][data_plan_week]
            var _html = '',
                _html_close = ''
            var _count = 0,
                _count_close = 0
            $.each(_plan, function(index, value) {
                _html += '<div class="layui-card" data-alert-title="' + _title + '" data-plan="' + data_plan + '" data-index="' + index + '" data-parent-index="' + data_plan_week
                _html += '">    <div class="layui-card-header" style="color:#01AAED;font-weight:bold;cursor:pointer;" title="改变计划状态">'
                
                if (value.open == 1) {
                    _count++
                    _html += '<i class="plan-check layui-icon layui-icon-circle" style="font-size:20px;color: #FF5722;cursor:pointer;"></i> '
                    
                } else {
                    _count_close++
                    // _html_close += '<div class="layui-card" data-alert-title="' + _title + '" data-plan="' + data_plan + '" data-index="' + index + '" data-parent-index="' + data_plan_week
                    // _html_close += '">	<div class="layui-card-header" style="color:#01AAED;font-weight:bold;">'
                    _html += '<i class="plan-check layui-icon layui-icon-ok-circle" style="font-size:20px;color: #FF5722;cursor:pointer;"></i>	'
                    // _html_close += value.title + '</div>	<div class="layui-card-body">		' + value.desc + '</div></div>'
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
            // 模拟数据
            edit_planData(_planData)
            refresh()
        })

        // 所有标注为完成
        function do_all(open, msg) {
            // 修改plan
            chrome.storage.sync.get({ planData: {} }, function(items) {
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
            do_all(0, '已将所有任务标注为已完成！')
        })

        // 全部完成
        $('#open_all').click(function() {
            do_all(1, '已将所有任务置为开启状态！')
        })

        // 全部完成
        $('#export').click(function() {
            layer.msg('待完善，请先使用截图保存~')
        })

        // 访问代码库
        $('#visit_code').click(function() {
            window.location.href = 'https://github.com/liuzhen153/chrome-week-plan-plugin'
        })


        // 时间象限展示
        $('#v_time_q').click(function(){
            chrome.storage.sync.get({ planData: {} }, function(items) {
                var html_1 = '<ul>'
                var html_2 = '<ul>'
                var html_3 = '<ul>'
                var html_4 = '<ul>'
                var planData = items.planData
                $.each(planData, function(index, value) {
                    $.each(value['date_plan'], function(idx, val){
                        $.each(val, function(i, v){
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
                            }
                            if (time_q == 2) {
                                html_2 += _li + v['title']
                            }
                            if (time_q == 3) {
                                html_3 += _li + v['title']
                            }
                            if (time_q == 4) {
                                html_4 += _li + v['title']
                            }

                            if (v['open'] == 1) {
                                _del = ''
                            } else {
                                _del = '</del>'
                            }
                        })
                    })

                })


                _content = '<table class="layui-table" style="width:460px;height:410px;border:none;"><colgroup><col width="230"><col width="230"></colgroup><thead><tbody><tr style="border:none;border-bottom:1px solid #009688;">'
                _content += '<td style="border:none;border-right:1px solid #009688;padding:0;"><div class="time-q-1-d">'
                _content += html_1 + _del + '</div></li></ul>'
                _content += '<div class="time-q-t time-q-1">Q1 <span>必要之事</span></div></td><td style="border:none;"><div class="time-q-2-d">'
                _content += html_2 + _del + '</div></li></ul>'
                _content += '<div class="time-q-t time-q-2">Q2 <span>非凡的效能</span></div></td></tr><tr style="border:none;"><td style="border:none;border-right:1px solid #009688;"><div class="time-q-3-d">'
                _content += html_3 + _del + '</li></ul>'
                _content += '</div><div class="time-q-t time-q-3">Q3 <span>分心之事</span></div></td><td style="border:none;"><div class="time-q-4-d">'
                _content += html_4 + _del + '</li></ul>'
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



        // todo list展示
        $('#v_todo_list').click(function(){
            layer.msg('敬请期待')
            // 显示桌面通知
            // chrome.notifications.create(null, {
            //     type: 'basic',
            //     iconUrl: 'img/icon.png',
            //     title: '这是标题',
            //     message: '您刚才点击了自定义右键菜单！'
            // });
            
        })

        chrome.storage.sync.get({ allowAlert: 0 }, function(items) {
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
        $('#control_alert').click(function(){
            chrome.storage.sync.get({ allowAlert: 0 }, function(items) {
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
                chrome.storage.sync.set({ allowAlert: allowAlert }, function() {
                    console.log('修改通知开关成功')
                });
            })
        })







    });



});