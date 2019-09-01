<template>
    <div class="container">
        <!-- :data-zoom="dataZoom" -->
        <p class="title">Upload</p>
        <div class="buttons">
            <div @click="choose('all')" class="button" :class="{active:thisType == 'all'}">all</div>
            <div @click="choose(item)" class="button" :class="{active:thisType == item}" v-for="(item,index) in columns" :key="index">{{item}}</div>
        </div>
        <ve-line :data-zoom="dataZoom" :data="chartDataUp" :settings="chartSettings" :extend="extend" ></ve-line>

        <p class="title">Download</p>
        <div class="buttons">
            <div @click="chooseDown('all')" class="button" :class="{active:thisTypeDown == 'all'}">all</div>
            <div @click="chooseDown(item)" class="button" :class="{active:thisTypeDown == item}" v-for="(item,index) in columnsDown" :key="index">{{item}}</div>
        </div>
        <ve-line :data-zoom="dataZoom" :data="chartDataDown" :settings="chartSettings" :extend="extend" ></ve-line>
    </div>
</template>

<script>
    import 'echarts/lib/component/dataZoom'
    import { getChartsData } from '../tools/api'
    import { GetQueryString } from '../tools/utils'

    export default {
        data () {
            this.chartSettings = {
                metrics: [],
                dimension: ['time'],
                area: true,
                showDataZoom:true,
                start: 0,
                end: 100
            }
            this.extend = {
                yAxis:{
                    axisLabel:{
                        formatter:'{value}Kb/s'
                    }
                }
            }
            this.dataZoom = [
                {
                    type: 'slider',
                    start: 0,
                    end: 100,
                    
                }
            ]
            return {
                lastTime:0,
                thisTime:0,
                lastData:{},
                thisType:'all',
                thisTypeDown:'all',
                columns:[],
                columnsDown:[],
                dataUp:[],
                dataDown:[]
            }
        },
        computed:{
            chartDataUp (){
                let returnObj = {}
                if (this.thisType == 'all'){
                    this.chartSettings.metrics = this.columns
                    returnObj = {
                        columns:this.columns,
                        rows:this.dataUp
                    }
                }else{
                    let arr = []
                    for (let i = 0; i < this.dataUp.length; i++){
                        let obj = {}
                        obj[this.thisType] = this.dataUp[i][this.thisType];
                        obj.time = this.dataUp[i].time;
                        arr.push(obj)
                    }
                    this.chartSettings.metrics = [ this.thisType ]
                    returnObj = {
                        columns:[this.thisType],
                        rows:arr
                    }
                } 
                if (returnObj.rows.length > 100){
                    returnObj.rows.shift();
                }
                return returnObj
            },
            chartDataDown (){
                let returnObj = {}
                if (this.thisTypeDown == 'all'){
                    this.chartSettings.metrics = this.columnsDown
                    returnObj = {
                        columns:this.columnsDown,
                        rows:this.dataDown
                    }
                }else{
                    let arr = []
                    for (let i = 0; i < this.dataDown.length; i++){
                        let obj = {}
                        obj[this.thisTypeDown] = this.dataDown[i][this.thisTypeDown];
                        obj.time = this.dataDown[i].time;
                        arr.push(obj)
                    }
                    this.chartSettings.metrics = [ this.thisTypeDown ]
                    returnObj =  {
                        columns:[this.thisTypeDown],
                        rows:arr
                    }
                } 
                if (returnObj.rows.length > 100){
                    returnObj.rows.shift();
                }
                return returnObj
            }
        },
        methods:{
            choose (type){
                this.thisType = type;
            },
            chooseDown (type){
                this.thisTypeDown = type;
            },
            changeData (data){
                let time = this.$moment(data.timestamp).format("HH:mm:ss");  
                this.lastTime = this.thisTime;
                this.thisTime = data.timestamp;

                if (this.lastTime == 0){
                    //first
                    this.lastData = data.stats;
                    for (let key in data.stats){
                        this.columns.push(key)
                        this.columnsDown.push(key)
                    }
                }else{
                    let s = this.thisTime - this.lastTime
                    let _s = parseInt(s/1000);

                    let uploadobjup = {}
                    let uploadobjdown = {}

                    uploadobjup.time = time;
                    uploadobjdown.time = time;

                    for(let key in data.stats){
                        let resup = data.stats[key].upload - this.lastData[key].upload;
                        let resdown = data.stats[key].download - this.lastData[key].download;

                        let _resup = resup > 0 ? resup : 0;
                        let _resdown = resdown > 0 ? resdown : 0;

                        let uploadkb_up = _resup / 1024;
                        let uploadkb_down = _resdown / 1024;

                        uploadobjup[key] = uploadkb_up / _s;
                        uploadobjdown[key] = uploadkb_down / _s;

                    }
                    this.dataUp.push(uploadobjup)
                    this.dataDown.push(uploadobjdown)
                }
            },
            getData (){
                let ip = GetQueryString('ip');
                setTimeout(()=>{
                   
                    getChartsData({
                        ip
                    },(res)=>{
                        if (res.status == 'OK'){
                            var tmp = new Date();
                            res.data.timestamp = tmp;
                            this.changeData(res.data);
                            this.getData();
                        }else{
                            alert(res.status)
                        }
                    })
                },10000)
                
            }
        },
        mounted (){
            // YYYY-MM-DD HH:mm:ss
            this.getData()
           
        }
    }
</script>

<style scoped>
    .container{
        margin-top: 30px;
    }
    .title{
        margin-left: 10px;
        font-weight: bold;
    }
    .buttons{
        overflow: hidden;
    }
    .buttons .button{
        float: left;
        padding: 10px 16px;
        border: 1px solid #ccc;
        margin-left: 10px;
        margin-top: 10px;
        color: #aaa;
        cursor: pointer;
    }
    .buttons .active{
        background: #4ac8fa;
        color: #3b607c;
        border: 1px solid #4ac8fa;
    }
</style>
