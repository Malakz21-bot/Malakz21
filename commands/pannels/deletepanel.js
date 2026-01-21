// import axios from "axios";

// export default {
//   name: "deleteall",
//   aliases: ["purgeall", "wipservers", "nuke"],
//   category: "Admin",
//   description: "⚠️ Delete ALL servers from Wolf Host Pterodactyl panel",
  
//   async execute(sock, m, args, PREFIX) {
//     const jid = m.key.remoteJid;
//     const sender = m.key.participant || m.key.remoteJid;

//     // Pterodactyl API configuration for Wolf Host
//     const PTERODACTYL_API_KEY = "ptla_u9ZUDn5B2z36xZYNQKPzyffMRJqdt5R0O1zOqeGNEJL";
//     const PTERODACTYL_PANEL_URL = "https://wolf-host.xcasper.site/api";
    
//     // First, confirm this dangerous action
//     const confirmationMessage = await sock.sendMessage(jid, {
//       text: `⚠️ *DANGEROUS COMMAND - CONFIRMATION REQUIRED* ⚠️\n\n` +
//             `❌ This command will DELETE ALL SERVERS from your Wolf Host panel.\n\n` +
//             `📊 *This action is:*\n` +
//             `• Irreversible\n` +
//             `• Will delete ALL server data\n` +
//             `• Cannot be undone\n\n` +
//             `🔧 To proceed, type: ${PREFIX}deleteall confirm\n` +
//             `🔧 To cancel, type: ${PREFIX}deleteall cancel\n\n` +
//             `📝 *CONFIRMATION CODE:* DELETE-ALL-${Date.now()}`
//     }, { quoted: m });

//     // Wait for confirmation
//     const confirmation = args[0];
    
//     if (!confirmation || confirmation.toLowerCase() !== 'confirm') {
//       await sock.sendMessage(jid, {
//         text: `✅ *Operation Cancelled*\n\n` +
//               `No servers were deleted.\n` +
//               `Use \`${PREFIX}listservers\` to view servers instead.`,
//         edit: confirmationMessage.key
//       });
//       return;
//     }

//     try {
//       // Start deletion process
//       const statusMsg = await sock.sendMessage(jid, {
//         text: `⚠️ *INITIATING SERVER DELETION* ⚠️\n\n` +
//               `🔍 Fetching server list from Wolf Host panel...\n` +
//               `🌐 URL: wolf-host.xcasper.site\n` +
//               `⏰ Started: ${new Date().toLocaleTimeString()}`
//       }, { quoted: m });

//       // Fetch all servers first
//       const response = await axios({
//         method: 'GET',
//         url: `${PTERODACTYL_PANEL_URL}/application/servers`,
//         headers: {
//           'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//           'User-Agent': 'Wolf-Host-Bot/1.0'
//         },
//         timeout: 30000
//       });

//       if (response.status !== 200) {
//         await sock.sendMessage(jid, {
//           text: `❌ *Failed to fetch servers*\n` +
//                 `Status: ${response.status}\n` +
//                 `Response: ${JSON.stringify(response.data)}`,
//           edit: statusMsg.key
//         });
//         return;
//       }

//       const servers = response.data.data || [];
      
//       if (servers.length === 0) {
//         await sock.sendMessage(jid, {
//           text: `📭 *No servers found to delete*\n` +
//                 `The panel is already empty.`,
//           edit: statusMsg.key
//         });
//         return;
//       }

//       // Update status with server count
//       await sock.sendMessage(jid, {
//         text: `⚠️ *DELETION IN PROGRESS* ⚠️\n\n` +
//               `📊 Found ${servers.length} servers to delete\n` +
//               `⏰ Estimated time: ${Math.ceil(servers.length * 2)} seconds\n` +
//               `🔄 Starting deletion process...`,
//         edit: statusMsg.key
//       });

//       let deletedCount = 0;
//       let failedCount = 0;
//       const deletedServers = [];
//       const failedServers = [];

//       // Delete servers one by one
//       for (let i = 0; i < servers.length; i++) {
//         const server = servers[i];
//         const serverName = server.attributes.name;
//         const serverId = server.attributes.id;

//         try {
//           // Send force deletion request
//           const deleteResponse = await axios({
//             method: 'DELETE',
//             url: `${PTERODACTYL_PANEL_URL}/application/servers/${serverId}/force`,
//             headers: {
//               'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
//               'Accept': 'application/json',
//               'Content-Type': 'application/json',
//               'User-Agent': 'Wolf-Host-Bot/1.0'
//             },
//             timeout: 15000
//           });

//           if (deleteResponse.status === 204) {
//             deletedCount++;
//             deletedServers.push(serverName);
            
//             // Update progress every 5 servers
//             if (deletedCount % 5 === 0 || i === servers.length - 1) {
//               await sock.sendMessage(jid, {
//                 text: `🔄 *Deletion Progress*\n\n` +
//                       `📊 Progress: ${deletedCount}/${servers.length} (${Math.round((deletedCount/servers.length)*100)}%)\n` +
//                       `✅ Deleted: ${deletedCount}\n` +
//                       `❌ Failed: ${failedCount}\n\n` +
//                       `⏰ Elapsed: ${Math.round(i * 2)} seconds`,
//                 edit: statusMsg.key
//               });
//             }
//           } else {
//             failedCount++;
//             failedServers.push(`${serverName} (Status: ${deleteResponse.status})`);
//           }

//           // Small delay to avoid rate limiting
//           await new Promise(resolve => setTimeout(resolve, 1000));

//         } catch (error) {
//           failedCount++;
//           failedServers.push(`${serverName} (Error: ${error.message})`);
//           console.error(`Failed to delete server ${serverName}:`, error.message);
//         }
//       }

//       // Build final report
//       let reportText = `📊 *DELETION COMPLETE* 📊\n\n`;
//       reportText += `⏰ *Time:* ${new Date().toLocaleTimeString()}\n`;
//       reportText += `📋 *Total Servers:* ${servers.length}\n`;
//       reportText += `✅ *Successfully Deleted:* ${deletedCount}\n`;
//       reportText += `❌ *Failed to Delete:* ${failedCount}\n\n`;

//       if (deletedServers.length > 0) {
//         reportText += `🗑️ *Deleted Servers:*\n`;
//         deletedServers.slice(0, 10).forEach((server, index) => {
//           reportText += `${index + 1}. ${server}\n`;
//         });
//         if (deletedServers.length > 10) {
//           reportText += `... and ${deletedServers.length - 10} more\n`;
//         }
//         reportText += `\n`;
//       }

//       if (failedServers.length > 0) {
//         reportText += `⚠️ *Failed Deletions:*\n`;
//         failedServers.slice(0, 5).forEach((server, index) => {
//           reportText += `${index + 1}. ${server}\n`;
//         });
//         if (failedServers.length > 5) {
//           reportText += `... and ${failedServers.length - 5} more\n`;
//         }
//         reportText += `\n`;
//       }

//       reportText += `🔧 *Next Steps:*\n`;
//       reportText += `• Use \`${PREFIX}listservers\` to verify\n`;
//       reportText += `• Visit https://wolf-host.xcasper.site\n`;
//       reportText += `• Create new servers with \`${PREFIX}createserver\`\n\n`;
//       reportText += `⚠️ *Note:* This action cannot be undone!`;

//       await sock.sendMessage(jid, {
//         text: reportText,
//         edit: statusMsg.key
//       });

//     } catch (error) {
//       console.error('❌ [DELETEALL] ERROR:', error.message);
      
//       let errorMessage = `❌ *DELETION FAILED*\n\n`;
      
//       if (error.response) {
//         errorMessage += `*Status:* ${error.response.status}\n`;
//         errorMessage += `*Response:* ${JSON.stringify(error.response.data, null, 2).substring(0, 200)}...\n\n`;
//       } else {
//         errorMessage += `*Error:* ${error.message}\n\n`;
//       }
      
//       errorMessage += `🔧 *Troubleshooting:*\n`;
//       errorMessage += `1. Check API key permissions\n`;
//       errorMessage += `2. Verify panel is accessible\n`;
//       errorMessage += `3. Try deleting servers manually from panel\n\n`;
//       errorMessage += `🌐 *Panel:* https://wolf-host.xcasper.site`;
      
//       await sock.sendMessage(jid, {
//         text: errorMessage
//       }, { quoted: m });
//     }
//   }
// };