import { tryOrAlert, tryOrAlertAsync } from "@/try";
import { defineStore } from "pinia";
import { ref } from "vue";

/**
 * Pinia store which holds an object which corresponds to the currently
 * stored errors, this can hold a list of errors + every function from which these errors originated
 */
export const useErrorStore = defineStore("error", () => {
  const errors = ref<unknown[]>([]);
  const currentFunction = ref<() => any>(() => ({}));
  const currentAsyncFunction = ref<() => Promise<any>>(async () => ({}));

  function addToStore(e: unknown) {
    errors.value.push(e);
  }

  function storeFunction(func: () => any) {
    currentFunction.value = func;
  }

  function storeAsyncFunction(func: () => Promise<any>) {
    currentAsyncFunction.value = func;
  }

  /**
   * Empty the store fully
   */
  function emptyStore() {
    errors.value.splice(0);
    currentFunction.value = () => ({});
    currentAsyncFunction.value = async () => ({});
  }
  /**
   * Try executing the stored function once more, if it fails it will still call an error.
   */
  function retryFunction() {
    const tempFunction: () => any = currentFunction.value;
    const tempAsyncFunction: () => Promise<any> = currentAsyncFunction.value;
    emptyStore();
    tryOrAlert(tempFunction);
    tryOrAlertAsync(tempAsyncFunction);
  }

  return {
    errors,
    currentFunction,
    addToStore,
    emptyStore,
    retryFunction,
    storeFunction,
    storeAsyncFunction,
  };
});
