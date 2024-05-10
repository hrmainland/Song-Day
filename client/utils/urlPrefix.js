/* eslint-disable no-undef */
// For test and deploy, set to true (and update NODE_ENV)

var baseUrl;

if (process.env.NODE_ENV === "production") {
  baseUrl = "";
} else {
  baseUrl = "/api";
}
export default baseUrl;
