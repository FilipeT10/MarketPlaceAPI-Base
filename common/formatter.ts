//adaptada de https://gist.github.com/joaohcrangel/8bd48bcc40b9db63bef7201143303937.js
export const dateFormat = (date: Date): string => {
  var today = new Date(date);
  var day = today.getDate() + "";
  var month = (today.getMonth() + 1) + "";
  var year = today.getFullYear() + "";
  var hour = today.getHours() + "";
  var minutes = today.getMinutes() + "";
  var seconds = today.getSeconds() + "";
    
  function checkZero(data){
    if(data.length == 1){
      data = "0" + data;
    }
    return data;
  }
  day = checkZero(day);
  month = checkZero(month);
  year = checkZero(year);
  hour = checkZero(hour);
  minutes = checkZero(minutes);
  seconds = checkZero(seconds);

  return day + "/" + month + "/" + year + " " + hour + ":" + minutes + ":" + seconds;

}