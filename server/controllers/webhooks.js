
import { Webhook } from 'svix';
import User from '../models/User.js';


   const clerkWebhooks = async (req, res) => {
    try {
       const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

       // verify header
      await whook.verify(JSON.stringify(req.body),{
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"]

      })

      // getting data from req body 
      const { data, type } = req.body;

      
    switch (type) {
      case 'user.created': {

        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address ,
          image: data.image_url,
          name:data.first_name + " " + data.last_name ,
          resume: '',
        };
        await User.create(userData);
        res.json({})
        break;
      }

      case 'user.updated': {
         const userData = {
         
          email: data.email_addresses[0].email_address ,
          image: data.image_url,
          name:data.first_name + " " + data.last_name ,
         
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.json({})
        break;
      }
      case 'user.deleted': {
        await User.findByIdAndDelete(data.id);
        res.json({})
        break;
      }

      default:
        break;
    }

    } catch (error) {
      console.log(error.message)
      res.json({success:false, message:"Webhooks error"})
      
    }

  }
  export default clerkWebhooks;

//     // Verify webhook signature. Ensure CLERK_WEBHOOK_SECRET is set in Vercel env.

//     const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

//     // Passing full headers helps the library locate correct header names
//     await whook.verify(rawBody, req.headers);

//     const body = JSON.parse(rawBody.toString());
//     const { data, type } = req.body;

//     // // Safe helpers
//     // const getEmail = (d) =>
//     //   (d?.email_addresses && d.email_addresses[0]?.email_address) || d?.primary_email_address || null;
//     // const getName = (d) => {
//     //   const name = [d?.first_name, d?.last_name].filter(Boolean).join(' ');
//     //   return name || d?.name || '';
//     // };

//     switch (type) {
//       case 'user.created': {
//         const userPayload = {
//           _id: data.id,
//           email: getEmail(data),
//           image: data?.image_url || null,
//           name: getName(data),
//           resume: '',
//         };
//         // upsert: create if not exists, otherwise update
//         await User.findOneAndUpdate(
//           { _id: data.id },
//           { $set: userPayload },
//           { upsert: true, new: true, setDefaultsOnInsert: true }
//         );
//         return res.status(200).json({ message: 'User created/updated' });
//       }

//       case 'user.updated': {
//         const update = {
//           email: getEmail(data),
//           image: data?.image_url || null,
//           name: getName(data),
//         };
//         await User.findOneAndUpdate({ _id: data.id }, { $set: update }, { new: true });
//         return res.status(200).json({ message: 'User updated' });
//       }

//       case 'user.deleted': {
//         await User.deleteOne({ _id: data.id });
//         return res.status(200).json({ message: 'User deleted' });
//       }

//       default:
//         // Return 200 so the sender doesn't keep retrying; log if you want
//         return res.status(200).json({ message: 'Unhandled event type' });
//     }
//   } catch (err) {
//     console.error('Webhook handler error:', err?.message || err);
//     return res.status(400).json({ success: false, message: 'Webhook verification/processing failed' });
//   }
// }
// // ...existing code...