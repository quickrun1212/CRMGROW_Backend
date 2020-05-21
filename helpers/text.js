const phone = require('phone');
const twilio = require('twilio')(accountSid, authToken);
const User = require('../models/user');
const Contact = require('../models/contact');
const config = require('../config/config');
const Activity = require('../models/activity');

const accountSid = config.TWILIO.TWILIO_SID;
const authToken = config.TWILIO.TWILIO_AUTH_TOKEN;
const urls = require('../constants/urls');

const bulkVideo = async (data) => {
  const { user, content, videos, contacts } = data;
  const currentUser = await User.findOne({ _id: user }).catch((err) => {
    console.log('err', err);
  });
  const promise_array = [];

  for (let i = 0; i < contacts.length; i++) {
    const _contact = await Contact.findOne({ _id: contacts[i] }).catch(
      (err) => {
        console.log('err', err);
      }
    );
    let video_titles = '';
    let video_descriptions = '';
    let video_objects = '';
    let video_content = content;
    let activity;
    for (let j = 0; j < videos.length; j++) {
      const video = videos[j];

      if (typeof video_content === 'undefined') {
        video_content = '';
      }

      video_content = video_content
        .replace(/{user_name}/gi, currentUser.user_name)
        .replace(/{user_email}/gi, currentUser.email)
        .replace(/{user_phone}/gi, currentUser.cell_phone)
        .replace(/{contact_first_name}/gi, _contact.first_name)
        .replace(/{contact_last_name}/gi, _contact.last_name)
        .replace(/{contact_email}/gi, _contact.email)
        .replace(/{contact_phone}/gi, _contact.cell_phone);

      const _activity = new Activity({
        content: 'sent video using sms',
        contacts: contacts[i],
        user: currentUser.id,
        type: 'videos',
        videos: video._id,
        created_at: new Date(),
        updated_at: new Date(),
        description: video_content,
      });

      activity = await _activity
        .save()
        .then()
        .catch((err) => {
          console.log('err', err);
        });

      const video_link = urls.MATERIAL_VIEW_VIDEO_URL + activity.id;

      if (j < videos.length - 1) {
        video_titles = video_titles + video.title + ', ';
        video_descriptions += `${video.description}, `;
      } else {
        video_titles += video.title;
        video_descriptions += video.description;
      }
      const video_object = `\n${video.title}:\n\n${video_link}\n`;
      video_objects += video_object;
    }

    if (video_content.search(/{video_object}/gi) !== -1) {
      video_content = video_content.replace(/{video_object}/gi, video_objects);
    } else {
      video_content = video_content + '\n' + video_objects;
    }

    if (video_content.search(/{video_title}/gi) !== -1) {
      video_content = video_content.replace(/{video_title}/gi, video_titles);
    }

    if (video_content.search(/{video_description}/gi) !== -1) {
      video_content = video_content.replace(
        /{video_description}/gi,
        video_descriptions
      );
    }

    let fromNumber = currentUser['proxy_number'];

    if (!fromNumber) {
      const areaCode = currentUser.cell_phone.substring(1, 4);

      const data = await twilio.availablePhoneNumbers('US').local.list({
        areaCode,
      });

      let number = data[0];

      if (typeof number === 'undefined') {
        const areaCode1 = currentUser.cell_phone.substring(1, 3);

        const data1 = await twilio.availablePhoneNumbers('US').local.list({
          areaCode: areaCode1,
        });
        number = data1[0];
      }

      if (typeof number !== 'undefined') {
        const proxy_number = await twilio.incomingPhoneNumbers.create({
          phoneNumber: number.phoneNumber,
          smsUrl: urls.SMS_RECEIVE_URL,
        });

        currentUser['proxy_number'] = proxy_number.phoneNumber;
        fromNumber = currentUser['proxy_number'];
        currentUser.save().catch((err) => {
          console.log('err', err);
        });
      } else {
        fromNumber = config.TWILIO.TWILIO_NUMBER;
      }
    }

    const promise = new Promise((resolve, reject) => {
      const e164Phone = phone(_contact.cell_phone)[0];

      if (!e164Phone) {
        Activity.deleteOne({ _id: activity.id }).catch((err) => {
          console.log('err', err);
        });
        resolve({
          contact: contacts[i],
          error: 'Phone number is not valid format',
          status: false,
        }); // Invalid phone number
      }
      twilio.messages
        .create({ from: fromNumber, body: video_content, to: e164Phone })
        .then(() => {
          console.info(
            `Send SMS: ${fromNumber} -> ${_contact.cell_phone} :`,
            video_content
          );
          Contact.findByIdAndUpdate(contacts[i], {
            $set: { last_activity: activity.id },
          }).catch((err) => {
            console.log('err', err);
          });
          resolve({
            status: true,
          });
        })
        .catch((err) => {
          console.log('err', err);
          Activity.deleteOne({ _id: activity.id }).catch((err) => {
            console.log('err', err);
          });
          resolve({
            contact: contacts[i],
            error: err,
            status: false,
          });
        });
    });
    promise_array.push(promise);
  }

  return Promise.all(promise_array);
};

const bulkPdf = async (data) => {
  const { user, content, pdfs, contacts } = data;
  const currentUser = await User.findOne({ _id: user }).catch((err) => {
    console.log('err', err);
  });
  const promise_array = [];

  for (let i = 0; i < contacts.length; i++) {
    const _contact = await Contact.findOne({ _id: contacts[i] }).catch(
      (err) => {
        console.log('err', err);
<<<<<<< Updated upstream
      }
    );
    let pdf_titles = '';
    let pdf_descriptions = '';
    let pdf_objects = '';
    let pdf_content = content;
    let activity;

    for (let j = 0; j < pdfs.length; j++) {
      const pdf = pdfs[j];

      if (!pdf_content) {
        pdf_content = '';
      }
=======
      }
    );
    let pdf_titles = '';
    let pdf_descriptions = '';
    let pdf_objects = '';
    let pdf_content = content;
    let activity;

    for (let j = 0; j < pdfs.length; j++) {
      const pdf = pdfs[j];

      if (!pdf_content) {
        pdf_content = '';
      }
>>>>>>> Stashed changes

      pdf_content = pdf_content
        .replace(/{user_name}/gi, currentUser.user_name)
        .replace(/{user_email}/gi, currentUser.email)
        .replace(/{user_phone}/gi, currentUser.cell_phone)
        .replace(/{contact_first_name}/gi, _contact.first_name)
        .replace(/{contact_last_name}/gi, _contact.last_name)
        .replace(/{contact_email}/gi, _contact.email)
        .replace(/{contact_phone}/gi, _contact.cell_phone);

      const _activity = new Activity({
        content: 'sent pdf using sms',
        contacts: contacts[i],
        user: currentUser.id,
        type: 'pdfs',
        pdfs: pdf._id,
        created_at: new Date(),
        updated_at: new Date(),
        description: pdf_content,
      });

      activity = await _activity
        .save()
        .then()
        .catch((err) => {
          console.log('err', err);
        });

      const pdf_link = urls.MATERIAL_VIEW_PDF_URL + activity.id;

      if (j < pdfs.length - 1) {
        pdf_titles = pdf_titles + pdf.title + ', ';
        pdf_descriptions += `${pdf.description}, `;
      } else {
        pdf_titles += pdf.title;
        pdf_descriptions += pdf.description;
      }
      const pdf_object = `\n${pdf.title}:\n\n${pdf_link}\n`;
      pdf_objects += pdf_object;
    }

    if (pdf_content.search(/{pdf_object}/gi) !== -1) {
      pdf_content = pdf_content.replace(/{pdf_object}/gi, pdf_objects);
    } else {
      pdf_content = pdf_content + '\n' + pdf_objects;
    }

    if (pdf_content.search(/{pdf_title}/gi) !== -1) {
      pdf_content = pdf_content.replace(/{pdf_title}/gi, pdf_titles);
    }

    if (pdf_content.search(/{pdf_description}/gi) !== -1) {
      pdf_content = pdf_content.replace(
        /{pdf_description}/gi,
        pdf_descriptions
      );
    }

    let fromNumber = currentUser['proxy_number'];

    if (!fromNumber) {
      const areaCode = currentUser.cell_phone.substring(1, 4);

      const data = await twilio.availablePhoneNumbers('US').local.list({
        areaCode,
      });

      let number = data[0];

      if (typeof number === 'undefined') {
        const areaCode1 = currentUser.cell_phone.substring(1, 3);

        const data1 = await twilio.availablePhoneNumbers('US').local.list({
          areaCode: areaCode1,
        });
        number = data1[0];
      }

      if (typeof number !== 'undefined') {
        const proxy_number = await twilio.incomingPhoneNumbers.create({
          phoneNumber: number.phoneNumber,
          smsUrl: urls.SMS_RECEIVE_URL,
        });

        currentUser['proxy_number'] = proxy_number.phoneNumber;
        fromNumber = currentUser['proxy_number'];
        currentUser.save().catch((err) => {
          console.log('err', err);
        });
      } else {
        fromNumber = config.TWILIO.TWILIO_NUMBER;
      }
    }

    const promise = new Promise((resolve, reject) => {
      const e164Phone = phone(_contact.cell_phone)[0];

      if (!e164Phone) {
        Activity.deleteOne({ _id: activity.id }).catch((err) => {
          console.log('err', err);
        });
        resolve({
          status: false,
          contact: contacts[i],
        }); // Invalid phone number
      }
      twilio.messages
        .create({ from: fromNumber, body: pdf_content, to: e164Phone })
        .then(() => {
          console.info(
            `Send SMS: ${fromNumber} -> ${_contact.cell_phone} :`,
            pdf_content
          );
          Contact.findByIdAndUpdate(contacts[i], {
            $set: { last_activity: activity.id },
          }).catch((err) => {
            console.log('err', err);
          });
          resolve({
            status: true,
          });
        })
        .catch((err) => {
          console.log('err', err);
          Activity.deleteOne({ _id: activity.id }).catch((err) => {
            console.log('err', err);
          });
          resolve({
            status: false,
            error: err,
            contact: contacts[i],
          });
        });
    });
    promise_array.push(promise);
  }

  return Promise.all(promise_array);
};

const bulkImage = async (data) => {
  const { user, content, images, contacts } = data;
  const currentUser = await User.findOne({ _id: user }).catch((err) => {
    console.log('err', err);
  });
  const promise_array = [];
  const error = [];

  for (let i = 0; i < contacts.length; i++) {
    const _contact = await Contact.findOne({ _id: contacts[i] }).catch(
      (err) => {
        console.log('err', err);
<<<<<<< Updated upstream
      }
    );
    let image_titles = '';
    let image_descriptions = '';
    let image_objects = '';
    let image_content = content;
    let activity;
    for (let j = 0; j < images.length; j++) {
      const image = images[j];

      if (!image_content) {
        image_content = '';
      }
=======
      }
    );
    let image_titles = '';
    let image_descriptions = '';
    let image_objects = '';
    let image_content = content;
    let activity;
    for (let j = 0; j < images.length; j++) {
      const image = images[j];

      if (!image_content) {
        image_content = '';
      }
>>>>>>> Stashed changes

      image_content = image_content
        .replace(/{user_name}/gi, currentUser.user_name)
        .replace(/{user_email}/gi, currentUser.email)
        .replace(/{user_phone}/gi, currentUser.cell_phone)
        .replace(/{contact_first_name}/gi, _contact.first_name)
        .replace(/{contact_last_name}/gi, _contact.last_name)
        .replace(/{contact_email}/gi, _contact.email)
        .replace(/{contact_phone}/gi, _contact.cell_phone);

      const _activity = new Activity({
        content: 'sent image using sms',
        contacts: contacts[i],
        user: currentUser.id,
        type: 'images',
        images: image._id,
        created_at: new Date(),
        updated_at: new Date(),
      });

      activity = await _activity
        .save()
        .then()
        .catch((err) => {
          console.log('err', err);
        });

      const image_link = urls.MATERIAL_VIEW_IMAGE_URL + activity.id;

      if (j < images.length - 1) {
        image_titles = image_titles + image.title + ', ';
        image_descriptions += `${image.description}, `;
      } else {
        image_titles += image.title;
        image_descriptions += image.description;
      }
      const image_object = `\n${image.title}:\n\n${image_link}\n`;
      image_objects += image_object;
    }

    if (image_content.search(/{image_object}/gi) !== -1) {
      image_content = image_content.replace(/{image_object}/gi, image_objects);
    } else {
      image_content = image_content + '\n' + image_objects;
    }

    if (image_content.search(/{image_title}/gi) !== -1) {
      image_content = image_content.replace(/{image_title}/gi, image_titles);
    }

    if (image_content.search(/{image_description}/gi) !== -1) {
      image_content = image_content.replace(
        /{image_description}/gi,
        image_descriptions
      );
    }

    let fromNumber = currentUser['proxy_number'];

    if (!fromNumber) {
      const areaCode = currentUser.cell_phone.substring(1, 4);

      const data = await twilio.availablePhoneNumbers('US').local.list({
        areaCode,
      });

      let number = data[0];

      if (typeof number === 'undefined') {
        const areaCode1 = currentUser.cell_phone.substring(1, 3);

        const data1 = await twilio.availablePhoneNumbers('US').local.list({
          areaCode: areaCode1,
        });
        number = data1[0];
      }

      if (typeof number !== 'undefined') {
        const proxy_number = await twilio.incomingPhoneNumbers.create({
          phoneNumber: number.phoneNumber,
          smsUrl: urls.SMS_RECEIVE_URL,
        });

        currentUser['proxy_number'] = proxy_number.phoneNumber;
        fromNumber = currentUser['proxy_number'];
        currentUser.save().catch((err) => {
          console.log('err', err);
        });
      } else {
        fromNumber = config.TWILIO.TWILIO_NUMBER;
      }
    }

    const promise = new Promise((resolve, reject) => {
      const e164Phone = phone(_contact.cell_phone)[0];

      if (!e164Phone) {
        Activity.deleteOne({ _id: activity.id }).catch((err) => {
          console.log('err', err);
        });
        resolve({
          status: false,
          contact: contacts[i],
        });
      }
      twilio.messages
        .create({ from: fromNumber, body: image_content, to: e164Phone })
        .then(() => {
          console.info(
            `Send SMS: ${fromNumber} -> ${_contact.cell_phone} :`,
            image_content
          );
          Contact.findByIdAndUpdate(contacts[i], {
            $set: { last_activity: activity.id },
          }).catch((err) => {
            console.log('err', err);
          });
          resolve({
            status: true,
          });
        })
        .catch((err) => {
          console.log('err', err);
          Activity.deleteOne({ _id: activity.id }).catch((err) => {
            console.log('err', err);
          });
          resolve({
            status: false,
            contact: contacts[i],
            error: err,
          });
        });
    });
    promise_array.push(promise);
  }

  return Promise.all(promise_array);
};

const getTwilioNumber = async (id) => {
  const user = await User.findOne({ _id: id }).catch((err) => {
    console.log('err', err);
  });
  let areaCode;
  let countryCode;
  let fromNumber;
  const phone = user.phone;
<<<<<<< Updated upstream
=======
  console.log('user', user);
>>>>>>> Stashed changes
  if (phone) {
    areaCode = phone.areaCode;
    countryCode = phone.countryCode;
  } else {
    areaCode = user.cell_phone.substring(1, 4);
    countryCode = 'US';
  }
<<<<<<< Updated upstream
  const data = await twilio
    .availablePhoneNumbers(countryCode)
    .local.list({
      areaCode,
    })
    .catch((err) => {
      console.log('phone number get err', err);
      fromNumber = config.TWILIO.TWILIO_NUMBER;
      return fromNumber;
    });
=======
  const data = await twilio.availablePhoneNumbers(countryCode).local.list({
    areaCode,
  });
>>>>>>> Stashed changes

  let number = data[0];

  if (typeof number === 'undefined') {
    const areaCode1 = areaCode.slice(1);

<<<<<<< Updated upstream
    const data1 = await twilio
      .availablePhoneNumbers(countryCode)
      .local.list({
        areaCode: areaCode1,
      })
      .catch((err) => {
        console.log('phone number get err', err);
        fromNumber = config.TWILIO.TWILIO_NUMBER;
        return fromNumber;
      });
=======
    const data1 = await twilio.availablePhoneNumbers(countryCode).local.list({
      areaCode: areaCode1,
    });
>>>>>>> Stashed changes
    number = data1[0];
  }

  if (typeof number !== 'undefined') {
    const proxy_number = await twilio.incomingPhoneNumbers
      .create({
        phoneNumber: number.phoneNumber,
        smsUrl: urls.SMS_RECEIVE_URL,
      })
      .then()
      .catch((err) => {
        console.log('proxy number error', err);
      });

    user['proxy_number'] = proxy_number.phoneNumber;
    fromNumber = proxy_number.phoneNumber;
    user.save().catch((err) => {
      console.log('err', err);
    });
  } else {
    fromNumber = config.TWILIO.TWILIO_NUMBER;
  }

  return fromNumber;
};

const matchUSPhoneNumber = (phoneNumberString) => {
  const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  let phoneNumber;
  if (match) {
    phoneNumber = '(' + match[2] + ') ' + match[3] + '-' + match[4];
  }
  return phoneNumber;
};

module.exports = {
  bulkVideo,
  bulkPdf,
  bulkImage,
  getTwilioNumber,
  matchUSPhoneNumber,
};
