import { defineStore } from "pinia";
import { QueryError } from "@selab-2/groep-1-query";
import { ref } from 'vue'

/**
 * Pinia store which holds an object which corresponds to the currently
 * logged-in user. May also be an instance of APIError, or simply null.
 */
export const useErrorStore = defineStore("error", () => {
    const errors = ref<unknown[]>([])

    function addToStore(e: unknown){
        console.log(errors.value)

        errors.value.push(e)
    }

    function removeFromStore(index: number){
        errors.value.splice(index, 1)
    }

    function emptyStore(){
        errors.value.splice(0)
    }

  return { errors, addToStore, removeFromStore, emptyStore };
});
