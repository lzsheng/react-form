
const routes = [
  {
    path: '/',
    getComponents: (a, cb) =>import("../../pages/react-form/formDemo").then(mod=>cb(null,mod.default))
  },
  {
    path: '/radioGroup',
    getComponents: (a, cb) =>import("../../pages/react-form/RadioGroup/demo").then(mod=>cb(null,mod.default))
  }
]

export default routes
