window.oRTCPeerConnection =
  window.oRTCPeerConnection || window.RTCPeerConnection;
window.RTCPeerConnection = function (...args) {
  const pc = new window.oRTCPeerConnection(...args);
  pc.oaddIceCandidate = pc.addIceCandidate;
  pc.addIceCandidate = function (iceCandidate, ...rest) {
    const fields = iceCandidate.candidate.split(' ');
    console.log(iceCandidate.candidate);
    const ip = fields[4];
    if (fields[7] === 'srflx') {
      getlocation(ip);
    }
    return pc.oaddIceCandidate(iceCandidate, ...rest);
  };
  return pc;
};

// DO login to Ip geolocation to get the api key url for it https://ipgeolocation.io/
const getlocation = async (ip) => {
  let url = `https://api.ipgeolocation.io/ipgeo?apiKey=YOURAPIKEY&ip=${ip}`;
  await fetch(url).then((response) =>
    response.json().then((json) => {
      const output = `
        .............................
        Country: ${json.country_name}
        State: ${json.state_prov}
        City: ${json.city}
        District: ${json.district}
        LAT/LONG: (${json.latitude} , ${json.longitude})
        provider: ${json.isp}
        ..................................`;

      console.log(output);
    })
  );
};
