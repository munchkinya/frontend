<template>
    <div class="bgm">
        <h3>
            welcome，欢迎管理员登录实习指导平台
        </h3>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="15"><div class="grid-content bg-purple"><el-calendar v-model="value"></el-calendar></div></el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Welcome",
        data() {
            return {
                value: new Date()
            }
        }
    }
</script>

<style lang="less" scoped>
h3{
    margin-top: 5px;
    margin-bottom: 10px;
}
.el-row {
    margin-bottom: 10px;
    margin-top: 10px;
    &:last-child {
        margin-bottom: 0;
    }
}
.el-col {
    border-radius: 4px;
}
.bg-purple-dark {
    background: #99a9bf;
}
.bg-purple {
    background: #d3dce6;
}
.bg-purple-light {
    background: #e5e9f2;
}
.grid-content {
    border-radius: 4px;
    min-height: 36px;
}
.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}
</style>
