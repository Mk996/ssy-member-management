import { fa } from '../firebase/firebaseinit'
import firebaseCalls from '@/firebase/firebaseCalls'
import { DOCUMENT } from '@/constant/constant'
fa.signInWithEmailAndPassword('gor.maharshi@gmail.com', 'admin@123')

const members = []
export const memberData = (callback) => {
  firebaseCalls.fetchAllMembers().then(response => {
    callback && callback(response)
  })
  return members
}

export const updateNames = () => {
  firebaseCalls.fetchAllMembers().then(response => {
    const list = response.filter(element => element.ssyId)
    list.forEach(element => {
      element.name = element.name.trim()
    })
    const obj = {}
    obj[DOCUMENT.MEMBERS] = list
    firebaseCalls.setAllMemebers(obj)
  })
}

export const setupBalance = () => {
  memberData(callFirebaseSetupMember)
  // console.log(members)
  // const balances = {}
  // members.forEach(member => {
  //   balances[member.ssyId] = 0
  // })
  // console.log(balances)
  // firebaseCalls.setupMembers(members)
}

const callFirebaseSetupMember = (response) => {
  console.log(response)
  firebaseCalls.setupMembers(response)
}
