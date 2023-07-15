let pseudoLocation: Partial<Location> = {
  // ancestorOrigins: {},
  href: "https://www.formstack.com/admin/form/builder/5350841/build",
  origin: "https://www.formstack.com",
  protocol: "https:",
  host: "www.formstack.com",
  hostname: "www.formstack.com",
  port: "",
  pathname: "/admin/form/builder/5350841/build",
  search: "",
  hash: "",
};
// function getFormIdFromLocation({ pathname }: Location = location) {
function xgetFormIdFromLocation({ pathname }: Location) {
  const regExp = /\/admin\/form\/builder\/(?<formId>\d+)\/build(\/*)+/g;
  return regExp.exec(pathname)?.groups?.formId || null;
}
// const x = getFormIdFromLocation(pseudoLocation);
// const x = getFormIdFromLocation({ pathname: "/some/other/path" });
console.log({
  //@ts-ignore
  formId: getFormIdFromLocation(pseudoLocation),
  //@ts-ignore
  nonBuilderPath: getFormIdFromLocation({ pathname: "/some/other/path" }),
  //@ts-ignore
  builderPathWithFieldId: getFormIdFromLocation({
    pathname: "/admin/form/builder/5350841/build/field/147366617",
  }),
});
