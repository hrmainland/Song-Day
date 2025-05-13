/* eslint-disable no-undef */

var baseUrl;

if (process.env.NODE_ENV === "production") {
  baseUrl = "";
} else {
  baseUrl = "/api";
}
export default baseUrl;
