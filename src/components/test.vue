<template>
    <div class="container">
        <div class="center">
            <div class="networkBox">
                <div class="line"></div>
                <div class="wrap">
                    <img class="mark" src="../assets/server.png"/>
                    <img class="status" src="../assets/true.png" />
                    <div class="info">
                        <p>312321321</p>
                        <p>312321321</p>
                        <p>312321321</p>
                        <p>312321321</p>
                    </div>
                </div>
            </div>
            <div class="serverBox">
                <div class="line"></div>
                <div class="wrap">
                    <img class="mark" src="../assets/network.png"/>
                    <img class="status" src="../assets/true.png" />
                    <div class="info">
                        <p>312321321</p>
                        <p>312321321</p>
                        <p>312321321</p>
                        <p>312321321</p>
                    </div>
                </div>
            </div>
            <div class="routeBox">
                <div class="line"></div>
                <div class="wrap">
                    <img class="mark" src="../assets/route.png"/>
                    <img class="status" src="../assets/true.png" />
                    <div class="info">
                        <p>312321321</p>
                        <p>312321321</p>
                        <p>312321321</p>
                        <p>312321321</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="wanBox">
            <div class="scrollx">
                <div class="item">
                    <div class="wrap">
                        <img class="mark" src="../assets/wan.png"/>
                        <img class="status" src="../assets/true.png" />
                        <div class="info">
                            <p>312321321</p>
                            <p>312321321</p>
                            <p>312321321</p>
                            <p>312321321</p>
                        </div>
                    </div>
                </div>
                <div class="item">
                    <div class="wrap">
                        <img class="mark" src="../assets/wan.png"/>
                        <img class="status" src="../assets/true.png" />
                        <div class="info">
                            <p>312321321</p>
                            <p>312321321</p>
                            <p>312321321</p>
                            <p>312321321</p>
                        </div>
                    </div>
                </div>
                <div class="item">
                    <div class="wrap">
                        <img class="mark" src="../assets/wan.png"/>
                        <img class="status" src="../assets/true.png" />
                        <div class="info">
                            <p>312321321</p>
                            <p>312321321</p>
                            <p>312321321</p>
                            <p>312321321</p>
                        </div>
                    </div>
                </div>
                <div class="item">
                    <div class="wrap">
                        <img class="mark" src="../assets/wan.png"/>
                        <img class="status" src="../assets/true.png" />
                        <div class="info">
                            <p>312321321</p>
                            <p>312321321</p>
                            <p>312321321</p>
                            <p>312321321</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
           
        }
    }
}
</script>

<style scoped>
    .container{
        height: 1000px;
    }
    .center{
        text-align: center;
        font-size: 0;
    }
    .networkBox,.serverBox{
        position: relative;
        width: 400px;
        height: 100px;
        background: #f6faf8;
        display: inline-block;
        font-size: 14px;
        text-align: left;
        margin: 20px;
    }
    .line{
        width: 4px;
        background: #76e63d;
        height: 70px;
        position: absolute;
        bottom: -75px;
        left: 50%;
        margin-left: -2px;
    }
    .routeBox{
        position: relative;
        width: 840px;
        height: 100px;
        background: #f6faf8;
        display: inline-block;
        font-size: 14px;
        text-align: left;
        margin-top: 60px;
    }
    .scrollx{
        width: 1000px;
        height: 100px;
    }
    .wanBox{
        width: 100%;
        height: 120px;
        overflow-x: scroll;
        overflow-y: hidden;
        margin-top: 80px;
    }
    .wanBox .item{
        float: left;
        width: 200px;
        height: 100px;
        margin-left: 20px;
        background: #f6faf8;
    }
    .wanBox .item:first-child{
        margin-left: 0;
    }
    .wrap{
        position: relative;
        margin: 10px;
    }
    .wrap .mark{
        position: absolute;
        width: 50px;
        left: 0;
        top: 0;
    }
    .wrap .status{
        position: absolute;
        width: 30px;
        left: 0;
        top: 60px;
    }
    .wrap .info{
        position: absolute;
        left: 70px;
        right: 0;
        word-break:break-all;
    }
    @media all and (max-width: 1000px) {
        .networkBox,.serverBox{ 
            width: 46%;
            margin: 2%;
        }
        .routeBox{
            width: 96%;
        }
        .wrap .mark{
            width: 35px;
        }
        .wrap .status{
            width: 25px;
            top: 50px;
        }
        .wrap .info{
            left: 50px;
        }
    }
</style>
