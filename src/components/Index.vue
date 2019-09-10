<template>
    <div class="container">
        <p id="tips" class="tips" v-if="!data.client">设备未在线</p>
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
                            <p>load：{{data.server.load}}</p>
                            <p>uptime：{{data.server.uptime}}</p>
                        </div>
                    </div>
                </div>
                <div class="routeBox" @click="restartRoutingFn()">
                    <div class="line"></div>
                    <div class="wrap">
                        <img class="mark" src="../assets/route.png"/>
                        <div class="info">
                            <p class="title">{{data.router.name}}({{data.router.ip}})</p>
                            <p>Version：{{data.router.version}}</p>
                            <p>Core Temp：{{data.router.core_temp}}℃</p>
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
        <Charts :chartsData="chartsDataUp" :columns="columns" :text="'Upload'"/>
        <Charts :chartsData="chartsDataDown" :columns="columns" :text="'Download'"/>
    </div>
</template>

<script>
    import { getServerData,restartRouting,getChartsData } from '../tools/api'
    import { GetQueryString } from '../tools/utils'
    import Charts from './Charts'

    export default {
        components:{
            Charts
        },
        data () {
            return {
                data:{},
                wanBoxMaxH:0,
                chartsDataUp:[],
                chartsDataDown:[],
                columns:[],
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
            restartRoutingFn (){
                let r = confirm("是否重载所有网络?");
                if ( r == true ){
                    let ip = GetQueryString('ip');
                    restartRouting({ip},(res)=>{
                        alert('重启成功');
                        setTimeout(()=>{
                            location.reload();
                        },1000)
                    })
                }

            },
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
            },
            errorFn (){
                let tips = document.getElementById('tips');
                if (tips){
                    tips.style.display = 'block';
                }
            },
            getData (){
                let ip = GetQueryString('ip');
                getServerData({
                    ip
                },(res)=>{
                    if (res.status == 'OK'){
                        // console.log(res.data)
                        this.data = res.data;
                        this.calculationH();
                    }else{
                        this.errorFn()
                    }
                }) 
            },
            getChartsDataAjx (){
                let ip = GetQueryString('ip');
                getChartsData({
                    ip
                },(res)=>{
                    if (res.status == 'OK'){
                        let tmp = new Date(res.data.timestamp * 1000);
                        //let tmp = new Date();
                        res.data.timestamp = tmp;
                        this.changeData(res.data);
                        this.getChartsData();
                    }else{
                        this.getChartsData();
                        this.errorFn()
                    }
                },()=>{
                    this.getChartsData();
                })
            },
            getChartsData (){
                
                setTimeout(()=>{
                   
                    this.getChartsDataAjx()
                    
                }, 5000)
            },
            changeData (data){
                let time = this.$moment(data.timestamp).format("HH:mm:ss");
                
                if (this.columns.length == 0){
                    for (let key in data.stats){
                        this.columns.push(key)
                    }
                }
                
                let uploadObj = {}
                let downObj = {}

                uploadObj.time = time;
                downObj.time = time;

                for(let key in data.stats){
                    uploadObj[key] = data.stats[key].upload;
                    downObj[key] = data.stats[key].download;
                }

                this.chartsDataUp.push(uploadObj)
                this.chartsDataDown.push(downObj)
            }
        },
        created (){
            this.getData();
            setInterval(()=>{
                this.getData();
            }, 20000)
        },
        mounted (){
            this.getChartsDataAjx()
            window.onresize = () => {
                this.resize()
            }
        }
    }
</script>

<style scoped>
    .tips{
        text-align: center;
        padding-top: 30px;
        color: #fe7c62;
        display: none;
    }
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

    /* .hideScroll::-webkit-scrollbar { width: 0 !important }
    .hideScroll { -ms-overflow-style: none; }
    .hideScroll { overflow: -moz-scrollbars-none; } */
    
   
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
