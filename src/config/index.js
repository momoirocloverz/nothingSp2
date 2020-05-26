let config = null
let develop_config = {}
let pre_config = {}
let product_config = {}

if (process.env.NODE_ENV === 'development') {
  config = {
    ...develop_config
  }
} else if (process.env.NODE_ENV === 'pre') {
  config = {
    ...pre_config
  }
} else if (process.env.NODE_ENV === 'production') {
  config = {
    ...product_config
  }
}
export default config