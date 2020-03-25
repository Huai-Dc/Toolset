<template>
    <div class="bg-alpha-content">
        <h3>用于生成兼容低版IE 的透明度背景色</h3>
        <Row class="w400">
            <Col span="7">color(颜色)</Col>
            <Col span="17"><Input v-model="color"/></Col>
        </Row>
        <Row class="w400">
            <Col span="7">alpha（透明度）</Col>
            <Col span="17"><Input v-model="alpha"/></Col>
        </Row>
        <Row class="w400">
            <Col span="24">
                <Button type="primary" @click="generate">生成</Button>
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <Input v-model="result" type="textarea" style="width: 500px" :rows="4"/>
            </Col>
        </Row>
        <Alert show-icon style="margin-top: 10px;">
            提示
            <Icon type="ios-bulb-outline" slot="icon"></Icon>
            <template slot="desc">
                <p>颜色值（color）必须为 "FFFFFF" 的hex值</p>
                <p>透明度（alpha）必须位于0~1的范围内 比如 0.6</p>
            </template>
        </Alert>
    </div>
</template>

<script>
    import { Input, Button, Row, Col, Alert, Icon } from 'view-design';

    export default {
        name: 'Bg-alpha',
        components: {
            Input,
            Button,
            Row, Icon,
            Col, Alert
        },
        data() {
            return {
                color: 'F4DBBB',  // 背景色
                alpha: '0.6',     // 透明度
                result: null,     // 生成结果
            };
        },
        methods: {
            generate() {
                let color = this.color, alpha = this.alpha;
                if(color === "" && alpha === ""){
                    throw new Error("color and alpha can't be empty")
                }
                let rgb = [];
                for (let i=0; i<color.length; i+=2) {
                    rgb.push(parseInt("0x" + color[i] + color[i+1]));
                }
                let alphaHex = Math.floor(parseFloat(alpha) * 255).toString(16);
                this.result = "background: rgba(" + rgb.join(",") + ", "+alpha+");\r\n" +
                    "filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#"+ alphaHex +color+", endColorstr=#" + alphaHex +color+");";
            }
        }
    };
</script>

<style lang="scss" scoped>
.bg-alpha-content{
    .w400{
        width: 400px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
    }
}
</style>
