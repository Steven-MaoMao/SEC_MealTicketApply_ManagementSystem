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
            default-active="/application"
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
            <el-tab-pane label="申请总览">
              <!-- 操作栏 -->
              <div>
                <div>查询：（留空表示全选）</div>
                <div style="margin-top: 10px;">
                  <el-input
                    style="width: 220px; margin-right: 20px"
                    v-model="selectInput.id"
                    placeholder="id"
                  ></el-input>
                  <el-input
                    style="width: 220px; margin-right: 20px"
                    v-model="selectInput.applicant"
                    placeholder="申请人手机"
                  ></el-input>
                  <el-date-picker
                    :clearable="false"
                    value-format="yyyy-MM-dd"
                    v-model="selectInput.applyDate"
                    placeholder="申请日期"
                  ></el-date-picker>
                </div>
                <div style="margin-top: 10px;">
                  <el-input
                    style="width: 220px; margin-right: 20px"
                    v-model="selectInput.approver"
                    placeholder="审批人"
                  ></el-input>
                  <el-select
                    style="width: 220px; margin-right: 20px"
                    v-model="selectInput.approvalState"
                    placeholder="审批状态"
                  >
                    <el-option
                      v-for="item in approvalStateOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                  <el-date-picker
                    :clearable="false"
                    value-format="yyyy-MM-dd"
                    style="margin-right: 20px"
                    v-model="selectInput.approvalDate"
                    placeholder="审批日期"
                  ></el-date-picker>
                  <el-button type="primary" @click="selectApplication"
                    >查询</el-button
                  >
                </div>
              </div>
              <div style="margin-top: 10px; margin-bottom: 10px">
                操作：
                <el-button
                  type="primary"
                  @click="showUpdateApplication"
                  :disabled="isSelectRow()"
                  >修改申请信息</el-button
                >
                <el-button
                  type="primary"
                  @click="deleteApplication"
                  :disabled="isSelectRow()"
                  >删除申请</el-button
                >
                <el-button @click="reset">重置</el-button>
              </div>
              <div style="margin-bottom: 10px">
                审批：
                <el-button type="primary" @click="approvalPass" :disabled="approvable()">通过</el-button>
                <el-button type="primary" @click="approvalFail" :disabled="approvable()">不通过</el-button>
              </div>
              <!-- 表格 -->
              <el-table
                :data="applicationTable"
                highlight-current-row
                @current-change="handleRowChange"
              >
                <el-table-column prop="id" label="编号"></el-table-column>
                <el-table-column
                  prop="applicant"
                  label="申请人"
                ></el-table-column>
                <el-table-column
                  prop="applyDate"
                  label="申请日期"
                ></el-table-column>
                <el-table-column
                  prop="applyNum"
                  label="申请数量"
                >
                  <template slot-scope="scope">
                    <el-popover trigger="click">
                      <el-table :data="ticketTable">
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
                      <el-tag slot="reference" size="medium">{{ scope.row.applyNum }}</el-tag>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="applyReason"
                  label="申请原因"
                ></el-table-column>
                <el-table-column
                  prop="approver"
                  label="审批人"
                ></el-table-column>
                <el-table-column
                  prop="approvalState"
                  label="审批状态"
                ></el-table-column>
                <el-table-column
                  prop="approvalDate"
                  label="审批时间"
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
                  :total="applicationNum"
                >
                </el-pagination>
              </div>
            </el-tab-pane>
            <!-- 添加申请 -->
            <el-tab-pane label="添加申请">
              <el-form
                label-position="right"
                label-width="100px"
                :model="newApplicationForm"
                :rules="rules"
                ref="newApplicationRef"
              >
                <el-form-item
                  prop="applicant"
                  label="申请人手机"
                  style="width: 500px"
                >
                  <el-input
                    v-model="newApplicationForm.applicant"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  prop="applyDate"
                  label="申请日期"
                  style="width: 500px"
                >
                  <el-date-picker
                    :clearable="false"
                    value-format="yyyy-MM-dd"
                    v-model="newApplicationForm.applyDate"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item
                  prop="applyNum"
                  label="申请数量"
                  style="width: 500px"
                >
                  <el-input-number
                    v-model="newApplicationForm.applyNum"
                    :min="1"
                    :max="100"
                  ></el-input-number>
                </el-form-item>
                <el-form-item
                  prop="applyReason"
                  label="申请原因"
                  style="width: 500px"
                >
                  <el-input
                    type="textarea"
                    v-model="newApplicationForm.applyReason"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button @click="this.addApplication">确认</el-button>
                  <el-button @click="this.addApplicationReset">重置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </el-container>
    </el-container>
    <!-- 修改申请信息对话框 -->
    <el-dialog
      title="修改申请信息"
      :visible.sync="updateApplicationFormVisible"
    >
      <el-form
        label-position="top"
        :model="updateApplicationForm"
        :rules="rules"
        ref="updateApplicationRef"
      >
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="编号" prop="id">
              <el-input v-model="updateApplicationForm.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="申请日期" prop="applyDate">
              <el-date-picker
                :clearable="false"
                value-format="yyyy-MM-dd"
                v-model="updateApplicationForm.applyDate"
                :disabled="isPass"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="申请原因" prop="applyReason">
              <el-input type="textarea" v-model="updateApplicationForm.applyReason"></el-input>
            </el-form-item>
            <el-form-item label="审批状态" prop="approvalState">
              <el-select v-model="updateApplicationForm.approvalState" disabled>
                <el-option
                  v-for="item in approvalStateOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请人手机号" prop="applicant">
              <el-input v-model="updateApplicationForm.applicant"></el-input>
            </el-form-item>
            <el-form-item label="申请数量" prop="applyNum">
              <el-input-number
                v-model="updateApplicationForm.applyNum"
                :min="1"
                :max="100"
                :disabled="isPass"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="审批人手机号" prop="approver">
              <el-input v-model="updateApplicationForm.approver" disabled></el-input>
            </el-form-item>
            <el-form-item label="审批日期" prop="approvalDate">
              <el-date-picker
              :clearable="false"
              value-format="yyyy-MM-dd"
              v-model="updateApplicationForm.approvalDate"
              disabled
            ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button @click="this.updateApplication">确认</el-button>
          <el-button @click="this.updateApplicationReset">重置</el-button>
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
      applicationNum: 0,
      applicationTable: [],
      ticketTable: [],
      // 选择表格某行
      currentRow: null,
      // 查询
      selectInput: {
        id: '',
        applicant: '',
        applyDate: null,
        approver: '',
        approvalState: '',
        approvalDate: null
      },
      selectType: {
        id: -1,
        applicant: '',
        applyDate: null,
        applyNum: null,
        applyReason: null,
        approver: '',
        approvalState: '',
        approvalDate: null
      },
      approvalStateOption: [{
        value: '待审批',
        label: '待审批'
      }, {
        value: '通过',
        label: '通过'
      }, {
        value: '未通过',
        label: '未通过'
      }],
      // 添加申请
      newApplicationForm: {
        applicant: '',
        applyDate: '',
        applyNum: 1,
        applyReason: ''
      },
      // 修改申请
      updateApplicationForm: {},
      updateApplicationFormVisible: false,
      isPass: true,
      // 验证规则
      rules: {
        applicant: [
          { required: true, message: '申请人手机不能为空', trigger: 'blur' }
        ],
        applyDate: [
          { required: true, message: '申请日期不能为空', trigger: 'blur' }
        ],
        applyReason: [
          { required: true, message: '申请原因不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  async mounted () {
    this.phone = window.sessionStorage.getItem('phone')
    const { data: res } = await this.$http.post('/applications/page/select/' + this.currentPage + '/' + this.pageSize, this.selectType)
    for (const row of res.records) {
      if (row.approver === null) {
        row.approver = '无'
      }
      if (row.approvalDate === null) {
        row.approvalDate = '无'
      }
    }
    this.applicationTable = res.records
    this.applicationNum = res.total
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
      const { data: res } = await this.$http.post('/applications/page/select/' + this.currentPage + '/' + this.pageSize, this.selectType)
      for (const row of res.records) {
        if (row.approver === null) {
          row.approver = '无'
        }
        if (row.approvalDate === null) {
          row.approvalDate = '无'
        }
      }
      this.applicationTable = res.records
    },
    // 查询申请
    async selectApplication () {
      if (this.selectInput.id !== '') {
        this.selectType.id = Number(this.selectInput.id)
      } else {
        this.selectType.id = -1
      }
      this.selectType.applicant = this.selectInput.applicant
      this.selectType.applyDate = this.selectInput.applyDate
      this.selectType.approver = this.selectInput.approver
      this.selectType.approvalState = this.selectInput.approvalState
      this.selectType.approvalDate = this.selectInput.approvalDate
      this.currentPage = 1
      const { data: res } = await this.$http.post('/applications/page/select/' + this.currentPage + '/' + this.pageSize, this.selectType)
      for (const row of res.records) {
        if (row.approver === null) {
          row.approver = '无'
        }
        if (row.approvalDate === null) {
          row.approvalDate = '无'
        }
      }
      this.applicationTable = res.records
      this.applicationNum = res.total
    },
    async reset () {
      this.selectType.id = -1
      this.selectType.applicant = ''
      this.selectType.applyDate = null
      this.selectType.approver = ''
      this.selectType.approvalState = ''
      this.selectType.approvalDate = null

      this.selectInput.id = ''
      this.selectInput.applicant = ''
      this.selectInput.applyDate = null
      this.selectInput.approver = ''
      this.selectInput.approvalState = ''
      this.selectInput.approvalDate = null

      this.isPass = true

      const { data: res } = await this.$http.post('/applications/page/select/' + this.currentPage + '/' + this.pageSize, this.selectType)
      for (const row of res.records) {
        if (row.approver === null) {
          row.approver = '无'
        }
        if (row.approvalDate === null) {
          row.approvalDate = '无'
        }
      }
      this.applicationTable = res.records
      this.applicationNum = res.total
    },
    // 添加申请
    addApplication () {
      this.$refs.newApplicationRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('/applications', this.newApplicationForm)
        if (res === true) {
          this.$message({
            message: '添加成功！',
            type: 'success'
          })
          this.addApplicationReset()
          this.reset()
        } else {
          this.$message({
            message: '添加失败，请重试！',
            type: 'error'
          })
        }
      })
    },
    addApplicationReset () {
      this.$refs.newApplicationRef.resetFields()
    },
    // 选择某一行
    async handleRowChange (row) {
      this.currentRow = row
      const { data: res } = await this.$http.get('/tickets/getByOrderId/' + this.currentRow.id)
      this.ticketTable = res
      for (const row of this.ticketTable) {
        if (row.useDate === null) {
          row.useDate = '无'
        }
      }
    },
    isSelectRow () {
      if (this.currentRow === null) return true
      else return false
    },
    approvable () {
      if (!this.isSelectRow()) {
        if (this.currentRow.approvalState === '待审批') {
          return false
        }
      }
      return true
    },
    // 修改用户信息
    showUpdateApplication () {
      this.updateApplicationFormVisible = true
      this.updateApplicationForm = JSON.parse(JSON.stringify(this.currentRow))
      if (this.updateApplicationForm.approvalState === '待审批') {
        this.isPass = false
      } else {
        this.isPass = true
      }
      if (this.updateApplicationForm.approvalDate === '无') {
        this.updateApplicationForm.approvalDate = null
      }
      if (this.updateApplicationForm.approver === '无') {
        this.updateApplicationForm.approver = null
      }
    },
    updateApplication () {
      this.$refs.updateApplicationRef.validate(async (valid) => {
        if (!valid) return
        if (this.updateApplicationForm.approver === '') {
          this.updateApplicationForm.approver = null
        }
        const { data: res } = await this.$http.put('/applications', this.updateApplicationForm)
        if (res === true) {
          this.$message({
            message: '修改成功！',
            type: 'success'
          })
          this.updateApplicationFormVisible = false
          this.updateApplicationForm = {}
          this.reset()
        } else {
          this.$message({
            message: '修改失败，请重试！',
            type: 'error'
          })
        }
      })
    },
    updateApplicationReset () {
      this.$refs.updateApplicationRef.resetFields()
    },
    // 删除用户
    async deleteApplication () {
      const { data: res } = await this.$http.delete('/applications/' + this.currentRow.id)
      if (res === true) {
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
        this.reset()
      } else {
        this.$message({
          message: '删除失败，请重试！',
          type: 'error'
        })
      }
    },
    // 审批
    formatterDate (date) {
      if (!date) {
        return ''
      }
      const year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      if (month < 10) {
        month = '0' + month
      }
      if (day < 10) {
        day = '0' + day
      }
      const nowDate = year + '-' + month + '-' + day
      return nowDate
    },
    async approvalPass () {
      this.updateApplicationForm = JSON.parse(JSON.stringify(this.currentRow))
      this.updateApplicationForm.approver = this.phone
      this.updateApplicationForm.approvalState = '通过'
      this.updateApplicationForm.approvalDate = this.formatterDate(new Date())
      const { data: res } = await this.$http.put('/approve/pass', this.updateApplicationForm)
      if (res === true) {
        this.$message({
          message: '成功！',
          type: 'success'
        })
        this.updateApplicationForm = {}
        this.reset()
      } else {
        this.$message({
          message: '失败，请重试！',
          type: 'error'
        })
      }
    },
    async approvalFail () {
      this.updateApplicationForm = JSON.parse(JSON.stringify(this.currentRow))
      this.updateApplicationForm.approver = this.phone
      this.updateApplicationForm.approvalState = '未通过'
      this.updateApplicationForm.approvalDate = this.formatterDate(new Date())
      const { data: res } = await this.$http.put('/approve/fail', this.updateApplicationForm)
      if (res === true) {
        this.$message({
          message: '成功！',
          type: 'success'
        })
        this.updateApplicationForm = {}
        this.reset()
      } else {
        this.$message({
          message: '失败，请重试！',
          type: 'error'
        })
      }
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
