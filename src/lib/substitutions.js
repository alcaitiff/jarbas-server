const substitutions = {
  do(arr, msg) {
    for (let i = 0; i < arr.length; i++) {
      msg = msg.split(arr[i].key).join(arr[i].value);
    }
    return msg;
  },
  add(arr, obj) {
    arr.forEach(element => {
      element.substitutions = obj;
    });
    return arr;
  }
}
module.exports = substitutions;