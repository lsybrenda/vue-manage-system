<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 考核表详情
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-container>
            <el-header>各部门领导干部考核评估表</el-header>
            <el-container>
                <el-aside width="200px">一、业绩目标</el-aside>
                <el-container>
                <el-main>
                    <el-table
                        :data="performanceTargets"
                        style="width:100%"
                        :show-header="hiddenTableHeader">
                        <el-table-column
                            prop="examinationquestions"
                        >
                        </el-table-column>

                    </el-table>
                </el-main>
                </el-container>
            </el-container>
            </el-container>

            <el-container>
            <el-aside width="200px">二、核心能力</el-aside>
            <el-container>
                <el-main>
                    <el-table
                        :data="coreCompetence"
                        style="width:100%"
                        :show-header="hiddenTableHeader">
                        <el-table-column
                            prop="competence"
                        >
                        </el-table-column>

                    </el-table>
                </el-main>
            </el-container>
            </el-container>

            <el-container>
            <el-aside width="200px">三、工作态度</el-aside>
            <el-container>
                <el-main>
                    <el-table
                        :data="workAttitude"
                        style="width:100%"
                        :show-header="hiddenTableHeader"
                    >
                    <el-table-column
                            prop="attitude"
                        >
                    </el-table-column>
                    </el-table>
                </el-main> 
            </el-container>
        </el-container>
    </div>
</template>

<script>
import { getDetail } from '../../api/examiner';
import Vue from "vue";
import Router from "vue-router";

export default {
    name: 'basetable',
    data() {
        return {
            performanceTargets:[{}],
            coreCompetence: [{
                competence: '1、解决问题能力(运用观念、规则、一定的程序方法等对问题进行分析并提出解决方案)',
            },{
                competence: '2、团队建设能力(为了实现团队产出最大化而进行的一系列结构设计、团队优化行为)',
            },{
                competence: '3、培养他人能力(自发、真诚的去帮助他人提高工作上的技能、工作方法和能力素质等)',
            },{
                competence: '4、适应变化能力(对外部、内部变化快速反应并提出解决方案)',
            },{
                competence: '5、沟通协调能力(能妥善处理好上级、同级、下级的关系，调动各方面的工作积极性)'
            }],
            workAttitude: [{
                attitude: '1、责任感强，尽职尽责',
            },{
                attitude: '2、工作中具有服务意识',
            },{
                attitude: '3、具有预见性、计划性',
            }],
            hiddenTableHeader: false,
            query: {
                id: ''
            },
            delList: [],
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1
        };
    },
    activated() {
        this.getData();
    },
    mounted(){
        this.query.id = this.$route.query.id;
    },
    methods: {
        // 获取打分表数据
        getData() {
            this.query.id = this.$route.query && this.$route.query.id;
            //console.log(this.$route.query.id);
            getDetail(this.query).then(res => {
                this.performanceTargets = res.examination;
                this.query.id = '';
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
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
.el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
