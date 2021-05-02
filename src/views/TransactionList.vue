<template>
  <main class="transaction-list">
    <div class="grid-block">
      <input
        type="text"
        class="text-field text-field-root"
        placeholder="Search here..."
        v-model="searchInput"
      />
    </div>
    <div class="card-box list-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th class="base-line-title h-size-4 text-left pad-2">
              Transaction Id
            </th>
            <th class="base-line-title text-left pad-2">Name</th>
            <th class="base-line-title h-size-3 text-right pad-2">Amount</th>
            <th class="base-line-title h-size-4 text-right pad-2">Date</th>
          </tr>
        </thead>
        <tbody class="tbody">
          <tr
            class="list-item"
            v-for="(transaction, index) in filteredTransactionList"
            :key="index"
            @click="
              selectedTransaction = transaction;
              isRecordPaymentPopup = true;
            "
            tabindex="0"
          >
            <td class="base-line h-size-4 text-left pad-2-h pad-2-v">
              {{ transaction.data().created }}
            </td>
            <td class="base-line text-left pad-2-h pad-2-v">
              {{ showIds(transaction.data().ssyIds) }}
            </td>
            <td class="base-line h-size-3 text-right pad-2-h pad-2-v">
              {{ transaction.data().amount }}
            </td>
            <td class="base-line h-size-4 text-right pad-2-h pad-2-v">
              {{ transaction.data().date }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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
          Transaction Id: {{ selectedTransaction.data().created }}
        </p>
        <p class="title">
          Transaction Amount: {{ selectedTransaction.data().amount }}
        </p>
        <div
          v-for="member in selectedTransaction.data().ssyIds"
          :key="member.ssyId"
          class="gap-2 title"
        >
          <span> {{ member.ssyId }} : {{ member.amount }}</span>
        </div>
        <p class="title">Remarks:</p>
        <p class="title">{{ selectedTransaction.data().remarks }}</p>
        <div class="grid-block-sb gap-1">
          <button class="button button-acent" @click="revertTransaction">
            Revert Transaction
          </button>
        </div>
      </div>
    </aside>
  </main>
</template>

<script>
import { fs } from '../firebase/firebaseinit'
import { checkForAvailableId, showIds } from '../utils/helper'
export default {
  name: 'Transactions',
  data () {
    return {
      transactionList: [],
      searchInput: '',
      selectedTransaction: {},
      isRecordPaymentPopup: false,
      showIds
    }
  },
  computed: {
    filteredTransactionList () {
      return this.transactionList.filter((transaction) => {
        return (
          transaction.data().ssyIds &&
          checkForAvailableId(transaction.data().ssyIds, this.searchInput)
        )
      })
    }
  },
  methods: {
    closeOverlay () {
      this.isRecordPaymentPopup = false
      this.selectedTransaction = {}
    },
    revertTransaction () {
      this.$store.commit('setShowLoading', true)
      const batch = fs.batch()
      const transaction = fs
        .collection('transaction')
        .doc(this.selectedTransaction.id)
      this.selectedTransaction.data().ssyIds.forEach((el) => {
        const member = fs.collection('member').doc(el.ssyId)
        member
          .get()
          .then((doc) => {
            batch.update(member, {
              balance: Number(doc.data().balance) - Number(el.amount)
            })
            if (
              doc.data().ssyId ===
              this.selectedTransaction.data().ssyIds[
                this.selectedTransaction.data().ssyIds.length - 1
              ].ssyId
            ) {
              batch.delete(transaction)
              batch.commit().then(() => {
                this.closeOverlay()
                this.$store.commit('setShowLoading', false)
              })
            }
          })
      })
    }
  },
  beforeCreate () {
    this.$store.commit('setShowLoading', true)
    fs.collection('transaction')
      .orderBy('created', 'desc')
      .onSnapshot((snapshot) => {
        const retrivedData = []
        snapshot.docs.forEach((element) => {
          retrivedData.push(element)
        })
        this.transactionList = retrivedData
        if (!(this.isRecordPaymentPopup)) {
          this.$store.commit('setShowLoading', false)
        }
      })
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.transaction-list {
  padding: 5px 15vw 0px 15vw;
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
