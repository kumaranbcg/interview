const axios = require("axios");
axios
  .get("http://localhost:3000/api/authenticated", {
    headers: {
      authorization:
        "Bearer eyJraWQiOiJjZDNnbUc1eTlVOTJCTlp2MWFPZVhoNTFMbko2NHh2VTkwdHBBVVBseWc4PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJiZmE1ZTNiMy05NWIxLTQwMjQtOWViYy00ZjU4NWE3NThmZjYiLCJldmVudF9pZCI6Ijg5NDQ1Y2U5LTZmNTYtMTFlOS1iYmJlLTUxMTNlN2FmYzY0ZCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE1NTcwNzUzMDcsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5hcC1zb3V0aGVhc3QtMS5hbWF6b25hd3MuY29tXC9hcC1zb3V0aGVhc3QtMV92VWpPMk1vY3MiLCJleHAiOjE1NTcwNzg5MDcsImlhdCI6MTU1NzA3NTMwNywianRpIjoiZjk2Njk1OWQtMGI5YS00Yjc2LWE4ZTEtMGQzYWM0ZGRiMTdhIiwiY2xpZW50X2lkIjoiMTdoYWZoZjVsMmZwcDB2azYzMXVrODBlNTIiLCJ1c2VybmFtZSI6IndpbmRodCJ9.Q7a9ZMZljwOT8n-9M1QtmaqIypaXsKbMVCF-NMuGj6AKawbWKKzhCq9Xd9mmz8OIj1GaeEWkXub3D6PyX3zwZth5tTTnJkyRP7HlzgVXByIzaFs9ydmZmZv-5bZHODLI3d_hvF89GBHTq9CpMeSk9jNWrgR9RFeEJtKtcmhUX-ed41CCzqv_a7t8QY4V4zVPab8E034eZ5Vmg92RIehfbCoPx-GqLydH0M1xqatV8euqs4nUbSaaXpIsXdxRI_WxOoAy7z6VOeClPTFCZNubhXEmcCqGflqg_o-sVsT3u-me5bw2z_OwwF_ave_2o6na1xHmH_NNgw9DLI8WfF1YXA"
    }
  })
  .then(result => {
    console.log("Success");
    console.log(result.data);
  })
  .catch(err => {
    console.log("Error");
    console.log(err);
  });
