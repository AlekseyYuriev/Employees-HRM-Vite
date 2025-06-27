import { storeToRefs } from "pinia";
import { useToastStore } from "@/store/toast";
import { Id, toast, type ToastOptions, type Content } from "vue3-toastify";
import { Ref } from "vue";

// типизировать composable

interface UseToastType {
  removeCurrToast: () => void;
  setErrorToast: (msg: string) => void;
}

export default function useToast(): UseToastType {
  const { currToastId }: { currToastId: Ref<Id | null> } = storeToRefs(
    useToastStore()
  );

  const removeCurrToast = () => {
    if (currToastId.value) {
      toast.remove(currToastId.value);
      currToastId.value = null;
    }
  };

  const setErrorToast = (msg: Content) => {
    const toastData: ToastOptions = {
      type: "error",
      position: toast.POSITION.BOTTOM_CENTER,
      closeOnClick: false,
    };
    currToastId.value = toast(msg, toastData);
  };

  return { removeCurrToast, setErrorToast };
}
