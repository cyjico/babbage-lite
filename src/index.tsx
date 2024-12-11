/* @refresh reload */
import "./global.css";
import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import { routes } from "./app/routes";

const wrapper = document.getElementById("root");

if (wrapper === null) {
  throw new Error("No wrapper was found");
} else {
  render(() => <Router>{routes}</Router>, wrapper);
}
