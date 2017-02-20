/**
 * Created by alex_ on 2017-02-20.
 */

//4*4 游戏数据,一维数组
var board=new Array();
//游戏分数
var score=0;

$(document).ready(function () {
    newgame();
});

function newgame() {
    //初始化棋盘格
    init();
    //随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

function init() {
    //对4*4的16个小格子的位置进行赋值
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            //坐标值对应的每个小格子的元素，通过id取得相应的对象
            var gridCell=$("#grid-cell-"+ i +"-"+ j);
            //对每个小格子的top和left进行计算，传入坐标值来算出top和left值
            gridCell.css('top',getPosTop(i,j));
            gridCell.css('left',getPosLeft(i,j));
        }
    }
    //通过遍历i变成二维数组
    for(var i=0;i<4;i++){
        board[i]=new Array();
        for(var j=0;j<4;j++){
            board[i][j]=0;
        }
    }
    //通知前端对board二位数组进行设定
    updateBoardView();
}

//根据变量board的值对前端的number-cell元素进行操作，需要在grid-container动态的添加
//用户每次操作，board的值都会发生变化都会调用一次updateBoardView函数
function updateBoardView(){
    $(".number-cell").remove();
    for(var i = 0;i<4;i++){
        for ( var j = 0; j < 4; j++) {
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell = $('#number-cell-'+i+'-'+j);
            if(board[i][j] == 0){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
            }else{
                theNumberCell.css('width','100px');
                theNumberCell.css('hegiht','100px');
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                //NumberCell覆盖
                theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));//返回背景色
                theNumberCell.css('color',getNumberColor(board[i][j]));//返回前景色
                theNumberCell.text(board[i][j]);
            }
        }
    }
}

function generateOneNumber(){
    if (nospace(board))
        return false;

    //随机一个位置
    var randx = parseInt(Math.floor(Math.random()*4));
    var randy = parseInt(Math.floor(Math.random()*4));
    while(true){
        if (board[randx][randy] == 0)
            break;
        randx = parseInt(Math.floor(Math.random()*4));
        randy = parseInt(Math.floor(Math.random()*4));
    }
    //随机一个数字
    var randNumber = Math.random()<0.5 ?2 : 4;
    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx,randy,randNumber);
    return true;
}

$(document).keydown(function (event) {
    switch(event.keyCode){
        case 37: //left
            if(moveLeft()){
                setTimeout("generateOneNumber()",200);
                isgameover();
            }
            break;
        case 38: //up
            if(moveUp()){
                setTimeout("generateOneNumber()",200);
                isgameover();
            }
            break;
        case 39: //right
            if(moveRight()){
                setTimeout("generateOneNumber()",200);
                isgameover();
            }
            break;
        case 40: //down
            if(moveDown()){
                setTimeout("generateOneNumber()",200);
                isgameover();
            }
            break;
        default:
            break;
    }
});

function  isgameover() {
    
}
/*moveLft逻辑
 落脚位置是否为空？
 落脚位置数字和待判定元素数字相等？
 移动路径中是否有障碍物？
 */
function moveLeft(){//更多地细节信息
    //判断格子是否能够向左移动
    if( !canMoveLeft(board))
        return false;

    //真正的moveLeft函数//标准
    for(var i = 0;i<4;i++)
        for(var j = 1;j<4;j++){//第一列的数字不可能向左移动
            if(board[i][j] !=0){
                //(i,j)左侧的元素
                for(var k = 0;k<j;k++){
                    //落脚位置的是否为空 && 中间没有障碍物
                    if(board[i][k] == 0 && noBlockHorizontal(i , k, j, board)){
                        //move
                        showMoveAnimation(i, j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    //落脚位置的数字和本来的数字相等 && 中间没有障碍物
                    else if(board[i][k] == board[i][j] && noBlockHorizontal(i , k, j, board)){
                        //move
                        showMoveAnimation(i, j,i,k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;

                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()",200);
    return true;
}

function moveRight() {
    if(!canMoveRight(board)){
        return false;
    }
    for(var i=0;i<4;i++)
        for(var j=2;j>=0;j--){
            if(board[i][j]!=0){
                for(var k=3;k>j;k--){
                    //如果落脚点为0且没有障碍物
                    if(board[i][k]==0 && noBlockHorizontal(i,j,k,board)){
                        //move;
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                        //如果落脚点的值与待移动的值相同且中间没有障碍物
                    } else if(board[i][k]==board[i][j] && noBlockHorizontal(i,j,k,board)){
                        //move
                        showMoveAnimation(i,j,i,k);
                        //add
                        board[i][k]+=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()",200);
    return true;
}

function moveUp() {
    if(!canMoveUp(board)){
        return false;
    }

    for(var j=0;j<4;j++)
        for(var i=1;i<4;i++){
            if(board[i][j]!=0){
                for(var k=0;k<i;k++){
                    //如果落脚点为0且没有障碍物
                    if(board[k][j]==0 && noBlockVertical(j,k,i,board)){
                        //move;
                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        break;
                        //如果落脚点的值与待移动的值相同且中间没有障碍物
                    } else if(board[k][j]==board[i][j] && noBlockVertical(j,k,i,board)){
                        //move
                        showMoveAnimation(i,j,k,j);
                        //add
                        board[k][j]+=board[i][j];
                        board[i][j]=0;
                        break;
                    }
                }
            }
        }
    setTimeout("updateBoardView()",200);
    return true;
}

function moveDown() {
    if(!canMoveDown(board)){
        return false;
    }
    for(var j=0;j<4;j++)
        for(var i=2;i>=0;i--){
            if(board[i][j]!=0){
                for(var k=3;k>i;k--){
                    //如果落脚点为0且没有障碍物
                    if(board[k][j]==0 && noBlockVertical(j,i,k,board)){
                        //move;
                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        continue;
                        //如果落脚点的值与待移动的值相同且中间没有障碍物
                    } else if(board[k][j]==board[i][j] && noBlockVertical(j,i,k,board)){
                        //move
                        showMoveAnimation(i,j,k,j);
                        //add
                        board[k][j]+=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()",200);
    return true;
}


