// import axios from "axios";

// export default {
//   name: "listservers",
//   aliases: ["servers", "panelstatus", "pservers", "wolfhost"],
//   category: "Admin",
//   description: "List all servers on Wolf Host Pterodactyl panel",
  
//   async execute(sock, m, args, PREFIX) {
//     const jid = m.key.remoteJid;
//     const sender = m.key.participant || m.key.remoteJid;

//     // Pterodactyl API configuration for Wolf Host
//     const PTERODACTYL_API_KEY = "ptla_u9ZUDn5B2z36xZYNQKPzyffMRJqdt5R0O1zOqeGNEJL";
//     const PTERODACTYL_PANEL_URL = "https://wolf-host.xcasper.site/api";
    
//     // Check if API key is valid (starts with ptla_)
//     if (!PTERODACTYL_API_KEY.startsWith('ptla_')) {
//       await sock.sendMessage(jid, { 
//         text: `❌ *INVALID API KEY*\n\nAPI key must start with 'ptla_'\n\nCurrent: ${PTERODACTYL_API_KEY.substring(0, 20)}...`
//       }, { quoted: m });
//       return;
//     }

//     try {
//       // Send initial status
//       const statusMsg = await sock.sendMessage(jid, { 
//         text: `🔍 *Connecting to Wolf Host Panel...*\n` +
//               `🌐 *URL:* wolf-host.xcasper.site\n` +
//               `🔑 *API Key:* ${PTERODACTYL_API_KEY.substring(0, 8)}...${PTERODACTYL_API_KEY.substring(PTERODACTYL_API_KEY.length - 4)}`
//       }, { quoted: m });

//       console.log(`🌐 [LISTSERVERS] Connecting to: ${PTERODACTYL_PANEL_URL}`);

//       // Fetch servers from Pterodactyl API
//       const response = await axios({
//         method: 'GET',
//         url: `${PTERODACTYL_PANEL_URL}/application/servers`,
//         headers: {
//           'Authorization': `Bearer ${PTERODACTYL_API_KEY}`,
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//           'User-Agent': 'Wolf-Host-Bot/1.0'
//         },
//         timeout: 20000, // 20 second timeout
//         validateStatus: function (status) {
//           return status >= 200 && status < 500; // Accept 2xx and 4xx
//         }
//       });

//       console.log(`✅ [LISTSERVERS] API Response status: ${response.status}`);

//       // Handle different response statuses
//       if (response.status === 200) {
//         const servers = response.data.data || [];
        
//         await sock.sendMessage(jid, {
//           text: `🔍 *Connection successful!* ✅\n` +
//                 `📊 *Fetching server list...*`,
//           edit: statusMsg.key
//         });

//         // Build server list message
//         let serverText = `🐺 *WOLF HOST PANEL - SERVER LIST*\n\n`;
//         serverText += `📈 *Total Servers:* ${servers.length}\n`;
//         serverText += `🌐 *Panel URL:* https://wolf-host.xcasper.site\n\n`;
        
//         if (servers.length === 0) {
//           serverText += `📭 *No servers found*\n`;
//           serverText += `💡 *Create your first server on the panel!*\n\n`;
//         } else {
//           serverText += `🖥️ *Active Servers:*\n\n`;
          
//           servers.forEach((server, index) => {
//             const attributes = server.attributes;
//             serverText += `*${index + 1}. ${attributes.name}*\n`;
//             serverText += `   🆔 *ID:* ${attributes.id}\n`;
//             serverText += `   🔧 *Identifier:* ${attributes.identifier}\n`;
            
//             // Format description (if exists)
//             if (attributes.description) {
//               serverText += `   📝 *Description:* ${attributes.description}\n`;
//             }
            
//             // Format limits
//             serverText += `   💾 *Memory:* ${attributes.limits.memory}MB\n`;
//             serverText += `   💿 *Disk:* ${attributes.limits.disk}MB\n`;
//             serverText += `   ⚡ *CPU:* ${attributes.limits.cpu}%\n`;
            
//             // Format status
//             const status = attributes.suspended ? '🚫 Suspended' : '✅ Active';
//             serverText += `   📊 *Status:* ${status}\n`;
            
//             // Format creation date
//             const createdDate = new Date(attributes.created_at).toLocaleDateString('en-US', {
//               month: 'short',
//               day: 'numeric',
//               year: 'numeric'
//             });
//             serverText += `   📅 *Created:* ${createdDate}\n`;
            
//             // Panel link
//             serverText += `   🔗 *Panel:* https://wolf-host.xcasper.site/server/${attributes.identifier}\n`;
            
//             serverText += `\n`;
//           });
          
//           // Add summary
//           const activeServers = servers.filter(s => !s.attributes.suspended).length;
//           const suspendedServers = servers.filter(s => s.attributes.suspended).length;
//           const totalMemory = servers.reduce((sum, s) => sum + s.attributes.limits.memory, 0);
//           const totalDisk = servers.reduce((sum, s) => sum + s.attributes.limits.disk, 0);
          
//           serverText += `📊 *Summary:*\n`;
//           serverText += `   ✅ *Active:* ${activeServers} servers\n`;
//           serverText += `   🚫 *Suspended:* ${suspendedServers} servers\n`;
//           serverText += `   💾 *Total Memory:* ${totalMemory}MB\n`;
//           serverText += `   💿 *Total Disk:* ${totalDisk}MB\n\n`;
//         }
        
//         serverText += `🔧 *Quick Actions:*\n`;
//         serverText += `• Visit https://wolf-host.xcasper.site\n`;
//         serverText += `• Use \`${PREFIX}createserver\` to make new server\n`;
//         serverText += `• Contact support for help\n`;
//         serverText += `• API Status: ✅ Connected`;

//         // Send the server list
//         await sock.sendMessage(jid, { 
//           text: serverText,
//           edit: statusMsg.key 
//         });

//         console.log(`✅ [LISTSERVERS] Successfully listed ${servers.length} servers from Wolf Host`);

//       } else if (response.status === 401) {
//         await sock.sendMessage(jid, { 
//           text: `❌ *AUTHENTICATION FAILED*\n\nInvalid Pterodactyl API Key.\n\n` +
//                 `🔑 *Key:* ${PTERODACTYL_API_KEY.substring(0, 10)}...\n` +
//                 `📝 *Note:* Regenerate API key in panel settings.\n` +
//                 `🔗 *Panel:* https://wolf-host.xcasper.site/admin/api`,
//           edit: statusMsg.key 
//         });
//       } else if (response.status === 403) {
//         await sock.sendMessage(jid, { 
//           text: `❌ *PERMISSION DENIED*\n\nAPI key lacks permission to view servers.\n\n` +
//                 `💡 *Fix:* Ensure API key has "Server" read permissions.\n` +
//                 `🔗 *Panel:* https://wolf-host.xcasper.site/admin/api`,
//           edit: statusMsg.key 
//         });
//       } else if (response.status === 404) {
//         await sock.sendMessage(jid, { 
//           text: `❌ *PANEL NOT FOUND*\n\nCannot connect to Wolf Host panel.\n\n` +
//                 `🌐 *URL:* https://wolf-host.xcasper.site\n` +
//                 `🔧 *Check:*\n1. Panel is running\n2. URL is correct\n3. Network connection`,
//           edit: statusMsg.key 
//         });
//       } else if (response.status === 307) {
//         await sock.sendMessage(jid, { 
//           text: `⚠️ *REDIRECT DETECTED*\n\nPanel is redirecting requests.\n\n` +
//                 `🌐 *Try these URLs:*\n` +
//                 `1. https://wolf-host.xcasper.site/api\n` +
//                 `2. https://wolf-host.xcasper.site:8080/api\n` +
//                 `3. https://wolf-host.xcasper.site:8443/api\n` +
//                 `🔧 *Note:* Check panel configuration.`,
//           edit: statusMsg.key 
//         });
//       } else {
//         await sock.sendMessage(jid, { 
//           text: `❌ *API ERROR*\n\nStatus: ${response.status}\n\n` +
//                 `📋 *Response:* ${JSON.stringify(response.data, null, 2).substring(0, 200)}...`,
//           edit: statusMsg.key 
//         });
//       }

//     } catch (error) {
//       console.error('❌ [LISTSERVERS] ERROR:', error.message);
      
//       let errorMessage = `❌ *CONNECTION FAILED*\n\n`;
      
//       if (error.code === 'ECONNREFUSED') {
//         errorMessage += `• Wolf Host panel is not accessible\n`;
//         errorMessage += `• Check if panel is running\n`;
//         errorMessage += `• URL: https://wolf-host.xcasper.site\n`;
//       } else if (error.code === 'ENOTFOUND') {
//         errorMessage += `• Cannot resolve wolf-host.xcasper.site\n`;
//         errorMessage += `• Check DNS/domain configuration\n`;
//       } else if (error.code === 'ETIMEDOUT') {
//         errorMessage += `• Connection timeout (20s)\n`;
//         errorMessage += `• Panel may be slow or offline\n`;
//       } else if (error.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
//         errorMessage += `• SSL certificate issue\n`;
//         errorMessage += `• Try: https://wolf-host.xcasper.site (without /api)\n`;
//       } else if (error.message.includes('307')) {
//         errorMessage += `• Panel redirecting (307)\n`;
//         errorMessage += `• Try different API endpoint\n`;
//         errorMessage += `• Check panel configuration\n`;
//       } else {
//         errorMessage += `• Error: ${error.message}\n`;
//       }
      
//       errorMessage += `\n🔧 *Troubleshooting:*\n`;
//       errorMessage += `1. Visit https://wolf-host.xcasper.site\n`;
//       errorMessage += `2. Check panel status\n`;
//       errorMessage += `3. Verify API key permissions\n`;
//       errorMessage += `4. Try without /api endpoint\n`;
      
//       errorMessage += `\n📋 *Test URL:*\n`;
//       errorMessage += `https://wolf-host.xcasper.site/api/application/servers`;
      
//       await sock.sendMessage(jid, { 
//         text: errorMessage
//       }, { quoted: m });
//     }
//   }
// };