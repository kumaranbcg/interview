const input = [
  {
    "username": "yashudeepjain",
    "surname": "jain",
    "sub": "e53854b1-2739-495d-8ba4-b3a3a7aa4051",
    "phone": "+85255914505",
    "email_verified": "true",
    "firstname": "yashudeep",
    "company_code": "viAct",
    "role": "2",
    "email": "jain.viact@gmail.com"
  }
]

var request = require('request');


input.forEach((data) => {
  var options = {
    'method': 'PUT',
    'url': `http://localhost:3000/api/admin/user/${data.username}`,
    'headers': {
      'Authorization': 'Bearer eyJraWQiOiJuOUV1QTlvc3BPZndlXC9OSnllcUdOc2dNSWhoa1BXOGNMSlNaRmFcL2lLems9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIxZGI5MjYzMy01NjViLTRiMmYtODhlZi02NzNkYmM0NmUyNTEiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiY3VzdG9tOnByb2ZpbGVfcGljIjoiaHR0cHM6XC9cL3d3dy5nb29nbGUuY29tXC91cmw_c2E9aSZzb3VyY2U9aW1hZ2VzJmNkPSZ2ZWQ9MmFoVUtFd2pkdWFTVnU2am5BaFhFcE9rS0hkR0JDVzRRalJ4NkJBZ0JFQVEmdXJsPWh0dHBzJTNBJTJGJTJGeWEtd2ViZGVzaWduLmNvbSUyRmV4cGxvcmUlMkZ1c2VyLWltYWdlLXBuZyUyRiZwc2lnPUFPdlZhdzJfcV94bWNpUzRhSGRLVXJ6WVJBRDQmdXN0PTE1ODAzNzUzNjI4Njk5MzYiLCJjdXN0b206Zmlyc3RuYW1lIjoiSGlwIiwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoZWFzdC0xLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoZWFzdC0xX3ZVak8yTW9jcyIsImNvZ25pdG86dXNlcm5hbWUiOiJoaXBoaW5nIiwiY3VzdG9tOnN1cm5hbWUiOiJIaW5nIiwiYXVkIjoiMTdoYWZoZjVsMmZwcDB2azYzMXVrODBlNTIiLCJjdXN0b206cGhvbmUiOiIrODUyNTkyMzE5OTQiLCJldmVudF9pZCI6IjkwM2VjY2IwLWI4MmEtNGU0ZC04YjEyLTM5ZDU1NTYwMDE3YyIsInRva2VuX3VzZSI6ImlkIiwiY3VzdG9tOmNvbXBhbnlfY29kZSI6IkhpcCBIaW5nIiwiYXV0aF90aW1lIjoxNTg0NDQ1NDU1LCJjdXN0b206cmVwb3J0X2ZyZXF1ZW5jeSI6Im5vbmUiLCJleHAiOjE1ODQ1Mzc3MzcsImN1c3RvbTpwZXJtaXNzaW9ucyI6IltdIiwiY3VzdG9tOnJvbGUiOiIyIiwiaWF0IjoxNTg0NTM0MTM3LCJlbWFpbCI6ImpvZXJnZW5AdmlhY3QuYWkiLCJjdXN0b206bm90aWZpY2F0aW9uX3R5cGUiOiJub25lIn0.VTP2ZaFHHcT36M194Qiy71RLqR5SDAH_llYuh25uhyjShJOIP45-GobMH0oLqx2EUZVXsSyDr5iR2j5csVyuv_R-iviOf3zpNHOb8QrmZMYd6QLtK8owCaGvI7EXX4pprv5x2biANi2i4xr_yaUWtBg46LbPn_fTg1TAWDgPu0-gPUr-09teIUyZPilkRg8rzlZIaVV1FnprKWnyZ6r2cWXNPpzrCaODaZ1Gqo40zZJ39E43azib-Jrc7bwGAdtAWekMAh_-eVe2v2ov-z-r5hFVNd6l0HuCLcQ5qjqKwz_bMmleTd6xpWlBD7uRkHjxU4PFfH-b-eOfqPaCzqd3Jg',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...data, "company_code": "viact", created_by: 'windht' })

  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });

})