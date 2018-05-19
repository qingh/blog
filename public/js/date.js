/* 插入日期 */
let date = {
    //把时间戳（字符串）变为整数
    serverDate: +$('#date').attr('data-nowdate'),
    init: function() {
        this.initDate();
        this.bind();
    },
    bind: function() {
        /* 点击按钮上个月 */
        let that = this,
            serverDate = this.serverDate;
        $('#prev').bind('click', function() {
            let dataArr = $('#nowTime').attr('data-time').split(/-/),
                year = dataArr[0],
                month = dataArr[1];
            month--;
            //禁止一直向左切换
            if (year == 1970 && month == 0) {
                return false;
            }
            if (month == 0) {
                year--;
                $('#nowTime').html(year + '年12月').attr('data-time', year + '-12');
            } else {
                $('#nowTime').html(year + '年' + month + '月').attr('data-time', year + '-' + month);
            }
            that.changeDate();
        });

        /* 点击按钮下个月 */
        $('#next').bind('click', function() {
            let dataArr = $('#nowTime').attr('data-time').split(/-/),
                year = dataArr[0],
                month = dataArr[1];

            month++;
            //禁止一直向右切换
            if (year == new Date(serverDate).getFullYear() && month == 13) {
                return false;
            }

            if (month == 13) {
                year++;
                $('#nowTime').html(year + '年1月').attr('data-time', year + '-1');
            } else {
                $('#month').val(month);
                $('#nowTime').html(year + '年' + month + '月').attr('data-time', year + '-' + month);
            }
            that.changeDate();
        });
    },
    initDate: function() {
        /* 当前日期 */
        let serverDate = this.serverDate,
            nowDate = new Date(serverDate),
            year = nowDate.getFullYear(),
            month = nowDate.getMonth() + 1,
            month1 = [1, 3, 5, 7, 8, 10, 12],
            month2 = [4, 6, 9, 11],
            day = 0; //存储当前月份的天数

        let setDate, curWeek;
        setDate = new Date(serverDate);
        setDate.setFullYear(year, month - 1, 1);
        curWeek = setDate.getDay(); //获取当前月份的1号是周几

        $('#nowTime').html(year + '年' + month + '月').attr('data-time', year + '-' + month);

        /* 计算闰年的天数 */
        if (month == 2) {
            if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
                day = 29;
            } else {
                day = 28;
            }
        }
        for (let i = 0; i < month1.length; i++) {
            if (month == month1[i]) {
                day = 31;
            }
        }

        for (let i = 0; i < month2.length; i++) {
            if (month == month2[i]) {
                day = 30;
            }
        }

        for (let j = 0; j < day; j++) {
            $('#tab td').eq(curWeek + j).html(j + 1);
        }

        //如果是当前日期
        if (year == new Date(serverDate).getFullYear() && month == new Date(serverDate).getMonth() + 1) {
            $('#tab td').eq(new Date().getDate() + curWeek - 1).addClass('date-cutTime');
        }
    },
    changeDate: function() {
        /* 清空表格数据 */
        $('#tab td').empty();

        let serverDate = this.serverDate,
            dataArr = $('#nowTime').attr('data-time').split(/-/),
            year = dataArr[0],
            month = dataArr[1],
            month1 = [1, 3, 5, 7, 8, 10, 12],
            month2 = [4, 6, 9, 11],
            day = 0;


        let setDate, curWeek;
        setDate = new Date(serverDate);
        setDate.setFullYear(year, month - 1, 1);
        curWeek = setDate.getDay(); //获取每月的1号是周几


        /* 计算闰年的天数 */
        if (month == 2) {
            if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
                day = 29;
            } else {
                day = 28;
            }
        }

        for (let i = 0; i < month1.length; i++) {
            if (month == month1[i]) {
                day = 31;
            }
        }

        for (let i = 0; i < month2.length; i++) {
            if (month == month2[i]) {
                day = 30;
            }
        }

        for (let i = 0; i < day; i++) {
            $('#tab td').eq(curWeek + i).html(i + 1);
        }

        //如果是当前日期
        if (year == new Date(serverDate).getFullYear() && month == new Date(serverDate).getMonth() + 1) {
            $('#tab td').eq(new Date(serverDate).getDate() + curWeek - 1).addClass('date-cutTime');
        } else {
            $('#tab td').removeAttr('class');
        }
    }
};

date.init();