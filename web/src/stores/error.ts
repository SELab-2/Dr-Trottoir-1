import { tryOrAlertAsync } from "@/try";
import { defineStore } from "pinia";
import { Ref, ref } from "vue";

/**
 * Pinia store which holds an object which corresponds to the currently
 * stored errors, this can hold a list of errors + every function from which these errors originated
 */
export const useErrorStore = defineStore("error", () => {
  /* The state of this store. */
  const state: Ref<{
    error: Error;
    func: () => Promise<void>;
  } | null> = ref(null);

  function setError(error: Error, func: () => Promise<void>) {
    state.value = {
      error,
      func,
    };
  }

  function popError(): { error: Error; func: () => Promise<void> } | null {
    const result = state.value;
    state.value = null;
    return result;
  }

  async function retryFunction() {
    const result = popError();

    if (result) {
      await tryOrAlertAsync(result.func);
    }
  }

  return {
    state,
    retryFunction,
    popError,
    setError,
  };
});
