<template>
  <main class="member-list">
    <div class="grid-block">
      <input
        type="text"
        class="text-field text-field-root"
        placeholder="Search here..."
        v-model="searchInput"
      />
    </div>
    <div class="list-wrapper card-box">
      <div class="grid-block-sb pad-2-v base-line-title table-title">
        <h3 class="title pad-1-h">SSY Id : Name</h3>
        <h3 class="title pad-1-h">Balance</h3>
      </div>
      <div class="list-items">
        <div
          class="grid-block-sb base-line pad-2 list-item"
          v-for="member in filteredMemberList"
          :key="member.ssyId"
          tabindex="1"
          @click="memberSelected(member)"
        >
          <span>{{ member.ssyId }} : {{ member.name }}</span>
          <span>{{ member.balance }}</span>
        </div>
      </div>
    </div>
    <div class="grid-block-sb pad-2-v">
      <div>
        <button
          class="button button-blue space-1-right"
          @click="openRecordPaymentPopup"
        >
          Record Payment
        </button>
        <button
          class="button button-acent space-1-right"
          @click="goToUpdateMember"
          v-if="disableButtons"
        >
          Update Member Details
        </button>
        <button
          class="button button-blue"
          @click="openDeadDeclarationPopup"
          v-if="disableButtons"
        >
          Initiate Benefits
        </button>
      </div>
      <button
          class="button button-blue"
          @click="exportData"
        >
          Export Data
        </button>
    </div>
    <aside class="overlay" v-if="isDeadDeclarePopup || isRecordPaymentPopup">
      <div
        v-if="isRecordPaymentPopup"
        class="card-box overlay-box"
        style="width: 40vw"
      >
        <div class="grid-block-sb">
          <h3 class="title gap-3-bottom">Record Payment</h3>
          <i
            class="fas fa-times-circle pad-1-v-t icon-image"
            @click="closeOverlay"
          ></i>
        </div>
        <div class="grid-block">
          <input
            type="text"
            class="text-field text-field-root"
            placeholder="Search here..."
            v-model="searchInput"
          />
        </div>
        <div class="list-wrapper card-box">
          <div class="grid-block-sb pad-2-v base-line-title table-title">
            <h3 class="title pad-1-h">SSY Id</h3>
            <h3 class="title pad-1-h">Balance</h3>
          </div>
          <div class="list-items">
            <div
              class="grid-block-sb base-line pad-2 list-item"
              v-for="member in filteredMemberList"
              :key="member.ssyId"
              tabindex="1"
              @click="paymentMemberSelected(member)"
            >
              <span>{{ member.ssyId }}</span>
              <span>{{ member.balance }}</span>
            </div>
          </div>
        </div>
        <div class="grid-block gap-2">
          <span> Total : </span>
          <input
            type="number"
            class="space-1"
            v-model="paymentAmount"
            @input="updatePaymentAmount"
          />
        </div>
        <div v-for="member in paymentMembers" :key="member.ssyId" class="gap-2">
          <span> {{ member.ssyId }} : </span>
          <input type="number" v-model="member.amount" />
        </div>
        <div class="grid-block gap-2">
          <textarea
            placeholder="Remarks"
            class="text-field"
            rows="6"
            v-model="remarks"
          ></textarea>
        </div>
        <div class="grid-block-sb gap-2-bottom">
          <button class="button button-acent" @click="recordPayment">
            Record
          </button>
        </div>
      </div>
      <div v-if="isDeadDeclarePopup" class="card-box overlay-box">
        <div class="grid-block-sb">
          <h3 class="title gap-3-bottom">Initiate Benefits</h3>
          <i
            class="fas fa-times-circle pad-1-v-t icon-image"
            @click="closeOverlay"
          ></i>
        </div>
        <p class="title pad-1-v-t">{{ selectedMember.ssyId }}</p>
        <p class="title pad-1-v">{{ selectedMember.name }}</p>
        <p class="title">Current balance: {{ selectedMember.balance }}</p>
        <div class="grid-block-sb gap-2">
          <button class="button button-acent" @click="declareDeath">
            Initiate
          </button>
        </div>
      </div>
    </aside>
  </main>
</template>

<script>
import { fs } from '../firebase/firebaseinit'
import { generateDate, getMemberHeaders, getMemberKeys } from '../utils/helper'

export default {
  name: 'MemberList',
  data () {
    return {
      memberList: [],
      searchInput: '',
      isDeadDeclarePopup: false,
      isRecordPaymentPopup: false,
      selectedMember: {},
      paymentAmount: 0,
      remarks: '',
      paymentMembers: []
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
    disableButtons () {
      return this.selectedMember.ssyId
    }
  },
  methods: {
    exportData () {
      this.$store.commit('setShowLoading', true)
      const memberArray = this.memberList.map(el => {
        const values = []
        getMemberKeys().forEach(key => {
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
      const csvContent = 'data:text/csv;charset=utf-8,' + memberArray.map(e => e.join(',')).join('\n')
      var encodedUri = encodeURI(csvContent)
      window.open(encodedUri)
      this.$store.commit('setShowLoading', false)
    },
    updatePaymentAmount () {
      this.paymentMembers.forEach((el) => {
        el.amount = this.paymentAmount / this.paymentMembers.length
      })
    },
    paymentMemberSelected (member) {
      let result = true
      this.paymentMembers.forEach((el) => {
        if (el.ssyId === member.ssyId) {
          result = false
        }
      })
      if (result) {
        this.paymentMembers.push(member)
      }
    },
    memberSelected (member) {
      this.selectedMember = member
    },
    closeOverlay () {
      this.isDeadDeclarePopup = false
      this.isRecordPaymentPopup = false
      this.selectedMember = {}
      this.paymentMembers = []
      this.paymentAmount = 0
    },
    openRecordPaymentPopup () {
      this.isRecordPaymentPopup = true
    },
    openDeadDeclarationPopup () {
      if (Object.keys(this.selectedMember).length > 0) {
        this.isDeadDeclarePopup = true
      }
    },
    recordPayment () {
      if (this.paymentAmount) {
        this.$store.commit('setShowLoading', true)
        const batch = fs.batch()
        this.paymentMembers.forEach((paymentMember) => {
          const member = fs.collection('member').doc(paymentMember.ssyId)
          batch.update(member, {
            balance:
              Number(paymentMember.balance) + Number(paymentMember.amount)
          })
        })
        const transaction = fs.collection('transaction').doc()
        const date = generateDate()
        batch.set(transaction, {
          ssyIds: this.paymentMembers.map((el) => {
            return {
              ssyId: el.ssyId,
              amount: el.amount
            }
          }),
          amount: this.paymentAmount,
          date,
          created: new Date().getTime(),
          remarks: this.remarks
        })
        batch.commit().then(() => {
          this.closeOverlay()
          this.$store.commit('setShowLoading', false)
        })
      }
    },
    declareDeath () {
      this.$store.commit('setShowLoading', true)
      fs.collection('member')
        .doc(this.selectedMember.ssyId)
        .update({
          isDead: true,
          balance: 0
        })
        .then(() => {
          this.updateBalances()
        })
    },
    updateBalances () {
      fs.collection('member')
        .where('isDead', '==', false)
        .where('isActive', '==', true)
        .get()
        .then((querySnapshot) => {
          const batch = fs.batch()
          querySnapshot.forEach((doc) => {
            batch.update(doc.ref, {
              balance: Number(doc.data().balance) - 100
            })
          })
          batch.commit().then(() => {
            this.closeOverlay()
            this.$store.commit('setShowLoading', false)
          })
        })
    },
    goToUpdateMember () {
      this.$router.push({
        name: 'MemberUpdate',
        query: {
          ssyId: this.selectedMember.ssyId
        }
      })
    }
  },
  beforeCreate () {
    this.$store.commit('setShowLoading', true)
    fs.collection('member')
      .orderBy('balance')
      .onSnapshot((snapshot) => {
        const retrivedData = []
        snapshot.docs.forEach((element) => {
          if (!element.data().isDead && element.data().isActive) {
            retrivedData.push(element.data())
          }
        })
        this.memberList = retrivedData
        if (!(this.isDeadDeclarePopup || this.isRecordPaymentPopup)) {
          this.$store.commit('setShowLoading', false)
        }
      })
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.member-list {
  padding: 5px 15vw 40px 15vw;
}

.list-wrapper {
  position: relative;
  height: 78vh;
  overflow-y: scroll;
  padding: 0;
  border-radius: 4px;
}

.overlay .list-wrapper {
  height: 172px;
}

.list-items {
  margin-top: 52px;
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

.table-title {
  position: absolute;
  width: 100%;
}
</style>
