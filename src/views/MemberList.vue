<template>
  <main class="member-list">
    <div class="grid-block">
      <input type="text" class="text-field text-field-root" placeholder="Search here..." v-model="searchInput" />
    </div>
    <div class="grid-block-sb pad-2-v-t">
      <h3 class="title">SSY Id : Name</h3>
      <h3 class="title">Balance</h3>
    </div>
    <div class="list-wrapper card-box">
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
    <div class="grid-block-sb pad-2-v">
      <div>
        <button
          class="button button-blue space-1-right"
          @click="openRecordPaymentPopup"
          v-if="disableButtons"
        >Record Payment</button>
        <button
          class="button button-acent space-1-right"
          @click="goToUpdateMember"
          v-if="disableButtons"
        >Update Member Details</button>
      </div>
      <button
        class="button button-blue"
        @click="openDeadDeclarationPopup"
        v-if="disableButtons"
      >Initiate Benefits</button>
    </div>
    <aside class="overlay" v-if="isDeadDeclarePopup || isRecordPaymentPopup">
      <div v-if="isRecordPaymentPopup" class="card-box overlay-box">
        <div class="grid-block-sb">
          <h3 class="title gap-3-bottom">Record Payment</h3>
          <i class="fas fa-times-circle pad-1-v-t icon-image" @click="closeOverlay"></i>
        </div>
        <p class="title pad-1-v-t">{{ selectedMember.ssyId }}</p>
        <p class="title pad-1-v">{{ selectedMember.name }}</p>
        <p class="title">Current balance: {{ selectedMember.balance }}</p>
        <div class="grid-block gap-2">
          <input
            type="number"
            class="text-field"
            placeholder="enter amount"
            v-model="paymentAmount"
          />
        </div>
        <div class="grid-block-sb gap-2-bottom">
          <button class="button button-acent" @click="recordPayment">Record</button>
        </div>
      </div>
      <div v-if="isDeadDeclarePopup" class="card-box overlay-box">
        <h3 class="title gap-3-bottom">Initiate Benefits</h3>
        <p class="title pad-1-v-t">{{ selectedMember.ssyId }}</p>
        <p class="title pad-1-v">{{ selectedMember.name }}</p>
        <p class="title">Current balance: {{ selectedMember.balance }}</p>
        <div class="grid-block-sb gap-2">
          <button class="button button-acent" @click="declareDeath">Initiate</button>
        </div>
      </div>
    </aside>
  </main>
</template>

<script>
import { fs } from '../firebase/firebaseinit'

export default {
  name: 'MemberList',
  data () {
    return {
      memberList: [],
      searchInput: '',
      isDeadDeclarePopup: false,
      isRecordPaymentPopup: false,
      selectedMember: {},
      paymentAmount: ''
    }
  },
  computed: {
    filteredMemberList () {
      return this.memberList.filter(member => {
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
    memberSelected (member) {
      this.selectedMember = member
    },
    closeOverlay () {
      this.isDeadDeclarePopup = false
      this.isRecordPaymentPopup = false
      this.selectedMember = {}
    },
    openRecordPaymentPopup () {
      if (Object.keys(this.selectedMember).length > 0) {
        this.isRecordPaymentPopup = true
      }
    },
    openDeadDeclarationPopup () {
      if (Object.keys(this.selectedMember).length > 0) {
        this.isDeadDeclarePopup = true
      }
    },
    recordPayment () {
      fs.collection('member')
        .doc(this.selectedMember.ssyId)
        .update({
          balance:
            Number(this.selectedMember.balance) + Number(this.paymentAmount)
        }).then(() => {
          const today = new Date()
          const date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()
          fs.collection('transaction')
            .add({
              ssyId: this.selectedMember.ssyId,
              name: this.selectedMember.name,
              amount: this.paymentAmount,
              date: date,
              created: today.getTime()
            }).then(() => {
              this.closeOverlay()
            })
        })
    },
    declareDeath () {
      fs.collection('member')
        .doc(this.selectedMember.ssyId)
        .update({
          isDead: true
        })
        .then(() => {
          const batch = fs.batch()
          fs.collection('member')
            .get()
            .then(docs => {
              docs.forEach(doc => {
                const ref = fs.collection('member').doc(doc.data().ssyId)
                if (!doc.data().isDead) {
                  batch.update(ref, {
                    balance: Number(doc.data().balance) - 100
                  })
                }
              })
              return batch.commit().then(() => {
                this.closeOverlay()
              })
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
      .onSnapshot(snapshot => {
        const retrivedData = []
        snapshot.docs.forEach(element => {
          if (!element.data().isDead) {
            retrivedData.push(element.data())
          }
        })
        this.memberList = retrivedData
        this.$store.commit('setShowLoading', false)
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
  height: 70vh;
  overflow-y: scroll;
}

.list-item:hover {
  background-color: $color-support;
  color: white;
  cursor: pointer;
}
.list-item:focus {
  background-color: $color-support;
  color: white;
  cursor: pointer;
  outline: none;
}
</style>
