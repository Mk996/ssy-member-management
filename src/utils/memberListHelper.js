export const updateAmount = (member, obj) => {
  obj.amount = member.amount
  return obj
}

export const checkMemberAlreadyPresentInList = (members, ssyId) => {
  if (findMemberInList(members, ssyId)) {
    return true
  }
  return false
}

export const findMemberInList = (members, ssyId) => {
  return members.filter(el => el.ssyId === ssyId)[0]
}

export const calculateBenefitValues = (totalBenefit, benefitObj) => {
  const corpusFund = (totalBenefit) * (benefitObj.corpusFundPercentage / 100)
  const pendingBalance = benefitObj.member.balance
  const netBenefit = totalBenefit - corpusFund + pendingBalance
  return {
    totalBenefit,
    corpusFund,
    pendingBalance,
    netBenefit
  }
}

export const totalBenefits = (members, benefitObj) => (members.filter(item => !item.isDead && item.isActive).length - 1) * benefitObj.contributionAmount
