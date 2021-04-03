<template>
    <div>
        <el-card>
            <el-page-header @back="goBack" content="编辑页面">
            </el-page-header>
            <el-form ref="editnewformRef" :model="editnewform" label-width="100px">
                <el-form-item label="新闻标题:" style="margin-top: 40px">
                    <el-input v-model="editnewform.title"></el-input>
                </el-form-item>
                <!--这里要说下，发布时间和发布人不能修改-->
                <el-form-item label="类别:">
                    <el-select v-model="editnewform.kind" placeholder="请选择" disabled>
                        <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="轮播:" style="margin-top: 10px">
                    <el-radio-group v-model="isslideshoww">
                        <el-radio :label="0">不轮播</el-radio>
                        <el-radio :label="1">轮播</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="轮播图片:" style="margin-top: 10px">
                    <el-upload
                            ref="upload"
                            action="http://localhost:8888/api/news/uploaer"
                            list-type="picture-card"
                            :auto-upload="false"
                            :headers="headers"
                            :data="params"
                            :disabled="isUpload">
                        <i slot="default" class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="新闻主体:" style="margin-top: 30px" v-model="editnewform.body">
                    <div id="div5" style="border: 1px solid #C9D8DB;"></div>
                    <div id="div6" style="border: 1px solid #C9D8DB;height: 300px"></div>
                    <!--<el-button id="complete">获取文本内容</el-button>-->
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="danger" @click="toeditnews">确认修改</el-button>
                </el-form-item>
            </el-form>


        </el-card>
    </div>
</template>

<script>
    import Editor from "wangeditor";
    export default {
        name: "FrontEditNews",
        data(){
            return{
                editor:null,
                id:'',
                editnewform:{},
                //新的
                options: [
                    {id: 'student', label: '学校相关新闻'},
                    {id: 'potice', label: '实训相关新闻'},
                    {id: 'price', label: '实习相关新闻'},
                    {id: 'inter', label: '招聘相关新闻'},
                ],
                //控制上传图片组件是否能用
                isUpload:null,
                isslideshoww:null
            }
        },
        methods: {
            goBack() {
                //返回新闻列表
                this.$router.go(-1)
            },
            async getNewByid(){
                let {data:res}=await this.$http.get('news/getbyid',
                    {
                        params: {
                            id: this.id
                        }
                    });
                this.editnewform=res;
                this.editor.txt.html(this.editnewform.body);
                this.isUpload = this.editnewform.isslideshow === 0;
                this.isslideshoww=this.editnewform.isslideshow
            },
            async toeditnews(){
                this.$refs.upload.submit();
                var that=this
                this.$http.post('/news/news', {
                    notice_id: this.id,
                    title: this.editnewform.title,
                    body: this.editor.txt.html(),
                    kind: this.editnewform.kind,
                    isslideshow: this.isslideshoww,
                })
                .then(function (response) {
                    that.$message.success('成功提交修改！')
                    that.editnewform=response.data
                })
                .catch(function (error) {
                    console.log(error);
                });
            }

        },
        mounted: function () {
            //得到新闻id，外加初始化富文本编辑器
            this.id = this.$route.params.id;
            this.getNewByid();
            this.editor = new Editor("#div5", "#div6");
            this.editor.config.uploadImgShowBase64 = true;
            /*console.log(editor);*/
            this.editor.create();
        },
        watch:{
            //根据轮播点选按钮的改变来控制下面的上传组件是否可用
            isslideshoww: function (newQuestion, oldQuestion) {
                if(newQuestion===0){
                    this.isUpload=true
                }else {
                    this.isUpload=false
                }
            }

        },
        computed: {
            headers() {
                return{
                    "access_token": window.sessionStorage.getItem('token')
                }
            },
            params() {
                return{
                    "id":this.id
                }
            },
        },
    }
</script>

<style lang="less" scoped>
.title{
    text-align: center;
    font-size: 20px;
    font-weight:bold;
    .p{
        display: inline-block;

        vertical-align: middle;
    }
}
.newsfotter{
    display: flex;
    justify-content: space-between;//组件左右贴边
     .right1{
         margin: 10px 10px 0 0px;
     }
    .right2{
        margin: 10px 10px 0 0px;
    }
}
.info {
    border-radius: 10px;
    line-height: 20px;
    padding: 10px;
    margin: 10px;
    background-color: #ffffff;
}
</style>
