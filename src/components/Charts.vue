<template>
    <div class="container">
        <!-- :data-zoom="dataZoom" -->
        <p class="title">{{text}}</p>
        <!--<div class="buttons">
            <div @click="choose('all')" class="button" :class="{active:thisType == 'all'}">all</div>
            <div @click="choose(item)" class="button" :class="{active:thisType == item}" v-for="(item,index) in columns" :key="index">{{item}}</div>
        </div> -->
        <ve-line  
            :not-set-unchange="['dataZoom']" 
            :mark-line="markLine" 
            :mark-point="markPoint" 
            :data-zoom="dataZoom" 
            :data="chartData" 
            :settings="chartSettings" 
            :extend="extend"
        >
        </ve-line>
    </div>
</template>

<script>
    import 'echarts/lib/component/dataZoom'
    import 'echarts/lib/component/markLine'
    import 'echarts/lib/component/markPoint'
    import { getChartsData } from '../tools/api'
    import { GetQueryString } from '../tools/utils'

    export default {
        props:['chartsData','columns','text'],
        data () {
            this.markLine = {
                data: [
                    {
                        name: '平均线',
                        type: 'average'
                    }
                ],    
                label: {
                    normal: {
                        position: 'end',
                        formatter:function (data){
                            if (data.value > 1000){
                                return (data.value/(1000)).toFixed(2)+" Mbps";
                            }else{
                                return data.value + " Kbps";
                            }
                        } 
                    },
                    
                }
            }
            this.markPoint = {
                label:{
                    formatter: function (data){
                        if (data.value > 1000){
                            return (data.value/(1000)).toFixed(2)+" Mbps";
                        }else{
                                return data.value + " Kbps";
                        }
                    }
                },
                data: [
                    {
                        name: '最大值',
                        type: 'max'
                    },
                    {
                        name: '最小值',
                        type: 'min'
                    }
                ]
            }
            this.chartSettings = {
                metrics: [],
                dimension: ['time'],
                area: true,
                showDataZoom:true,
                start: 0,
                end: 100,
            }
            this.extend = {
                grid:{
                    right: '6%',
                },
                tooltip:{
                    show:true,
                    formatter:function(params)  
                    {  
                        var relVal = params[0].name;  
                        for (var i = 0, l = params.length; i < l; i++) {  
                            let str = null;
                            let _val = params[i].value[1];
                            if (_val > 1000){
                                str =  (_val/(1000)).toFixed(2)+" Mbps";
                            }else{
                                 str = _val + " Kbps";
                            }
                            relVal += '<br/>' + params[i].seriesName + ' : ' + str;  
                        }  
                        return relVal;  
                    } 
                },
                yAxis:{
                    axisLabel:{
                        formatter: function(value){
                            if (value > 1000){
                                return (value/(1000)).toFixed(2)+" Mbps";
                            }else{
                                 return value + " Kbps";
                            }
                        }
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
                // thisType:'all',
                // columns:[],
                // data:[],
            }
        },
        computed:{
            chartData (){
                let returnObj = {}
                this.chartSettings.metrics = this.columns
                returnObj = {
                    columns:this.columns,
                    rows:this.chartsData
                }
                if (returnObj.rows.length > 60){
                    returnObj.rows.shift();
                }
                return returnObj
            }
        },
        methods:{
            // changeData (data){
            //     let time = this.$moment(data.timestamp).format("HH:mm:ss");
                
            //     if (this.columns.length == 0){
            //         for (let key in data.stats){
            //             this.columns.push(key)
            //         }
            //     }
                
            //     let uploadobj = {}
            //     uploadobj.time = time;

            //     for(let key in data.stats){
            //         uploadobj[key] = data.stats[key].upload;
            //     }

            //     this.data.push(uploadobj)
            // },
            // getData (){
            //     let ip = GetQueryString('ip');
            //     setTimeout(()=>{
                   
            //         getChartsData({
            //             ip
            //         },(res)=>{
            //             if (res.status == 'OK'){
            //                 // let tmp = new Date(res.data.timestamp * 1000);
            //                 let tmp = new Date();
            //                 res.data.timestamp = tmp;
            //                 this.changeData(res.data);
            //                 this.getData();
            //             }else{
            //                 // alert(res.status)
            //             }
            //         })
            //     }, 3000)
            // }
        },
        //mounted (){
            // YYYY-MM-DD HH:mm:ss
            //this.getData()
            
        //}
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
