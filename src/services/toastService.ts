import { toast, type Id } from "react-toastify";

class ToastService {
  loading(message: string): Id {
    return toast.loading(message);
  }

  success(message: string) {
    toast.success(message);
  }

  error(message: string) {
    toast.error(message);
  }

  info(message: string) {
    toast.info(message);
  }

  update(id: Id, message: string, type: "success" | "error" | "info" = "success") {
    toast.update(id, {
      render: message,
      type,
      isLoading: false,
      autoClose: 2500,
    });
  }
}

export default new ToastService();
