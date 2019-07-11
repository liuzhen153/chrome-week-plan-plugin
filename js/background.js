setInterval(function() {
    // getDates()
    check_alert()

}, 60000)
// check_alert()

_a = 1
_t = 0

function check_alert() {
    chrome.storage.local.get({ isHistory: 0 }, function(items) {
        // 如果是查看历史，则不提醒
        isHistory = items.isHistory
        if (isHistory == 1) {
            return
        } else {
            chrome.storage.local.get({ allowAlert: 0 }, function(items) {
                allowAlert = items.allowAlert
                if (allowAlert == 0) {
                    return
                } else {
                    do_alert()
                }

            })
        }

    })

}

// 日期列表
function getDates(_d) {
    var date_list = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    var new_Date = new Date()
    var timesStamp = new_Date.getTime();
    var currenDay = new_Date.getDay();
    var d = new Date(timesStamp + 24 * 60 * 60 * 1000 * (currenDay - 1 - (currenDay + 6) % 7)).toLocaleDateString().replace(/[年月]/g, '-').replace(/[日上下午]/g, '').substring(5)
    return _d.indexOf(d)
}

// 执行弹窗
function do_alert() {
    ret = []
    chrome.storage.local.get({ planData: {} }, function(items) {
        var planData = items.planData
        $.each(planData, function(index, value) {
            v_time = value['time']
            if (index == 'time_106') {
                v_time = 12
            }

            if (index == 'time_112') {
                v_time = 18
            }
            // 结束前5分钟提醒
            $.each(value['date_plan'], function(idx, val) {
                if (getDates(idx) != -1 && val.length != 0) {

                    item = {
                        'v_time': v_time,
                        'idx': idx,
                        'val': val
                    }
                    ret.push(item)

                }


            })


        })
        $.each(ret, function(i, v) {
            _t++
            if (_a == 0) {
                setTimeout(function() {
                    _a = 0
                    charge_alert(v['v_time'], v['idx'], v['val'])
                }, 2000 * _t)
            } else {
                _a = 0
                charge_alert(v['v_time'], v['idx'], v['val'])
            }


        })

    });
    // return ret
}




function charge_alert(v_time, idx, val) {
    // return

    _time_end = parseInt((new Date()).setHours(parseInt(v_time) - 1, 55, 0))
    // 提前15分钟提醒
    _time_start = parseInt((new Date()).setHours(parseInt(v_time) - 2, 45, 0))
    // 开始前提醒
    alert_start = idx + '_start_' + v_time

    // 结束前提醒
    alert_end = idx + '_end_' + v_time
    chrome.storage.local.get({ alertList: {} }, function(its) {

        alertList = its.alertList

        // 如果都提醒过了
        if (alertList.hasOwnProperty(alert_start) && alertList.hasOwnProperty(alert_end)) {

            // console.log('都有了')
            // return false
        }
        // 如果开始未提醒，且时间到了提醒时间
        _now = parseInt((new Date()).getTime())

        if (!alertList.hasOwnProperty(alert_start) && _now >= _time_start) {
            send_alert(val, alert_start, alertList, 1)
        }
        // 如果到了结束前，且未提醒
        if (!alertList.hasOwnProperty(alert_end) && _now >= _time_end) {
            send_alert(val, alert_end, alertList, 0)
        }
        _a = 1
    })

}


// 发送提醒
function send_alert(val, k, alertList, _type) {
    _msg = '任务即将开始：'
    if (_type == 0) {
        _msg = '任务即将截止：'
    }
    $.each(val, function(i, v) {
        chrome.notifications.create(null, {
            type: 'basic',
            iconUrl: 'img/icon.png',
            title: _msg,
            message: v['title']
        });
    })

    alertList[k] = 1
    chrome.storage.local.set({ alertList: alertList }, function() {
        console.log('通知成功！')
    });
}





// 设置tab
function set_tab() {
    chrome.storage.local.set({ isGoogle: 1 }, function() {
        $('#baidu').hide()
        $('#google').show()
        $('#switch_search').html('百度')
        console.log('搜索模式切换到谷歌成功')
    });
}