import { TRANSACTION_TYPE } from '@/constant/constant'

export const updateBalanceAmounts = (completeList, updatedMembers) => {
  completeList.forEach(element => {
    updatedMembers.forEach(member => {
      if (element.ssyId === member.ssyId) {
        element.balance = Number(element.balance) + Number(member.amount)
      }
    })
  })
  return completeList
}

export const intitateBenefitBalanceUpdate = (memberList, contributionAmount, memberSsyId) => {
  memberList.forEach(element => {
    if (memberSsyId === element.ssyId) {
      element.isDead = true
    } else {
      element.balance -= contributionAmount
    }
  })
  return memberList
}

export const generateDocumentName = () => {
  const today = new Date()
  const APRIL_MONTH = 3
  if (today.getMonth() >= APRIL_MONTH) {
    return `${today.getFullYear()}-${today.getFullYear() + 1}`
  }
  return `${today.getFullYear() - 1}-${today.getFullYear()}`
}

export const convertToTransactionData = (data, type) => {
  const transactionData = {}
  transactionData.date = data.date.getTime()
  transactionData.remarks = data.remarks
  transactionData.type = type
  transactionData.created = new Date().getTime()

  if (type === TRANSACTION_TYPE.MEMBER_PAYMENT) {
    transactionData.members = data.members.map(member => {
      return {
        ssyId: member.ssyId,
        name: member.name,
        amount: Number(member.amount)
      }
    })
    transactionData.amount = getTotalAmount(data.members)
  } else if (type === TRANSACTION_TYPE.BENEFIT) {
    transactionData.members = [{
      ssyId: data.member.ssyId,
      name: data.member.name
    }]
    transactionData.amount = data.netBenefit
    transactionData.netBenefit = data.netBenefit
    transactionData.totalBenefit = data.totalBenefit
    transactionData.corpusFund = data.corpusFund
    transactionData.pendingBalance = data.pendingBalance
    transactionData.contributionAmount = data.contributionAmount
    transactionData.corpusFundPercentage = data.corpusFundPercentage
  }
  return transactionData
}

const getTotalAmount = (members) => {
  let total = 0
  members.forEach(el => {
    total += Number(el.amount)
  })
  return total
}
