






// import axios from "axios";

// export default {
//   name: "p",
//   description: "Check bot ping and status",

//   async execute(sock, m, args) {
//     try {
//       const jid = m.key.remoteJid;
//       const sender = m.key.participant || m.key.remoteJid;

//       const startTime = Date.now();
      
//       // 🔧 Fetch GitHub user data to get profile image
//       const owner = "777Wolf-dot";
//       const githubUserUrl = `https://api.github.com/users/${owner}`;
      
//       // Fetch GitHub user data
//       const { data: githubData } = await axios.get(
//         githubUserUrl,
//         { 
//           headers: { 
//             "User-Agent": "Silent-Wolf-Bot",
//             "Accept": "application/vnd.github.v3+json"
//           } 
//         }
//       );
      
//       const apiLatency = Date.now() - startTime;
      
//       // Get bot uptime if available
//       const uptime = process.uptime();
//       const hours = Math.floor(uptime / 3600);
//       const minutes = Math.floor((uptime % 3600) / 60);
//       const seconds = Math.floor(uptime % 60);
      
//       // Get memory usage
//       const usedMemory = process.memoryUsage().heapUsed / 1024 / 1024;
//       const totalMemory = process.memoryUsage().heapTotal / 1024 / 1024;
      
//       const text = `
// ⚡ *BOT STATUS & PING*

// 📡 *Bot Latency:* ${apiLatency}ms
// ⏱️ *Uptime:* ${hours}h ${minutes}m ${seconds}s
// 💾 *Memory:* ${usedMemory.toFixed(2)}MB / ${totalMemory.toFixed(2)}MB
// 👋 @${sender.split("@")[0]}, WolfBot is running smoothly!
//       `.trim();

//       await sock.sendMessage(
//         jid,
//         {
//           text,
//           contextInfo: {
//             mentionedJid: [sender],
//             externalAdReply: {
//               title: "🐺 Silent Wolf Bot Status",
//               body: `Ping: ${apiLatency}ms | Uptime: ${hours}h`,
//               mediaType: 1,
//               thumbnailUrl: githubData.avatar_url, // This will show your GitHub profile image
//               sourceUrl: githubData.html_url,
//               renderLargerThumbnail: true,
//               showAdAttribution: false
//             },
//           },
//         },
//         { quoted: m }
//       );

//       console.log(`✅ Ping command executed - Latency: ${apiLatency}ms`);

//     } catch (err) {
//       console.error("❌ Ping command error:", err.message || err);
      
//       // Fallback to basic info if API fails
//       const fallbackText = `
// ⚡ *BOT STATUS & PING*

// 📡 *Bot Latency:* Unable to measure
// ⏱️ *Uptime:* Calculating...
// 💾 *Memory:* Unknown
// 👤 *Developer:* 777Wolf-dot

// 👋 @${owner.split("@")[0]}, bot is still running!
// ⚠️ Connection issues detected
//       `.trim();

//       await sock.sendMessage(
//         m.key.remoteJid,
//         { 
//           text: fallbackText,
//           contextInfo: {
//             mentionedJid: [sender],
//             externalAdReply: {
//               title: "Silent Wolf Bot Status",
//               body: "Connection issues detected",
//               mediaType: 1,
//               thumbnailUrl: "https://avatars.githubusercontent.com/u/583231?v=4", // Default GitHub avatar
//               sourceUrl: "https://github.com/777Wolf-dot",
//               renderLargerThumbnail: true,
//               showAdAttribution: false
//             }
//           }
//         },
//         { quoted: m }
//       );
//     }
//   },
// };                







// import axios from "axios";
// import fs from "fs/promises";
// import path from "path";

// export default {
//   name: "p",
//   description: "Check bot ping and status",

//   async execute(sock, m, args) {
//     try {
//       const jid = m.key.remoteJid;
//       const sender = m.key.participant || m.key.remoteJid;

//       // Read owner information from owner.json
//       let ownerJid = "";
//       let ownerNumber = "";
      
//       try {
//         const ownerPath = path.join(process.cwd(), "owner.json");
//         const ownerData = await fs.readFile(ownerPath, "utf8");
//         const ownerInfo = JSON.parse(ownerData);
        
//         ownerJid = ownerInfo.OWNER_JID || ownerInfo.OWNER_CLEAN_JID || "";
//         ownerNumber = ownerInfo.OWNER_NUMBER || ownerInfo.OWNER_CLEAN_NUMBER || "";
        
//         console.log(`📋 Owner info loaded: ${ownerNumber} | ${ownerJid}`);
//       } catch (ownerError) {
//         console.error("❌ Failed to read owner.json:", ownerError.message);
//         // Fallback to hardcoded owner if file not found
      
//       }

//       const startTime = Date.now();
      
//       // 🔧 Fetch GitHub user data to get profile image
//       const githubOwner = "777Wolf-dot";
//       const githubUserUrl = `https://api.github.com/users/${githubOwner}`;
      
//       // Fetch GitHub user data
//       const { data: githubData } = await axios.get(
//         githubUserUrl,
//         { 
//           headers: { 
//             "User-Agent": "Silent-Wolf-Bot",
//             "Accept": "application/vnd.github.v3+json"
//           } 
//         }
//       );
      
//       const apiLatency = Date.now() - startTime;
      
//       // Get bot uptime if available
//       const uptime = process.uptime();
//       const hours = Math.floor(uptime / 3600);
//       const minutes = Math.floor((uptime % 3600) / 60);
//       const seconds = Math.floor(uptime % 60);
      
//       // Get memory usage
//       const usedMemory = process.memoryUsage().heapUsed / 1024 / 1024;
//       const totalMemory = process.memoryUsage().heapTotal / 1024 / 1024;
      
//       // Extract owner name from JID for mention
//       const ownerForMention = ownerNumber || ownerJid.split("@")[0] || "Owner";
      
//       const text = `
// ⚡ *BOT STATUS & PING*

// 📡 *Bot Latency:* ${apiLatency}ms
// ⏱️ *Uptime:* ${hours}h ${minutes}m ${seconds}s
// 💾 *Memory:* ${usedMemory.toFixed(2)}MB / ${totalMemory.toFixed(2)}MB
// 🐺 *Maintained by:* @${ownerForMention}
// 🔧 *GitHub:* ${githubOwner}
//       `.trim();

//       await sock.sendMessage(
//         jid,
//         {
//           text,
//           contextInfo: {
//             mentionedJid: ownerJid ? [ownerJid] : [], // Tag the owner from owner.json
//             externalAdReply: {
//               title: "🐺 Silent Wolf Bot Status",
//               body: `Ping: ${apiLatency}ms | Uptime: ${hours}h`,
//               mediaType: 1,
//               thumbnailUrl: githubData.avatar_url,
//               sourceUrl: githubData.html_url,
//               renderLargerThumbnail: true,
//               showAdAttribution: false
//             },
//           },
//         },
//         { quoted: m }
//       );

//       console.log(`✅ Ping command executed - Latency: ${apiLatency}ms | Owner tagged: ${ownerJid}`);

//     } catch (err) {
//       console.error("❌ Ping command error:", err.message || err);
      
//       // Try to read owner info again for fallback
//       let fallbackOwnerJid = "";
//       let fallbackOwnerNumber = "";
      
//       try {
//         const ownerPath = path.join(process.cwd(), "owner.json");
//         const ownerData = await fs.readFile(ownerPath, "utf8");
//         const ownerInfo = JSON.parse(ownerData);
        
//         fallbackOwnerJid = ownerInfo.OWNER_JID || ownerInfo.OWNER_CLEAN_JID || "";
//         fallbackOwnerNumber = ownerInfo.OWNER_NUMBER || ownerInfo.OWNER_CLEAN_NUMBER || "";
//       } catch {
//         fallbackOwnerJid = "254703397679@s.whatsapp.net";
//         fallbackOwnerNumber = "254703397679";
//       }
      
//       const fallbackText = `
// ⚡ *BOT STATUS & PING*

// 📡 *Bot Latency:* Unable to measure
// ⏱️ *Uptime:* Calculating...
// 💾 *Memory:* Unknown
// 🐺 *Maintained by:* @${fallbackOwnerNumber || "Owner"}

// ⚠️ Connection issues detected
//       `.trim();

//       await sock.sendMessage(
//         m.key.remoteJid,
//         { 
//           text: fallbackText,
//           contextInfo: {
//             mentionedJid: fallbackOwnerJid ? [fallbackOwnerJid] : [],
//             externalAdReply: {
//               title: "Silent Wolf Bot Status",
//               body: "Connection issues detected",
//               mediaType: 1,
//               thumbnailUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
//               sourceUrl: "https://github.com/777Wolf-dot",
//               renderLargerThumbnail: true,
//               showAdAttribution: false
//             }
//           }
//         },
//         { quoted: m }
//       );
//     }
//   },
// };












import axios from "axios";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  name: "ping",
  aliases: ["p", "speed", "status", "test"],
  description: "Check bot ping, status, and performance",

  async execute(sock, m, args, PREFIX) {
    try {
      const jid = m.key.remoteJid;
      const sender = m.key.participant || m.key.remoteJid;

      // Send initial status
      const statusMsg = await sock.sendMessage(jid, { 
        text: `⚡ *Testing Bot Performance*\n` +
              `📡 *Measuring latency...*\n` +
              `🔍 *Checking system status...*`
      }, { quoted: m });

      // Record start time for ping calculation
      const pingStartTime = Date.now();
      
      // Read owner information from owner.json
      let ownerInfo = {
        jid: "",
        number: "",
        name: ""
      };
      
      try {
        const ownerPath = path.join(__dirname, "../../owner.json");
        const ownerData = await fs.readFile(ownerPath, "utf8");
        const ownerDataJson = JSON.parse(ownerData);
        
        ownerInfo.jid = ownerDataJson.OWNER_JID || ownerDataJson.OWNER_CLEAN_JID || "";
        ownerInfo.number = ownerDataJson.OWNER_NUMBER || ownerDataJson.OWNER_CLEAN_NUMBER || "";
        ownerInfo.name = ownerDataJson.OWNER_NAME || "Silent Wolf";
        
        console.log(`📋 [PING] Owner info loaded: ${ownerInfo.name} | ${ownerInfo.number}`);
      } catch (ownerError) {
        console.error("❌ [PING] Failed to read owner.json:", ownerError.message);
        // Fallback defaults
        ownerInfo.name = "Silent Wolf";
        ownerInfo.number = "254703397679";
        ownerInfo.jid = "254703397679@s.whatsapp.net";
      }

      // 🔧 Fetch GitHub user data for Silent-Wolf7
      const githubOwner = "Silent-Wolf7";
      let githubData = {
        avatar_url: "https://avatars.githubusercontent.com/u/10639145",
        html_url: `https://github.com/${githubOwner}`,
        name: "Silent Wolf"
      };
      
      try {
        const githubUserUrl = `https://api.github.com/users/${githubOwner}`;
        console.log(`🌐 [PING] Fetching GitHub data for: ${githubOwner}`);
        
        const githubResponse = await axios.get(githubUserUrl, { 
          timeout: 10000,
          headers: { 
            "User-Agent": "Silent-Wolf-Bot",
            "Accept": "application/vnd.github.v3+json"
          } 
        });
        
        githubData = githubResponse.data;
        console.log(`✅ [PING] GitHub data fetched successfully`);
      } catch (githubError) {
        console.error("⚠️ [PING] GitHub API failed, using defaults:", githubError.message);
      }

      // Calculate ping/latency
      const pingTime = Date.now() - pingStartTime;
      
      // Get system information
      const uptime = process.uptime();
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);
      
      // Get memory usage
      const memoryUsage = process.memoryUsage();
      const usedMemory = memoryUsage.heapUsed / 1024 / 1024;
      const totalMemory = memoryUsage.heapTotal / 1024 / 1024;
      const memoryPercent = ((usedMemory / totalMemory) * 100).toFixed(1);
      
      // Get CPU/Node info
      const nodeVersion = process.version;
      const platform = process.platform;
      const arch = process.arch;
      
      // Check database/API connectivity (simulated)
      const apiStatus = pingTime < 1000 ? "✅ Excellent" : pingTime < 3000 ? "⚠️ Good" : "❌ Slow";
      const dbStatus = "✅ Connected";
      
      // Calculate response quality
      let responseQuality = "";
      if (pingTime < 500) responseQuality = "⚡ Lightning Fast";
      else if (pingTime < 1500) responseQuality = "🚀 Fast";
      else if (pingTime < 3000) responseQuality = "🐢 Moderate";
      else responseQuality = "🐌 Slow";

      // Update status
      await sock.sendMessage(jid, {
        text: `⚡ *Testing Bot Performance*\n` +
              `📡 *Measuring...* ✅\n` +
              `🔍 *System check...*\n` +
              `📊 *Compiling statistics...*`,
        edit: statusMsg.key
      });

      // Prepare text with all stats
      const text = `
🤖 *SILENT WOLF BOT STATUS*

📡 *Performance Metrics:*
⏱️ *Response Time:* ${pingTime}ms
⚡ *Quality:* ${responseQuality}
🔌 *API Status:* ${apiStatus}
🐺 *Maintained by:* @${ownerInfo.number}
📁 *GitHub:* ${githubOwner}
🚀 *Bot is operational and ready!*
      `.trim();

      await sock.sendMessage(
        jid,
        {
          text,
          contextInfo: {
            mentionedJid: ownerInfo.jid ? [ownerInfo.jid] : [],
            externalAdReply: {
              title: "🐺 Silent Wolf Bot v2",
              body: `Ping: ${pingTime}ms • Uptime: ${hours}h ${minutes}m`,
              mediaType: 1,
              thumbnailUrl: githubData.avatar_url,
              sourceUrl: githubData.html_url,
              mediaUrl: `https://github.com/Silent-Wolf7/Silentwolf`,
              renderLargerThumbnail: true
            },
          },
        },
        { 
          quoted: m,
          edit: statusMsg.key 
        }
      );

      console.log(`✅ [PING] Command executed - Latency: ${pingTime}ms | Quality: ${responseQuality}`);

    } catch (err) {
      console.error("❌ [PING] Command error:", err.message || err);
      
      // Fallback with basic information
      const fallbackText = `
⚡ *BOT STATUS*

📡 *Response Time:* Calculating...
💻 *Status:* Operational
🐺 *Developer:* Silent Wolf
🔗 *GitHub:* Silent-Wolf7/Silentwolf
      `.trim();

      try {
        await sock.sendMessage(
          m.key.remoteJid,
          { 
            text: fallbackText,
            contextInfo: {
              externalAdReply: {
                title: "Silent Wolf Bot Status",
                body: "Bot is online • Basic metrics",
                mediaType: 1,
                thumbnailUrl: "https://avatars.githubusercontent.com/u/10639145",
                sourceUrl: "https://github.com/Silent-Wolf7/Silentwolf"
              }
            }
          },
          { quoted: m }
        );
      } catch (sendError) {
        console.error("❌ [PING] Failed to send fallback:", sendError.message);
      }
    }
  },
};