const vFilter = {
  //过滤股票字符
  filtersName: function (value) {
    return value && value.substring(2);
  },
  filterNum: function (value) {
    return value && parseInt(value).toFixed(2)
  }
};
export default vFilter