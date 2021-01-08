<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 考核内容</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="upload-demo" style="width:500px">
            <el-upload
                class="upload-demo"
                drag
                action=""
                accept=".doc,.docx"
                multiple
                :auto-upload="false"
                :before-upload="beforeUploadFile"
                :on-change="fileChange"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :on-error="handleError"
                :file-list="fileList"
                >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将Word文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传.doc/.docx文件，且不超过10M</div>
            </el-upload>
        </div>
        <div style="margin-top:10px;">
            <el-button size="small" type="warning" @click="emptyFile">清空(首次操作前请先进行清空操作)</el-button>
        </div>
        <div style="margin-top:10px;">
            <el-button size="small" type="primary" @click="submitUpload">上传Word文件到服务器</el-button>
        </div>
        <div style="margin-top:10px;">
            <el-button size="small" type="primary" @click="wordAnalysis">批量解析Word文件</el-button>
        </div>
        <div style="margin-top:10px;">
            <el-button size="small" type="primary" @click="excelDownload">下载解析后的Excel文件</el-button>
        </div>
    </div>
</template>

<script>
import { fileUpload, wordEmpty, getWordContent } from '../../api/examiner';
import VueCropper  from 'vue-cropperjs';
export default {
    name: 'upload',
    data() {
        return {
            fileList: [],//上传文件列表
        };
    },
    components: {
        VueCropper
    },
    methods: {
        // 清空文件
        emptyFile() {
            console.log('开始清空...')
            wordEmpty().then(res => {
                if(res.success){
                    this.$message.success('历史数据已清空,可开始上传')
                }else{
                    this.$message.error('操作失败,请稍后重试或联系管理员')
                }
            })
        },
        // 解析word文件
        wordAnalysis() {
            getWordContent().then(res => {
                if(res.success) {
                    this.$message.success('已完成Word解析并生成Excel文件')
                } else {
                    this.$message.error('解析出现错误,请稍后重试或联系管理员')
                }
            })
        },
        // 上传文件之前的处理
        beforeUploadFile(file) {
            console.log('before upload');
            console.log(file);
            let extension = file.name.substring(file.name.lastIndexOf(',') + 1);
            let size = file.size / 1024 / 1024;
            if(extension !== 'doc' && extension !== '.docx'){
                this.$message.warning('只能上传.doc和.docx格式的文件');
            }
            if(size > 10){
                this.$message.warning('上传文件大小不得超过10M');
            }
        },
        // 文件状态改变时
        fileChange(file, fileList) {
            let existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name);
            if (existFile) {
                this.$message.error('选取文件重复,请检查!');
                fileList.pop();
            } else {
                console.log(file.raw);
                this.fileList.push(file.raw);
                console.log(this.fileList)
            }
        },
        // 移除文件
        handleRemove(file, fileList) {
            this.fileList = fileList;
        },
        submitUpload() {
            if(this.fileList.length === 0){
                this.$message.warning('请选择文件');
            } else {
                var formData = new FormData();
                // 因为要传一个文件数组过去，所以要循环append
                this.fileList.forEach((file) => {
                    formData.append('file', file)
                })
                fileUpload(formData).then(res => {
                    if(res.success){
                    this.$message({
                        message: "上传成功",
                        type: "success",
                    });
                }else{
                    this.$message({
                        message: "导入失败，请稍后重试或联系管理员",
                        type: "error",
                    })
                }
                })
            }
        },
        // 上传文件成功
        handleSuccess(res, file, fileList) {
            this.$message.success('文件上传成功');
        },
        // 上传文件失败
        handleError(err, file, fileList) {
            this.$message.error('上传文件失败，请联系管理员或稍后重试');
        },
    }
}
</script>

<style scoped>
    .el-icon-download{
        font-size: 67px;
        color: #C0C4CC;
        margin: 40px 0 16px;
        line-height: 50px;
    }
    .content-title{
        font-weight: 400;
        line-height: 50px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
    .pre-img{   
        width: 100px;
        height: 100px;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
    }
    .crop-demo{
        display: flex;
        align-items: flex-end;
    }
    .crop-demo-btn{
        position: relative;
        width: 100px;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        margin-left: 30px;
        background-color: #409eff;
        color: #fff;
        font-size: 14px;
        border-radius: 4px;
        box-sizing: border-box;
    }
    .crop-input{
        position: absolute;
        width: 100px;
        height: 40px;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }
</style>