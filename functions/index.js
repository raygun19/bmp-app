/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const cors = require('cors')();
const admin = require("firebase-admin");
admin.initializeApp();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//     cors(request, response, () => {
//         // Your function logic here
//         response.send('Hello from Firebase with CORS!');
//     });
// });

exports.addUser = onRequest(async (request, response) => {
    cors(request, response, async () => {
      const newUser = request.body;
      try {
        const userRecord = await admin.auth().createUser(newUser);
        logger.info("User created:", userRecord.uid);
        response.json({ success: true, uid: userRecord.uid });
      } catch (error) {
        logger.error("Error in Firebase Server:", error);
        response.status(500).json({ success: false, error: error.message });
      }
    });
  });

//   exports.removeUser = onRequest(async (request, response) => {
//     cors(request, response, async () => {
//         const { uid } = request.params;
//         try {
//             await admin.auth().deleteUser(uid);
//             logger.info('User removed successfully');
//             response.json({ success: true, message: 'User removed successfully' });
//         } catch (error) {
//             logger.error('Error removing user:', error);
//             response.status(500).json({ success: false, error: error.message });
//         }
//     });
// });
exports.removeUser = onRequest(async (request, response) => {
    cors(request, response, async () => {
        const { uid } = request.body; // Extract uid from the request body

        if (uid && uid.length > 0 && uid.length <= 128) {
            try {
                await admin.auth().deleteUser(uid);
                logger.info('User removed successfully');
                response.json({ success: true, message: 'User removed successfully' });
            } catch (error) {
                logger.error('Error removing user:', error);
                response.status(500).json({ success: false, error: error.message });
            }
        } else {
            // Handle the case where the UID is not valid
            response.status(400).json({ success: false, error: 'Invalid UID' });
        }
    });
});



