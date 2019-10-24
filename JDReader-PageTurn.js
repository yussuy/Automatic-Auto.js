threads.start(function () {
    var window = floaty.window(
        <frame gravity="center">
            <text id="text" textSize="10sp" textColor="#f44336" />
        </frame>
    );
    window.setPosition(240, 0)
    window.exitOnClose();

    window.text.click(() => {
        window.setAdjustEnabled(!window.isAdjustEnabled());
    });
});

setInterval(() => {
    //对控件的操作需要在UI线程中执行
    ui.run(function () {
        window.text.setText(dynamicText());
    });
}, 1000);

function dynamicText() {
    var date = new Date();
    var str = util.format("时间: %d:%d:%d\n", date.getHours(), date.getMinutes(), date.getSeconds());
    str += util.format("内存使用量: %d%%\n", getMemoryUsage());
    str += "当前应用: 京东读书\n";
    str += "音量减键退出运行！！"
    return str;
}

//获取内存使用率
function getMemoryUsage() {
    var usage = (100 * device.getAvailMem() / device.getTotalMem());
    //保留一位小数
    return Math.round(usage * 10) / 10;
}
});

threads.start(function () {
    events.observeKey();
    //监听音量上键按下
    events.onKeyDown("volume_down", function (event) {
        toast("程序结束");
        exit();
    });
    events.onTouch(function () {
        //触摸事件发生时, 打印出触摸的点的坐标
        console.log("脚本运行过程中请不要触摸屏幕");
    });
});

events.on("exit", function () {
    log("结束运行");
    console.hide();
});

console.show();
console.setSize(device.width / 2, device.height / 4);
console.setPosition(500, 0);
console.log("打开程序中，请稍等");
launchApp('京东读书');
sleep(10000);

// try {
// 	if(device.getBrightnessMode() == 1)
// 		device.setBrightnessMode(0)
// 	device.setBrightness(0)
// }catch(err) {
// 	console.warn("如需运行时自动调节亮度至最低，需\"修改系统设置\"权限");
// }

var books = id("mBookCover").find();
var booksCount = books.size();


if (booksCount <= 0) {
    console.log("请提前添加好书目");
}
else {
    console.log("已添加 %d 本书", booksCount)
    for (var i = 0; i < booksCount; i++) {
        if (books[i].parent().parent().findOne(id("tv_read_progress")).text() == "已读完") {
            toast("读完第" + (i + 1) + "本书");
            sleep(2000);
            console.clear();
            continue;
        }
        var b = books[i].bounds();
        console.log("%s", b);
        click(b.centerX(), b.centerY());
        sleep(3000);
        var end = id("close_book_tv").find();
        while (end.empty()) {
            var nextPage = id("menu_view_layout").findOne();
            var next = nextPage.bounds();
            console.log("%s", next)
            var x1 = next.left + (next.right - next.left) * .7;
            var x2 = next.left + (next.right - next.left) * .3;
            var y = next.centerY();
            swipe(x1, y, x2, y, 500);
            sleep(3000);
            end = id("close_book_tv").find();
            console.log("%s", end);
        }
        var theEnd = end[0];
        theEnd.click();
        toast("读完第" + (i + 1) + "本书");
        sleep(2000);
        console.clear();
    }
}

toast("读完所有书目，10秒后程序自动关闭");
sleep("10000");
console.hide();
console.clear();
exit();