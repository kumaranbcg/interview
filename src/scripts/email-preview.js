const Email = require("email-templates");

const email = new Email({
  message: {
    from: "niftylettuce@gmail.com"
  },
  send: true,
  preview: {
    open: "google chrome"
  }
});

email
  .send({
    template: "daily",
    message: {
      to: "elon@spacex.com"
    },
    locals: {
      date: " 2019-10-22",
      name: "Viact Construction",
      humanCount: 0,
      noHelmetCount: 0,
      url: ""
    }
  })
  .then(console.log)
  .catch(console.error);
