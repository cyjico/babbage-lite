import { lazy } from "solid-js";

export const routes = [
  {
    path: import.meta.env.PROD ? "/babbage-lite" : "/",
    component: lazy(() => import("@/pages/home")),
  },
];
