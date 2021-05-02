<template>
  <main class="member-register">
    <div class="member-details card-box">
      <h2 class="title">Member Details</h2>
      <div class="grid-block">
        <div class="block-9">
          <div class="grid-block">
            <input
              type="text"
              class="text-field space-1-right block-11"
              placeholder="Name"
              v-model="memberDetail.name"
            />
            <input
              type="number"
              class="text-field block-1 h-size-2"
              placeholder="Age"
              v-model="memberDetail.age"
            />
          </div>
          <div class="grid-block">
            <input
              type="tel"
              class="text-field space-1-right block-1"
              placeholder="Contact number (10 digits)"
              v-model="memberDetail.contact"
            />
            <input
              type="date"
              class="text-field block-1"
              placeholder="Date of birth"
              v-model="memberDetail.dateOfBirth"
              @blur="calculateAge('member', memberDetail.dateOfBirth)"
            />
          </div>
          <div class="grid-block">
            <input
              type="text"
              class="text-field"
              placeholder="Address"
              v-model="memberDetail.address"
            />
          </div>
        </div>
        <div class="block-3 image-upload-wrapper h-size-2">
          <div class="image-upload">
            <span>coming soon</span>
          </div>
        </div>
      </div>
    </div>
    <div class="bank-details card-box">
      <h2 class="title">Bank Details</h2>
      <div class="grid-block">
        <input
          type="text"
          class="text-field"
          placeholder="Bank name"
          v-model="memberDetail.bankDetail.name"
        />
      </div>
      <div class="grid-block">
        <input
          type="text"
          class="text-field space-1-right block-3"
          placeholder="Branch name"
          v-model="memberDetail.bankDetail.branchName"
        />
        <input
          type="text"
          class="text-field block-1 h-size-2"
          placeholder="IFSC"
          v-model="memberDetail.bankDetail.ifsc"
        />
      </div>
      <div class="grid-block">
        <input
          type="text"
          class="text-field"
          placeholder="Account no."
          v-model="memberDetail.bankDetail.accountNo"
        />
      </div>
    </div>
    <div class="member-details card-box">
      <h2 class="title">Nominee One</h2>
      <div class="grid-block">
        <div class="block-9">
          <div class="grid-block">
            <input
              type="text"
              class="text-field space-1-right block-11"
              placeholder="Name"
              v-model="memberDetail.nomineeOne.name"
            />
            <input
              type="number"
              class="text-field block-1 h-size-2"
              placeholder="Age"
              v-model="memberDetail.nomineeOne.age"
            />
          </div>
          <div class="grid-block">
            <input
              type="tel"
              class="text-field space-1-right block-1"
              placeholder="Contact number (10 digits)"
              v-model="memberDetail.nomineeOne.contact"
            />
            <input
              type="date"
              class="text-field block-1"
              placeholder="Date of birth"
              v-model="memberDetail.nomineeOne.dateOfBirth"
              @blur="calculateAge('nomineeOne', memberDetail.nomineeOne.dateOfBirth)"
            />
          </div>
          <div class="grid-block">
            <input
              type="text"
              class="text-field"
              placeholder="Address"
              v-model="memberDetail.nomineeOne.address"
            />
          </div>
        </div>
        <div class="block-3 image-upload-wrapper h-size-2">
          <div class="image-upload">
            <span>coming soon</span>
          </div>
        </div>
      </div>
    </div>
    <div class="member-details card-box">
      <h2 class="title">Nominee Two</h2>
      <div class="grid-block">
        <div class="block-9">
          <div class="grid-block">
            <input
              type="text"
              class="text-field space-1-right block-11"
              placeholder="Name"
              v-model="memberDetail.nomineeTwo.name"
            />
            <input
              type="number"
              class="text-field block-1 h-size-2"
              placeholder="Age"
              v-model="memberDetail.nomineeTwo.age"
            />
          </div>
          <div class="grid-block">
            <input
              type="tel"
              class="text-field space-1-right block-1"
              placeholder="Contact number (10 digits)"
              v-model="memberDetail.nomineeTwo.contact"
            />
            <input
              type="date"
              class="text-field block-1"
              placeholder="Date of birth"
              v-model="memberDetail.nomineeTwo.dateOfBirth"
              @blur="calculateAge('nomineeTwo', memberDetail.nomineeTwo.dateOfBirth)"
            />
          </div>
          <div class="grid-block">
            <input
              type="text"
              class="text-field"
              placeholder="Address"
              v-model="memberDetail.nomineeTwo.address"
            />
          </div>
        </div>
        <div class="block-3 image-upload-wrapper h-size-2">
          <div class="image-upload">
            <span>coming soon</span>
          </div>
        </div>
      </div>
    </div>
    <div class="card-box">
      <div class="grid-block gap-2">
        <input type="number" class="text-field" placeholder="Balance" v-model="memberDetail.balance">
      </div>
      <div class="gap-2">
        <select class="text-field" v-model="memberDetail.representative">
          <option value="" disabled selected>Representative</option>
          <option
            v-for="representative in representativeList"
            :key="representative.name"
            :value="representative.name"
          >
            {{ representative.name }}
          </option>
        </select>
      </div>
      <div class="gap-2">
        <label> User active </label> <input type="checkbox" v-model="memberDetail.isActive"/>
      </div>
    </div>
    <section class="attachment-upload v-size-1 gap-2 grid-block-sb pad-2">
      <span class="title">ID Proof Attachment</span>
      <span class="title">Uploaded file name</span>
      <button>Browse</button>
    </section>
    <section class="grid-block-c">
      <button class="button button-acent" @click="saveMember">Save</button>
    </section>
  </main>
</template>

<script>
import MemberDetail from '../models/MemberDetail'
import { db, fs } from '../firebase/firebaseinit'
import { calculateAge } from '../utils/helper'

const ssyPrefix = 'SSY-'

export default {
  name: 'MemberRegister',
  data () {
    return {
      memberDetail: new MemberDetail(),
      memberDetailConverter: {
        toFirestore: (memberDetail) => {
          return {
            name: memberDetail.name,
            age: memberDetail.age,
            contact: memberDetail.contact,
            dateOfBirth: memberDetail.dateOfBirth,
            address: memberDetail.address,
            balance: memberDetail.balance,
            isDead: memberDetail.isDead,
            bankDetail: {
              name: memberDetail.bankDetail.name,
              branchName: memberDetail.bankDetail.branchName,
              ifsc: memberDetail.bankDetail.ifsc,
              accountNo: memberDetail.bankDetail.accountNo
            },
            nomineeOne: {
              name: memberDetail.nomineeOne.name,
              age: memberDetail.nomineeOne.age,
              contact: memberDetail.nomineeOne.contact,
              dateOfBirth: memberDetail.nomineeOne.dateOfBirth,
              address: memberDetail.nomineeOne.address
            },
            nomineeTwo: {
              name: memberDetail.nomineeTwo.name,
              age: memberDetail.nomineeTwo.age,
              contact: memberDetail.nomineeTwo.contact,
              dateOfBirth: memberDetail.nomineeTwo.dateOfBirth,
              address: memberDetail.nomineeTwo.address
            },
            ssyId: memberDetail.ssyId,
            isActive: memberDetail.isActive,
            representative: memberDetail.representative
          }
        },
        fromFirestore: (snapshot, options) => {
          return snapshot.data(options)
        }
      },
      representativeList: []
    }
  },
  methods: {
    calculateAge (type, dob) {
      dob = new Date(dob)
      if (type === 'member') {
        this.memberDetail.age = calculateAge(dob)
      } else if (type === 'nomineeOne') {
        this.memberDetail.nomineeOne.age = calculateAge(dob)
      } else {
        this.memberDetail.nomineeTwo.age = calculateAge(dob)
      }
    },
    saveMember () {
      db.ref('settings/memberId').transaction((currentData) => {
        if (currentData != null) {
          this.memberDetail.ssyId = this.createSsyId(currentData)
          this.updateMember()
          currentData++
        }
        return currentData
      })
    },
    createSsyId (memberId) {
      let id = String(memberId)
      const length = id.length
      for (let i = 0; i < 5 - length; i++) {
        id = '0'.concat(id)
      }
      return ssyPrefix + id
    },
    updateMember () {
      fs.collection('member')
        .doc(this.memberDetail.ssyId)
        .withConverter(this.memberDetailConverter)
        .set(this.memberDetail)
        .then(() => {
          this.$router.replace('/home')
        })
    }
  },
  beforeCreate () {
    this.$store.commit('setShowLoading', true)
    fs.collection('pratinidhi')
      .get()
      .then((querySnapshot) => {
        this.representativeList = []
        querySnapshot.forEach((doc) => {
          this.representativeList.push(doc.data())
        })
        this.$store.commit('setShowLoading', false)
        this.representativeList.sort((a, b) => a.name.localeCompare(b.name))
      })
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.member-register {
  padding: 5px 15vw 40px 15vw;
}
.image-upload-wrapper {
  padding: 5px 0 7px 10px;
}

.image-upload {
  border: 1px solid $color-support;
  border-radius: 4px;
  height: 95%;
  text-align: center;
}

.attachment-upload {
  border: 1px solid $color-support;
  border-radius: 8px;
}
</style>
