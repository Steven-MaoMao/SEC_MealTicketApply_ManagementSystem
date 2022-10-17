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
            default-active="/user"
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
            <!-- 用户总览 -->
            <el-tab-pane label="用户总览">
              <!-- 操作栏 -->
              <div>
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
                <el-button type="primary" @click="selectUser">查询</el-button>
              </div>
              <div style="margin-top: 10px; margin-bottom: 10px">
                操作：
                <el-button
                  type="primary"
                  @click="showUpdateUser"
                  :disabled="isSelectRow()"
                  >修改用户信息</el-button
                >
                <el-button
                  type="primary"
                  @click="deleteUser"
                  :disabled="isSelectRow()"
                  >删除用户</el-button
                >
                <el-button
                  type="primary"
                  @click="resetPassword"
                  :disabled="isSelectRow()"
                  >重置密码</el-button
                >
                <el-button @click="reset">重置</el-button>
              </div>
              <!-- 表格 -->
              <el-table
                :data="userTable"
                highlight-current-row
                @current-change="handleRowChange"
              >
                <el-table-column prop="wno" label="工号"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="phone" label="电话"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="company" label="公司"></el-table-column>
                <el-table-column
                  prop="department"
                  label="部门"
                ></el-table-column>
                <el-table-column prop="role" label="角色"></el-table-column>
                <el-table-column prop="password" label="密码"></el-table-column>
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
                  :total="userNum"
                >
                </el-pagination>
              </div>
            </el-tab-pane>
            <!-- 添加用户 -->
            <el-tab-pane label="添加用户">
              <el-form
                label-position="right"
                label-width="60px"
                :model="newUserForm"
                :rules="rules"
                ref="newUserRef"
              >
                <el-row :gutter="50">
                  <el-col :span="12">
                    <el-form-item label="工号" prop="wno">
                      <el-input v-model="newUserForm.wno"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="phone">
                      <el-input v-model.number="newUserForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="公司" prop="company">
                      <el-input v-model="newUserForm.company"></el-input>
                    </el-form-item>
                    <el-form-item label="角色" prop="role">
                      <el-select v-model="newUserForm.role" placeholder="请选择">
                        <el-option
                          v-for="item in roleOption"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="姓名" prop="name">
                      <el-input v-model="newUserForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                      <el-input v-model="newUserForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="部门" prop="department">
                      <el-input v-model="newUserForm.department"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                      <el-input v-model="newUserForm.password" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item>
                  <el-button @click="this.addUser">确认</el-button>
                  <el-button @click="this.addUserReset">重置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </el-container>
    </el-container>
    <!-- 修改用户信息对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="updateUserFormVisible">
      <el-form
        label-position="right"
        label-width="60px"
        :model="updateUserForm"
        :rules="rules"
        ref="updateUserRef"
      >
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="工号" prop="wno">
              <el-input v-model="updateUserForm.wno" disabled></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="phone">
              <el-input v-model.number="updateUserForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="公司" prop="company">
              <el-input v-model="updateUserForm.company"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="role">
              <el-select v-model="updateUserForm.role" placeholder="请选择">
                <el-option
                  v-for="item in roleOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="updateUserForm.name"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="updateUserForm.email"></el-input>
            </el-form-item>
            <el-form-item label="部门" prop="department">
              <el-input v-model="updateUserForm.department"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="updateUserForm.password" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button @click="this.updateUser">确认</el-button>
          <el-button @click="this.updateUserReset">重置</el-button>
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
      userNum: 0,
      userTable: [],
      // 选择表格某行
      currentRow: null,
      // 查询用户
      selectInput: '',
      selectType: null,
      selectTypeOption: [{
        value: 'searchByWno',
        label: '通过工号搜索'
      }, {
        value: 'searchByName',
        label: '通过姓名搜索'
      }, {
        value: 'searchByPhone',
        label: '通过手机号搜索'
      }, {
        value: 'searchByEmail',
        label: '通过邮箱搜索'
      }, {
        value: 'searchByCompany',
        label: '通过公司搜索'
      }, {
        value: 'searchByDepartment',
        label: '通过部门搜索'
      }, {
        value: 'searchByRole',
        label: '通过角色搜索'
      }],
      // 添加用户
      newUserForm: {
        wno: '',
        name: '',
        phone: '',
        email: '',
        company: '',
        department: '',
        role: '',
        password: this.$md5('123456')
      },
      // 验证规则
      rules: {
        wno: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' }
        ],
        company: [
          { required: true, message: '公司不能为空', trigger: 'blur' }
        ],
        department: [
          { required: true, message: '部门不能为空', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择用户角色', trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      },
      roleOption: [{
        value: 'user',
        label: '一般用户'
      }, {
        value: 'manager',
        label: '审批人'
      }, {
        value: 'scanner',
        label: '食堂阿姨'
      }],
      // 修改用户信息
      updateUserFormVisible: false,
      updateUserForm: {}
    }
  },
  inject: [
    'reload'
  ],
  // 生命周期函数
  async mounted () {
    this.phone = window.sessionStorage.getItem('phone')
    const { data: res } = await this.$http.get('/users/page/' + this.currentPage + '/' + this.pageSize)
    this.userTable = res.records
    this.userNum = res.total
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
        const { data: res } = await this.$http.get('/users/page/' + this.currentPage + '/' + this.pageSize)
        this.userTable = res.records
      } else if (this.selectType === 'searchByWno') {
        const { data: res } = await this.$http.get('/users/pageByWno/' + this.selectInput + '/' + this.currentPage + '/' + this.pageSize)
        this.userTable = res.records
      } else if (this.selectType === 'searchByName') {
        const { data: res } = await this.$http.get('/users/pageByName/' + this.selectInput + '/' + this.currentPage + '/' + this.pageSize)
        this.userTable = res.records
      } else if (this.selectType === 'searchByPhone') {
        const { data: res } = await this.$http.get('/users/pageByPhone/' + this.selectInput + '/' + this.currentPage + '/' + this.pageSize)
        this.userTable = res.records
      } else if (this.selectType === 'searchByEmail') {
        const { data: res } = await this.$http.get('/users/pageByEmail/' + this.selectInput + '/' + this.currentPage + '/' + this.pageSize)
        this.userTable = res.records
      } else if (this.selectType === 'searchByCompany') {
        const { data: res } = await this.$http.get('/users/pageByCompany/' + this.selectInput + '/' + this.currentPage + '/' + this.pageSize)
        this.userTable = res.records
      } else if (this.selectType === 'searchByDepartment') {
        const { data: res } = await this.$http.get('/users/pageByDepartment/' + this.selectInput + '/' + this.currentPage + '/' + this.pageSize)
        this.userTable = res.records
      } else if (this.selectType === 'searchByRole') {
        const { data: res } = await this.$http.get('/users/pageByRole/' + this.selectInput + '/' + this.currentPage + '/' + this.pageSize)
        this.userTable = res.records
      }
    },
    // 添加新用户
    addUser () {
      this.$refs.newUserRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('/users', this.newUserForm)
        if (res === true) {
          this.$message({
            message: '添加成功！',
            type: 'success'
          })
          this.addUserReset()
          this.reset()
        } else {
          this.$message({
            message: '添加失败，请重试！',
            type: 'error'
          })
        }
      })
    },
    addUserReset () {
      this.$refs.newUserRef.resetFields()
    },
    // 选择某一行
    handleRowChange (row) {
      this.currentRow = row
    },
    isSelectRow () {
      if (this.currentRow === null) return true
      else return false
    },
    // 搜索用户
    async selectUser () {
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
      } else if (this.selectType === 'searchByWno') {
        this.currentPage = 1
        const { data: res } = await this.$http.get('/users/pageByWno/' + this.selectInput + '/' + this.currentPage + '/' + this.pageSize)
        this.userTable = res.records
        this.userNum = res.total
      } else if (this.selectType === 'searchByName') {
        this.currentPage = 1
        const { data: res } = await this.$http.get('/users/pageByName/' + this.selectInput + '/' + this.currentPage + '/' + this.pageSize)
        this.userTable = res.records
        this.userNum = res.total
      } else if (this.selectType === 'searchByPhone') {
        this.currentPage = 1
        const { data: res } = await this.$http.get('/users/pageByPhone/' + this.selectInput + '/' + this.currentPage + '/' + this.pageSize)
        this.userTable = res.records
        this.userNum = res.total
      } else if (this.selectType === 'searchByEmail') {
        this.currentPage = 1
        const { data: res } = await this.$http.get('/users/pageByEmail/' + this.selectInput + '/' + this.currentPage + '/' + this.pageSize)
        this.userTable = res.records
        this.userNum = res.total
      } else if (this.selectType === 'searchByCompany') {
        this.currentPage = 1
        const { data: res } = await this.$http.get('/users/pageByCompany/' + this.selectInput + '/' + this.currentPage + '/' + this.pageSize)
        this.userTable = res.records
        this.userNum = res.total
      } else if (this.selectType === 'searchByDepartment') {
        this.currentPage = 1
        const { data: res } = await this.$http.get('/users/pageByDepartment/' + this.selectInput + '/' + this.currentPage + '/' + this.pageSize)
        this.userTable = res.records
        this.userNum = res.total
      } else if (this.selectType === 'searchByRole') {
        this.currentPage = 1
        const { data: res } = await this.$http.get('/users/pageByRole/' + this.selectInput + '/' + this.currentPage + '/' + this.pageSize)
        this.userTable = res.records
        this.userNum = res.total
      }
    },
    // 重置
    async reset () {
      this.selectType = null
      this.selectInput = ''
      const { data: res } = await this.$http.get('/users/page/' + this.currentPage + '/' + this.pageSize)
      this.userTable = res.records
      this.userNum = res.total
    },
    // 修改用户信息
    showUpdateUser () {
      this.updateUserFormVisible = true
      this.updateUserForm = JSON.parse(JSON.stringify(this.currentRow))
    },
    updateUser () {
      this.$refs.updateUserRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put('/users/wno/' + this.updateUserForm.wno, this.updateUserForm)
        if (res === true) {
          this.$message({
            message: '修改成功！',
            type: 'success'
          })
          this.updateUserFormVisible = false
          this.updateUserForm = {}
          this.reset()
        } else {
          this.$message({
            message: '修改失败，请重试！',
            type: 'error'
          })
        }
      })
    },
    updateUserReset () {
      this.updateUserForm = JSON.parse(JSON.stringify(this.currentRow))
    },
    // 删除用户
    async deleteUser () {
      const { data: res } = await this.$http.delete('/users/wno/' + this.currentRow.wno)
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
    // 重置密码
    async resetPassword () {
      this.updateUserForm = this.currentRow
      this.updateUserForm.password = this.$md5('123456')
      const { data: res } = await this.$http.put('/users/wno/' + this.updateUserForm.wno, this.updateUserForm)
      if (res === true) {
        this.$message({
          message: '重置成功！',
          type: 'success'
        })
        this.updateUserFormVisible = false
        this.updateUserForm = {}
        this.reset()
      } else {
        this.$message({
          message: '重置失败，请重试！',
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
