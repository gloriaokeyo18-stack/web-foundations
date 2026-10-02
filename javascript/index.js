let variable = "Peter Karanja";
const variable2 = "Peter Karanja";

let bank_balance = 2000;
const fuliza_limit = 200;

const can_fuliza = (amount) => {
  if (amount > fuliza_limit) {
    return "I am sorry, you can not fuliza";
  } else {
    return "You can fuliza";
  }
};

console.log(`Hello Chico, ${can_fuliza(1000)}`);
