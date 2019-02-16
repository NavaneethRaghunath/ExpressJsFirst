exports.getDate = ()=> {
  let dayName = " ";
  let date = new Date();
  let options = { weekday: 'long',
    year: 'numeric',
    month: 'long'};
  return date.toLocaleDateString("en-US", options);
}

exports.gDay = ()=>{
  let dayName = " ";
  let date = new Date();
  let options = { weekday: 'long'};
  return date.toLocaleDateString("en-US", options);
}
