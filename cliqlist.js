dateStart = "2024-11-01";
dateEnd = "2024-11-27";

var Text = "UID,NAME,DATE,CHECKIN,CHECKOUT,INTERVAL \n";
var sts = 0;
const date = new Date().toJSON().slice(0, 10);
const fileName = String(date) + "_cliq_snapshot.csv";
var cookieCT_CSRF_TOKEN = document.cookie.replace(
  /(?:(?:^|.*;\s*)CT_CSRF_TOKEN\s*\=\s*([^;]*).*$)|^.*$/,
  "$1",
);

async function getUsers() {
  sts += 1;
  if (sts === 0) download(Text, fileName, 'text/csv;charset=utf-8;');

  const response = await fetch("https://cliq.zoho.com/company/815958837/adminapi/v2/users?limit=25&module=user", {
    "credentials": "include",
    "headers": {
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0",
      "Accept": "*/*",
      "Accept-Language": "es,en;q=0.7,fr;q=0.3",
      "X-XHR-exception": "true",
      "X-ZCSRF-TOKEN": "zchat_csrparam=" + cookieCT_CSRF_TOKEN,
      "X-Client-Version": "9514504",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "Priority": "u=0",
      "Pragma": "no-cache",
      "Cache-Control": "no-cache"
    },
    "referrer": "https://cliq.zoho.com/company/815958837/setup/availability_reports",
    "method": "GET",
    "mode": "cors"
  });

  const users = await response.json();

  for (let i in users.data) {
    this.getTimestamps(users.data[i].zuid, users.data[i].display_name).then(_ => {
      sts -= 1;
      if (sts === 0) download(Text, fileName, 'text/csv;charset=utf-8;');
    })

  }
}

async function getTimestamps(uid, name) {
  sts += 1;
  if (sts === 0) download(Text, fileName, 'text/csv;charset=utf-8;');

  url = "https://cliq.zoho.com/company/815958837/adminapi/v2/reports/attendance/users/" + uid + "?from=" + dateStart + "&to=" + dateEnd;

  const response = await fetch(url, {
    "credentials": "include",
    "headers": {
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0",
      "Accept": "*/*",
      "Accept-Language": "es,en;q=0.7,fr;q=0.3",
      "X-XHR-exception": "true",
      "X-ZCSRF-TOKEN": "zchat_csrparam=" + cookieCT_CSRF_TOKEN,
      "X-Client-Version": "9514504",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "Priority": "u=0",
      "Pragma": "no-cache",
      "Cache-Control": "no-cache"
    },
    "referrer": "https://cliq.zoho.com/company/815958837/setup/availability_reports",
    "method": "GET",
    "mode": "cors"
  });

  const timestamps = await response.json();
 
  for (let e in timestamps.data) {
 
    for (let u in timestamps.data[e].entries) {
      checkin = timeConverter(timestamps.data[e].entries[u].checkin_time);
      checkout = timeConverter(timestamps.data[e].entries[u].checkout_time);
      interval = (timestamps.data[e].entries[u].checkout_time - timestamps.data[e].entries[u].checkin_time) / 3600000;
      interval = interval.toFixed(1)
      Text = Text + "\"" + uid + "\",\"" + name + "\",\"" + timestamps.data[e].date + "\",\"" + checkin + "\",\"" + checkout + "\",\"" + interval + "\" \n";
    }
  }
}

function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp);
  var hour = a.getHours();
  var min = a.getMinutes();
  var time = hour + ':' + min;
  return time;
}

function download(data, filename, type) {
  var file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob) { // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  } else { // Others
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

this.getUsers().then(_ => {
  sts -= 1;
  if (sts === 0) download(Text, fileName, 'text/csv;charset=utf-8;');
});