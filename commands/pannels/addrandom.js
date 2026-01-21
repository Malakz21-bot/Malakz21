// import axios from "axios";

// export default {
//     name: "addrandom",
//     aliases: ["randomall", "bulkall", "createrandomall"],
//     category: "Owner",
//     description: "Create random users with simple usernames and unlimited servers",
//     ownerOnly: true,
    
//     async execute(sock, m, args, PREFIX, extra) {
//         const jid = m.key.remoteJid;
//         const { jidManager } = extra;
        
//         // Owner check
//         if (!jidManager.isOwner(m)) {
//             return sock.sendMessage(jid, {
//                 text: `❌ Owner only command.`
//             }, { quoted: m });
//         }
        
//         // Get number of users to create
//         if (args.length === 0) {
//             return sock.sendMessage(jid, {
//                 text: `📦 *Usage:* ${PREFIX}addrandom [amount]\n📝 *Example:* ${PREFIX}addrandom 10`
//             }, { quoted: m });
//         }
        
//         const count = parseInt(args[0]);
//         if (isNaN(count) || count < 1 || count > 50) {
//             return sock.sendMessage(jid, {
//                 text: `❌ Please enter a valid number (1-50).`
//             }, { quoted: m });
//         }
        
//         // API configuration
//         const PTERODACTYL_API_KEY = "ptla_u9ZUDn5B2z36xZYNQKPzyffMRJqdt5R0O1zOqeGNEJL";
//         const PTERODACTYL_PANEL_URL = "https://wolf-host.xcasper.site/api/application";
//         const PANEL_BASE_URL = "https://wolf-host.xcasper.site";
        
//         // Send initial status
//         const statusMsg = await sock.sendMessage(jid, {
//             text: `🚀 Creating ${count} users with simple usernames...\n\n0/${count} users created\n0/${count} servers created`
//         }, { quoted: m });
        
//         const allUsers = [];
//         const failedUsers = [];
        
//         // Simple 4-letter usernames
//         const simpleUsernames = [
//             'wolf', 'tech', 'host', 'game', 'node', 'java', 'mine', 'rust', 'code', 'data',
//             'site', 'web', 'app', 'api', 'bot', 'ai', 'dev', 'ops', 'net', 'cloud',
//             'easy', 'fast', 'safe', 'cool', 'free', 'pro', 'max', 'mini', 'mega', 'ultra',
//             'fire', 'ice', 'wind', 'star', 'moon', 'sun', 'sky', 'sea', 'land', 'rock',
//             'gold', 'silver', 'iron', 'steel', 'time', 'space', 'nova', 'cosmo', 'astro', 'quant'
//         ];
        
//         // Data for generation
//         const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'protonmail.com'];
//         const firstNames = ['alex', 'john', 'mike', 'david', 'chris', 'steve', 'ryan', 'kevin'];
//         const lastNames = ['smith', 'johnson', 'williams', 'brown', 'jones', 'miller', 'davis'];
        
//         // Get egg details
//         let eggId = 15; // ArmangzOfficial egg ID
//         let eggName = "ArmangzOfficial";
//         let eggDetails = null;
//         let environment = {};
        
//         try {
//             // Get egg details including variables
//             const eggDetailResponse = await axios({
//                 method: 'GET',
//                 url: `${PTERODACTYL_PANEL_URL}/nests/5/eggs/${eggId}?include=variables`,
//                 headers: {
//                     'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
//                     'Accept': 'application/json'
//                 },
//                 timeout: 10000
//             });

//             if (eggDetailResponse.status === 200) {
//                 eggDetails = eggDetailResponse.data.attributes;
//                 const eggVariables = eggDetails.relationships?.variables?.data || [];

//                 // Build environment variables
//                 for (const variable of eggVariables) {
//                     const varAttrs = variable.attributes;
//                     environment[varAttrs.env_variable] = varAttrs.default_value || varAttrs.rules_value || '';
//                 }
//             }
//         } catch (error) {
//             console.log('[ADDRANDOM] Using default egg variables');
//             environment = {
//                 CMD_RUN: "npm start",
//                 AUTO_UPDATE: "0",
//                 USER_UPLOAD: "0"
//             };
//         }
        
//         // Keep track of used allocations and usernames
//         let usedAllocations = new Set();
//         let usedUsernames = new Set();
        
//         // Main loop
//         for (let i = 1; i <= count; i++) {
//             try {
//                 // Generate random user data
//                 const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
//                 const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
//                 const domain = domains[Math.floor(Math.random() * domains.length)];
//                 const randomNum = Math.floor(Math.random() * 1000);
                
//                 // Create email
//                 const email = `${firstName}${lastName}${randomNum}@${domain}`.toLowerCase();
                
//                 // Generate simple 4-letter username (ensure unique)
//                 let username;
//                 let attempts = 0;
//                 do {
//                     username = simpleUsernames[Math.floor(Math.random() * simpleUsernames.length)];
//                     attempts++;
//                     if (attempts > 50) {
//                         // Fallback: username + 2 digits
//                         const baseUsername = simpleUsernames[Math.floor(Math.random() * simpleUsernames.length)];
//                         username = `${baseUsername}${Math.floor(Math.random() * 100)}`.substring(0, 6);
//                     }
//                 } while (usedUsernames.has(username) && attempts <= 50);
                
//                 usedUsernames.add(username);
                
//                 // Generate simple 4-digit password
//                 const password = Math.floor(1000 + Math.random() * 9000).toString();
//                 const fullName = `${firstName.charAt(0).toUpperCase() + firstName.slice(1)} ${lastName.charAt(0).toUpperCase() + lastName.slice(1)}`;
                
//                 // Update status
//                 await sock.sendMessage(jid, {
//                     text: `🚀 Creating ${i}/${count} users...\n\n${i-1}/${count} users created\n${i-1}/${count} servers created\n\nCurrent: ${username}`,
//                     edit: statusMsg.key
//                 });
                
//                 console.log(`[ADDRANDOM] Creating user ${i}: ${username} (${email})`);
                
//                 // Step 1: Create user
//                 const userResponse = await axios({
//                     method: 'POST',
//                     url: `${PTERODACTYL_PANEL_URL}/users`,
//                     headers: {
//                         'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
//                         'Accept': 'application/json',
//                         'Content-Type': 'application/json'
//                     },
//                     data: {
//                         email: email,
//                         username: username,
//                         first_name: firstName,
//                         last_name: lastName,
//                         password: password,
//                         root_admin: false,
//                         language: "en"
//                     },
//                     timeout: 10000
//                 });
                
//                 if (userResponse.status !== 201) {
//                     console.error(`[ADDRANDOM] User creation failed: ${userResponse.status}`);
//                     // Remove username from used set
//                     usedUsernames.delete(username);
//                     failedUsers.push({ 
//                         type: 'user', 
//                         username: username,
//                         error: `Status: ${userResponse.status}` 
//                     });
//                     continue;
//                 }
                
//                 const userData = userResponse.data.attributes;
//                 const userId = userData.id;
                
//                 console.log(`✅ Created user: ${username} (ID: ${userId})`);
                
//                 // Small delay
//                 await new Promise(resolve => setTimeout(resolve, 500));
                
//                 // Step 2: Create server for this user
//                 try {
//                     // Get available allocations
//                     const allocResponse = await axios({
//                         method: 'GET',
//                         url: `${PTERODACTYL_PANEL_URL}/nodes/1/allocations?per_page=100`,
//                         headers: {
//                             'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
//                             'Accept': 'application/json'
//                         },
//                         timeout: 10000
//                     });

//                     if (allocResponse.status !== 200 || !allocResponse.data.data.length) {
//                         failedUsers.push({ 
//                             type: 'server', 
//                             username: username, 
//                             error: 'No allocations' 
//                         });
//                         continue;
//                     }

//                     // Find unused allocation
//                     const allocations = allocResponse.data.data;
//                     let availableAlloc = null;
                    
//                     for (const allocation of allocations) {
//                         const allocId = allocation.attributes.id;
//                         if (allocation.attributes.assigned === false && !usedAllocations.has(allocId)) {
//                             availableAlloc = allocation;
//                             usedAllocations.add(allocId);
//                             break;
//                         }
//                     }

//                     if (!availableAlloc) {
//                         failedUsers.push({ 
//                             type: 'server', 
//                             username: username, 
//                             error: 'No free ports' 
//                         });
//                         continue;
//                     }

//                     const serverName = `${username}-server`;
                    
//                     // Create server
//                     const createResponse = await axios({
//                         method: 'POST',
//                         url: `${PTERODACTYL_PANEL_URL}/servers`,
//                         headers: {
//                             'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
//                             'Accept': 'application/json',
//                             'Content-Type': 'application/json'
//                         },
//                         data: {
//                             name: serverName,
//                             user: userId,
//                             egg: eggId,
//                             docker_image: eggDetails?.docker_image || "ghcr.io/parkervcp/yolks:nodejs_24",
//                             startup: eggDetails?.startup || "npm start",
//                             environment: environment,
//                             limits: {
//                                 memory: 0,
//                                 swap: 0,
//                                 disk: 0,
//                                 io: 500,
//                                 cpu: 0
//                             },
//                             feature_limits: {
//                                 databases: 0,
//                                 backups: 0,
//                                 allocations: 1
//                             },
//                             allocation: {
//                                 default: availableAlloc.attributes.id
//                             },
//                             deploy: {
//                                 locations: [1],
//                                 dedicated_ip: false,
//                                 port_range: []
//                             },
//                             nest: 5,
//                             description: `Created for ${username}`,
//                             start_on_completion: true
//                         },
//                         timeout: 15000
//                     });

//                     if (createResponse.status === 201) {
//                         const serverData = createResponse.data.attributes;
//                         console.log(`✅ Created server for ${username}`);
                        
//                         allUsers.push({
//                             website: PANEL_BASE_URL,
//                             username: username,
//                             email: email,
//                             password: password,
//                             name: fullName,
//                             server: serverData.name,
//                             port: availableAlloc.attributes.port,
//                             identifier: serverData.identifier,
//                             resources: '∞ Memory | ∞ Disk | ∞ CPU'
//                         });
//                     } else {
//                         // Remove allocation from used set
//                         usedAllocations.delete(availableAlloc.attributes.id);
//                         failedUsers.push({ 
//                             type: 'server', 
//                             username: username, 
//                             error: `Server: ${createResponse.status}` 
//                         });
//                     }

//                 } catch (serverError) {
//                     console.error(`❌ Server error for ${username}:`, serverError.message);
//                     failedUsers.push({ 
//                         type: 'server', 
//                         username: username, 
//                         error: serverError.message.substring(0, 50) 
//                     });
//                 }
                
//                 // Delay between users
//                 await new Promise(resolve => setTimeout(resolve, 1500));
                
//             } catch (error) {
//                 console.error(`❌ General error:`, error.message);
//                 failedUsers.push({ 
//                     type: 'general', 
//                     username: `user${i}`, 
//                     error: error.message.substring(0, 50) 
//                 });
//             }
//         }
        
//         // // Generate final report
//          let report = `📊 *ENJOY FOR A WHILE*\n\n`;
         
//         // report += `✅ *Created:* ${allUsers.length} users with servers\n`;
//         // report += `❌ *Failed:* ${failedUsers.length} entries\n`;
//         // report += `👤 *Usernames:* Simple 4-letter words\n`;
//         // report += `🔑 *Passwords:* 4-digit numbers\n`;
//         // report += `⚡ *Resources:* UNLIMITED (0 limits)\n`;
//         // report += `⏰ *Time:* ${new Date().toLocaleTimeString()}\n\n`;
        
//         if (allUsers.length > 0) {
//             report += `*📦 CREATED ACCOUNTS:*\n`;
//             report += `═════════════════════\n`;
            
//             allUsers.forEach((user, index) => {
//                 report += `\n🔹 *Account ${index + 1}:*\n`;
//                 report += `👤 *Username:* ${user.username}\n`;
//                 report += `🔑 *Password:* ${user.password}\n`;
//                 report += `📧 *Email:* ${user.email}\n`;
//                 // report += `🖥️ *Server:* ${user.server}\n`;
//                  report += `🌐 *Panel:* ${user.website}\n`;
//                 // report += `🔌 *Port:* ${user.port}\n`;
//                 // report += `⚡ *Resources:* ${user.resources}\n`;
//                 report += `───────────────────\n`;
//             });
            
//             // report += `\n*🔗 LOGIN INSTRUCTIONS:*\n`;
//             // report += `1. Go to: ${PANEL_BASE_URL}/auth/login\n`;
//             // report += `2. Username: (see above)\n`;
//             // report += `3. Password: (see above)\n`;
//             // report += `4. Click "Sign In"\n\n`;
            
//             // report += `*💡 FEATURES:*\n`;
//             // report += `• Simple 4-letter usernames\n`;
//             // report += `• Easy 4-digit passwords\n`;
//             // report += `• Unlimited resources\n`;
//             // report += `• Ready-to-use servers\n\n`;
            
//             report += `📋 *TOTAL:* ${allUsers.length} accounts ✅\n\n`;
//             report += `> Silent Wolf\n`
//         } else {
//             report += `*😔 No accounts were created*\n`;
//             report += `Check error details below.`;
//         }
        
//         // Send final report
//         await sock.sendMessage(jid, {
//             text: report
//         }, { quoted: m });
        
//         // Send failure details if any
//         if (failedUsers.length > 0) {
//             let failedReport = `\n*⚠️ FAILED CREATIONS (${failedUsers.length}):*\n`;
            
//             failedUsers.forEach((fail, idx) => {
//                 failedReport += `${idx + 1}. ${fail.username}\n`;
//                 failedReport += `   ${fail.error}\n`;
//                 if (idx < failedUsers.length - 1) failedReport += `\n`;
//             });
            
//             await sock.sendMessage(jid, { text: failedReport });
//         }
        
//         // Final message
//         if (allUsers.length > 0) {
//             await sock.sendMessage(jid, {
//                 //text: `🎉 *DONE!* ${allUsers.length} accounts with simple usernames created!\nEasy login with 4-letter usernames & 4-digit passwords. ✅`
//             });
//         }
//     }
// };