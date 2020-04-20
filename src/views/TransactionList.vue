<template>
  <main class="transaction-list">
    <div class="grid-block">
      <input type="text" class="text-field text-field-root" placeholder="Search here..." v-model="searchInput" />
    </div>
    <div class="card-box list-wrapper">
      <table class="table gap-2">
        <tr>
          <th class="base-line h-size-4 text-left pad-1-h">SSYId</th>
          <th class="base-line text-left pad-1-h">Name</th>
          <th class="base-line h-size-3 text-right pad-1-h">Amount</th>
          <th class="base-line h-size-4 text-right pad-1-h">Date</th>
        </tr>
        <tr
          class="list-item"
          v-for="transaction in filteredTransactionList"
          :key="transaction.data().created"
          @click="selectedTransaction = transaction"
          tabindex="0"
        >
          <td class="base-line h-size-4 text-left pad-1-h pad-2-v">{{ transaction.data().ssyId }}</td>
          <td class="base-line text-left pad-1-h pad-2-v">{{ transaction.data().name }}</td>
          <td class="base-line h-size-3 text-right pad-1-h pad-2-v">{{ transaction.data().amount }}</td>
          <td class="base-line h-size-4 text-right pad-1-h pad-2-v">{{ transaction.data().date }}</td>
        </tr>
      </table>
    </div>
    <div class="gap-2">
      <button class="button button-blue"
      @click="revertTransaction"
      v-if="disableButton">Revert Transaction</button>
    </div>
  </main>
</template>

<script>
import { fs } from '../firebase/firebaseinit'
export default {
  name: 'Transactions',
  data () {
    return {
      transactionList: [],
      searchInput: '',
      selectedTransaction: {}
    }
  },
  computed: {
    filteredTransactionList () {
      return this.transactionList.filter(transaction => {
        return (
          transaction
            .data()
            .name.toUpperCase()
            .indexOf(this.searchInput.toUpperCase()) > -1 ||
          transaction
            .data()
            .ssyId.toUpperCase()
            .indexOf(this.searchInput.toUpperCase()) > -1
        )
      })
    },
    disableButton () {
      return Object.keys(this.selectedTransaction).length
    }
  },
  methods: {
    revertTransaction () {
      fs.collection('transaction')
        .doc(this.selectedTransaction.id)
        .delete()
        .then(() => {
          const ref = fs.collection('member')
            .doc(this.selectedTransaction.data().ssyId)
          fs.runTransaction(t => {
            return t.get(ref)
              .then(doc => {
                const balance = Number(doc.data().balance) - Number(this.selectedTransaction.data().amount)
                t.update(ref, { balance: balance })
              })
          })
        })
    }
  },
  beforeCreate () {
    this.$store.commit('setShowLoading', true)
    fs.collection('transaction')
      .orderBy('created', 'desc')
      .onSnapshot(snapshot => {
        const retrivedData = []
        snapshot.docs.forEach(element => {
          retrivedData.push(element)
        })
        this.transactionList = retrivedData
        this.$store.commit('setShowLoading', false)
      })
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.transaction-list {
  padding: 5px 15vw 40px 15vw;
}

.list-wrapper {
  height: 70vh;
  overflow-y: scroll;
}

.list-item {
  height: 20px;
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
