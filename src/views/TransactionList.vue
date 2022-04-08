<template>
  <main>
    <el-row class="gap-2-top">
      <el-col :span="18" :offset="1">
        <div class="grid-block">
          <el-input
            placeholder="Search here..."
            style="width:100%; margin: 5px 0;"
            v-model="searchInput"
            clearable
          >
          </el-input>
        </div>
        <div class="gap-1" style="color: #909399;">
          <i class="el-icon-info"></i>
          <span class="pad-1-h"> Click on any transaction to see further transaction details </span>
        </div>
        <el-table
          v-if="filteredTransactionList.length"
          :data="filteredTransactionList"
          height="78vh"
          style="width: 100%"
          @row-click="seeTransactionDetails"
          >
          <el-table-column
            prop="created"
            label="Transaction Id"
            width="180">
          </el-table-column>
          <el-table-column
            label="Member SSY Id(s)">
            <template slot-scope="scope">
              {{ showIds(scope.row.members) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="date"
            label="Date"
            width="120">
            <template slot-scope="scope">
              {{ getDateFromTime(scope.row.date) }}
            </template>
          </el-table-column>
          <el-table-column
            label="Type"
            align="left"
            width="150">
            <template slot-scope="scope">
              <el-tag size="mini"> {{ scope.row.type }} </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="amount"
            label="Amount"
            align="right"
            width="100">
          </el-table-column>
        </el-table>
        <aside class="overlay" v-if="isRecordPaymentPopup">
          <div v-if="isRecordPaymentPopup" class="card-box overlay-box">
            <div class="grid-block-sb">
              <h3 class="title gap-3-bottom">Transaction Details</h3>
              <i
                class="fas fa-times-circle pad-1-v-t icon-image"
                @click="closeOverlay"
              ></i>
            </div>
            <p class="title pad-1-v-t">
              Transaction Id: {{ selectedTransaction.created }}
            </p>
            <p class="title">
              Transaction Amount: {{ selectedTransaction.amount }}
            </p>
            <div
              v-for="member in selectedTransaction.members"
              :key="member.ssyId"
              class="gap-2 title"
            >
              <span> {{ member.ssyId }} : {{ member.amount }}</span>
            </div>
            <p class="title">Remarks:</p>
            <p class="title">{{ selectedTransaction.remarks }}</p>
            <div class="grid-block-sb gap-1">
              <button class="button button-acent" @click="revertTransaction">
                Revert Transaction
              </button>
            </div>
          </div>
        </aside>
      </el-col>
      <el-col :span="4" :offset="1"></el-col>
    </el-row>
    <el-drawer
      :with-header="false"
      :visible.sync="transactionDetailsDrawer"
      :before-close="clearSelectedTransaction"
      size="40%">
      <div class="drawer-content">
        <el-descriptions title="Transaction Details" :column="1" border>
          <el-descriptions-item label="TransactionId"> {{ selectedTransaction.created }} </el-descriptions-item>
          <el-descriptions-item label="Type">
            <el-tag size="small">{{ selectedTransaction.type }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Date"> {{ getDateFromTime(selectedTransaction.date) }} </el-descriptions-item>
          <el-descriptions-item label="Amount"> Rs.{{ selectedTransaction.amount }} </el-descriptions-item>
          <el-descriptions-item label="Remarks"> {{ selectedTransaction.remarks }} </el-descriptions-item>
        </el-descriptions>
        <el-descriptions
          class="gap-2-top"
          v-if="selectedTransaction.type === benefitType"
          title="Benefit Details"
          :column="1"
          border>
          <el-descriptions-item label="SSYId"> {{ selectedTransaction.members[0].ssyId }} </el-descriptions-item>
          <el-descriptions-item label="Name"> {{ selectedTransaction.members[0].name }} </el-descriptions-item>
          <el-descriptions-item label="Contribution Amount"> Rs.{{ selectedTransaction.contributionAmount }} </el-descriptions-item>
          <el-descriptions-item label="Total Benefit"> Rs.{{ selectedTransaction.totalBenefit }} </el-descriptions-item>
          <el-descriptions-item label="Corpus Fund">
            Rs.{{ selectedTransaction.corpusFund }} : ( {{ selectedTransaction.corpusFundPercentage }}% )
          </el-descriptions-item>
          <el-descriptions-item label="Cleared Balance"> Rs.{{ selectedTransaction.pendingBalance }} </el-descriptions-item>
          <el-descriptions-item label="Net Benefit"> Rs.{{ selectedTransaction.netBenefit }} </el-descriptions-item>
        </el-descriptions>
        <el-table
          :data="selectedTransaction.members"
          style="width: 100%"
          v-else
          >
          <el-table-column
            prop="ssyId"
            label="SSYId"
            width="100">
          </el-table-column>
          <el-table-column
            prop="name"
            label="Name">
          </el-table-column>
          <el-table-column
            prop="amount"
            label="Amount"
            width="100">
          </el-table-column>
        </el-table>
        <!-- <el-descriptions
          class="gap-2-top"
          v-if="selectedTransaction.type === memberPaymentType"
          title="Payee Member Details"
          :column="1"
          border>
          <div
            v-for="member in selectedTransaction.members"
            :key="member.ssyId"
            class="gap-1-top"
          >
            <el-descriptions-item label="SSYId"> {{ member.ssyId }} </el-descriptions-item>
            <el-descriptions-item label="Name"> {{ member.name }} </el-descriptions-item>
            <el-descriptions-item label="Amount"> Rs.{{ member.amount }} </el-descriptions-item>
          </div>
        </el-descriptions> -->
      </div>
    </el-drawer>
  </main>
</template>

<script>
import { checkForAvailableId, showIds, getDateFromTime } from '../utils/helper'
import { TRANSACTION_TYPE } from '@/constant/constant'
export default {
  name: 'Transactions',
  data () {
    return {
      transactionList: [],
      searchInput: '',
      selectedTransaction: {},
      transactionDetailsDrawer: false,
      isRecordPaymentPopup: false,
      showIds,
      getDateFromTime,
      benefitType: TRANSACTION_TYPE.BENEFIT,
      memberPaymentType: TRANSACTION_TYPE.MEMBER_PAYMENT
    }
  },
  computed: {
    filteredTransactionList () {
      if (this.searchInput) {
        return this.transactionList.filter((transaction) => {
          return (
            transaction.members &&
          checkForAvailableId(transaction.members, this.searchInput)
          )
        })
      }
      return this.transactionList
    },
    storedTransactionList () {
      return this.$store.getters.getTransactionList
    }
  },
  watch: {
    storedTransactionList (newValue) {
      this.transactionList = [].concat(newValue)
      this.transactionList.sort((a, b) => b.created - a.created)
    }
  },
  methods: {
    seeTransactionDetails (transaction) {
      this.transactionDetailsDrawer = true
      this.selectedTransaction = transaction
    },
    clearSelectedTransaction () {
      this.transactionDetailsDrawer = false
      this.selectedTransaction = {}
    }
  },
  beforeCreate () {
    this.$store.commit('setShowLoading', true)
    this.$store.dispatch('fetchAllTransactions')
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.transaction-list {
  padding: 5px 20vw 0px 5vw;
}

.drawer-content {
  margin: 10px 20px 0;
}

.list-wrapper {
  height: calc(78vh);
  overflow-y: scroll;
  padding: 0;
  border-radius: 0;
}

.list-item {
  height: 20px;
}

.list-item:hover {
  background-color: rgba($color: $color-support, $alpha: 0.3);
  cursor: pointer;
}
.list-item:focus {
  background-color: $color-support;
  color: white;
  cursor: pointer;
  outline: none;
}
</style>
