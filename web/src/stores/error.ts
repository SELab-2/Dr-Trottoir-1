import { tryOrAlertAsync } from "@/try";
import { defineStore } from "pinia";
import { Ref, ref } from "vue";

/**
 * Pinia store which holds an object which corresponds to the currently
 * stored errors, this can hold a list of errors + every function from which these errors originated
 */
export const useErrorStore = defineStore("error", () => {
  /* The state of this store. */
  const errors: Ref<
    Array<{
      error: Error;
      func: () => Promise<void>;
    }>
  > = ref([]);

  function appendError(error: Error, func: () => Promise<void>) {
    errors.value.push({
      error,
      func,
    });
  }

  function popError(): { error: Error; func: () => Promise<void> } | undefined {
    return errors.value.pop();
  }

  async function retryFunction() {
    const result = errors.value.pop();

    if (result) {
      await tryOrAlertAsync(result.func);
    }
  }

  return {
    errors,
    retryFunction,
    appendError,
    popError,
  };
});
