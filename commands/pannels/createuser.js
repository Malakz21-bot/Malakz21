// import axios from "axios";
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export default {
//     name: "createuser",
//     aliases: ["adduser", "newuser", "registeruser", "cuser"],
//     category: "Owner",
//     description: "Create new user on Wolf Host Pterodactyl panel (Owner Only)",
//     ownerOnly: true,
    
//     async execute(sock, m, args, PREFIX, extra) {
//         const jid = m.key.remoteJid;
//         const { jidManager } = extra;
        
//         // Owner check
//         if (!jidManager.isOwner(m)) {
//             return sock.sendMessage(jid, {
//                 text: `❌ *OWNER ONLY COMMAND*\n\nOnly the bot owner can create users.\n\n` +
//                       `🔒 This command requires administrative privileges.`
//             }, { quoted: m });
//         }
        
//         // Pterodactyl API configuration
//         const PTERODACTYL_API_KEY = "ptla_u9ZUDn5B2z36xZYNQKPzyffMRJqdt5R0O1zOqeGNEJL";
//         const PTERODACTYL_PANEL_URL = "https://wolf-host.xcasper.site/api/application";
//         const PANEL_BASE_URL = "https://wolf-host.xcasper.site";
        
//         // Check if email is provided
//         if (args.length === 0) {
//             return sock.sendMessage(jid, {
//                 text: `🐺 *WOLF HOST - USER CREATION*\n\n` +
//                       `🔧 *Usage:* \`${PREFIX}createuser user@email.com\`\n\n` +
//                       `📝 *Examples:*\n` +
//                       `\`${PREFIX}createuser john@gmail.com\`\n` +
//                       `\`${PREFIX}createuser jane@outlook.com jane123\`\n` +
//                       `\`${PREFIX}createuser bob@yahoo.com bobgamer Bob Gamer\`\n\n` +
//                       `⚙️ *Auto-generated details:*\n` +
//                       `• Username: wolftechXXX (if not specified)\n` +
//                       `• Password: Random 4-digit\n` +
//                       `• Name: Wolf User (default)\n\n` +
//                       `⚠️ *Owner Only Command*`
//             }, { quoted: m });
//         }

//         // Extract arguments
//         const email = args[0];
//         const customUsername = args[1] || null;
//         const firstName = args[2] || "Wolf";
//         const lastName = args[3] || "User";

//         // Validate email
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//             return sock.sendMessage(jid, {
//                 text: `❌ *INVALID EMAIL FORMAT*\n\n` +
//                       `Please provide a valid email address.\n\n` +
//                       `✅ *Valid examples:*\n` +
//                       `• user@gmail.com\n` +
//                       `• user@outlook.com\n` +
//                       `• user@yahoo.com\n` +
//                       `• user@protonmail.com\n\n` +
//                       `❌ *Invalid examples:*\n` +
//                       `• user@.com\n` +
//                       `• user@gmail\n` +
//                       `• @gmail.com\n\n` +
//                       `🔧 *Try:* \`${PREFIX}createuser valid@email.com\``
//             }, { quoted: m });
//         }

//         // Generate random 4-digit password
//         const randomPassword = Math.floor(1000 + Math.random() * 9000).toString();
        
//         // Generate username
//         let username;
//         if (customUsername) {
//             username = customUsername.toLowerCase().replace(/[^a-z0-9]/g, '');
//             if (username.length < 3) {
//                 return sock.sendMessage(jid, {
//                     text: `❌ *INVALID USERNAME*\n\n` +
//                           `Username requirements:\n` +
//                           `• Minimum 3 characters\n` +
//                           `• Only letters (a-z) and numbers (0-9)\n` +
//                           `• No spaces or special characters\n\n` +
//                           `✅ *Good usernames:*\n` +
//                           `• wolftech123\n` +
//                           `• gamingwolf\n` +
//                           `• serverhost\n\n` +
//                           `❌ *Bad usernames:*\n` +
//                           `• ab (too short)\n` +
//                           `• wolf_tech (underscore)\n` +
//                           `• wolf-tech (hyphen)\n\n` +
//                           `📝 *Try:* \`${PREFIX}createuser ${email} wolftech123\``
//                 }, { quoted: m });
//             }
//         } else {
//             const randomNum = Math.floor(100 + Math.random() * 900);
//             username = `wolftech${randomNum}`;
//         }

//         try {
//             // Send initial status with website thumbnail info
//             // const statusMsg = await sock.sendMessage(jid, {
//             //     text: `🐺 *WOLF HOST - CREATING USER*\n\n` +
//             //           `🌐 *Panel:* Wolf Host Panel\n` +
//             //           `📧 *Email:* ${email}\n` +
//             //           `👤 *Username:* ${username}\n` +
//             //           `🔑 *Password:* ${'•'.repeat(4)}\n` +
//             //           `👑 *Status:* Owner Mode\n` +
//             //           `⏳ *Processing...*\n\n` +
//             //           `📸 *Thumbnail:* Wolf Host Logo\n` +
//             //           `🔒 *Security:* Owner Verified`
//             // }, { quoted: m });

//             console.log(`[CREATEUSER] Owner creating user: ${email} (${username})`);

//             // Create user via Pterodactyl API
//             const response = await axios({
//                 method: 'POST',
//                 url: `${PTERODACTYL_PANEL_URL}/users`,
//                 headers: {
//                     'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json',
//                     'User-Agent': 'Wolf-Host-Bot/1.0'
//                 },
//                 data: {
//                     email: email,
//                     username: username,
//                     first_name: firstName,
//                     last_name: lastName,
//                     password: randomPassword,
//                     root_admin: false,
//                     language: "en"
//                 },
//                 timeout: 20000,
//                 validateStatus: (status) => status < 500
//             });

//             console.log(`[CREATEUSER] API Response: ${response.status}`);

//             if (response.status === 201) {
//                 const userData = response.data.attributes;
//                 const userID = userData.id;
                
//                 // Get owner info
//                 const ownerJid = m.key.participant || jid;
//                 const cleanedOwner = jidManager.cleanJid(ownerJid);
//                 const ownerName = cleanedOwner.cleanNumber || "Owner";
                
//                 // Create beautiful credential card
//                 const credentialCard = 
// `┏━━━━━━━━━━━━━━
// ┃      🐺 WOLF HOST        
// ┃   📧 USER CREDENTIALS    
// ┣━━━━━━━━━━━━━━━
// ┃                          
// ┃  📧 *Email:* ${email}
// ┃  👤 *Username:* ${username}
// ┃  🔑 *Password:* ${randomPassword}
// ┃  🆔 *User ID:* ${userID}
// ┃  🔗 *Login URL:* ${PANEL_BASE_URL}/auth/login                                         
// ┣━━━━━━━━━━━━━━━
// ┃     👑 CREATED BY        
// ┣━━━━━━━━━━━━━━━━
// ┃                          
// ┃  Owner: ${ownerName}
// ┃  Time: ${new Date().toLocaleTimeString()}
// ┃  Date: ${new Date().toLocaleDateString()}
// ┃                          
// ┗━━━━━━━━━━━━━━━━┛`;

//                 // Send credentials in a secure way
//                 await sock.sendMessage(jid, {
//                     text: credentialCard
//                 }, { quoted: m });

//                 // Send website thumbnail and login instructions
// //                 const thumbnailMessage = 
// // `🌐 *WOLF HOST PANEL ACCESS*



// // 1. 📱 *Open Browser:*
// //    • Chrome, Firefox, Safari, Edge
// //    • Mobile or Desktop

// // 2. 🌐 *Visit Website:*
// //    • Go to: ${PANEL_BASE_URL}
// //    • Click "Login" (top right)

// // 3. 🔐 *Enter Credentials:*
// //    • *Username:* ${username}
// //    • *Password:* ${randomPassword}
// //    • Click "Sign In"

// // 4. ⚡ *Immediate Actions:*
// //    • Go to Account Settings
// //    • Change Password NOW!
// //    • Set up security questions
// //    • Verify email if prompted

// // 📱 *QUICK ACCESS LINKS:*
// // • 🔗 Login: ${PANEL_BASE_URL}/auth/login
// // • 📚 Docs: ${PANEL_BASE_URL}/docs
// // • 🆘 Support: ${PANEL_BASE_URL}/support
// // • 💰 Billing: ${PANEL_BASE_URL}/billing

// // ⚠️ *SECURITY REMINDERS:*
// // • 🚫 No hosting bug bots allowed!
// // • 🔒 Our systems are secured 24/7
// // • 👮 Monitored for suspicious activity
// // • 🛡️ DDoS protected infrastructure

// // 💡 *NEXT STEPS FOR USER:*
// // 1. Create first server
// // 2. Configure server settings
// // 3. Install applications
// // 4. Invite team members (if needed)

// // 👑 *OWNER NOTES:*
// // User created via Owner Bot Command
// // Created at: ${new Date().toLocaleString()}
// // User ID: ${userID}
// // Status: Active`;

// //                 await sock.sendMessage(jid, {
// //                     text: thumbnailMessage
// //                 }, { quoted: m });

//                 // Send quick action buttons
//                 try {
//                     await sock.sendMessage(jid, {
//                         templateButtons: [
//                             {
//                                 index: 1,
//                                 urlButton: {
//                                     displayText: "🌐 Login Now",
//                                     url: `${PANEL_BASE_URL}/auth/login`
//                                 }
//                             },
//                             {
//                                 index: 2,
//                                 urlButton: {
//                                     displayText: "📖 Documentation",
//                                     url: `${PANEL_BASE_URL}/docs`
//                                 }
//                             },
//                             {
//                                 index: 3,
//                                 quickReplyButton: {
//                                     displayText: `👑 Owner Menu`,
//                                     id: `${PREFIX}menu owner`
//                                 }
//                             }
//                         ],
//                         // caption: `✅ *USER CREATED SUCCESSFULLY*\n\n` +
//                         //         `👤 ${firstName} ${lastName}\n` +
//                         //         `📧 ${email}\n` +
//                         //         `👑 Created by Owner\n\n` +
//                         //         `🔐 Use username "${username}" to login`,
//                         // footer: "Wolf Host Panel • Owner Command",
//                         // headerType: 1
//                     });
//                 } catch (buttonError) {
//                     console.log("[CREATEUSER] Buttons not supported");
//                 }

//                 // Log the creation
//                 console.log(`✅ [CREATEUSER] Owner created user: ${email} (${username})`);
                
//                 // Send success confirmation
//                 // await sock.sendMessage(jid, {
//                 //     text: `✅ *USER CREATION COMPLETE*\n\n` +
//                 //           `👤 *User:* ${firstName} ${lastName}\n` +
//                 //           `📧 *Email:* ${email}\n` +
//                 //           `🔑 *Temp Password:* ${randomPassword}\n` +
//                 //           `👑 *Created by:* Owner\n` +
//                 //           `⏰ *Time:* ${new Date().toLocaleTimeString()}\n\n` +
//                 //           `⚠️ *Security Note:*\n` +
//                 //           `User must change password immediately!\n` +
//                 //           `Share login URL: ${PANEL_BASE_URL}\n\n` +
//                 //           `🚫 *NO HOSTING BUG BOTS ALLOWED!*`
//                 // }, { quoted: m });

//             } else if (response.status === 422) {
//                 const errors = response.data.errors || {};
//                 let errorDetails = `❌ *VALIDATION FAILED*\n\n`;
                
//                 if (errors.email) errorDetails += `📧 Email: ${errors.email[0]}\n`;
//                 if (errors.username) errorDetails += `👤 Username: ${errors.username[0]}\n`;
//                 if (errors.password) errorDetails += `🔑 Password: ${errors.password[0]}\n`;
                
//                 errorDetails += `\n🔧 *Suggestions:*\n`;
//                 errorDetails += `• Try different username\n`;
//                 errorDetails += `• Check email format\n`;
//                 errorDetails += `• Use simpler password\n\n`;
//                 errorDetails += `📝 *Example:* \`${PREFIX}createuser ${email} wolftech123\``;

//                 await sock.sendMessage(jid, {
//                     text: errorDetails,
//                     edit: statusMsg.key
//                 });

//             } else if (response.status === 409) {
//                 await sock.sendMessage(jid, {
//                     text: `⚠️ *DUPLICATE USER*\n\n` +
//                           `User with email ${email} already exists.\n\n` +
//                           `🔧 *Owner Options:*\n` +
//                           `• Reset password in panel\n` +
//                           `• Delete existing user\n` +
//                           `• Use different email\n\n` +
//                           `📝 *Try:* \`${PREFIX}createuser different@email.com\``,
//                     edit: statusMsg.key
//                 });

//             } else if (response.status === 401 || response.status === 403) {
//                 await sock.sendMessage(jid, {
//                     text: `🔐 *OWNER PERMISSION ERROR*\n\n` +
//                           `API key lacks permission to create users.\n\n` +
//                           `👑 *Owner Action Required:*\n` +
//                           `1. Login to panel as admin\n` +
//                           `2. Go to Admin → API\n` +
//                           `3. Edit API key permissions\n` +
//                           `4. Enable ALL user permissions\n` +
//                           `5. Save and retry\n\n` +
//                           `🔗 *Panel:* ${PANEL_BASE_URL}/admin/api`,
//                     edit: statusMsg.key
//                 });

//             } else {
//                 const errorData = response.data ? JSON.stringify(response.data).substring(0, 150) + '...' : 'No response data';
//                 await sock.sendMessage(jid, {
//                     text: `❌ *API ERROR [${response.status}]*\n\n` +
//                           `Failed to create user.\n\n` +
//                           `📋 *Response:*\n` +
//                           `${errorData}\n\n` +
//                           `🔧 *Check:*\n` +
//                           `• Panel is online\n` +
//                           `• API key is valid\n` +
//                           `• Network connection`,
//                     edit: statusMsg.key
//                 });
//             }

//         } catch (error) {
//             console.error('❌ [CREATEUSER] ERROR:', error.message);
            
//             let errorMessage = `❌ *CREATION FAILED - OWNER ALERT*\n\n`;
            
//             if (error.code === 'ECONNREFUSED') {
//                 errorMessage += `• Panel is OFFLINE\n`;
//                 errorMessage += `• Check: systemctl status pteroq\n`;
//                 errorMessage += `• URL: ${PANEL_BASE_URL}\n\n`;
//             } else if (error.code === 'ENOTFOUND') {
//                 errorMessage += `• DNS resolution failed\n`;
//                 errorMessage += `• Check domain: wolf-host.xcasper.site\n`;
//                 errorMessage += `• Verify DNS settings\n\n`;
//             } else if (error.code === 'ETIMEDOUT') {
//                 errorMessage += `• Connection timeout\n`;
//                 errorMessage += `• Panel overloaded\n`;
//                 errorMessage += `• Try again later\n\n`;
//             } else if (error.response) {
//                 errorMessage += `• API Error: ${error.response.status}\n`;
//                 const errorData = error.response.data ? JSON.stringify(error.response.data).substring(0, 100) + '...' : 'No data';
//                 errorMessage += `• Details: ${errorData}\n\n`;
//             } else {
//                 errorMessage += `• Error: ${error.message}\n\n`;
//             }
            
//             errorMessage += `👑 *OWNER TROUBLESHOOTING:*\n`;
//             errorMessage += `1. Test panel: ${PANEL_BASE_URL}\n`;
//             errorMessage += `2. Check API key in admin panel\n`;
//             errorMessage += `3. Verify panel services are running\n`;
//             errorMessage += `4. Check error logs\n\n`;
            
//             errorMessage += `📋 *Manual Creation Steps:*\n`;
//             errorMessage += `1. Login to ${PANEL_BASE_URL}\n`;
//             errorMessage += `2. Go to Users → Create New\n`;
//             errorMessage += `3. Fill user details\n`;
//             errorMessage += `4. Save and share credentials\n\n`;
            
//             errorMessage += `🚫 *Security Notice:*\n`;
//             errorMessage += `No hosting bug bots allowed!\n`;
//             errorMessage += `Our systems are monitored 24/7`;

//             await sock.sendMessage(jid, {
//                 text: errorMessage
//             }, { quoted: m });
//         }
//     }
// };