import axios from "axios";
import { createToaster } from "@meforma/vue-toaster";
const toaster = createToaster({ position: "top-right" });

export default function (to, from, next) {
  axios
    .get("/api/admin/check-login", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tk_nhan_vien"),
      },
    })
    .then((res) => {
      if (res.data.status) {
        next();
      } else {
        next("/admin/dang-nhap");
        toaster.error(res.data.message);
      }
    })
    .catch((err) => {
      console.error("Auth check failed:", err);
      next("/admin/dang-nhap");
    });
}
