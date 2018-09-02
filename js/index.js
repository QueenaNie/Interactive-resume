/*
* 第一块：loading
* */
let bell=$('#bell')[0],
    say=$('#say')[0],
    bgm=$('#bg_music')[0];
let loading=function () {
  let $progressBar=$('.progress .progressBar');
  let $loadingBox=$('.loadingBox');
  //进度条的进度是由项目中所有图片的加载完成决定的
    let ary=['phone-bg.jpg','phone-key.png','phone-listen.png','message-arrow1.png','message-arrow2.png','message-chatBtn.png','message-keyboard.png','message-head1.png','message-head2.png','phone-name.png'];
    let n=0;//记录加载完成的图片个数
    ary.forEach((item)=>{
        let img=new Image();
        //让临时的img去请求 图片
        img.src=`./images/`+item;
        img.onload=function () {
            load();
        }
    });
    function load() {
        n++;
        if (n==ary.length){
            //这说明所有图片加载完毕
            $progressBar.css({
                width:'100%'
            });
            let timer2=setTimeout(function () {
                $loadingBox.hide();//第一个块隐层，第二个块执行
                phoneFn();
                }
           ,1800 );
          /*  let timer1=setTimeout(function () {
                $loadingBox.css({
                    opacity:0
                })
            },1000)*/
            $loadingBox.css({
                opacity:0
            })
        } else {
            //没加载完
            $progressBar.css({
                width:n/ary.length*100+'%'
            })
        }
    }
};
loading();

/*
* 第二块
* */
let phoneFn=function () {
    let $phoneBox=$('.phoneBox'),
        $listenBox=$('.listen_box'),
        $listenBtn=$('.listenBtn'),
        $noListenBox=$('.no_listen_box'),
        $noListenBtn=$('.no_listenBtn'),
        $timerBox=$phoneBox.find('h4');
    //$listenBtn.on('touchend')
    bell.play();
    $listenBtn.tap(function () {
        //点击 接听按钮
        bell.pause();
        say.play();
        //语音播放，让上面的时间跟着变化
        let sayTimer=setInterval(function () {
            let t=say.currentTime;
            let str='00:'+(Math.ceil(t)<10?'0'+Math.ceil(t):Math.ceil(t));
            $timerBox.html(str);
            //需要把say.currentTime转成00：34这个格式的字符串
            //需要我们判断音频是否播放完毕
            if(say.ended){
                clearInterval(sayTimer);
                phoneEnd();
            }
        },1000);
        $listenBox.hide();
        $timerBox.show();
        $noListenBox.css({
            transform:'translateY(0)'

        });
        $noListenBtn.tap(function () {
            say.pause();
            phoneEnd();
        });
        function phoneEnd() {
            let h= document.documentElement.clientHeight||document.body.clientHeight;
            console.log(h);
            $phoneBox.css({
                transform:`translateY(${h}px)`
            });
            //设置个定时器，等待0.8s后触发下一个模块的函数
            setTimeout(function () {
                msgFn();
            },1000)
        }
    })
};

/*
* 第三个块
* */
let msgFn=function () {
    //让每一个li先都透明，并且下移
    //循环这些li，让这些li轮着升上去，并且显示出来
    let $msgBox=$('.msgBox'),
        $ul = $msgBox.children('ul'),
        $lis=$ul.children('li'),
        $keyboard=$msgBox.find('.keyboard'),
        $textBox=$keyboard.find('.textBox'),
        $btn=$keyboard.find('.btn');
    bgm.play();
    let h=0,
        n=0;//存储当前要显示的那个元素的索引
    let moveTimer=null;
function move(){
  let   moveTimer=setInterval(function () {
        if (n==$lis.length){
            clearInterval(moveTimer);
            return;
        }
        $lis.eq(n).css({
            transform:'translateY(0)',
            opacity:1
        });
        //oul向上移动 根据索引；索引大于3；就让ul向上移动
        if (n>=3){
            h+=$lis[n].clientHeight;
            $ul.css({
                transform:`translateY(-${h}px)`
            })
        }
        if (n==2){
            $keyboard.css({
                transform:'translateY(0)'
            });
            clearInterval(moveTimer);
            //接下来要让字体一个个显示出来
            setTimeout(function () {
                inputWorld();//这个是异步，n=3
            },1600);
//inputWorld();//这个是同步的，n=2

        }
        n++;
    },2000);
}
move();

    function inputWorld() {
        //让字体一个个蹦出来
        console.log(n);
        let str=$lis[n].innerText;//要显示的全部内容
        let str2='';//当前要显示的内容
        let  timer2=null;
        let index=0;//控制当前要出来的那个字
        //现在我们要让字体出现完成后，按钮变色
        timer2=setInterval(function () {
            if (index==str.length){
                //说明字已经全部显示完毕
                clearInterval(timer2);
                $btn.show();
                $btn.tap(function () {
                    $textBox.html('');

                    $lis.eq(n).css({
                        opacity:1,
                        transform:`translateY(0)`
                    });
                    h+=$lis[n].clientHeight;
                   $ul.css({
                        transform:`translateY(-${h}px)`
                    });
                   n++;
                   $keyboard.css({
                       transform:'translateY(7rem)'
                   });
                    move();
                });//点击按钮要做 1、清空textbox  2、让键盘下去  3、对话框接着弹
                return;
            }
            str2+=str[index];
            $textBox.html(str2);
            index++;
        },200)
    }

    /*$lis.each(function (index,item) {
        setTimeout(function () {
            $(item).css({
                opacity:1,
                transform:'translateY(0)'
            });
            if (index>=3){
                h+=item.clientHeight;
                $ul.css({
                    transform:`translateY(-${h}px)`
                })
            };
          /!*  if (index==2){
                $keyboard.css({
                    transform:'translateY(0)'
                })
            }*!/
        },index*2000)
    })*/
}