<template>
    <div>
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>排行榜</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card>
            <el-select v-model="query" placeholder="请选择年级" @change="getStudentList">
                <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id">
                </el-option>
            </el-select>
        </el-card>
        <el-card style="margin-top: 20px">
            <el-table :data="studentList"  stripe>
                <el-table-column  type="expand">
                    <template slot-scope="scope">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="学院：">
                                <span>{{ scope.row.coname }}</span>
                            </el-form-item>
                            <el-form-item label="专业：">
                                <span>{{ scope.row.majname }}</span>
                            </el-form-item>
                            <el-form-item label="班级：">
                                <span>{{ scope.row.adname }}</span>
                            </el-form-item>
                            <el-form-item label="实习地点：">
                                <span>{{ scope.row.address }}</span>
                            </el-form-item>
                            <el-form-item label="实习开始时间：">
                                <span>{{ dateFormat(scope.row.starttime) }}</span>
                            </el-form-item>
                            <el-form-item label="实习结束时间：">
                                <span>{{ dateFormat(scope.row.endtime)}}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column  align="center" type="index" label="名次"></el-table-column>
                <el-table-column prop="stunumber" label="学号" align="center" width="100"></el-table-column>
                <el-table-column prop="stuname" label="姓名" align="center" width="120"></el-table-column>
                <el-table-column prop="stusex" label="性别" align="center" ></el-table-column>
                <el-table-column prop="intername" label="实习公司" align="center" ></el-table-column>
                <el-table-column prop="old_post" label="岗位" align="center" width="120"></el-table-column>
                <el-table-column prop="old_money" label="薪资" align="center" width="120"></el-table-column>
            </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[50, 100, 150, 200]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "RankingList",
        data() {
            return {
                studentList:[],
                grade:'',
                options:[],
                query:'',
                queryInfo:{
                    pagenum:1,//默认从第一页
                    pagesize:50//默认六条一页
                },
                total:0,//为了分页显示的时候,

            }
        },
        methods:{
            //表格中日期的格式化日期
            dateFormat(row, column) {
                var date = new Date(row);
                var year = date.getFullYear();
                var month = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : "" + (date.getMonth() + 1);
                var day = date.getDate() < 10 ? "0" + date.getDate() : "" + date.getDate();
                return (year + "年" + month + "月" + day+"日");
            },
            //监听pagesize改变的事件(分页里面）
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getStudentList();
            },
            //监听页码值，改变的事件(分页里面）
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getStudentList();
            },
            //根据年级得到学生排行榜信息
            async getStudentList(){
                const result = await this.$http.get('internshipinfo/getranklist',
                    {
                        params: {
                            query: this.query,
                            pageNum: this.queryInfo.pagenum,
                            pageSize: this.queryInfo.pagesize
                        }
                    });
                this.studentList=result.data.list;
                this.total=result.data.total
            },
            //得到全部年级
            async getGrade(){
                const result = await this.$http.get('student/getallgrade');
                for(let i=0;i<result.data.length;i++){
                    if(result.data[i].grade=='2017'){
                        this.options.push({id:'',label:result.data[i].grade})
                    }else {
                        this.options.push({id:result.data[i].grade,label:result.data[i].grade})
                    }
                }
            },

        },
        created() {
            this.getStudentList();
            this.getGrade()
        }
    }
</script>

<style lang="less" scoped>
.demo-table-expand {
    font-size: 0;
}
.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}
.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}
</style>
