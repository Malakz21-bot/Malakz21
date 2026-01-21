// // // import axios from "axios";

// // // export default {
// // //     name: "addserver",
// // //     aliases: ["createserver", "newserver", "makeserver"],
// // //     category: "Owner",
// // //     description: "Create server with zero resources (Owner Only)",
// // //     ownerOnly: true,
    
// // //     async execute(sock, m, args, PREFIX, extra) {
// // //         const jid = m.key.remoteJid;
// // //         const { jidManager } = extra;
        
// // //         // Owner check
// // //         if (!jidManager.isOwner(m)) {
// // //             return sock.sendMessage(jid, {
// // //                 text: `❌ Owner Only Command`
// // //             }, { quoted: m });
// // //         }
        
// // //         // Check if email is provided
// // //         if (args.length === 0) {
// // //             return sock.sendMessage(jid, {
// // //                 text: `📧 *Usage:* \`${PREFIX}addserver user@email.com\``
// // //             }, { quoted: m });
// // //         }

// // //         const email = args[0];
// // //         const PTERODACTYL_API_KEY = "ptla_u9ZUDn5B2z36xZYNQKPzyffMRJqdt5R0O1zOqeGNEJL";
// // //         const PTERODACTYL_PANEL_URL = "https://wolf-host.xcasper.site/api/application";
// // //         const PANEL_URL = "https://wolf-host.xcasper.site";

// // //         try {
// // //             // Step 1: Find user by email
// // //             const searchResponse = await axios({
// // //                 method: 'GET',
// // //                 url: `${PTERODACTYL_PANEL_URL}/users?filter[email]=${encodeURIComponent(email)}`,
// // //                 headers: {
// // //                     'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
// // //                     'Accept': 'application/json'
// // //                 },
// // //                 timeout: 10000
// // //             });

// // //             if (searchResponse.status !== 200 || !searchResponse.data.data.length) {
// // //                 return sock.sendMessage(jid, {
// // //                     text: `❌ User not found: ${email}`
// // //                 }, { quoted: m });
// // //             }

// // //             const user = searchResponse.data.data[0];
// // //             const userId = user.attributes.id;
// // //             const username = user.attributes.username;

// // //             // Generate server name
// // //             const serverName = `Server-${username}-${Date.now().toString().slice(-6)}`;

// // //             // Step 2: Get eggs from nest ID 5 (caspertech)
// // //             const eggsResponse = await axios({
// // //                 method: 'GET',
// // //                 url: `${PTERODACTYL_PANEL_URL}/nests/5/eggs`,
// // //                 headers: {
// // //                     'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
// // //                     'Accept': 'application/json'
// // //                 },
// // //                 timeout: 10000
// // //             });

// // //             if (eggsResponse.status !== 200 || !eggsResponse.data.data.length) {
// // //                 return sock.sendMessage(jid, {
// // //                     text: `❌ No eggs found in nest 5`
// // //                 }, { quoted: m });
// // //             }

// // //             // Find ArmangzOfficial egg (you need to check the actual egg ID)
// // //             const eggs = eggsResponse.data.data;
// // //             let armangzEgg = null;
            
// // //             // Try to find ArmangzOfficial egg by name
// // //             for (const egg of eggs) {
// // //                 if (egg.attributes.name.toLowerCase().includes('armangz')) {
// // //                     armangzEgg = egg;
// // //                     break;
// // //                 }
// // //             }

// // //             // If not found, use the first egg
// // //             if (!armangzEgg) {
// // //                 armangzEgg = eggs[0];
// // //             }

// // //             const eggId = armangzEgg.attributes.id;
// // //             const eggName = armangzEgg.attributes.name;

// // //             // Step 3: Create server with zero resources
// // //             const createResponse = await axios({
// // //                 method: 'POST',
// // //                 url: `${PTERODACTYL_PANEL_URL}/servers`,
// // //                 headers: {
// // //                     'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
// // //                     'Accept': 'application/json',
// // //                     'Content-Type': 'application/json'
// // //                 },
// // //                 data: {
// // //                     name: serverName,
// // //                     user: userId,
// // //                     egg: eggId,
// // //                     docker_image: armangzEgg.attributes.docker_image || "quay.io/pterodactyl/core:java",
// // //                     startup: armangzEgg.attributes.startup || "java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}",
// // //                     environment: armangzEgg.attributes.environment || {
// // //                         SERVER_JARFILE: "server.jar",
// // //                         BUILD_NUMBER: "latest"
// // //                     },
// // //                     limits: {
// // //                         memory: 0,     // Unlimited memory
// // //                         swap: 0,       // Disable swap
// // //                         disk: 0,       // Unlimited disk
// // //                         io: 500,
// // //                         cpu: 0         // Unlimited CPU
// // //                     },
// // //                     feature_limits: {
// // //                         databases: 0,
// // //                         backups: 0,
// // //                         allocations: 1
// // //                     },
// // //                     allocation: {
// // //                         default: 1     // Default allocation
// // //                     },
// // //                     nest: 5,           // Nest ID 5 (caspertech)
// // //                     description: "Created via Wolf Host Bot",
// // //                     start_on_completion: true
// // //                 },
// // //                 timeout: 15000
// // //             });

// // //             if (createResponse.status === 201) {
// // //                 const serverData = createResponse.data.attributes;
// // //                 const serverId = serverData.id;
// // //                 const identifier = serverData.identifier;
                
// // //                 await sock.sendMessage(jid, {
// // //                     text: `✅ Server created successfully\n📧 ${email}\n👤 ${username}\n🆔 ${serverId}\n🥚 ${eggName}\n🔗 ${PANEL_URL}/server/${identifier}`
// // //                 }, { quoted: m });
// // //             } else {
// // //                 await sock.sendMessage(jid, {
// // //                     text: `❌ Failed to create server\nStatus: ${createResponse.status}`
// // //                 }, { quoted: m });
// // //             }

// // //         } catch (error) {
// // //             console.error('[ADDSERVER] Error:', error.message);
            
// // //             if (error.response) {
// // //                 if (error.response.status === 404) {
// // //                     await sock.sendMessage(jid, {
// // //                         text: `❌ User or nest not found`
// // //                     }, { quoted: m });
// // //                 } else if (error.response.status === 401 || error.response.status === 403) {
// // //                     await sock.sendMessage(jid, {
// // //                         text: `🔐 Permission denied`
// // //                     }, { quoted: m });
// // //                 } else {
// // //                     const errorMsg = error.response.data ? JSON.stringify(error.response.data.errors || error.response.data).substring(0, 100) : 'No details';
// // //                     await sock.sendMessage(jid, {
// // //                         text: `❌ API Error: ${error.response.status}\n${errorMsg}`
// // //                     }, { quoted: m });
// // //                 }
// // //             } else if (error.code === 'ECONNREFUSED') {
// // //                 await sock.sendMessage(jid, {
// // //                     text: `❌ Panel offline`
// // //                 }, { quoted: m });
// // //             } else {
// // //                 await sock.sendMessage(jid, {
// // //                     text: `❌ Error: ${error.message}`
// // //                 }, { quoted: m });
// // //             }
// // //         }
// // //     }
// // // };





















// // import axios from "axios";

// // export default {
// //     name: "addserver",
// //     aliases: ["createserver", "newserver", "makeserver"],
// //     category: "Owner",
// //     description: "Create server with zero resources (Owner Only)",
// //     ownerOnly: true,
    
// //     async execute(sock, m, args, PREFIX, extra) {
// //         const jid = m.key.remoteJid;
// //         const { jidManager } = extra;
        
// //         // Owner check
// //         if (!jidManager.isOwner(m)) {
// //             return sock.sendMessage(jid, {
// //                 text: `❌ Owner Only Command`
// //             }, { quoted: m });
// //         }
        
// //         // Check if email is provided
// //         if (args.length === 0) {
// //             return sock.sendMessage(jid, {
// //                 text: `📧 *Usage:* \`${PREFIX}addserver user@email.com\``
// //             }, { quoted: m });
// //         }

// //         const email = args[0];
// //         const PTERODACTYL_API_KEY = "ptla_u9ZUDn5B2z36xZYNQKPzyffMRJqdt5R0O1zOqeGNEJL";
// //         const PTERODACTYL_PANEL_URL = "https://wolf-host.xcasper.site/api/application";
// //         const PANEL_URL = "https://wolf-host.xcasper.site";

// //         try {
// //             // Step 1: Find user by email
// //             const searchResponse = await axios({
// //                 method: 'GET',
// //                 url: `${PTERODACTYL_PANEL_URL}/users?filter[email]=${encodeURIComponent(email)}`,
// //                 headers: {
// //                     'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
// //                     'Accept': 'application/json'
// //                 },
// //                 timeout: 10000
// //             });

// //             if (searchResponse.status !== 200 || !searchResponse.data.data.length) {
// //                 return sock.sendMessage(jid, {
// //                     text: `❌ User not found: ${email}`
// //                 }, { quoted: m });
// //             }

// //             const user = searchResponse.data.data[0];
// //             const userId = user.attributes.id;
// //             const username = user.attributes.username;

// //             // Generate server name
// //             const serverName = `Server-${username}-${Date.now().toString().slice(-6)}`;

// //             // Step 2: Get eggs from nest ID 5 (caspertech)
// //             const eggsResponse = await axios({
// //                 method: 'GET',
// //                 url: `${PTERODACTYL_PANEL_URL}/nests/5/eggs`,
// //                 headers: {
// //                     'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
// //                     'Accept': 'application/json'
// //                 },
// //                 timeout: 10000
// //             });

// //             if (eggsResponse.status !== 200 || !eggsResponse.data.data.length) {
// //                 return sock.sendMessage(jid, {
// //                     text: `❌ No eggs found in nest 5`
// //                 }, { quoted: m });
// //             }

// //             // Find ArmangzOfficial egg (you need to check the actual egg ID)
// //             const eggs = eggsResponse.data.data;
// //             let armangzEgg = null;
            
// //             // Try to find ArmangzOfficial egg by name
// //             for (const egg of eggs) {
// //                 if (egg.attributes.name.toLowerCase().includes('armangz')) {
// //                     armangzEgg = egg;
// //                     break;
// //                 }
// //             }

// //             // If not found, use the first egg
// //             if (!armangzEgg) {
// //                 armangzEgg = eggs[0];
// //             }

// //             const eggId = armangzEgg.attributes.id;
// //             const eggName = armangzEgg.attributes.name;

// //             // Step 3: Get specific egg details including variables
// //             const eggDetailResponse = await axios({
// //                 method: 'GET',
// //                 url: `${PTERODACTYL_PANEL_URL}/nests/5/eggs/${eggId}?include=variables`,
// //                 headers: {
// //                     'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
// //                     'Accept': 'application/json'
// //                 },
// //                 timeout: 10000
// //             });

// //             if (eggDetailResponse.status !== 200) {
// //                 return sock.sendMessage(jid, {
// //                     text: `❌ Failed to get egg details`
// //                 }, { quoted: m });
// //             }

// //             const eggDetails = eggDetailResponse.data.attributes;
// //             const eggVariables = eggDetails.relationships?.variables?.data || [];

// //             // Build environment variables
// //             const environment = {};
// //             for (const variable of eggVariables) {
// //                 const varAttrs = variable.attributes;
// //                 environment[varAttrs.env_variable] = varAttrs.default_value || varAttrs.rules_value || '';
// //             }

// //             // Step 4: Create server with zero resources
// //             const createResponse = await axios({
// //                 method: 'POST',
// //                 url: `${PTERODACTYL_PANEL_URL}/servers`,
// //                 headers: {
// //                     'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
// //                     'Accept': 'application/json',
// //                     'Content-Type': 'application/json'
// //                 },
// //                 data: {
// //                     name: serverName,
// //                     user: userId,
// //                     egg: eggId,
// //                     docker_image: eggDetails.docker_image,
// //                     startup: eggDetails.startup,
// //                     environment: environment,
// //                     limits: {
// //                         memory: 0,     // Unlimited memory
// //                         swap: 0,       // Disable swap
// //                         disk: 0,       // Unlimited disk
// //                         io: 500,
// //                         cpu: 0         // Unlimited CPU
// //                     },
// //                     feature_limits: {
// //                         databases: 0,
// //                         backups: 0,
// //                         allocations: 1
// //                     },
// //                     allocation: {
// //                         default: 1     // Default allocation
// //                     },
// //                     nest: 5,           // Nest ID 5 (caspertech)
// //                     description: "Created via Wolf Host Bot",
// //                     start_on_completion: true
// //                 },
// //                 timeout: 15000
// //             });

// //             if (createResponse.status === 201) {
// //                 const serverData = createResponse.data.attributes;
// //                 const serverId = serverData.id;
// //                 const identifier = serverData.identifier;
                
// //                 await sock.sendMessage(jid, {
// //                     text: `✅ Server created successfully\n📧 ${email}\n👤 ${username}\n🆔 ${serverId}\n🥚 ${eggName}\n🔗 ${PANEL_URL}/server/${identifier}`
// //                 }, { quoted: m });
// //             } else {
// //                 await sock.sendMessage(jid, {
// //                     text: `❌ Failed to create server\nStatus: ${createResponse.status}`
// //                 }, { quoted: m });
// //             }

// //         } catch (error) {
// //             console.error('[ADDSERVER] Error:', error.message);
            
// //             if (error.response) {
// //                 if (error.response.status === 404) {
// //                     await sock.sendMessage(jid, {
// //                         text: `❌ User or nest not found`
// //                     }, { quoted: m });
// //                 } else if (error.response.status === 401 || error.response.status === 403) {
// //                     await sock.sendMessage(jid, {
// //                         text: `🔐 Permission denied`
// //                     }, { quoted: m });
// //                 } else if (error.response.status === 422) {
// //                     // Validation error - show the specific field error
// //                     const errors = error.response.data.errors || [];
// //                     let errorMsg = `❌ Validation Error:\n`;
                    
// //                     if (Array.isArray(errors)) {
// //                         errors.forEach(err => {
// //                             errorMsg += `• ${err.detail || JSON.stringify(err)}\n`;
// //                         });
// //                     } else if (typeof errors === 'object') {
// //                         Object.keys(errors).forEach(key => {
// //                             errorMsg += `• ${key}: ${errors[key][0]}\n`;
// //                         });
// //                     }
                    
// //                     await sock.sendMessage(jid, {
// //                         text: errorMsg.substring(0, 500)
// //                     }, { quoted: m });
// //                 } else {
// //                     const errorMsg = error.response.data ? JSON.stringify(error.response.data.errors || error.response.data).substring(0, 200) : 'No details';
// //                     await sock.sendMessage(jid, {
// //                         text: `❌ API Error: ${error.response.status}\n${errorMsg}`
// //                     }, { quoted: m });
// //                 }
// //             } else if (error.code === 'ECONNREFUSED') {
// //                 await sock.sendMessage(jid, {
// //                     text: `❌ Panel offline`
// //                 }, { quoted: m });
// //             } else {
// //                 await sock.sendMessage(jid, {
// //                     text: `❌ Error: ${error.message}`
// //                 }, { quoted: m });
// //             }
// //         }
// //     }
// // };






















// import axios from "axios";

// export default {
//     name: "addserver",
//     aliases: ["createserver", "newserver", "makeserver"],
//     category: "Owner",
//     description: "Create multiple servers with zero resources (Owner Only)",
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
//                 text: `📧 *Usage:* \`${PREFIX}addserver email@example.com [amount]\`\n📝 *Example:* \`${PREFIX}addserver john@gmail.com 5\``
//             }, { quoted: m });
//         }

//         const email = args[0];
//         const amount = parseInt(args[1]) || 1; // Default to 1 server
        
//         if (amount < 1 || amount > 20) {
//             return sock.sendMessage(jid, {
//                 text: `❌ Amount must be between 1-20`
//             }, { quoted: m });
//         }

//         const PTERODACTYL_API_KEY = "ptla_u9ZUDn5B2z36xZYNQKPzyffMRJqdt5R0O1zOqeGNEJL";
//         const PTERODACTYL_PANEL_URL = "https://wolf-host.xcasper.site/api/application";
//         const PANEL_URL = "https://wolf-host.xcasper.site";

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

//             // Step 2: Get eggs from nest ID 5 (caspertech)
//             const eggsResponse = await axios({
//                 method: 'GET',
//                 url: `${PTERODACTYL_PANEL_URL}/nests/5/eggs`,
//                 headers: {
//                     'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
//                     'Accept': 'application/json'
//                 },
//                 timeout: 10000
//             });

//             if (eggsResponse.status !== 200 || !eggsResponse.data.data.length) {
//                 return sock.sendMessage(jid, {
//                     text: `❌ No eggs found in nest 5`
//                 }, { quoted: m });
//             }

//             // Find ArmangzOfficial egg
//             const eggs = eggsResponse.data.data;
//             let armangzEgg = null;
            
//             for (const egg of eggs) {
//                 if (egg.attributes.name.toLowerCase().includes('armangz')) {
//                     armangzEgg = egg;
//                     break;
//                 }
//             }

//             if (!armangzEgg) {
//                 armangzEgg = eggs[0];
//             }

//             const eggId = armangzEgg.attributes.id;
//             const eggName = armangzEgg.attributes.name;

//             // Step 3: Get egg details including variables
//             const eggDetailResponse = await axios({
//                 method: 'GET',
//                 url: `${PTERODACTYL_PANEL_URL}/nests/5/eggs/${eggId}?include=variables`,
//                 headers: {
//                     'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
//                     'Accept': 'application/json'
//                 },
//                 timeout: 10000
//             });

//             if (eggDetailResponse.status !== 200) {
//                 return sock.sendMessage(jid, {
//                     text: `❌ Failed to get egg details`
//                 }, { quoted: m });
//             }

//             const eggDetails = eggDetailResponse.data.attributes;
//             const eggVariables = eggDetails.relationships?.variables?.data || [];

//             // Build environment variables
//             const environment = {};
//             for (const variable of eggVariables) {
//                 const varAttrs = variable.attributes;
//                 environment[varAttrs.env_variable] = varAttrs.default_value || varAttrs.rules_value || '';
//             }

//             // Step 4: Get available allocations
//             const allocationsResponse = await axios({
//                 method: 'GET',
//                 url: `${PTERODACTYL_PANEL_URL}/nodes/1/allocations?per_page=100`, // Change node ID if needed
//                 headers: {
//                     'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
//                     'Accept': 'application/json'
//                 },
//                 timeout: 10000
//             });

//             if (allocationsResponse.status !== 200 || !allocationsResponse.data.data.length) {
//                 return sock.sendMessage(jid, {
//                     text: `❌ No allocations available`
//                 }, { quoted: m });
//             }

//             // Find unused allocations
//             const allocations = allocationsResponse.data.data;
//             const availableAllocations = allocations.filter(allocation => 
//                 allocation.attributes.assigned === false
//             );

//             if (availableAllocations.length < amount) {
//                 return sock.sendMessage(jid, {
//                     text: `❌ Not enough allocations available\nNeed: ${amount}, Available: ${availableAllocations.length}`
//                 }, { quoted: m });
//             }

//             // Step 5: Create servers
//             let createdCount = 0;
//             const failedServers = [];

//             for (let i = 0; i < amount; i++) {
//                 try {
//                     const serverName = `${username}-server-${Date.now().toString().slice(-6)}-${i + 1}`;
//                     const allocation = availableAllocations[i];

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
//                             docker_image: eggDetails.docker_image,
//                             startup: eggDetails.startup,
//                             environment: environment,
//                             limits: {
//                                 memory: 0,     // Unlimited memory
//                                 swap: 0,       // Disable swap
//                                 disk: 0,       // Unlimited disk
//                                 io: 500,
//                                 cpu: 0         // Unlimited CPU
//                             },
//                             feature_limits: {
//                                 databases: 0,
//                                 backups: 0,
//                                 allocations: 1
//                             },
//                             allocation: {
//                                 default: allocation.attributes.id
//                             },
//                             deploy: {
//                                 locations: [1], // Default location
//                                 dedicated_ip: false,
//                                 port_range: []
//                             },
//                             nest: 5,
//                             description: `Server ${i + 1}/${amount} for ${email}`,
//                             start_on_completion: true
//                         },
//                         timeout: 15000
//                     });

//                     if (createResponse.status === 201) {
//                         createdCount++;
//                         console.log(`✅ Created server ${i + 1}/${amount} for ${email}`);
//                     } else {
//                         failedServers.push(`Server ${i + 1}: Status ${createResponse.status}`);
//                     }

//                     // Small delay to avoid rate limiting
//                     if (i < amount - 1) {
//                         await new Promise(resolve => setTimeout(resolve, 1000));
//                     }

//                 } catch (serverError) {
//                     console.error(`❌ Failed to create server ${i + 1}:`, serverError.message);
//                     failedServers.push(`Server ${i + 1}: ${serverError.message}`);
//                 }
//             }

//             // Step 6: Send result
//             let resultMessage = `📊 *Server Creation Results*\n\n`;
//             resultMessage += `📧 *User:* ${email}\n`;
//             resultMessage += `👤 *Username:* ${username}\n`;
//             resultMessage += `🥚 *Egg:* ${eggName}\n`;
//             resultMessage += `📈 *Requested:* ${amount} server(s)\n`;
//             resultMessage += `✅ *Created:* ${createdCount} server(s)\n`;
//             resultMessage += `❌ *Failed:* ${failedServers.length} server(s)\n\n`;

//             if (failedServers.length > 0 && failedServers.length <= 5) {
//                 resultMessage += `📝 *Failed Servers:*\n`;
//                 failedServers.forEach((fail, idx) => {
//                     resultMessage += `${idx + 1}. ${fail}\n`;
//                 });
//             } else if (failedServers.length > 5) {
//                 resultMessage += `📝 ${failedServers.length} servers failed (too many to list)\n`;
//             }

//             if (createdCount > 0) {
//                 resultMessage += `\n🌐 *Panel:* ${PANEL_URL}\n`;
//                 resultMessage += `🔧 *Check:* User servers section`;
//             }

//             await sock.sendMessage(jid, {
//                 text: resultMessage
//             }, { quoted: m });

//         } catch (error) {
//             console.error('[ADDSERVER] Error:', error.message);
            
//             if (error.response) {
//                 if (error.response.status === 404) {
//                     await sock.sendMessage(jid, {
//                         text: `❌ Resource not found\nCheck user email, nest, or node`
//                     }, { quoted: m });
//                 } else if (error.response.status === 401 || error.response.status === 403) {
//                     await sock.sendMessage(jid, {
//                         text: `🔐 Permission denied\nCheck API key`
//                     }, { quoted: m });
//                 } else if (error.response.status === 422) {
//                     const errors = error.response.data.errors || [];
//                     let errorMsg = `❌ Validation Error:\n`;
                    
//                     if (Array.isArray(errors)) {
//                         errors.forEach(err => {
//                             errorMsg += `• ${err.detail || JSON.stringify(err)}\n`;
//                         });
//                     }
                    
//                     await sock.sendMessage(jid, {
//                         text: errorMsg.substring(0, 500)
//                     }, { quoted: m });
//                 } else {
//                     const errorMsg = error.response.data ? JSON.stringify(error.response.data).substring(0, 200) : 'No details';
//                     await sock.sendMessage(jid, {
//                         text: `❌ API Error: ${error.response.status}\n${errorMsg}`
//                     }, { quoted: m });
//                 }
//             } else if (error.code === 'ECONNREFUSED') {
//                 await sock.sendMessage(jid, {
//                     text: `❌ Panel offline`
//                 }, { quoted: m });
//             } else {
//                 await sock.sendMessage(jid, {
//                     text: `❌ Error: ${error.message}`
//                 }, { quoted: m });
//             }
//         }
//     }
// };