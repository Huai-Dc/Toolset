<template>
    <Layout>
        <Sider width="240" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
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
    import { mapGetters } from 'vuex';

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
        computed: {
            ...mapGetters([
                "isCollapsed"
            ])
        }
    };
</script>

<style scoped>

</style>
