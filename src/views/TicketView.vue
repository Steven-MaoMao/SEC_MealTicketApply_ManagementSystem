<template>
    <div class="container">
      <el-container>
        <!-- 页面头部 -->
        <el-header>
          <div class="title">后台管理系统</div>
          <div class="manager_info">
            <div>欢迎！{{ phone }}</div>
            <el-button class="quit" type="danger" size="mini" @click="logout"
              >退出登录</el-button
            >
          </div>
        </el-header>
        <el-container>
          <!-- 页面左侧导航栏 -->
          <el-aside width="200px">
            <el-menu
              default-active="/ticket"
              background-color="#f0f8ff"
              active-text-color="darkskyblue"
              router
            >
              <el-menu-item index="/user">
                <i class="el-icon-s-order"></i>
                <span slot="title">user表</span>
              </el-menu-item>
              <el-menu-item index="/application">
                <i class="el-icon-s-order"></i>
                <span slot="title">application表</span>
              </el-menu-item>
              <el-menu-item index="/ticket">
                <i class="el-icon-s-order"></i>
                <span slot="title">ticket表</span>
              </el-menu-item>
            </el-menu>
          </el-aside>
          <!-- 页面内容 -->
          <el-main>
            <el-tabs>
              <!-- 申请总览 -->
              <el-tab-pane label="饭票总览">
                <!-- 操作栏 -->
                <div style="margin-bottom: 10px;">
                    查询：
                    <el-select v-model="selectType" placeholder="请选择查询方式">
                        <el-option
                          v-for="item in selectTypeOption"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                    </el-select>
                    <el-input
                        style="width: 250px; margin-left: 20px; margin-right: 20px"
                        v-model="selectInput"
                        placeholder="请输入内容"
                        prefix-icon="el-icon-search"
                    ></el-input>
                    <el-button type="primary" @click="selectTicket">查询</el-button>
                </div>
                <div>
                    操作：
                    <el-button
                    type="primary"
                    @click="showUpdateTicket"
                    :disabled="isSelectRow()"
                    >修改饭票信息</el-button
                    >
                    <el-button @click="reset">重置</el-button>
                </div>
                <!-- 表格 -->
                <el-table
                  :data="ticketTable"
                  highlight-current-row
                  @current-change="handleRowChange"
                >
                  <el-table-column prop="id" label="编号"></el-table-column>
                  <el-table-column
                    prop="orderId"
                    label="申请编号"
                  ></el-table-column>
                  <el-table-column
                    prop="state"
                    label="状态"
                  ></el-table-column>
                  <el-table-column
                    prop="appearDate"
                    label="发放日期"
                  ></el-table-column>
                  <el-table-column
                    prop="useDate"
                    label="使用日期"
                  ></el-table-column>
                  <el-table-column
                    prop="expiredDate"
                    label="截止日期"
                  ></el-table-column>
                </el-table>
                <!-- 分页栏 -->
                <div>
                  <el-pagination
                    background
                    @size-change="handlePageSizeChange"
                    @current-change="handleCurrentPageChange"
                    :current-page.sync="currentPage"
                    :page-sizes="[5, 10]"
                    :page-size="pageSize"
                    layout="sizes, prev, pager, next"
                    :total="ticketNum"
                  >
                  </el-pagination>
                </div>
              </el-tab-pane>
              <!-- 添加饭票 -->
              <!-- <el-tab-pane label="添加饭票">
              </el-tab-pane> -->
            </el-tabs>
          </el-main>
        </el-container>
      </el-container>
      <!-- 修改饭票信息对话框 -->
    <el-dialog
    title="修改饭票信息"
    :visible.sync="updateTicketFormVisible"
  >
    <el-form
      label-position="top"
      :model="updateTicketForm"
      ref="updateTicketRef"
    >
      <el-row :gutter="50">
        <el-col :span="12">
          <el-form-item label="编号" prop="id">
            <el-input v-model="updateTicketForm.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-select v-model="updateTicketForm.state" disabled>
                <el-option
                  v-for="item in stateOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="使用日期" prop="useDate">
            <el-date-picker
                :clearable="false"
                value-format="yyyy-MM-dd"
                v-model="updateTicketForm.useDate"
                disabled
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请编号" prop="orderId">
            <el-input v-model="updateTicketForm.orderId" disabled></el-input>
          </el-form-item>
          <el-form-item label="发放日期" prop="appearDate">
            <el-date-picker
                :clearable="false"
                value-format="yyyy-MM-dd"
                v-model="updateTicketForm.appearDate"
                disabled
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="截至日期" prop="expiredDate">
            <el-date-picker
            :clearable="false"
            value-format="yyyy-MM-dd"
            v-model="updateTicketForm.expiredDate"
          ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="this.updateTicket">确认</el-button>
        <el-button @click="this.updateTicketReset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
    </div>
  </template>

<script>
export default {
  data () {
    return {
      // 当前用户账号（手机号）
      phone: '',
      // 分页栏
      currentPage: 1,
      pageSize: 5,
      // 表格
      ticketNum: 0,
      ticketTable: [],
      // 选择表格某行
      currentRow: null,
      // 查询用户
      selectInput: '',
      selectType: null,
      selectTypeOption: [{
        value: 'searchById',
        label: '通过id查询'
      }, {
        value: 'searchByOrderId',
        label: '通过申请id查询'
      }, {
        value: 'searchByState',
        label: '通过状态查询'
      }, {
        value: 'searchByAppearDate',
        label: '通过生成日期查询'
      }],
      // 修改申请
      updateTicketForm: {},
      updateTicketFormVisible: false,
      // 状态
      stateOption: [{
        value: '未审批',
        label: '未审批'
      }, {
        value: '通过',
        label: '通过'
      }, {
        value: '不通过',
        label: '不通过'
      }, {
        value: '作废',
        label: '作废'
      }]
    }
  },
  async mounted () {
    this.phone = window.sessionStorage.getItem('phone')
    const { data: res } = await this.$http.get('/tickets/page/' + this.currentPage + '/' + this.pageSize)
    for (const row of res.records) {
      if (row.useDate === null) {
        row.useDate = '无'
      }
    }
    this.ticketTable = res.records
    this.ticketNum = res.total
  },
  methods: {
    // 退出登录
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 分页栏调整
    async handlePageSizeChange (size) {
      this.pageSize = size
      this.currentPage = 1
      this.handleCurrentPageChange(1)
    },
    async handleCurrentPageChange (page) {
      this.currentPage = page
      if (this.selectType === null) {
        const { data: res } = await this.$http.get('/tickets/page/' + this.currentPage + '/' + this.pageSize)
        this.ticketTable = res.records
      } else if (this.selectType === 'searchById') {
        const { data: res } = await this.$http.get('/tickets/pageById/' + this.selectInput + '/' + this.currentPage + '/' + this.pageSize)
        this.ticketTable = res.records
      } else if (this.selectType === 'searchByOrderId') {
        const { data: res } = await this.$http.get('/tickets/pageByOrderId/' + this.selectInput + '/' + this.currentPage + '/' + this.pageSize)
        this.ticketTable = res.records
      } else if (this.selectType === 'searchByState') {
        const { data: res } = await this.$http.get('/tickets/pageByState/' + this.selectInput + '/' + this.currentPage + '/' + this.pageSize)
        this.ticketTable = res.records
      } else if (this.selectType === 'searchByAppearDate') {
        const { data: res } = await this.$http.get('/tickets/pageByAppearDate/' + this.selectInput + '/' + this.currentPage + '/' + this.pageSize)
        this.ticketTable = res.records
      }
      for (const row of this.ticketTable) {
        if (row.useDate === null) {
          row.useDate = '无'
        }
      }
    },
    // 查询饭票
    async selectTicket () {
      if (this.selectType === null) {
        this.$message({
          message: '请选择搜索类型！',
          type: 'error'
        })
      } else if (this.selectInput === '') {
        this.$message({
          message: '搜索框不能为空！',
          type: 'error'
        })
      } else if (this.selectType === 'searchById') {
        this.currentPage = 1
        const { data: res } = await this.$http.get('/tickets/pageById/' + this.selectInput + '/' + this.currentPage + '/' + this.pageSize)
        this.ticketTable = res.records
        this.ticketNum = res.total
      } else if (this.selectType === 'searchByOrderId') {
        this.currentPage = 1
        const { data: res } = await this.$http.get('/tickets/pageByOrderId/' + this.selectInput + '/' + this.currentPage + '/' + this.pageSize)
        this.ticketTable = res.records
        this.ticketNum = res.total
      } else if (this.selectType === 'searchByState') {
        this.currentPage = 1
        const { data: res } = await this.$http.get('/tickets/pageByState/' + this.selectInput + '/' + this.currentPage + '/' + this.pageSize)
        this.ticketTable = res.records
        this.ticketNum = res.total
      } else if (this.selectType === 'searchByAppearDate') {
        this.currentPage = 1
        const { data: res } = await this.$http.get('/tickets/pageByAppearDate/' + this.selectInput + '/' + this.currentPage + '/' + this.pageSize)
        this.ticketTable = res.records
        this.ticketNum = res.total
      }
      for (const row of this.ticketTable) {
        if (row.useDate === null) {
          row.useDate = '无'
        }
      }
    },
    // 重置
    async reset () {
      this.selectInput = ''
      this.selectType = null
      const { data: res } = await this.$http.get('/tickets/page/' + this.currentPage + '/' + this.pageSize)
      for (const row of res.records) {
        if (row.useDate === null) {
          row.useDate = '无'
        }
      }
      this.ticketTable = res.records
      this.ticketNum = res.total
    },
    // 选择某一行
    handleRowChange (row) {
      this.currentRow = row
    },
    isSelectRow () {
      if (this.currentRow === null) return true
      else return false
    },
    // 修改用户信息
    showUpdateTicket () {
      this.updateTicketFormVisible = true
      this.updateTicketForm = JSON.parse(JSON.stringify(this.currentRow))
    },
    async updateTicket () {
      if (this.updateTicketForm.expiredDate === null) {
        this.$message({
          message: '日期不能为空！',
          type: 'error'
        })
      } else {
        if (this.updateTicketForm.useDate === '无') {
          this.updateTicketForm.useDate = null
        }
        const { data: res } = await this.$http.put('/tickets', this.updateTicketForm)
        if (res === true) {
          this.$message({
            message: '修改成功！',
            type: 'success'
          })
          this.updateTicketFormVisible = false
          this.updateTicketForm = {}
          this.reset()
        } else {
          this.$message({
            message: '修改失败，请重试！',
            type: 'error'
          })
        }
      }
    },
    updateTicketReset () {
      this.$refs.updateTicketRef.resetFields()
    }
  }
}
</script>

<style scoped>
.container {
    height: 100%;
}
.el-container {
    height: 100%;
}
.el-header {
    background-color: #f0f8ff;
    border-bottom: 1px solid black;
    padding-left: 30px;
    padding-right: 30px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.title {
    font-size: x-large;
    line-height: 60px;
}
.manager_info {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    line-height: 60px;
}
.quit {
    width: 80px;
    height: 30px;
    margin-left: 20px;
}
.el-menu {
    height: 100%;
    border-right: 1px solid black;
}
</style>
