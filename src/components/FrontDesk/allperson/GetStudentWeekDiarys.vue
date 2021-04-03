<template>
    <div>
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>相关实习</el-breadcrumb-item>
            <el-breadcrumb-item>查看实习周记</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card>
            <!--栅格系统-->
            <el-row :gutter="4"><!--搜索框和按钮之间的间隔-->
                <el-col :span="8"><!--宽度-->
                    <span style="margin-left: 20px;margin-right: 10px">周数：</span>
                    <el-select v-model="selectValue" placeholder="请选择第几周" @change="getStudentWeekDiaryByOthers">
                        <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.value"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" @click="reset">重置</el-button>
                </el-col>
                <el-col :span="6" :offset="8">
                    <el-input
                            placeholder="请输入学生姓名"
                            v-model="inputText"
                            clearable>
                        <i slot="suffix" class="el-input__icon el-icon-search" @click="getStudentWeekDiaryByOthers"></i>
                    </el-input>
                </el-col>
            </el-row>
        </el-card>
        <el-card style="margin-top: 20px">
            <el-table :data="weekdiaryList" border stripe>
                <!--label每一列的标题-->
                <el-table-column type="index" label="#" width="60" align="center"></el-table-column>
                <el-table-column prop="stu_number" label="学号" align="center"></el-table-column>
                <el-table-column prop="stu_name" label="姓名" align="center"></el-table-column>
                <el-table-column prop="week" label="周数" align="center"></el-table-column>
                <el-table-column prop="filename" label="名称" align="center" width="480px"></el-table-column>
                <el-table-column label="操作" align="center" width="120px">
                    <template slot-scope="scope"><!--//作用域插槽-->
                        <el-button size="small" type="primary" @click="downloaddiary(scope.row.id,scope.row.filename)" :disabled="scope.row.status!==1">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center" width="120px">
                    <template slot-scope="scope"><!--//作用域插槽-->
                        <el-tag :type="getTagType[scope.row.status]">{{scope.row.status===0?'未提交':'已提交'}}</el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页区域-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 5, 10, 17]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="datacount">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "GetStudentWeekDiarys",
        data(){
            return {
                options:[
                    {'id':'','value':'全部'},
                    {'id':'第一周','value':'第一周'},
                    {'id':'第二周','value':'第二周'},
                    {'id':'第三周','value':'第三周'},
                    {'id':'第四周','value':'第四周'},
                    {'id':'第五周','value':'第五周'},
                    {'id':'第六周','value':'第六周'},
                    {'id':'第七周','value':'第七周'},
                    {'id':'第八周','value':'第八周'},
                    {'id':'第九周','value':'第九周'},
                    {'id':'第十周','value':'第十周'},{'id':'第十一周','value':'第十一周'},
                    {'id':'第十二周','value':'第十二周'},{'id':'第十三周','value':'第十三周'},
                    {'id':'第十四周','value':'第十四周'},{'id':'第十五周','value':'第十五周'},
                    {'id':'第十六周','value':'第十六周'},{'id':'第十七周','value':'第十七周'},
                ],
                weekdiaryList:[],
                queryInfo:{
                    query:'',
                    pagenum:1,//默认从第一页
                    pagesize:5//默认六条一页
                },
                datacount:0,//为了分页显示的时候,
                getTagType:['danger','success'],
                inputText:'',
                selectValue:''
            }
        },
        methods:{
            //监听pagesize改变的事件(分页里面）
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getStudentWeekDiary();
            },
            //监听页码值，改变的事件(分页里面）
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getStudentWeekDiary();
            },
            async getStudentWeekDiary(){
                const result=await this.$http.get('weekdiary/getstudentweekdiary',
                    {
                        params: {
                            query: this.selectValue,
                            pageNum: this.queryInfo.pagenum,
                            pageSize: this.queryInfo.pagesize,
                            teacherId: window.sessionStorage.getItem('username'),
                            roleId: window.sessionStorage.getItem('roleId'),
                            studentName: this.inputText
                        }
                    });
                this.weekdiaryList=result.data.list;
                this.datacount=result.data.total
            },
            async getStudentWeekDiaryByOthers(){
                this.queryInfo.pagenum=1
                this.queryInfo.pagesize=5
                const result=await this.$http.get('weekdiary/getstudentweekdiary',
                    {
                        params: {
                            query: this.selectValue,
                            pageNum: this.queryInfo.pagenum,
                            pageSize: this.queryInfo.pagesize,
                            teacherId: window.sessionStorage.getItem('username'),
                            roleId: window.sessionStorage.getItem('roleId'),
                            studentName: this.inputText
                        }
                    });
                this.weekdiaryList=result.data.list;
                this.datacount=result.data.total
            },
            reset(){
                this.selectValue='';
                this.getStudentWeekDiary()
            },
            async downloaddiary(id,filename) {
                fetch('http://localhost:8888/api/weekdiary/downloaddiary', {
                    method:"POST",
                    headers: {
                        'access_token':window.sessionStorage.getItem('token'),
                        'id':id
                    }
                }).then(res => res.blob())
                    .then(data => {
                        let blobUrl = window.URL.createObjectURL(new Blob([data]));
                        this.download(blobUrl,filename);
                    });
            },
            download(blobUrl,filename) {
                let a = document.createElement('a')
                a.setAttribute("download",filename)
                a.href = blobUrl;
                a.click();
            },


        },
        created() {
            this.getStudentWeekDiary()
        }
    }
</script>

<style scoped>

</style>
