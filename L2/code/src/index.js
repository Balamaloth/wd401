import "./css/style.css";

import "./lazyModule.js";

import { fetchData } from "axios";

document.getElementById("lazy-button").addEventListener("click", () => {
  import("./lazyModule.js").then((module) => {
    module.default();
  });
});

console.log("hello world");
