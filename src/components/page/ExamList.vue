<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 考核列表
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
                <el-input v-model="query.name" placeholder="请输入员工姓名查询" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData.slice((query.pageIndex-1)*query.pageSize,query.pageIndex*query.pageSize)"
                border
                class="table"
                ref="examTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="120" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="姓名">
                    <template slot-scope="{row}">
                        <span>{{ row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="position" label="职位">
                    <template slot-scope="{row}">
                        <span>{{ row.position }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-lx-text"
                            @click="showExamDetail(scope.$index, scope.row)"
                        >查看考核表</el-button>
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
import { fetchData , deleteExamIds } from '../../api/examiner';
import Vue from "vue";
import Router from "vue-router";

export default {
    name: 'basetable',
    data() {
        return {
            query: {
                id: '',
                name: '',
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            delVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            delIDs: ''
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取打分表数据
        getData() {
            fetchData(this.query).then(res => {
                console.log(res);
                this.tableData = res.data.items;
                this.pageTotal = res.data.total || 0;
            });
        },
        // 查看考核表
        showExamDetail(index,row) {
            let examId = row.id;
            let position = row.position;
            // 点击实现跳转
            // 区分领导干部和普通员工
            if(position !== '员工') {
                this.$router.push({path: '/examDetail',query: {id: examId}})
            } else {
                //this.$router.push()
                alert('暂无')
            }
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        //确定删除操作
        deleteRow(){
            //debugger;
            console.log(this.delIDs)
            deleteExamIds(this.delIDs).then(response => {
                console.log(response)
                this.getData();
                this.$message.success('删除成功')
            }).catch(error => {
                this.$message.error('删除失败')
            })
            this.delVisible = false;
            this.delList = [];
            this.delIDs = '';
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            this.delVisible = true;//显示删除弹框
            this.delIDs = '';
            
            // const length = this.multipleSelection.length;
            // for (let i = 0; i < length; i++) {
            //     this.delIDs += this.multipleSelection[i].id + ' ';
            // }
            // this.$message.error(`删除了${this.delIDs}`);
            this.delIDs = this.multipleSelection.map(item => item.id).join()
            this.multipleSelection = [];
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        }
    },
    
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
