// updateDataLogic.ts

import axios from "axios";

export const useUpdateDataOnServer = (reduxData: any) => {
  return axios
    .post("/api/updateData", { data: reduxData })
    .then((response) => {
      console.log("Данные успешно обновлены на сервере:", response.data);
    })
    .catch((error) => {
      console.error("Ошибка при обновлении данных на сервере:", error);
    });
};
