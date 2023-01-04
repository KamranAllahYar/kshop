import {DateTime} from "luxon";

export const randomCode = (length = 5) => {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

export const maxAge = (minute = 5) => {
  const age = DateTime.now().plus({minute});
  const validFor = `valid for ${minute} minutes`
  return {age, validFor};
}

export const signupOtp = (session, email) => {
  let signup = session.get('signup');
  if (signup) {
    if (signup.id === email && signup.maxAge) {
      if (signup.maxAge >= DateTime.now()) {
        const {age, validFor} = maxAge()
        signup.maxAge = age
        signup.validFor = validFor
        session.put('signup', signup);
        return signup;
      }
    }
  }
  const {age, validFor} = maxAge()
  signup = {
    code: randomCode(),
    email,
    maxAge: age,
    validFor
  }
  session.put('signup', signup);
  return signup;
}

export const sendOtp = async (session, email) => {
  const otp = signupOtp(session, email);
  const text = `To complete signup process use this OTP code ${otp.code}. This code is ${otp.validFor}`;
  const html = `<h1>WeShip Signup</h1> <p>To complete signup process use this OTP code <b>${otp.code}</b>. This code is <b>${otp.validFor}</b></p>`;
  // return await Mail.send((message) => {
  //   message
  //     .from('admin@dukanify.com', 'WeShip')
  //     .to(email)
  //     .subject('Signup Otp for WeShip')
  //     .text(text).html(html)
  // })
}
