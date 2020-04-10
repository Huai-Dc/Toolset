<template>
    <div class="adjust-boxShadow-content">
        <div class="part-left">
            <div class="handler-box">
                <Row v-for="(item, index) in shadow" :key="index">
                    <Col span="5">{{item.title}}</Col>
                    <Col span="3">{{item.unit}}</Col>
                    <Col span="16">
                        <Slider @on-input="showShadow" :min="item.range[0]" :max="item.range[1]" v-model="item.value"
                                show-input></Slider>
                    </Col>
                </Row>
                <Row>
                    <Col span="5">阴影颜色</Col>
                    <Col span="19">
                        <ColorPicker @on-change="showShadow" v-model="color"></ColorPicker>
                    </Col>
                </Row>
            </div>
        </div>
        <div class="part-right">
            <div class="demo-preview">
                <div class="demo-box"
                     :style="resultStyle">
                </div>
            </div>
            <div class="style-code-area">
                {{resultCode}}
            </div>
            <Alert show-icon style="margin-top: 10px;">
                提示
                <Icon type="ios-bulb-outline" slot="icon"></Icon>
                <template slot="desc">
                    <p>box-shadow:阴影水平偏移值（可取正负值）； 阴影垂直偏移值（可取正负值）；阴影模糊值；阴影颜色</p>
                    <p>Firefox支持Box Shadow(阴影)：-moz-box-shadow:2px 2px 5px #333333</p>
                    <p>webkit内核的Safari和Chrome支持Box Shadow(阴影)：-webkit-box-shadow:2px 2px 5px #333333</p>
                    <p>Opera支持Box Shadow(阴影)：box-shadow:2px 2px 5px #333333</p>
                    <p>IE不支持Box Shadow(阴影)</p>
                </template>
            </Alert>
        </div>
    </div>
</template>

<script>
    import { Row, Col, Alert, Icon, Input, Slider, ColorPicker } from 'view-design';

    export default {
        name: 'BoxShadowAdjust',
        components: {
            Row,
            Col,
            Alert,
            Icon,
            Input,
            Slider, ColorPicker
        },
        data() {
            return {
                shadow: {
                    hShadow: {
                        title: '水平位移',
                        unit: 'px',
                        value: 2,
                        range: [-10, 10]
                    },
                    vShadow: {
                        title: '垂直位移',
                        unit: 'px',
                        value: 2,
                        range: [-10, 10]
                    },
                    blur: {
                        title: '模糊半径',
                        unit: 'px',
                        value: 5,
                        range: [0, 20]
                    }
                },
                color: '#6e6e6e',
                resultCode: '',
                resultStyle: {},
            };
        },
        mounted() {
            this.showShadow();

            console.log(this.resultStyle);
        },
        methods: {
            showShadow() {
                let shadow = this.shadow;
                let theShadow = '';

                let shadowHOffset = shadow.hShadow.value + shadow.hShadow.unit;
                let shadowVOffset = shadow.vShadow.value + shadow.vShadow.unit;
                let shadowBlur = shadow.blur.value + shadow.blur.unit;
                let shadowColor = this.color;

                theShadow = shadowHOffset + ' ' + shadowVOffset + ' ' + shadowBlur + ' ' + shadowColor;

                this.resultStyle = {
                    '-moz-box-shadow': theShadow,
                    '-webkit-box-shadow': theShadow,
                    'box-shadow': theShadow,
                };

                this.resultCode = '-moz-box-shadow:' + theShadow + '; -webkit-box-shadow:' + theShadow + '; box-shadow:' + theShadow + ';';
            }
        }
    };
</script>

<style lang="scss" scoped>
    .adjust-boxShadow-content {
        display: flex;
        flex-direction: row;
        .part-left {
            width: 350px;
            border: 1px solid #dbdfe2;
            border-radius: 4px;
            padding: 10px;

            .handler-box {
                .ivu-row {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 5px;
                }
            }
        }

        .part-right {
            border: 1px solid #dbdfe2;
            border-radius: 4px;
            padding: 10px;
            margin-left: 15px;
            flex: 1;

            .style-code-area {
                height: 50px;
            }

            .demo-preview {
                padding: 10px 20px;
                display: flex;
                justify-content: center;
                align-items: center;

                .demo-box {
                    width: 70%;
                    height: 200px;
                    background-color: lightgray;
                }
            }
        }
    }
</style>
