<template>
    <div>
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item><!--这里写死了-->
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card>
                <!--角色列表区-->
                <el-table :data="menuList" border stripe height="450">
                    <el-table-column type="index"></el-table-column>
                    <el-table-column label="权限名称" prop="menuname"></el-table-column>
                    <el-table-column label="路径" prop="path"></el-table-column>
                    <el-table-column label="权限等级" prop="level">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.level===0 ">一级</el-tag>
                            <el-tag type="success" v-if="scope.row.level===1 ">二级</el-tag>
                            <el-tag type="warning" v-if="scope.row.level===2 ">三级</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Permission",
        data(){
            return{
                //所有权限列表对象
                menuList:[]
            }
        },
        methods:{
            async getMenuList(){
                const result = await this.$http.get('/menu/getallmenu')
                if (result.status !== 200) return thi.$message.error('获取权限列表失败！');
                this.menuList = result.data;
            }
        },
        created() {
            this.getMenuList();
        }
    }
</script>

<style lang="less" scoped>
</style>
