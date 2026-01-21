// import axios from "axios";

// export default {
//     name: "deleteuser",
//     aliases: ["removeuser", "deluser", "rmuser"],
//     category: "Owner",
//     description: "Delete user from Wolf Host Pterodactyl panel (Owner Only)",
//     ownerOnly: true,
    
//     async execute(sock, m, args, PREFIX, extra) {
//         const jid = m.key.remoteJid;
//         const { jidManager } = extra;
        
//         // Owner check
//         if (!jidManager.isOwner(m)) {
//             return sock.sendMessage(jid, {
//                 text: `❌ Owner Only Command`
//             }, { quoted: m });
//         }
        
//         // Check if email is provided
//         if (args.length === 0) {
//             return sock.sendMessage(jid, {
//                 text: `📧 *Usage:* \`${PREFIX}deleteuser user@email.com\``
//             }, { quoted: m });
//         }

//         const email = args[0];
//         const PTERODACTYL_API_KEY = "ptla_u9ZUDn5B2z36xZYNQKPzyffMRJqdt5R0O1zOqeGNEJL";
//         const PTERODACTYL_PANEL_URL = "https://wolf-host.xcasper.site/api/application";

//         try {
//             // Step 1: Find user by email
//             const searchResponse = await axios({
//                 method: 'GET',
//                 url: `${PTERODACTYL_PANEL_URL}/users?filter[email]=${encodeURIComponent(email)}`,
//                 headers: {
//                     'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
//                     'Accept': 'application/json'
//                 },
//                 timeout: 10000
//             });

//             if (searchResponse.status !== 200 || !searchResponse.data.data.length) {
//                 return sock.sendMessage(jid, {
//                     text: `❌ User not found: ${email}`
//                 }, { quoted: m });
//             }

//             const user = searchResponse.data.data[0];
//             const userId = user.attributes.id;
//             const username = user.attributes.username;

//             // Step 2: Delete the user
//             const deleteResponse = await axios({
//                 method: 'DELETE',
//                 url: `${PTERODACTYL_PANEL_URL}/users/${userId}`,
//                 headers: {
//                     'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
//                     'Accept': 'application/json'
//                 },
//                 timeout: 10000
//             });

//             if (deleteResponse.status === 204) {
//                 await sock.sendMessage(jid, {
//                     text: `✅ User deleted successfully\n📧 ${email}\n👤 ${username}`
//                 }, { quoted: m });
//             } else {
//                 await sock.sendMessage(jid, {
//                     text: `❌ Failed to delete user\nStatus: ${deleteResponse.status}`
//                 }, { quoted: m });
//             }

//         } catch (error) {
//             console.error('[DELETEUSER] Error:', error.message);
            
//             if (error.response) {
//                 if (error.response.status === 404) {
//                     await sock.sendMessage(jid, {
//                         text: `❌ User not found: ${email}`
//                     }, { quoted: m });
//                 } else if (error.response.status === 401 || error.response.status === 403) {
//                     await sock.sendMessage(jid, {
//                         text: `🔐 Permission denied\nCheck API key permissions`
//                     }, { quoted: m });
//                 } else {
//                     await sock.sendMessage(jid, {
//                         text: `❌ API Error: ${error.response.status}`
//                     }, { quoted: m });
//                 }
//             } else if (error.code === 'ECONNREFUSED') {
//                 await sock.sendMessage(jid, {
//                     text: `❌ Panel offline\nCheck wolf-host.xcasper.site`
//                 }, { quoted: m });
//             } else {
//                 await sock.sendMessage(jid, {
//                     text: `❌ Error: ${error.message}`
//                 }, { quoted: m });
//             }
//         }
//     }
// };