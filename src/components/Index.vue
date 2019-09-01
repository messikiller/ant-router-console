<template>
    <div class="container">
        <div v-if="data.client">
            <div class="center clearfloat">
                <div class="networkBox">
                    <div class="line"></div>
                    <div class="wrap">
                        <img class="mark" src="../assets/network.png"/>
                        <div class="info">
                            <p class="title">You({{data.client.ip}})</p>
                        </div>
                    </div>
                </div>
                <div class="serverBox">
                    <div class="line"></div>
                    <div class="wrap">
                        <img class="mark" src="../assets/server.png"/>
                        <div class="info">
                            <p class="title">{{data.server.name}}</p>
                            <p>status：{{data.server.status}}</p>
                            <p>version：{{data.server.version}}</p>
                        </div>
                    </div>
                </div>
                <div class="routeBox">
                    <div class="line"></div>
                    <div class="wrap">
                        <img class="mark" src="../assets/route.png"/>
                        <div class="info">
                            <p class="title">{{data.router.name}}({{data.router.ip}})</p>
                            <p>Version：{{data.router.version}}</p>
                            <p>Load：{{data.router.load}}</p>
                            <p>Uptime：{{data.router.uptime}}</p>
                            <p>Lan address：{{data.router.lan_addr}}</p>
                            <p>Lan range：{{data.router.lan_range}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="wanBox">
                <div class="scollx" ref="wanBoxEl" :style="{width:sx + 'px'}">
                    <div class="item" v-for="(item,index) in data.wans" :key="index" :style="{height:wanBoxMaxH ? wanBoxMaxH + 'px' : 'auto'}">
                        <div class="wrap">
                            <img v-if="item.status == 'OK'" class="mark" src="../assets/OK.png"/>
                            <img v-if="item.status == 'ERROR'" class="mark" src="../assets/error.png"/>
                            <img v-if="item.status == 'WARNING'" class="mark" src="../assets/warning.png"/>
                            <div class="info">
                                <p class="title">{{item.label}}({{item.ipaddr}})</p>
                                <p>wan ip: {{item.wanip}}</p>
                                <p>mtu: {{item.mtu}}</p>
                                <p>latency: {{item.latency}} ms</p>
                                <p>aggregate: {{item.aggregate}}</p>
                                <p>{{item.wan_info}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Charts/>
        <!-- <Charts :type="'down'"/> -->
    </div>
</template>

<script>
    import { getServerData } from '../tools/api'
    import { GetQueryString } from '../tools/utils'
    import Charts from './Charts'

    export default {
        components:{
            Charts
        },
        data () {
            return {
                data:{},
                wanBoxMaxH:0
            }
        },
        computed:{
            sx (){
                if (this.data.wans){
                    return this.data.wans.length * 205
                }else{
                    return 0
                }
            } 
        },
        methods:{
            calculationH (){
                setTimeout(()=>{
                    if (this.data.wans && this.data.wans.length > 0){
                        let children = this.$refs.wanBoxEl.children;
                        let max = children[0].offsetHeight;
                        for (let i = 0; i < children.length - 1; i++){
                            max = max < children[i+1].offsetHeight ? children[i+1].offsetHeight : max
                        }
                        this.wanBoxMaxH = max;
                    }
                },50)   
            },
            resize (){
                if (this.data.wans && this.data.wans.length > 0){
                    let children = this.$refs.wanBoxEl.children;
                    let max = children[0].children[0].offsetHeight;
                    for (let i = 0; i < children.length - 1; i++){
                        max = max < children[i+1].children[0].offsetHeight ? children[i+1].children[0].offsetHeight : max
                    }
                    this.wanBoxMaxH = max + 10;
                }
            }
        },
        created (){
            let ip = GetQueryString('ip');
            getServerData({
                ip
            },(res)=>{
                if (res.status == 'OK'){
                    // console.log(res.data)
                    this.data = res.data;
                    this.calculationH();
                }else{
                    alert(res.status)
                }
            }) 
        },
        mounted (){
            window.onresize = () => {
                this.resize()
            }
        }
    }
</script>

<style scoped>
    .clearfloat:after{
        display:block;
        clear:both;
        content:"";
        visibility:hidden;
        height:0;
    }
    .clearfloat{
        zoom:1
    }
    .container{
        margin: 5px;
        font-size: 13px;
    }
    .center{
        max-width: 800px;
        margin: 0 auto;
    }
    .networkBox{
        margin-right: 2%;
    }
    .serverBox{
        margin-left: 2%;
        
    }
    .networkBox,.serverBox{
        position: relative;
        float: left;
        width: 48%;
        height: 100px;
        /* background: #f6faf8; */
        border:1px solid #e1e1e1;
        box-sizing: border-box;
    }
    .line{
        position: absolute;
        width: 4px;
        height: 40px;
        bottom: -45px;
        background: #76e63d;
        left: 50%;
        margin-left: -2px;
    }
    .routeBox{
        position: relative;
        width: 60%;
        margin: 50px auto 0 auto;
        /* overflow: hidden; */
        float: left;
        border:1px solid #e1e1e1;
        box-sizing: border-box;
        margin-left: 20%;
    }
    .wanBox{
        width: 100%;
        margin-top: 50px;
        /* height: 200px; */
        overflow-x: scroll;
        overflow-y: hidden;
    }
    .scollx{
        width: 2000px;
        /* height: 200px; */
    }
    .wanBox .item{
        width: 200px;
        /* height: 200px; */
        float: left;
        margin: 0 5px 20px 0;
        position: relative;
        border:1px solid #e1e1e1;
        box-sizing: border-box;
    }
    .wrap{
        /* height: 200px; */
        position: relative;
        margin: 5px;
    }
    .wrap .mark{
        position: absolute;
        width: 40px;
        left: 0;
        top: 0;
    }
    .wrap .status{
        position: absolute;
        width: 26px;
        left: 7px;
        top: 45px;
    }
    .wrap .info{
        margin-left: 50px;
        color: #9e9e9e;
        word-break: break-all;
        font-size: 12px;
    }
    .wrap .info .title{
        color: #333;
        font-weight: bold;
        font-size: 14px;
    }
    
   
    @media all and (max-width: 750px) {
        .wanBox .item{
            /* width: 100%; */
            /* margin: 2%; */
        }
        .routeBox{
            width: 100%;
            margin-left: 0;
        }
    }
</style>
