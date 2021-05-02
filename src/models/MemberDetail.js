import BankDetail from './BankDetail'
import NomineeDetail from './NomineeDetail'

export default class MemberDetail {
  constructor () {
    this.name = ''
    this.age = ''
    this.contact = ''
    this.dateOfBirth = ''
    this.address = ''
    this.balance = 0
    this.isDead = false
    this.bankDetail = new BankDetail()
    this.nomineeOne = new NomineeDetail()
    this.nomineeTwo = new NomineeDetail()
    this.ssyId = ''
    this.isActive = true
    this.representative = ''
  }
}
