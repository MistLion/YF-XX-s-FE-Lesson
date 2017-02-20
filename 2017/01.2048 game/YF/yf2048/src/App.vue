<template>
    <div id="app" v-on:keyup.up="moveUp" v-on:keyup.down="moveDown" v-on:keyup.left="moveLeft" v-on:keyup.right="moveRight">
        <header>
            <h1>2048</h1>
            <a href="javascript:void(0)" v-on:click="startNewGame" id="newgamebutton">New Game</a>
            <p>score:<span id="score">{{score}}</span></p>
        </header>
        <div id="grid-container" style="width: 460px; height: 460px; padding: 20px; border-radius: 10px;">
<template v-for="x in 4">
    <template v-for="y in 4">
        <div class="grid-cell" :style="{top: 20+(y-1)*120+'px', left: 20+(x-1)*120+'px'}"></div>
    </template>
</template>
<template v-for="(arrayItem,arrayIndex) in numberArray">
    <template v-for="(blockItem,blockIndex) in arrayItem">
        <div class="number-cell" :style="{top: 20+arrayIndex*120+'px', left: 20+blockIndex*120+'px',display:blockItem.value!=0?'':'none',backgroundColor:bgcolor[blockItem.value-1]}">
            {{number[blockItem.value-1]}}
        </div>
    </template>
</template>
</div>
</div>
</template>

<script>
    export default {
        name: 'app',
        data() {
            return {
                bgcolor: [
                    'rgb(238, 228, 218)',
                    'rgb(237, 224, 200)',
                    'rgb(242, 177, 121)',
                    'rgb(245, 149, 99)',
                    'rgb(246, 126, 95)',
                    'rgb(246, 94, 59)',
                    'rgb(237, 207, 114)',
                    'rgb(237, 204, 97)',
                    'rgb(237, 177, 67)',
                    'rgb(197, 140,120)',
                    'rgb(195, 130,118)',
                    'rgb(188, 110,110)',
                    'rgb(177, 67,100)',
                ],
                number: [
                    2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192
                ],
                numberArray: [
                    [{ value: 0, conflicted: false }, { value: 0, conflicted: false }, { value: 0, conflicted: false }, { value: 0, conflicted: false }],
                    [{ value: 0, conflicted: false }, { value: 0, conflicted: false }, { value: 0, conflicted: false }, { value: 0, conflicted: false }],
                    [{ value: 0, conflicted: false }, { value: 0, conflicted: false }, { value: 0, conflicted: false }, { value: 0, conflicted: false }],
                    [{ value: 0, conflicted: false }, { value: 0, conflicted: false }, { value: 0, conflicted: false }, { value: 0, conflicted: false }]
                ],
                score: 0
            }
        },
        computed: {
            canMoveLeft: function () {
                for (var i = 0; i < 4; i++) {
                    for (var j = 1; j < 4; j++) {
                        if (this.numberArray[i][j].value != 0)
                            if (this.numberArray[i][j - 1].value == 0 || this.numberArray[i][j - 1].value == this.numberArray[i][j].value)
                                return true;
                    }
                }
                return false;
            },
            canMoveRight: function () {
                for (var i = 0; i < 4; i++) {
                    for (var j = 2; j > -1; j--) {
                        if (this.numberArray[i][j].value != 0)
                            if (this.numberArray[i][j + 1].value == 0 || this.numberArray[i][j + 1].value == this.numberArray[i][j].value)
                                return true;
                    }
                }
                return false;
            },
            canMoveUp: function () {
                for (var i = 1; i < 4; i++) {
                    for (var j = 0; j < 4; j++) {
                        if (this.numberArray[i][j].value != 0)
                            if (this.numberArray[i - 1][j].value == 0 || this.numberArray[i - 1][j].value == this.numberArray[i][j].value)
                                return true;
                    }
                }
                return false;
            },
            canMoveDown: function () {
                for (var i = 2; i > -1; i--) {
                    for (var j = 0; j < 4; j++) {
                        if (this.numberArray[i][j].value != 0)
                            if (this.numberArray[i + 1][j].value == 0 || this.numberArray[i + 1][j].value == this.numberArray[i][j].value)
                                return true;
                    }
                }
                return false;
            },
            haveSpace: function () {
                for (var i = 0; i < 4; i++) {
                    for (var j = 0; j < 4; j++) {
                        if (this.numberArray[i][j].value == 0)
                            return true;
                    }
                }
                return false;
            }
        },
        methods: {
            generateOneNumber: function () {
                console.log(this.haveSpace);
                if (!this.haveSpace) {
                    return false;
                }
                var randx = parseInt(Math.floor(Math.random() * 4));
                var randy = parseInt(Math.floor(Math.random() * 4));
                var times = 0;
                while (times < 50) {
                    if (this.numberArray[randx][randy].value == 0)
                        break;
                    var randx = parseInt(Math.floor(Math.random() * 4));
                    var randy = parseInt(Math.floor(Math.random() * 4));
                    times++;
                }
                if (times == 50) {
                    for (var i = 0; i < 4; i++) {
                        for (var j = 0; j < 4; j++) {
                            if (this.numberArray[i][j].value == 0) {
                                randx = i;
                                randy = j;
                            }
                        }
                    }
                }
                var randNumber = Math.random() < 0.5 ? 1 : 2;
                this.numberArray[randx][randy].value = randNumber;
                return true;
            },
            noBlockHorizontal: function (row, col1, col2) {
                for (var i = col1 + 1; i < col2; i++) {
                    if (this.numberArray[row][i].value != 0) {
                        return false;
                    }
                }
                return true;
            },
            noBlockVertical: function (column, row1, row2) {
                for (var i = row1 + 1; i < row2; i++) {
                    if (this.numberArray[i][column].value != 0) {
                        return false;
                    }
                }
                return true;
            },
            moveUp: function () {
                for (var i = 0; i < 4; i++) {
                    for (var j = 1; j < 4; j++) {
                        if (this.numberArray[j][i].value != 0) {
                            for (var k = 0; k < j; k++) {
                                if (this.numberArray[k][i].value == 0 && this.noBlockVertical(i, k, j)) {
                                    this.numberArray[k][i].value = this.numberArray[j][i].value;
                                    this.numberArray[j][i].value = 0;
                                    break;
                                }
                                else if (this.numberArray[k][i].value == this.numberArray[j][i].value && this.noBlockVertical(i, k, j) && !this.numberArray[k][i].conflicted) {
                                    this.numberArray[k][i].value += 1;
                                    this.numberArray[j][i].value = 0;
                                    this.numberArray[k][i].conflicted = true;
                                    this.score = this.score + this.number[this.numberArray[k][i].value - 1];
                                    break;
                                }
                            }
                        }
                    }
                }
            },
            moveDown: function () {
                for (var i = 0; i < 4; i++) {
                    for (var j = 2; j > -1; j--) {
                        if (this.numberArray[j][i].value != 0) {
                            for (var k = 3; k > j; k--) {
                                if (this.numberArray[k][i].value == 0 && this.noBlockVertical(i, k, j)) {
                                    this.numberArray[k][i].value = this.numberArray[j][i].value;
                                    this.numberArray[j][i].value = 0;
                                    break;
                                }
                                else if (this.numberArray[k][i].value == this.numberArray[j][i].value && this.noBlockVertical(i, k, j) && !this.numberArray[k][i].conflicted) {
                                    this.numberArray[k][i].value += 1;
                                    this.numberArray[j][i].value = 0;
                                    this.numberArray[k][i].conflicted = true;
                                    this.score = this.score + this.number[this.numberArray[k][i].value - 1];
                                    break;
                                }
                            }
                        }
                    }
                }
            },
            moveLeft: function () {
                for (var i = 0; i < 4; i++) {
                    for (var j = 1; j < 4; j++) {
                        if (this.numberArray[i][j].value != 0) {
                            for (var k = 0; k < j; k++) {
                                if (this.numberArray[i][k].value == 0 && this.noBlockHorizontal(i, k, j)) {
                                    this.numberArray[i][k].value = this.numberArray[i][j].value;
                                    this.numberArray[i][j].value = 0;
                                    break;
                                }
                                else if (this.numberArray[i][k].value == this.numberArray[i][j].value && this.noBlockHorizontal(i, k, j) && !this.numberArray[i][k].conflicted) {
                                    this.numberArray[i][k].value += 1;
                                    this.numberArray[i][j].value = 0;
                                    this.numberArray[i][k].conflicted = true;
                                    this.score = this.score + this.number[this.numberArray[i][k].value - 1];
                                    break;
                                }
                            }
                        }
                    }
                }
            },
            moveRight: function () {
                for (var i = 0; i < 4; i++) {
                    for (var j = 2; j > -1; j--) {
                        if (this.numberArray[i][j].value != 0) {
                            for (var k = 3; k > j; k--) {
                                if (this.numberArray[i][k].value == 0 && this.noBlockHorizontal(i, j, k)) {
                                    this.numberArray[i][k].value = this.numberArray[i][j].value;
                                    this.numberArray[i][j].value = 0;
                                    break;
                                }
                                else if (this.numberArray[i][k].value == this.numberArray[i][j].value && this.noBlockHorizontal(i, j, k) && !this.numberArray[i][k].conflicted) {
                                    this.numberArray[i][k].value += 1;
                                    this.numberArray[i][j].value = 0;
                                    this.numberArray[i][k].conflicted = true;
                                    this.score = this.score + this.number[this.numberArray[i][k].value - 1];
                                    break;
                                }
                            }
                        }
                    }
                }
            },
            startNewGame: function () {
                for (let i = 0; i < 4; i++) {
                    for (let j = 0; j < 4; j++) {
                        this.numberArray[i][j].value = 0;
                        this.numberArray[i][j].conflicted = false;
                    }
                }
                this.generateOneNumber();
                this.generateOneNumber();
                this.score = 0;
            },
            keyUp: function (e) {
                var currKey = 0, e = e || event;
                currKey = e.keyCode || e.which || e.charCode;
                switch (currKey) {
                    case 38:
                        if (this.canMoveUp) {
                            this.moveUp();
                        }
                        break;
                    case 39:
                        if (this.canMoveRight) {
                            this.moveRight();
                        }
                        break;
                    case 40:
                        if (this.canMoveDown) {
                            this.moveDown();
                        }
                        break;
                    case 37:
                        if (this.canMoveLeft) {
                            this.moveLeft();
                        }
                        break;
                }
                this.generateOneNumber();
            }
        },
        mounted: function () {
            var vm = this;
            vm.generateOneNumber();
            vm.generateOneNumber();
            document.onkeyup = vm.keyUp;
        }
    }
</script>

<style lang="scss">

.number-cell {
    border-radius: 6px;
    width: 100px;
    height: 100px;
    font-family: Arial;
    font-weight: bold;
    font-size: 60px;
    line-height: 100px;
    text-align: center;
    position: absolute;
}

.grid-cell {
    width: 100px;
    height: 100px;
    border-radius: 6px;
    background-color: #ccc0b3;
    position: absolute;
}

header {
    display: block;
    margin: 0px auto;
    width: 100%;
    text-align: center;
}
header #newgamebutton {
    display: block;
    margin: 0px auto;
    width: 100px;
    padding: 10px 10px;
    background-color: #8f7a66;
    font-family: Arial;
    color: white;
    border-radius: 10px;
    text-decoration: none;
}
user agent stylesheet
a:-webkit-any-link {
    color: -webkit-link;
    text-decoration: underline;
    cursor: auto;
}
header h1 {
    font-family: Arial;
    font-size: 30px;
    font-weight: bold;
}
header p {
    font-family: Arial;
    font-size: 20px;
    margin: 5px auto;
}

#grid-container {
    width: 460px;
    height: 460px;
    padding: 50px;
    margin: 5px auto;
    background-color: #bbada0;
    border-radius: 10px;
    position: relative;
}
</style>