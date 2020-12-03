<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 人员列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="addUser">新增</el-button>
                <el-button type="primary" icon="el-icon-lx-upload" @click="importUser">批量导入</el-button>
            </div>
            <!--上传文件弹窗-->
            <el-dialog title="批量导入" :visible.sync="importVisible" width="70%">
                <el-upload
                    class="upload-demo"
                    drag
                    action=""
                    accept=".xlsx,.xls"
                    multiple
                    :auto-upload="false"
                    :before-upload="beforeUploadFile"
                    :on-change="fileChange"
                    :on-exceed="exceedFile"
                    :on-success="handleSuccess"
                    :on-error="handleError"
                    :file-list="fileList"
                    >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传.xlsx/.xls文件，且不超过10M</div>
                </el-upload>
                <span slot="footer" class="dialog-footer">
                    <el-button size="small" type="primary" @click="uploadFile">立即上传</el-button>
                    <el-button @click="importVisible = false">取 消</el-button> 
                </span>

            </el-dialog>
            <el-table
                :data="tableData.slice((query.pageIndex-1)*query.pageSize,query.pageIndex*query.pageSize)"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center">
                    
                </el-table-column>
                <el-table-column prop="id" label="ID" width="100" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="姓名">
                    <template slot-scope="{row}">
                        <span>{{ row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="邮箱">
                    <template slot-scope="{row}">
                        <span>{{ row.email }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="position" label="职位">
                    <template slot-scope="{row}">
                        <span>{{ row.position }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="department" label="部门">
                    <template slot-scope="{row}">
                        <span>{{ row.department }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="hiredate" label="入职时间">
                    <template slot-scope="{row}">
                        <span>{{ row.hiredate }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="isdafen" label="是否参与打分">
                    <template slot-scope="{row}">
                        <span>{{ row.isdafen== '1' ? '参与' : '不参与' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-sizes="[1,10,20,50]"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="editform" :model="editform" :rules="rules" label-width="70px">
                <el-form-item label="ID" prop="id">
                    <el-input v-model="editform.id" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="editform.name"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editform.email"></el-input>
                </el-form-item>
                <el-form-item label="职位" prop="position">
                    <el-input v-model="editform.position"></el-input>
                </el-form-item>
                <el-form-item label="部门" prop="department">
                    <el-input v-model="editform.department"></el-input>
                </el-form-item>
                <el-form-item label="参与打分" prop="department">
                    <el-input v-model="editform.isdafen"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <!-- <el-button @click="editVisible = false">取 消</el-button> -->
                <el-button @click="cancelEdit('editform')">取消</el-button>
                <el-button type="primary" @click="saveEdit('editform')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 新增弹出框 -->
        <el-dialog title="新增" :visible.sync="addVisible" width="30%">
            <el-form ref="addform" :model="addform" :rules="rules" label-width="70px">
                <el-form-item label="ID" prop="id">
                    <el-input v-model="addform.id"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="addform.name"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addform.email"></el-input>
                </el-form-item>
                <el-form-item label="职位" prop="position">
                    <el-input v-model="addform.position"></el-input>
                </el-form-item>
                <el-form-item label="部门" prop="department">
                    <el-input v-model="addform.department"></el-input>
                </el-form-item>
                <el-form-item label="参与打分" prop="department">
                    <el-input v-model="addform.isdafen"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveUser('addform')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow" >确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import { fetchData,saveEditInfo,deleteUserInfo,addUserInfo,upload } from '../../api/index';

export default {
    name: 'basetable',
    data() {
        return {
            query: {
                id: '',
                name: '',
                position: '',
                department: '',
                pageIndex: 1,
                pageSize: 10
            },
            limitNum: 1, //允许上传的Excel最大数
            fileList: [],//excel文件列表
            tableData: [],
            multipleSelection: [],
            delList: [],//存放要删除的id
            delstr: '',
            delVisible: false,
            msg: "",
            importVisible: false,
            editVisible: false,
            addVisible: false,
            pageTotal: 0,
            editform: {
                id: '',
                name: '',
                email: '',
                position: '',
                department:'',
                isdafen: ''
            },
            addform: {
                id: '',
                name: '',
                email: '',
                position: '',
                department: '',
                isdafen: ''
            },
            idx: -1,
            rules: {
                id: [
                    { required:true, message: 'id不可为空',trigger: 'blur'},
                    { min: 5, message: '长度为5个字符', trigger: 'blur'}
                ],
                name: [
                    { required: true, message: '用户名不可为空', trigger: 'blur'},
                    { min: 1, max: 20, message: '长度在1到20个字符', trigger: 'blur'}
                ],
                isdafen: [
                    { required:true, message: '必填字段',trigger: 'blur'}
                ]
            }
        }
    },
    created() {
        this.getData();
    },
    methods: {
        // 超出最大上传文件数
        exceedFile(files,fileList) {
            this.$message.warning('只能选择 ${this.limitNum} 个文件')
        },
        // 文件状态改变时
        fileChange(file, fileList) {
            console.log(file.raw);
            this.fileList.push(file.raw);
            console.log(this.fileList)
        },
        // 上传文件之前的处理
        beforeUploadFile(file) {
            console.log('before upload');
            console.log(file);
            let extension = file.name.substring(file.name.lastIndexOf(',') + 1);
            let size = file.size / 1024 / 1024;
            if(extension !== 'xlsx' && extension !== '.xls'){
                this.$message.warning('只能上传.xlsx和.xls格式的文件');
            }
            if(size > 10){
                this.$message.warning('上传文件大小不得超过10M');
            }
        },
        //上传文件成功
        handleSuccess(res, file, fileList) {
            this.$message.success('文件上传成功');
        },
        //上传文件失败
        handleError(err, file, fileList) {
            this.$message.error('上传文件失败，请联系管理员或稍后重试');
        },
        // 上传文件
        uploadFile() {
            if(this.fileList.length === 0){
                this.$message.warning('请选择文件');
            } else {
                var formData = new FormData();
                formData.append('file',this.fileList[0]);
                //console.log(this.fileList[0])
                upload(formData).then(res => {
                    console.log(res);
                    if(res.success){
                        this.$message({
                            message: "导入成功",
                            type: "success",
                        });
                        this.fileList=[];
                        this.importVisible = false;
                        this.getData();
                    }else{
                        //alert(res.$message);
                        this.$message({
                            message: "导入失败，请稍后重试或联系管理员",
                            type: "error",
                        })
                        this.importVisible = false;
                        this.getData();
                    }
                })
            }
        },
        // 获取 table 的数据
        getData() {
            fetchData(this.query).then(res => {
                console.log(res);
                this.tableData = res.data.items;
                this.pageTotal = res.data.total || 0;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        //新增单个人员信息
        addUser(){
            this.addVisible = true;
        },
        //批量导入人员信息
        importUser() {
            console.log(this.tableData)
            if(this.tableData.length !== 0){
                this.$alert('请先清空现有人员信息','提示',{
                    confirmButtonText: '确定',
                    callback: action => {
                        this.$message({
                            type: 'info',
                            message: '操作取消'
                        })
                    }
                })
            } else {
                this.importVisible = true;  
            }
        },
        // 单行删除操作
        handleDelete(index, row) {
            this.idx = index;
            this.msg = row;
            this.delList.push(this.msg.id);
            this.delVisible = true;
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //批量删除
        delAllSelection() {
            const length = this.multipleSelection.length;
            if (length === 0) {
                alert("请选择要删除的人员");
            } else {
                this.delVisible = true;//显示删除弹框
                for(let i = 0; i < length; i++){
                    this.delList.push(this.multipleSelection[i].id)
                }
                //this.$message.error(`删除了${str}`);
                this.multipleSelection = [];
            } 
        },
        //确定删除操作
        deleteRow(){
            //this.delStr = '';
            this.delstr = '';
            let i = 0;
            const len = this.delList.length;
            for(i = 0; i < len-1; i++){
                this.delstr += this.delList[i] + ',';
            }
            this.delstr += this.delList[i];
            deleteUserInfo(this.delstr).then(response => {
                console.log(response)
                this.getData();
                this.$message.success('删除成功')
            }).catch(error => {
                console.log(error);
                this.$message.error('删除失败')
            })
            this.delVisible = false;
            this.delList = [];
            this.delstr = '';
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.editform = row;
            this.editVisible = true;
        },
        //保存新增人员信息
        saveUser(formName){
            this.$refs[formName].validate((valid) => {
                if(valid) {
                    addUserInfo(this.addform).then(response => {
                    console.log(response)
                    this.$message.success(`添加成功`);
                    this.$set(this.tableData, 0, this.addform);
                    this.pageTotal = this.pageTotal + 1;
                    })
                }
                else{
                    this.$message.error(`添加失败请检查`);
                    return false
                }
            })
            this.addVisible = false;
        },
        // 取消编辑
        cancelEdit(formName) {
            this.editVisible = false;
        },
        // 保存编辑
        saveEdit(formName) {
            this.$refs[formName].validate((valid) => {
                if(valid) {
                    saveEditInfo(this.editform).then(response => {
                    console.log(response)
                    this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                    this.$set(this.tableData, this.idx, this.editform);
                    })
                }
                else{
                    return false
                }
            })
            this.editVisible = false;
                 
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
