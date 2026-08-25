import Swal from "sweetalert2";

export const confirmLogout = async (
  title: string = "Çıxış etmək istəyirsiniz?",
  text: string = "Hesabınızdan çıxış ediləcək."
): Promise<boolean> => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#1a7a4a",
    cancelButtonColor: "#ef4444",
    confirmButtonText: "Bəli, çıxış et",
    cancelButtonText: "Ləğv et",
    reverseButtons: true,
    customClass: {
      popup: "rounded-3xl shadow-2xl font-sans border border-gray-100",
      confirmButton: "px-6 py-2.5 rounded-full font-bold text-sm bg-[#1a7a4a] text-white hover:bg-[#156040] transition-colors cursor-pointer",
      cancelButton: "px-6 py-2.5 rounded-full font-bold text-sm bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer mr-2",
    },
    buttonsStyling: false,
  });

  return result.isConfirmed;
};

export const showToast = (
  title: string,
  icon: "success" | "error" | "info" | "warning" = "success"
) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: "rounded-2xl shadow-lg font-sans text-xs",
    },
  });

  Toast.fire({
    icon,
    title,
  });
};

export const showSuccessAlert = (title: string, text?: string) => {
  return Swal.fire({
    title,
    text,
    icon: "success",
    confirmButtonColor: "#1a7a4a",
    confirmButtonText: "Tamam",
    customClass: {
      popup: "rounded-3xl shadow-2xl font-sans border border-gray-100",
      confirmButton: "px-6 py-2.5 rounded-full font-bold text-sm bg-[#1a7a4a] text-white cursor-pointer",
    },
    buttonsStyling: false,
  });
};

export const showErrorAlert = (title: string, text?: string) => {
  return Swal.fire({
    title,
    text,
    icon: "error",
    confirmButtonColor: "#ef4444",
    confirmButtonText: "Tamam",
    customClass: {
      popup: "rounded-3xl shadow-2xl font-sans border border-gray-100",
      confirmButton: "px-6 py-2.5 rounded-full font-bold text-sm bg-red-600 text-white cursor-pointer",
    },
    buttonsStyling: false,
  });
};
