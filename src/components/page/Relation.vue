<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 打分关系表
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
                <el-button type="primary" icon="el-icon-lx-add" @click="addRelation">新增</el-button>
                <el-button type="primary" icon="el-icon-lx-upload" @click="importRelation">批量导入</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center">
                </el-table-column>
                <el-table-column prop="examiner" label="考核人">
                    <template slot-scope="{row}">
                        <span>{{ row.examiner }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="candidate" label="被考核人">
                    <template slot-scope="{row}">
                        <span>{{ row.candidate }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="考核类别">
                    <template slot-scope="{row}">
                        <span>{{ row.type }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="groups" label="考核分组">
                    <template slot-scope="{row}">
                        <span>{{ row.groups }}</span>
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
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="editform" :model="editform" :rules="rules" label-width="70px">
                <el-form-item label="考核人" prop="examiner">
                    <el-input v-model="editform.examiner" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="被考核人" prop="candidate">
                    <el-input v-model="editform.candidate" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="考核类型">
                    <el-select v-model="editform.type" placeholder="请选择">
                        <el-option key="A" label="上级(A)" value="A"></el-option>
                        <el-option key="B" label="同级(B)" value="B"></el-option>
                        <el-option key="C" label="服务对象(C)" value="C"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="考核分组">
                    <el-select v-model="editform.groups" placeholder="请选择">
                        <el-option key="1" label="第一组" value="1"></el-option>
                        <el-option key="2" label="第二组" value="2"></el-option>
                        <el-option key="3" label="第三组" value="3"></el-option>
                        <el-option key="4" label="第四组" value="4"></el-option>
                        <el-option key="5" label="第五组" value="5"></el-option>
                        <el-option key="6" label="第六组" value="6"></el-option>
                        <el-option key="7" label="第七组" value="7"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="考核分组" prop="groups">
                    <el-input v-model="editform.groups"></el-input>
                </el-form-item> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit('editform')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 新增弹出框 -->
        <el-dialog title="新增" :visible.sync="addVisible" width="30%">
            <el-form ref="addform" :model="addform" :rules="rules" label-width="70px">
                <el-form-item label="考核人" prop="examiner" placeholder="请输入员工编码">
                    <el-input v-model="addform.examiner"></el-input>
                </el-form-item>
                <el-form-item label="被考核人" prop="candidate" placeholder="请输入员工编码">
                    <el-input v-model="addform.candidate"></el-input>
                </el-form-item>
                <el-form-item label="考核类型" prop="type">
                    <el-select v-model="addform.type" placeholder="请选择">
                        <el-option key="A" label="上级" value="A"></el-option>
                        <el-option key="B" label="下级" value="B"></el-option>
                        <el-option key="C" label="服务对象" value="C"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="考核分组" prop="groups">
                    <el-select v-model="addform.groups" placeholder="请选择">
                        <el-option key="1" label="第一组" value="1"></el-option>
                        <el-option key="2" label="第二组" value="2"></el-option>
                        <el-option key="3" label="第三组" value="3"></el-option>
                        <el-option key="4" label="第四组" value="4"></el-option>
                        <el-option key="5" label="第五组" value="5"></el-option>
                        <el-option key="6" label="第六组" value="6"></el-option>
                        <el-option key="7" label="第七组" value="7"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRelation('addform')">确 定</el-button>
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
import { fetchData, saveEditInfo, addRelationInfo, deleteRelationInfo } from '../../api/relation';

export default {
    name: 'basetable',
    data() {
        return {
            query: {
                examiner: '',
                candidate: '',
                type: '',
                groups: '',
                pageIndex: 1,
                pageSize: 10
            },
            limitNum: 1, //允许上传的Excel最大数
            fileList: [],//excel文件列表
            tableData: [],
            multipleSelection: [],
            delRelation: {
                examiner: '',
                candidate: '',
                type: '',
                groups: ''
            },
            delList: [],//存放要删除的关系
            delVisible: false,
            msg: "",
            importVisible: false,
            editVisible: false,
            addVisible: false,
            pageTotal: 0,
            editform: {
                examiner: '',
                candidate: '',
                type: '',
                groups: ''
            },
            addform: {
                examiner: '',
                candidate: '',
                type: '',
                groups: ''
            },
            idx: -1,
            /* id: -1, */
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
        // 获取 table 的数据
        getData() {
            fetchData(this.query).then(res => {
                console.log(res);
                this.tableData = res.data.items;
                this.pageTotal = res.data.total || 0;
            });
        },
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
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        //新增单个人员信息
        addRelation(){
            this.addVisible = true;
        },
        // 单行删除操作
        handleDelete(index, row) {
            this.idx = index;
            this.msg = row;
            this.delRelation.examiner = this.msg.examiner;
            this.delRelation.candidate = this.msg.candidate;
            this.delRelation.type = this.msg.type;
            this.delRelation.groups = this.msg.groups;
            this.delList.push(this.delRelation);
            this.delVisible = true;
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //批量删除
        delAllSelection() {
            this.delVisible = true;//显示删除弹框
            const length = this.multipleSelection.length;
            for(let i = 0; i < length; i++){
                this.delList.push(this.multipleSelection[i].id)
            }
            //this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        //确定删除操作
        deleteRow(){
            //debugger;
            console.log(this.delList)
            deleteRelationInfo(this.delList).then(response => {
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
        //新增单条考核关系
        saveRelation(formName){
            this.$refs[formName].validate((valid) => {
                if(valid) {
                    addRelationInfo(this.addform).then(response => {
                        if(response.success){
                            this.$message.success(`添加成功`);
                            this.$set(this.tableData, 0, this.addform);
                            this.pageTotal = this.pageTotal + 1;
                        } else {
                            this.$message.error(`添加失败请稍后重试`);
                        }
                    })
                }
                else{
                    this.$message.error(`添加失败请检查`);
                    return false
                }
            })
            this.addVisible = false;
            //getData()
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
