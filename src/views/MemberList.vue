<template>
  <main class="member-list">
    <div class="grid-block">
      <el-input
        placeholder="Search here..."
        style="width:100%; margin: 5px 0;"
        v-model="searchInput"
        clearable
      >
      </el-input>
    </div>
    <el-table
      v-if="filteredMemberList.length"
      :data="filteredMemberList"
      style="width: 100%"
      height="75vh"
      show-summary
      :summary-method="getSummaries"
      >
      <el-table-column
        prop="ssyId"
        label="SSY Id"
        sortable
        width="120">
      </el-table-column>
      <el-table-column
        prop="name"
        label="Name"
        :sortable="true"
        :sort-method="(a, b) => a.name.localeCompare(b.name)"
        >
      </el-table-column>
      <el-table-column
        prop="balance"
        label="Balance"
        sortable
        width="120"
        align="right"
        >
      </el-table-column>
      <el-table-column
        label="Operations"
        align="right">
        <template slot-scope="scope">
          <el-button @click="initiateBenefits(scope.row)" type="text" size="small">Initiate Benefits</el-button>
          <el-button type="text" size="small">Edit</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="grid-block-sb pad-2-v">
      <div>
        <el-button
          type="primary"
          plain
          @click="recordPaymentDrawer = true"
        >Record Payment</el-button>
      </div>
      <button class="button button-blue" @click="exportData">
        Export Data
      </button>
    </div>
    <el-drawer
      title="Record new payment"
      :visible.sync="recordPaymentDrawer"
      size="84%"
    >
      <div class="drawer-content">
        <el-row>
          <el-col :span="11">
            <div class="grid-block">
              <el-input
                placeholder="Search here..."
                style="width: 100%; margin: 5px 0;"
                v-model="searchInput"
                clearable
              >
              </el-input>
            </div>
            <el-table
              v-if="filteredMemberList.length"
              :data="filteredMemberList"
              style="width: 100%"
              height="45vh"
              @row-click="addPaymentMember"
            >
              <el-table-column
                prop="ssyId"
                label="SSY Id"
                sortable
              >
              </el-table-column>
              <el-table-column
                prop="name"
                label="Name"
                :sortable="true"
                :sort-method="(a, b) => a.name.localeCompare(b.name)"
                >
              </el-table-column>
            </el-table>
            <div class="pad-1-v-t" style="display: flex; width: 100%; justify-content:space-between;">
              <div style="color: #909399;">
                <i class="el-icon-info"></i>
                <span class="pad-1-h"> Click on any row to select a member for payment </span>
              </div>
              <span style="color: #67C23A;">
                Total Amount: {{ recordPaymentTotalAmount }}
              </span>
            </div>
            <div class="pad-2-v" v-show="recordPayment.members.length">
              <div class="pad-2-v">
                <el-input
                  type="textarea"
                  :rows="4"
                  placeholder="Please input your remarks"
                  v-model="recordPayment.remarks">
                </el-input>
              </div>
              <div class="pad-2-v">
                <el-select v-model="recordPayment.paymentMethod" placeholder="Select payment mode">
                  <el-option
                    v-for="item in paymentMethods"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
                <el-date-picker
                  v-model="recordPayment.date"
                  type="date"
                  placeholder="Payment date"
                  format="dd-MM-yyyy"
                  class="space-2-left">
                </el-date-picker>
              </div>
              <div class="pad-2-v">
                <el-button
                  type="primary"
                  :loading="recordPaymentLoading"
                  :disabled="disableRecordPaymentButton"
                  @click="savePaymentRecord"
                >Record Payment</el-button>
                <el-button
                  type="danger"
                  plain
                  @click="clearPaymentMembers"
                >Clear Selection</el-button>
              </div>
            </div>
          </el-col>
          <el-col :span="12" class="payment-memebrs-list border-left">
            <el-row class="gap-2-top"
                v-for="member in recordPayment.members"
                :key="member.ssyId"
                style="display: flex; align-items: center; width: 100%"
              >
                <el-col :span="15">
                  <span> {{member.ssyId}} : {{member.name}} </span>
                </el-col>
                <el-col :span="5">
                  <el-input size="mini" v-model="member.amount"></el-input>
                </el-col>
                <el-col :span="3" :offset="1">
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    tabindex="-1"
                    size="mini"
                    @click="removePaymentMember(member)"
                  ></el-button>
                </el-col>
              </el-row>
          </el-col>
        </el-row>
      </div>
    </el-drawer>
    <el-drawer
      title="Initiate Benefits"
      :visible.sync="initiateBenefitsDrawer"
      :before-close="clearInitiateBenefits"
    >
      <div class="drawer-content">
        <el-descriptions title="Details of Beneficiary" border :column="1">
          <el-descriptions-item label="SSYId"> {{ benefit.member.ssyId }} </el-descriptions-item>
          <el-descriptions-item label="Name"> {{ benefit.member.name }} </el-descriptions-item>
        </el-descriptions>
        <div class="gap-1" style="color: #909399; font-size: 12px;">
          <i class="el-icon-info"></i>
          <span class="pad-1-h"> Benefits calculated automatically, update if not correct! </span>
        </div>
        <div class="gap-3">
          <el-form class="initiate-benefit" label-width="160px" size="medium">
            <el-form-item label="Total Benefit">
              <el-input v-model="benefit.totalBenefit" @input="updateBenefitsValues(benefit.totalBenefit)"></el-input>
            </el-form-item>
            <el-form-item :label="`Corpus Fund ( ${benefit.corpusFundPercentage}% )`">
              <el-input v-model="benefit.corpusFund" disabled></el-input>
            </el-form-item>
            <el-form-item label="Pending Balance">
              <el-input v-model="benefit.pendingBalance" disabled></el-input>
            </el-form-item>
            <el-form-item label="Net Benefit">
              <el-input v-model="benefit.netBenefit" disabled></el-input>
            </el-form-item>
            <el-form-item label="Benefit Date">
              <el-date-picker
                  v-model="benefit.date"
                  type="date"
                  placeholder="Benefit Date"
                  format="dd-MM-yyyy"
                  style="width: 100%"
                  >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="Remarks">
              <el-input
                  type="textarea"
                  :rows="4"
                  placeholder="Please input your remarks"
                  v-model="benefit.remarks">
                </el-input>
            </el-form-item>
            <div class="gap-2" style="color: #67C23A; font-size: 16px; text-align: center;">
              <i class="el-icon-info"></i>
              <span class="pad-1-h"> Amount to be paid : Rs.{{ benefit.netBenefit }} </span>
            </div>
            <div class="gap-3" style="text-align: center;">
              <el-button
                type="primary"
                :loading="initiateBenefitsLoading"
                :disabled="disableInitiateBenfitsButton"
                @click="saveInitiateBenefitRecord"
              >Initiate Benefits</el-button>
              <el-button type="danger" @click="clearInitiateBenefits" plain> Cancel </el-button>
            </div>
          </el-form>
        </div>
      </div>
    </el-drawer>
  </main>
</template>

<script>
import { deepCopy, getMemberHeaders, getMemberKeys } from '../utils/helper'
import { calculateBenefitValues, checkMemberAlreadyPresentInList, totalBenefits, updateAmount } from '@/utils/memberListHelper'
import { CONTRIBUTION_AMOUNT, CORPUSFUND_PERECENTAGE, PAYMENT_METHODS } from '@/constant/constant'

export default {
  name: 'MemberList',
  data () {
    return {
      memberList: [],
      searchInput: '',
      recordPaymentDrawer: false,
      recordPaymentLoading: false,
      recordPayment: {
        members: [],
        paymentMethod: '',
        remarks: '',
        date: ''
      },
      initiateBenefitsDrawer: false,
      initiateBenefitsLoading: false,
      benefit: {
        member: {},
        totalBenefit: 0,
        corpusFund: 0,
        netBenefit: 0,
        pendingBalance: 0,
        contributionAmount: CONTRIBUTION_AMOUNT,
        corpusFundPercentage: CORPUSFUND_PERECENTAGE,
        remarks: '',
        date: ''
      },
      isDeadDeclarePopup: false,
      paymentAmount: 0,
      paymentMethods: PAYMENT_METHODS
    }
  },
  computed: {
    filteredMemberList () {
      return this.memberList.filter((member) => {
        return (
          member.name.toUpperCase().indexOf(this.searchInput.toUpperCase()) >
            -1 ||
          member.ssyId.toUpperCase().indexOf(this.searchInput.toUpperCase()) >
            -1
        )
      })
    },
    disableRecordPaymentButton () {
      let result = false
      this.recordPayment.members.forEach(el => {
        if (!el.amount) {
          result = true
        }
      })
      if (!(this.recordPayment.paymentMethod &&
        this.recordPayment.remarks && this.recordPayment.date)) {
        result = true
      }
      return result
    },
    disableInitiateBenfitsButton () {
      return !(this.benefit.totalBenefit && this.benefit.remarks && this.benefit.date)
    },
    storedMemberList () {
      return this.$store.getters.getMemberList
    },
    recordPaymentTotalAmount () {
      let total = 0
      this.recordPayment.members.forEach(member => {
        if (!isNaN(member.amount)) {
          total += Number(member.amount)
        }
      })
      return total
    }

  },
  watch: {
    storedMemberList (newValue) {
      this.memberList = newValue.filter(item => !item.isDead && item.isActive)
    }
  },
  methods: {
    exportData () {
      this.$store.commit('setShowLoading', true)
      const memberArray = this.memberList.map((el) => {
        const values = []
        getMemberKeys().forEach((key) => {
          if (key === 'address') {
            values.push(`"${el[key]}"`)
          } else {
            values.push(el[key])
          }
        })
        return values
      })
      memberArray.sort((a, b) => a[0].localeCompare(b[0]))
      memberArray.unshift(getMemberHeaders())
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        memberArray.map((e) => e.join(',')).join('\n')
      var encodedUri = encodeURI(csvContent)
      window.open(encodedUri)
      this.$store.commit('setShowLoading', false)
    },
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = 'Total Amount:'
        } else if (index === 2) {
          const values = data.map(item => Number(item[column.property]))
          if (values.length) {
            sums[index] = `Rs. ${values.reduce((prev, curr) => prev + curr)}`
          } else {
            sums[index] = ''
          }
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    addPaymentMember (member) {
      if (!checkMemberAlreadyPresentInList(this.recordPayment.members, member.ssyId)) {
        this.recordPayment.members.push(updateAmount(member, deepCopy(member)))
      } else {
        this.$notify({
          title: `${member.ssyId} already added`,
          message: `${member.ssyId} : ${member.name} is already present in the selected list`,
          type: 'warning'
        })
      }
    },
    removePaymentMember (member) {
      this.recordPayment.members = this.recordPayment.members.filter(el => el.ssyId !== member.ssyId)
    },
    clearPaymentMembers () {
      this.searchInput = ''
      this.recordPayment.members = []
      this.recordPayment.date = ''
      this.recordPayment.paymentMethod = ''
      this.recordPayment.remarks = ''
    },
    getMemberList () {
      this.$store.commit('setShowLoading', true)
      this.$store.dispatch('fetchAllMembers')
    },
    savePaymentRecord () {
      this.recordPaymentLoading = true
      this.$store.dispatch('recordPayment', {
        recordPayment: this.recordPayment,
        callback: this.stopRecordPaymentLoading
      })
    },
    stopRecordPaymentLoading () {
      this.recordPaymentLoading = false
      this.recordPaymentDrawer = false
      this.clearPaymentMembers()
      this.$notify({
        title: 'Success',
        message: 'Payment recorded successfully!',
        type: 'success'
      })
    },
    initiateBenefits (member) {
      this.benefit.member = member
      this.updateBenefitsValues(totalBenefits(this.storedMemberList, this.benefit))
      this.initiateBenefitsDrawer = true
    },
    updateBenefitsValues (totalBenefit) {
      const values = calculateBenefitValues(totalBenefit, this.benefit)
      this.benefit.totalBenefit = values.totalBenefit
      this.benefit.corpusFund = values.corpusFund
      this.benefit.pendingBalance = values.pendingBalance
      this.benefit.netBenefit = values.netBenefit
    },
    clearInitiateBenefits () {
      this.initiateBenefitsDrawer = false
      this.benefit = {
        member: {},
        totalBenefit: 0,
        corpusFund: 0,
        netBenefit: 0,
        pendingBalance: 0,
        contributionAmount: CONTRIBUTION_AMOUNT,
        corpusFundPercentage: CORPUSFUND_PERECENTAGE,
        remarks: '',
        date: ''
      }
    },
    saveInitiateBenefitRecord () {
      this.initiateBenefitsLoading = true
      this.$store.dispatch('initiateBenefit', {
        benefit: this.benefit,
        callback: this.stopInitiateBenefitLoading
      })
    },
    stopInitiateBenefitLoading () {
      this.initiateBenefitsLoading = false
      this.clearInitiateBenefits()
      this.$notify({
        title: 'Success',
        message: 'Benefits initiated successfully!',
        type: 'success'
      })
    }
  },
  created () {
    this.getMemberList()
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.member-list {
  padding: 5px 15vw 40px 15vw;
}

.drawer-content {
  margin: 0 20px;
}

.border-left {
  border-left: 2px dashed rgba(0, 0, 0, 0.4);
  padding-left: 20px;
  margin-left: 20px;
}

.payment-memebrs-list {
  height: 90vh;
  overflow-y: auto;
}

/deep/ .initiate-benefit .el-input .el-input__inner {
  text-align: right;
}
</style>
