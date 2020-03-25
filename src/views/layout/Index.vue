<template>
    <Layout>
        <Sider hide-trigger>
            <MSider></MSider>
        </Sider>
        <Layout>
            <Header>
                <MHeader></MHeader>
            </Header>
            <Content>
                <router-view/>
            </Content>
            <!--            <Footer>Footer</Footer>-->
        </Layout>
    </Layout>
</template>

<script>
    import { Layout, Sider, Header, Content, Footer } from 'view-design';
    import { MHeader, MSider } from './components';

    export default {
        name: 'Index',
        components: {
            Layout,
            Sider,
            Header,
            Content,
            Footer,
            MHeader,
            MSider,
        },
    };
</script>

<style scoped>

</style>
