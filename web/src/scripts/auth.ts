//TODO: this is a tempory file and should be deleted eventually

import { reactive } from 'vue'

export const auth = reactive({
  isLoggedin : false,
  roles : {
    superstudent : false,
    syndicus : false
  }
})