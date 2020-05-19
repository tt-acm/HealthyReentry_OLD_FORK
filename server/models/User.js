const mongoose = require('mongoose');


/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - email
 *        properties:
 *          _id:
 *            type: ObjectId
 *            description: Unique identifier automatically added to the user.
 *          name:
 *            type: String
 *            default: ""
 *            description: Neme of the user.
 *          email:
 *            type: String
 *            default: ""
 *            description: Email of the user, needs to be unique.
 *          office:
 *            type: String
 *            description: Office name as string.
 *          permissions:
 *            type: Object
 *            description: An object representing the true/false permission values for keys.
 *                         By default contains a permission set for 'admin' set to false.
 *          dateOfConsent:
 *            type: Date
 *            description: The consent date when a user signs the disclosure and consent form.
 *        example:
 *           name: Peter Parker
 *           email: pp_is_stuck@web.com
 *           office: New York
 *           dateOfConsent: "2020-05-13T19:52:51.297Z"
 *           permissions: { "admin": true, "read": true, "write": false }
 */
const UserSchema = new mongoose.Schema({
  // username: {
  //   type: String,
  //   unique: true,
  //   required: true,
  //   index: true
  // },
  name: {
    type: String,
    required: true,
    index: true,
    default: ""
  },
  email: {
    type: String,
    unique: true,
    index: true,
    default: ""
  },
  office: {
    type: String,
    default: ""
  },
  dateOfConsent: Date,
  permissions: {
    admin: {
      type: Boolean,
      default: false
    }
  }
}, {timestamps: true});


module.exports = mongoose.model('User', UserSchema);
