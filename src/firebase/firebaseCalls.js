import { fs } from '../firebase/firebaseinit'
import { COLLECTION, DOCUMENT } from '@/constant/constant'
import { convertToTransactionData, generateDocumentName, intitateBenefitBalanceUpdate, updateBalanceAmounts } from '@/utils/firebaseCallsHelper'

export default {
  async fetchAllMembers () {
    const snapshot = await fs.collection(COLLECTION.MEMBER).doc(DOCUMENT.MEMBERS).get()
    return snapshot.data().members
  },

  async setAllMemebers (members) {
    return await fs.collection(COLLECTION.MEMBER).doc(DOCUMENT.MEMBERS).set(members)
  },

  async recordPaymentTransaction (members) {
    const ref = fs.collection(COLLECTION.MEMBER).doc(DOCUMENT.MEMBERS)
    return await fs.runTransaction((transaction) => {
      return transaction.get(ref).then(doc => {
        const updatedMemberData = updateBalanceAmounts(doc.data().members, members)
        transaction.update(ref, { members: updatedMemberData })
      })
    })
  },

  async initiateBenefitTransaction (contributionAmount, member) {
    const ref = fs.collection(COLLECTION.MEMBER).doc(DOCUMENT.MEMBERS)
    return await fs.runTransaction((transaction) => {
      return transaction.get(ref).then(doc => {
        transaction.update(ref, { members: intitateBenefitBalanceUpdate(doc.data().members, contributionAmount, member.ssyId) })
      })
    })
  },

  async transactionEntry (transactionData, type, isReverseTransaction) {
    const ref = fs.collection(COLLECTION.TRANSACTIONS).doc(generateDocumentName())
    return await fs.runTransaction((transaction) => {
      return transaction.get(ref).then(doc => {
        if (!doc.exists) {
          transaction.set(ref, { transactions: [convertToTransactionData(transactionData, type)] })
        } else {
          const transactions = doc.data().transactions
          if (isReverseTransaction) {

          } else {
            transactions.push(convertToTransactionData(transactionData, type))
          }
          transaction.update(ref, { transactions })
        }
      })
    })
  },

  async fetchAllTransactions () {
    const snapshot = await fs.collection(COLLECTION.TRANSACTIONS).get()
    return snapshot.docs.flatMap(doc => doc.data().transactions)
  }

  // async addBalance (balance) {
  //   await fs.collection(COLLECTION.BALANCE)
  //     .doc(COLLECTION.MEMBER)
  //     .set(balance)
  // },

  // async setupMembers (members) {
  //   const obj = {}
  //   obj[DOCUMENT.MEMBERS] = members
  //   console.log(members)
  //   await fs.collection(COLLECTION.MEMBER)
  //     .doc(DOCUMENT.MEMBERS)
  //     .set(obj)
  // }

}
