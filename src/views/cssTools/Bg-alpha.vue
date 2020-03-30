<template>
    <div class="bg-alpha-content">
        <div class="title">用于生成兼容低版IE 的透明度背景色</div>
        <div class="main-content">
            <div class="left">
                <Row class="w400">
                    <Col span="6">color(颜色)</Col>
                    <Col span="15"><Input v-model="color"/></Col>
                    <Col span="3">
                      <ColorPicker @on-change="changeColor" v-model="color"></ColorPicker>
                    </Col>
                </Row>
                <Row class="w400">
                    <Col span="6">alpha（透明度）</Col>
                    <Col span="15"><Input v-model="alpha"/></Col>
                    <Col span="3"></Col>
                </Row>
                <Row class="w400">
                    <Col span="24">
                        <Button type="primary" @click="generate" icon="md-color-wand">生成</Button>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <Input v-model="result" type="textarea" style="width: 500px" :rows="4"/>
                    </Col>
                </Row>
            </div>
            <div class="right">
                <div class="preview-box" :style="{background: background}"></div>
            </div>
        </div>
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
    import { Input, Button, Row, Col, Alert, Icon, ColorPicker } from 'view-design';

    export default {
        name: 'Bg-alpha',
        components: {
            Input,
            Button,
            Row,
            Icon,
            Col,
            Alert,
            ColorPicker,
        },
        data() {
            return {
                color: '#f45920',  // 背景色
                alpha: '0.6',     // 透明度
                result: null,     // 生成结果
                background: ''
            };
        },
        mounted() {
            this.generate();
        },
        methods: {
            generate() {
                let color = this.color.replace('#', ''),
                    alpha = this.alpha;
                if (color === '' && alpha === '') {
                    throw new Error('color and alpha can\'t be empty');
                }
                let rgb = [];
                for (let i = 0; i < color.length; i += 2) {
                    rgb.push(parseInt('0x' + color[i] + color[i + 1]));
                }
                let alphaHex = Math.floor(parseFloat(alpha) * 255)
                    .toString(16);
                this.background = 'rgba(' + rgb.join(',') + ', ' + alpha + ')';
                this.result = 'background: rgba(' + rgb.join(',') + ', ' + alpha + ');\r\n' +
                    'filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#' + alphaHex + color + ', endColorstr=#' + alphaHex + color + ');';
            },
            changeColor() {
                this.generate();
            }
        }
    };
</script>

<style lang="scss" scoped>
    .bg-alpha-content {
        .title{
            font-size: 18px;
            font-weight: bolder;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #ddd;
        }
        .main-content{
            display: flex;
            flex-direction: row;
            .left{
                width: 500px;
            }
            .right{
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                padding-left: 50px;
                .preview-box{
                    width: 200px;
                    height: 200px;
                }
            }
        }

        .w400 {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 10px;
        }
    }
</style>
