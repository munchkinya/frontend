<template>
    <div>
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item><!--这里写死了-->
            <el-breadcrumb-item>角色维护</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片视图区域-->
        <el-card>
            <el-row>
                <el-col>
                    <!-- 添加角色按钮区-->
                    <el-button type="primary" @click="addroleDialogVisible=true" class="addButton">添加新角色</el-button>
                </el-col>
                <!--角色列表区-->
                <el-table :data="roleList" border stripe height="450">
                    <!--展开列-->
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <el-row :class="['bdbottom',i1===0?'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.subMenuList" :key="item1.id">
                                <!--渲染一级菜单-->
                                <el-col :span="7">
                                    <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.menuname}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <!--渲染二级菜单-->
                                <el-col :span="17">
                                    <el-tag type="success" v-for="(item3,i3) in item1.subMenuList" :key="item3.id"
                                            closable @close="removeRightById(scope.row,item3.id)">
                                        {{item3.menuname}}</el-tag>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <!--索引列-->
                    <el-table-column type="index"></el-table-column>
                    <el-table-column label="角色名称" prop="rolename"></el-table-column>
                    <el-table-column label="角色描述" prop="des"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope" width="300px">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="gotodelete(scope.row.id)">删除</el-button>
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
        </el-card>

        <!--分配权限的对话框-->
        <el-dialog
                title="分配权限"
                :visible.sync="setRightDialogVisible"
                width="50%" @close="setRightDialogClosed">
            <!--树形控件-->
            <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all
                     :default-checked-keys="defKeys" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>

        <!--添加角色的对话框-->
        <el-dialog title="添加新角色" :visible.sync="addroleDialogVisible" width="30%" @close="addroleDialogClosed">
            <!--内容主体区-->
            <el-form :model="roleaddForm" :rules="roleaddFormrules" ref="roleaddFormRef" label-width="80px">
                <el-form-item label="角色名" prop="rolename">
                    <el-input v-model="roleaddForm.rolename"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="des">
                    <el-input type="textarea" v-model="roleaddForm.des"></el-input>
                </el-form-item>
            </el-form>
            <!--底部按钮区-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addroleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addTodo">确 定</el-button>
                </span>
        </el-dialog>

        <!--修改角色的对话框-->
        <el-dialog
                title="修改角色"
                :visible.sync="editroleDialogVisible"
                width="50%" @close="editroleDialogClosed">
            <el-form :model="editroleForm" :rules="editroleFormRules" ref="editroleFormRef" label-width="100px">
                <el-form-item label="角色名" prop="rolename">
                    <el-input v-model="editroleForm.rolename"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="des">
                    <el-input type="textarea" v-model="editroleForm.des"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="editroleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUser">确 定</el-button>
  </span>
        </el-dialog>



    </div>
</template>

<script>
    export default {
        name: "Roles",
        data(){
            return{
                //所有角色列表对象
                roleList:[],
                /*控制分配权限对话框的显示和隐藏*/
                setRightDialogVisible:false,
                //所有权限的数据
                rightslist:[],
                //树形控件的数据绑定
                treeProps:{
                    label:'menuname',
                    children:'subMenuList'
                },
                //默认选中节点的id值数组
                defKeys:[],
                //当前即将分配角色的id
                roleid:'',
                addroleDialogVisible:false,
                roleaddForm:{
                    rolename:'',
                    des:''
                },
                roleaddFormrules:{
                    rolename:[
                        {required: true, message: '请输入新角色名称', trigger: 'blur'}
                    ],
                    des:[
                        {required: true, message: '请输入角色描述', trigger: 'blur'}
                    ]
                },
                editroleDialogVisible:false,
                //修改用户页面的表单（查询到的用户信息保存）所以这里不用赋值
                editroleForm:{},
                //修改表单的验证规则对象
                editroleFormRules:{
                    rolename:[
                        {required: true, message: '请输入新角色名称', trigger: 'blur'}
                    ],
                    des:[
                        {required: true, message: '请输入角色描述', trigger: 'blur'}
                    ]
                },
            }
        },
        methods:{
            async getRoleList(){
                const result = await this.$http.get('/role/getAllRoles')
                if (result.status !== 200) return this.$message.error('获取角色列表失败！');
                this.roleList = result.data;
            },
            //根据id删除对应的权限
            async removeRightById(role,menuid){
                //弹框提示用户是否要删除
               let confirmResult=await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err=>err);
                if(confirmResult!=='confirm'){
                    return this.$message.info('取消删除')
                }
                const {data:res}=await this.$http.delete(`/role/deleterolemenu/${role.id}/${menuid}`);
                this.getRoleList()
            },
            /*展示分配权限的对话框*/
            async showSetRightDialog(role){
                this.roleid=role.id
                /*再显示对话框之前，要先获取所有数据*/
                const {data:res} = await this.$http.get('/menu/getallmenutree')
              console.log(res)
                this.rightslist=res;
                //递归获取二级节点的id
                this.getLeafKeys(role,this.defKeys);
                this.setRightDialogVisible=true//显示分配权限的对话框
            },
            //通过递归的形式，获取角色下所有二级权限的id，并保存到数组defKeys
            getLeafKeys(node,arr){
                //如果当前node节点的子列表为空说明是二级节点
                if(node.pid!==0&&node.subMenuList===null){
                    return arr.push(node.id)
                }
                node.subMenuList.forEach(item=>this.getLeafKeys(item,arr))
            },
            //监听分配权限对话框的关闭事件,因为上面写了递归，会自动继承数组
            setRightDialogClosed(){
                this.defKeys=[]
            },
            //权限分配确定的函数
            async allotRights(){
                const keys=[
                    ...this.$refs.treeRef.getCheckedKeys(),//通过展开运算符...放到这个数组中
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ];
                const idStr=keys.join(',');
                const result=await this.$http.put(`/role/updaterolemenu/${this.roleid}/${idStr}`);
                if(result.data!==200){
                    return this.$message.error('分配权限失败')
                }
                this.$message.success('分配权限成功！')
                this.getRoleList()
                this.setRightDialogVisible=false
            },
            //监听添加角色对话框的关闭事件
            addroleDialogClosed() {
                this.$refs.roleaddFormRef.resetFields();
            }, //点击按钮，实现添加新用户,先表单预验证，再实现真正的添加功能
            addTodo() {
                this.$refs.roleaddFormRef.validate( async valid => {
                    if(!valid) return ;//表单预验证没通过
                    //可以发起添加用户的网络请求
                    let {data:res}=await this.$http.get('role/insertrole',
                        {
                            params: {
                                rolename: this.roleaddForm.rolename,
                                des: this.roleaddForm.des,
                            }
                        });
                    if(res==="success"){
                        this.$message.success('添加新角色成功，快去为新角色分配权限吧！');
                        this.addroleDialogVisible=false;//添加成功之后，把添加用户对话框关闭
                        this.getRoleList();//重新获取列表
                    }else if(res==="again"){
                        this.$message.error('添加新角色失败，角色已存在！');
                    }else{
                        this.$message.error('添加新角色失败！');
                    }
                })
            },
            //弹出编辑页面,显示角色信息
            async showEditDialog(id){
                let {data:res} = await this.$http.get('role/getrolebyid',
                    {
                        params: {
                            id: id
                        }
                    });
                this.editroleForm=res;
                this.editroleDialogVisible=true//显示编辑页面
            },
            //监听修改用户对话框的关闭事件
            editroleDialogClosed(){
                this.$refs.editroleFormRef.resetFields();
            },
            //点击按钮，实现修改用户,先表单预验证，再实现真正的修改功能
            editUser(){
                this.$refs.editroleFormRef.validate( async valid => {
                    if (!valid) return;//表单预验证没通过。。。valid为true表示通过，否则没通过
                    //否则发起修改用户的请求
                    const {data: res} = await this.$http.put(`/role/updaterole/${this.editroleForm.id}
                    /${this.editroleForm.rolename}/${this.editroleForm.des}`);
                    this.editroleDialogVisible=false;//添加成功之后，把修改用户对话框关闭
                    this.getRoleList();//重新获取列表
                    this.$message.success("更新角色信息成功！")
                })
            },
            //实现删除的功能
            async gotodelete(id){
                //先弹框提示
                const confirmresult=await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err);
                //如果用户确定删除，返回值是字符串confirm，否则就是cancel
                if(confirmresult!=='confirm'){
                    return this.$message.info('已取消删除')
                }
                const {data: res} = await this.$http.put(`/role/deleterole/${id}`);
                if(res==="success"){
                    this.$message.success("删除角色成功！")
                    this.getRoleList();//重新获取列表
                }else{
                    this.$message.error('删除角色失败')
                }
            }
        },
        created() {
            this.getRoleList();
        }
    }
</script>

<style lang="less" scoped>
.addButton{
    margin-bottom: 15px;
}
.el-tag{
    margin: 7px;
}
//下面这两个类是为了控制tag标签上划线和下划线
.bdtop{
    border-top: 1px solid #eee;
}
.bdbottom{
    border-bottom: 1px solid #eee;
}
//这个类是优化tag标签居中
.vcenter{
    display: flex;
    align-items: center;
}
</style>
