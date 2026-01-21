


// import axios from "axios";
// import yts from "yt-search";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Working APIs based on your Keith pattern
// const apis = {
//   keith: {
//     search: async (query) => {
//       try {
//         const response = await axios.get(
//           `https://apiskeith.vehttps://open.spotify.com/track/2337T5Uk5RJmcc0KHF6j7wrcel.app/search/yts?query=${encodeURIComponent(query)}`,
          
//           { timeout: 10000 }
//         );
//         return response.data?.result || [];
//       } catch (error) {
//         console.error("Keith search error:", error.message);
//         return [];
//       }
//     },
//     downloadAudio: async (url) => {
//       try {
//         const response = await axios.get(
//           `https://apiskeith.vercel.app/download/audio?url=${encodeURIComponent(url)}`,
//           { timeout: 15000 }
//         );
//         return response.data?.result;
//       } catch (error) {
//         console.error("Keith download error:", error.message);
//         return null;
//       }
//     }
//   },
  
//   // Alternative working API (y2mate)
//   y2mate: {
//     downloadAudio: async (url) => {
//       try {
//         const response = await axios.get(
//           `https://api.beautyofweb.com/y2mate?url=${encodeURIComponent(url)}&type=mp3`,
//           { timeout: 15000 }
//         );
//         return response.data?.result?.audio?.url;
//       } catch (error) {
//         console.error("Y2Mate error:", error.message);
//         return null;
//       }
//     }
//   },
  
//   // Another alternative API
//   tomp3: {
//     downloadAudio: async (url) => {
//       try {
//         // Try different y2mate endpoints
//         const endpoints = [
//           `https://api.beautyofweb.com/y2mate?url=${encodeURIComponent(url)}&type=mp3`,
//           `https://ytdl.sam-powers.workers.dev/?url=${encodeURIComponent(url)}&type=audio`,
//           `https://yt5s.com/api/ajaxSearch?q=${encodeURIComponent(url)}&vt=home`
//         ];
        
//         for (const endpoint of endpoints) {
//           try {
//             const response = await axios.get(endpoint, { timeout: 10000 });
//             if (response.data?.result?.audio?.url) return response.data.result.audio.url;
//             if (response.data?.url) return response.data.url;
//           } catch (e) {
//             continue;
//           }
//         }
//         return null;
//       } catch (error) {
//         console.error("Tomp3 error:", error.message);
//         return null;
//       }
//     }
//   }
// };

// export default {
//   name: "play",
//   //aliases: ["song", "ytmp3", "ytmp3doc", "audiodoc", "yta", "ytplay", "music"],
//   category: "Downloader",
//   description: "Download YouTube audio with multiple options",
  
//   async execute(sock, m, args) {
//     const jid = m.key.remoteJid;
//     const quoted = m.quoted;
//     let searchQuery = "";
    
//     // Parse arguments
//     const flags = {
//       doc: args.includes('doc') || args.includes('document'),
//       audio: args.includes('audio') || !args.includes('doc'),
//       list: args.includes('list') || args.includes('search'),
//       video: args.includes('video') || args.includes('vid'),
//       quality: args.find(arg => ['128', '192', '256', '320'].includes(arg)) || '128'
//     };
    
//     // Filter out flags from query
//     const queryArgs = args.filter(arg => 
//       !['doc', 'document', 'audio', 'list', 'search', 'video', 'vid', '128', '192', '256', '320'].includes(arg)
//     );
    
//     // Get search query
//     if (queryArgs.length > 0) {
//       searchQuery = queryArgs.join(" ");
//     } else if (quoted && quoted.text) {
//       searchQuery = quoted.text;
//     } else if (args.length === 0) {
//       const helpText = `🎵 *YouTube Player*\n\n*Usage:*\n• .play <song name>\n• .play <YouTube URL>\n• .play <song name> doc - Send as document\n• .play list <song name> - Show search results\n• .play video <query> - Download video\n\n*Examples:*\n• .play Blinding Lights\n• .play https://youtube.com/xxx\n• .play Shape of You doc\n• .play list Ed Sheeran\n• .play video funny cats\n\n*Aliases:* .song, .music, .ytmp3`;
//       await sock.sendMessage(jid, { text: helpText }, { quoted: m });
//       return;
//     }

//     console.log(`🎵 [PLAY] Query: "${searchQuery}"`);

//     try {
//       // LIST/SEARCH MODE
//       if (flags.list) {
//         const listQuery = searchQuery.replace('list', '').replace('search', '').trim();
//         if (!listQuery) {
//           await sock.sendMessage(jid, { 
//             text: "Please specify search query. Example: .play list Ed Sheeran" 
//           }, { quoted: m });
//           return;
//         }

//         const statusMsg = await sock.sendMessage(jid, { 
//           text: `🔍 *Searching:* "${listQuery}"` 
//         }, { quoted: m });

//         let videos = [];
        
//         // Try Keith API first for search
//         try {
//           videos = await apis.keith.search(listQuery);
//         } catch (error) {
//           console.error("Keith search failed:", error.message);
//         }
        
//         // Fallback to yt-search
//         if (!videos || videos.length === 0) {
//           try {
//             const { videos: ytResults } = await yts(listQuery);
//             videos = ytResults || [];
//           } catch (error) {
//             console.error("YT search error:", error);
//           }
//         }

//         if (videos.length === 0) {
//           await sock.sendMessage(jid, { 
//             text: `❌ No results found for "${listQuery}"`,
//             edit: statusMsg.key 
//           });
//           return;
//         }

//         // Create list message
//         let listText = `🔍 *Search Results:* "${listQuery}"\n\n`;
//         videos.slice(0, 10).forEach((video, index) => {
//           const title = video.title || "Unknown Title";
//           const author = video.author?.name || video.channel?.name || 'Unknown';
//           const duration = video.timestamp || video.duration || 'N/A';
//           const url = video.url || `https://youtube.com/watch?v=${video.videoId || video.id}`;
          
//           listText += `${index + 1}. ${title}\n`;
//           listText += `   👤 ${author}\n`;
//           listText += `   ⏱️ ${duration}\n`;
//           listText += `   📺 .play ${url}\n\n`;
//         });

//         listText += `\n*Usage:* Reply with number (1-10) or use .play <URL>`;
        
//         await sock.sendMessage(jid, { 
//           text: listText,
//           edit: statusMsg.key 
//         });
//         return;
//       }

//       // DOWNLOAD MODE
//       const statusMsg = await sock.sendMessage(jid, { 
//         text: `🔍 *Processing:* "${searchQuery}"` 
//       }, { quoted: m });

//       // Determine if URL or search
//       let videoUrl = '';
//       let videoTitle = '';
//       let thumbnail = '';
//       let videoId = '';

//       if (searchQuery.match(/(youtube\.com|youtu\.be)/i)) {
//         videoUrl = searchQuery;
//         videoId = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)?.[1];
//         if (!videoId) {
//           await sock.sendMessage(jid, { 
//             text: "❌ Invalid YouTube URL format.",
//             edit: statusMsg.key 
//           });
//           return;
//         }
//         videoTitle = "YouTube Audio";
//         thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
//       } else {
//         // Search for video using yt-search
//         try {
//           const { videos } = await yts(searchQuery);
//           if (!videos || videos.length === 0) {
//             // Try Keith search as fallback
//             const keithResults = await apis.keith.search(searchQuery);
//             if (keithResults && keithResults.length > 0) {
//               videoUrl = keithResults[0].url;
//               videoTitle = keithResults[0].title;
//               thumbnail = keithResults[0].thumbnail;
//               videoId = keithResults[0].videoId || keithResults[0].id;
//             } else {
//               await sock.sendMessage(jid, { 
//                 text: `❌ No results found for "${searchQuery}"`,
//                 edit: statusMsg.key 
//               });
//               return;
//             }
//           } else {
//             videoUrl = videos[0].url;
//             videoTitle = videos[0].title;
//             thumbnail = videos[0].thumbnail;
//             videoId = videos[0].videoId;
//           }
//         } catch (error) {
//           console.error("Search error:", error);
//           await sock.sendMessage(jid, { 
//             text: `❌ Search failed: ${error.message}`,
//             edit: statusMsg.key 
//           });
//           return;
//         }
//       }

//       console.log(`🎵 [PLAY] Selected: "${videoTitle}" | URL: ${videoUrl}`);

//       await sock.sendMessage(jid, { 
//         text: `🔍 *Found:* "${videoTitle}" ✅\n⬇️ *Downloading...*`,
//         edit: statusMsg.key 
//       });

//       // Try multiple download sources with priority
//       let downloadUrl = null;
//       let apiUsed = "";
      
//       // Priority 1: Keith API (most reliable based on your pattern)
//       downloadUrl = await apis.keith.downloadAudio(videoUrl);
//       if (downloadUrl) apiUsed = "Keith API";
      
//       // Priority 2: Y2Mate
//       if (!downloadUrl) {
//         console.log("⚠️ Keith failed, trying Y2Mate...");
//         downloadUrl = await apis.y2mate.downloadAudio(videoUrl);
//         if (downloadUrl) apiUsed = "Y2Mate API";
//       }
      
//       // Priority 3: Tomp3 (alternative)
//       if (!downloadUrl) {
//         console.log("⚠️ Y2Mate failed, trying alternative...");
//         downloadUrl = await apis.tomp3.downloadAudio(videoUrl);
//         if (downloadUrl) apiUsed = "Tomp3 API";
//       }
      
//       // Priority 4: Direct from YouTube (last resort)
//       if (!downloadUrl && videoId) {
//         console.log("⚠️ All APIs failed, trying direct method...");
//         // Some direct MP3 conversion services
//         try {
//           const directUrl = `https://api.beautyofweb.com/y2mate?url=${encodeURIComponent(videoUrl)}&type=mp3`;
//           const response = await axios.get(directUrl, { timeout: 15000 });
//           if (response.data?.result?.audio?.url) {
//             downloadUrl = response.data.result.audio.url;
//             apiUsed = "Direct API";
//           }
//         } catch (error) {
//           console.error("Direct method failed:", error.message);
//         }
//       }

//       if (!downloadUrl) {
//         console.error("❌ All download methods failed");
//         await sock.sendMessage(jid, { 
//           text: `❌ All download services failed. Please try:\n1. Another song/video\n2. Direct YouTube URL\n3. Try again later\n\nError: Could not get download link`,
//           edit: statusMsg.key 
//         });
//         return;
//       }

//       console.log(`✅ [PLAY] Using ${apiUsed} for download`);
      
//       await sock.sendMessage(jid, { 
//         text: `🔍 *Found:* "${videoTitle}" ✅\n⬇️ *Downloading...* ✅\n📤 *Processing file...*`,
//         edit: statusMsg.key 
//       });

//       // Create temp directory
//       const tempDir = path.join(__dirname, "../temp");
//       if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
      
//       // Clean filename
//       const fileName = `${videoTitle.replace(/[^\w\s.-]/gi, '').substring(0, 50)}.mp3`;
//       const tempFile = path.join(tempDir, `play_${Date.now()}_${Math.random().toString(36).substring(7)}.mp3`);

//       // Download and process file
//       try {
//         // Download file
//         const response = await axios({
//           url: downloadUrl,
//           method: 'GET',
//           responseType: 'stream',
//           timeout: 45000,
//           headers: {
//             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
//           }
//         });

//         if (response.status !== 200) {
//           throw new Error(`Download failed with status ${response.status}`);
//         }

//         const writer = fs.createWriteStream(tempFile);
//         response.data.pipe(writer);
        
//         await new Promise((resolve, reject) => {
//           writer.on('finish', resolve);
//           writer.on('error', reject);
//         });

//         // Check file size
//         const stats = fs.statSync(tempFile);
//         const fileSizeMB = (stats.size / 1024 / 1024).toFixed(2);
        
//         if (stats.size === 0) {
//           throw new Error("Downloaded file is empty");
//         }
        
//         if (fileSizeMB > 50) {
//           console.log(`⚠️ File too large: ${fileSizeMB}MB`);
//           await sock.sendMessage(jid, { 
//             text: `❌ File too large (${fileSizeMB}MB). Maximum size is 50MB.`,
//             edit: statusMsg.key 
//           });
//           fs.unlinkSync(tempFile);
//           return;
//         }

//         const fileBuffer = fs.readFileSync(tempFile);

//         // Get thumbnail
//         let thumbnailBuffer = null;
//         try {
//           const thumbResponse = await axios.get(thumbnail, {
//             responseType: 'arraybuffer',
//             timeout: 10000
//           });
//           thumbnailBuffer = Buffer.from(thumbResponse.data);
//         } catch (thumbError) {
//           console.log("⚠️ Could not fetch thumbnail");
//         }

//         // Prepare context info
//         const contextInfo = {
//           externalAdReply: {
//             title: videoTitle.substring(0, 60),
//             body: flags.doc ? '📄 Document' : '🎵 Audio',
//             mediaType: 1,
//             sourceUrl: videoUrl,
//             thumbnail: thumbnailBuffer,
//             renderLargerThumbnail: true
//           }
//         };

//         // Send file based on flags
//         if (flags.doc) {
//           // Send as document
//           await sock.sendMessage(jid, {
//             document: fileBuffer,
//             mimetype: "audio/mpeg",
//             fileName: fileName,
//             contextInfo: contextInfo
//           }, { quoted: m });
//         } else {
//           // Send as audio message
//           await sock.sendMessage(jid, {
//             audio: fileBuffer,
//             mimetype: 'audio/mpeg',
//             ptt: false,
//             fileName: fileName,
//             contextInfo: contextInfo
//           }, { quoted: m });
          
//           // Also send as document if file is small (<15MB)
//           if (fileSizeMB < 15) {
//             await sock.sendMessage(jid, {
//               document: fileBuffer,
//               mimetype: "audio/mpeg",
//               fileName: fileName,
//               contextInfo: {
//                 ...contextInfo,
//                 externalAdReply: { ...contextInfo.externalAdReply, body: '📄 Document Version' }
//               }
//             });
//           }
//         }

//         // Clean up
//         if (fs.existsSync(tempFile)) {
//           fs.unlinkSync(tempFile);
//           console.log(`🧹 Cleaned temp file: ${tempFile}`);
//         }

//         await sock.sendMessage(jid, { 
//           text: `✅ *Download Complete!*\n\n"${videoTitle}"\n📦 Size: ${fileSizeMB}MB\n📤 Format: ${flags.doc ? 'Document' : 'Audio Message'}\n🔧 API: ${apiUsed}`,
//           edit: statusMsg.key 
//         });

//         console.log(`✅ [PLAY] Success: "${videoTitle}" (${fileSizeMB}MB) via ${apiUsed}`);

//       } catch (downloadError) {
//         console.error("❌ [PLAY] Download error:", downloadError.message);
//         await sock.sendMessage(jid, { 
//           text: `❌ Failed to process file: ${downloadError.message}`,
//           edit: statusMsg.key 
//         });
//         if (fs.existsSync(tempFile)) {
//           try { fs.unlinkSync(tempFile); } catch {}
//         }
//       }

//     } catch (error) {
//       console.error("❌ [PLAY] ERROR:", error);
//       await sock.sendMessage(jid, { 
//         text: `❌ Error: ${error.message}` 
//       }, { quoted: m });
//     }
//   },
  
//   // Helper function to format duration
//   formatDuration(seconds) {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
    
//     if (hours > 0) {
//       return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//     }
//     return `${minutes}:${secs.toString().padStart(2, '0')}`;
//   }
// };
















import axios from "axios";
import yts from "yt-search";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Working APIs based on your Keith pattern
const apis = {
  keith: {
    search: async (query) => {
      try {
        const response = await axios.get(
          `https://apiskeith.vehttps://open.spotify.com/track/2337T5Uk5RJmcc0KHF6j7wrcel.app/search/yts?query=${encodeURIComponent(query)}`,
          
          { timeout: 10000 }
        );
        return response.data?.result || [];
      } catch (error) {
        console.error("Keith search error:", error.message);
        return [];
      }
    },
    downloadAudio: async (url) => {
      try {
        const response = await axios.get(
          `https://apiskeith.vercel.app/download/audio?url=${encodeURIComponent(url)}`,
          { timeout: 15000 }
        );
        return response.data?.result;
      } catch (error) {
        console.error("Keith download error:", error.message);
        return null;
      }
    }
  },
  
  // Alternative working API (y2mate)
  y2mate: {
    downloadAudio: async (url) => {
      try {
        const response = await axios.get(
          `https://api.beautyofweb.com/y2mate?url=${encodeURIComponent(url)}&type=mp3`,
          { timeout: 15000 }
        );
        return response.data?.result?.audio?.url;
      } catch (error) {
        console.error("Y2Mate error:", error.message);
        return null;
      }
    }
  },
  
  // Another alternative API
  tomp3: {
    downloadAudio: async (url) => {
      try {
        // Try different y2mate endpoints
        const endpoints = [
          `https://api.beautyofweb.com/y2mate?url=${encodeURIComponent(url)}&type=mp3`,
          `https://ytdl.sam-powers.workers.dev/?url=${encodeURIComponent(url)}&type=audio`,
          `https://yt5s.com/api/ajaxSearch?q=${encodeURIComponent(url)}&vt=home`
        ];
        
        for (const endpoint of endpoints) {
          try {
            const response = await axios.get(endpoint, { timeout: 10000 });
            if (response.data?.result?.audio?.url) return response.data.result.audio.url;
            if (response.data?.url) return response.data.url;
          } catch (e) {
            continue;
          }
        }
        return null;
      } catch (error) {
        console.error("Tomp3 error:", error.message);
        return null;
      }
    }
  }
};

export default {
  name: "play",
  //aliases: ["song", "ytmp3", "ytmp3doc", "audiodoc", "yta", "ytplay", "music"],
  category: "Downloader",
  description: "Download YouTube audio with multiple options",
  
  async execute(sock, m, args, prefix) {
    const jid = m.key.remoteJid;
    const quoted = m.quoted;
    let searchQuery = "";
    
    // Parse arguments
    const flags = {
      doc: args.includes('doc') || args.includes('document'),
      audio: args.includes('audio') || !args.includes('doc'),
      list: args.includes('list') || args.includes('search'),
      video: args.includes('video') || args.includes('vid'),
      quality: args.find(arg => ['128', '192', '256', '320'].includes(arg)) || '128'
    };
    
    // Filter out flags from query
    const queryArgs = args.filter(arg => 
      !['doc', 'document', 'audio', 'list', 'search', 'video', 'vid', '128', '192', '256', '320'].includes(arg)
    );
    
    // Get search query
    if (queryArgs.length > 0) {
      searchQuery = queryArgs.join(" ");
    } else if (quoted && quoted.text) {
      searchQuery = quoted.text;
    } else if (args.length === 0) {
      return sock.sendMessage(jid, {
        text: `🎵 *PLAY COMMAND*\n\n` +
              `📌 *Usage:* \`${prefix}play song name\`\n` +
              `📝 *Examples:*\n` +
              `• \`${prefix}play Home by NF\`\n` +
              `• \`${prefix}play https://youtube.com/...\`\n` +
              `• \`${prefix}play Ed Sheeran Shape of You\`\n\n` +
              `✨ Downloads audio from YouTube`
      }, { quoted: m });
    }

    console.log(`🎵 [PLAY] Query: "${searchQuery}"`);

    try {
      // LIST/SEARCH MODE
      if (flags.list) {
        const listQuery = searchQuery.replace('list', '').replace('search', '').trim();
        if (!listQuery) {
          await sock.sendMessage(jid, { 
            text: "Please specify search query. Example: .play list Ed Sheeran" 
          }, { quoted: m });
          return;
        }

        const statusMsg = await sock.sendMessage(jid, { 
          text: `🔍 *Searching:* "${listQuery}"` 
        }, { quoted: m });

        let videos = [];
        
        // Try Keith API first for search
        try {
          videos = await apis.keith.search(listQuery);
        } catch (error) {
          console.error("Keith search failed:", error.message);
        }
        
        // Fallback to yt-search
        if (!videos || videos.length === 0) {
          try {
            const { videos: ytResults } = await yts(listQuery);
            videos = ytResults || [];
          } catch (error) {
            console.error("YT search error:", error);
          }
        }

        if (videos.length === 0) {
          await sock.sendMessage(jid, { 
            text: `❌ No results found for "${listQuery}"`,
            edit: statusMsg.key 
          });
          return;
        }

        // Create list message
        let listText = `🔍 *Search Results:* "${listQuery}"\n\n`;
        videos.slice(0, 10).forEach((video, index) => {
          const title = video.title || "Unknown Title";
          const author = video.author?.name || video.channel?.name || 'Unknown';
          const duration = video.timestamp || video.duration || 'N/A';
          const url = video.url || `https://youtube.com/watch?v=${video.videoId || video.id}`;
          
          listText += `${index + 1}. ${title}\n`;
          listText += `   👤 ${author}\n`;
          listText += `   ⏱️ ${duration}\n`;
          listText += `   📺 .play ${url}\n\n`;
        });

        listText += `\n*Usage:* Reply with number (1-10) or use .play <URL>`;
        
        await sock.sendMessage(jid, { 
          text: listText,
          edit: statusMsg.key 
        });
        return;
      }

      // DOWNLOAD MODE
      const statusMsg = await sock.sendMessage(jid, { 
        text: `🔍 *Processing:* "${searchQuery}"` 
      }, { quoted: m });

      // Determine if URL or search
      let videoUrl = '';
      let videoTitle = '';
      let thumbnail = '';
      let videoId = '';

      if (searchQuery.match(/(youtube\.com|youtu\.be)/i)) {
        videoUrl = searchQuery;
        videoId = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)?.[1];
        if (!videoId) {
          await sock.sendMessage(jid, { 
            text: "❌ Invalid YouTube URL format.",
            edit: statusMsg.key 
          });
          return;
        }
        videoTitle = "YouTube Audio";
        thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
      } else {
        // Search for video using yt-search
        try {
          const { videos } = await yts(searchQuery);
          if (!videos || videos.length === 0) {
            // Try Keith search as fallback
            const keithResults = await apis.keith.search(searchQuery);
            if (keithResults && keithResults.length > 0) {
              videoUrl = keithResults[0].url;
              videoTitle = keithResults[0].title;
              thumbnail = keithResults[0].thumbnail;
              videoId = keithResults[0].videoId || keithResults[0].id;
            } else {
              await sock.sendMessage(jid, { 
                text: `❌ No results found for "${searchQuery}"`,
                edit: statusMsg.key 
              });
              return;
            }
          } else {
            videoUrl = videos[0].url;
            videoTitle = videos[0].title;
            thumbnail = videos[0].thumbnail;
            videoId = videos[0].videoId;
          }
        } catch (error) {
          console.error("Search error:", error);
          await sock.sendMessage(jid, { 
            text: `❌ Search failed: ${error.message}`,
            edit: statusMsg.key 
          });
          return;
        }
      }

      console.log(`🎵 [PLAY] Selected: "${videoTitle}" | URL: ${videoUrl}`);

      await sock.sendMessage(jid, { 
        text: `🔍 *Found:* "${videoTitle}" ✅\n⬇️ *Downloading...*`,
        edit: statusMsg.key 
      });

      // Try multiple download sources with priority
      let downloadUrl = null;
      let apiUsed = "";
      
      // Priority 1: Keith API (most reliable based on your pattern)
      downloadUrl = await apis.keith.downloadAudio(videoUrl);
      if (downloadUrl) apiUsed = "Keith API";
      
      // Priority 2: Y2Mate
      if (!downloadUrl) {
        console.log("⚠️ Keith failed, trying Y2Mate...");
        downloadUrl = await apis.y2mate.downloadAudio(videoUrl);
        if (downloadUrl) apiUsed = "Y2Mate API";
      }
      
      // Priority 3: Tomp3 (alternative)
      if (!downloadUrl) {
        console.log("⚠️ Y2Mate failed, trying alternative...");
        downloadUrl = await apis.tomp3.downloadAudio(videoUrl);
        if (downloadUrl) apiUsed = "Tomp3 API";
      }
      
      // Priority 4: Direct from YouTube (last resort)
      if (!downloadUrl && videoId) {
        console.log("⚠️ All APIs failed, trying direct method...");
        // Some direct MP3 conversion services
        try {
          const directUrl = `https://api.beautyofweb.com/y2mate?url=${encodeURIComponent(videoUrl)}&type=mp3`;
          const response = await axios.get(directUrl, { timeout: 15000 });
          if (response.data?.result?.audio?.url) {
            downloadUrl = response.data.result.audio.url;
            apiUsed = "Direct API";
          }
        } catch (error) {
          console.error("Direct method failed:", error.message);
        }
      }

      if (!downloadUrl) {
        console.error("❌ All download methods failed");
        await sock.sendMessage(jid, { 
          text: `❌ All download services failed. Please try:\n1. Another song/video\n2. Direct YouTube URL\n3. Try again later\n\nError: Could not get download link`,
          edit: statusMsg.key 
        });
        return;
      }

      console.log(`✅ [PLAY] Using ${apiUsed} for download`);
      
      await sock.sendMessage(jid, { 
        text: `🔍 *Found:* "${videoTitle}" ✅\n⬇️ *Downloading...* ✅\n📤 *Processing file...*`,
        edit: statusMsg.key 
      });

      // Create temp directory
      const tempDir = path.join(__dirname, "../temp");
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
      
      // Clean filename
      const fileName = `${videoTitle.replace(/[^\w\s.-]/gi, '').substring(0, 50)}.mp3`;
      const tempFile = path.join(tempDir, `play_${Date.now()}_${Math.random().toString(36).substring(7)}.mp3`);

      // Download and process file
      try {
        // Download file
        const response = await axios({
          url: downloadUrl,
          method: 'GET',
          responseType: 'stream',
          timeout: 45000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        if (response.status !== 200) {
          throw new Error(`Download failed with status ${response.status}`);
        }

        const writer = fs.createWriteStream(tempFile);
        response.data.pipe(writer);
        
        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });

        // Check file size
        const stats = fs.statSync(tempFile);
        const fileSizeMB = (stats.size / 1024 / 1024).toFixed(2);
        
        if (stats.size === 0) {
          throw new Error("Downloaded file is empty");
        }
        
        if (fileSizeMB > 50) {
          console.log(`⚠️ File too large: ${fileSizeMB}MB`);
          await sock.sendMessage(jid, { 
            text: `❌ File too large (${fileSizeMB}MB). Maximum size is 50MB.`,
            edit: statusMsg.key 
          });
          fs.unlinkSync(tempFile);
          return;
        }

        const fileBuffer = fs.readFileSync(tempFile);

        // Get thumbnail
        let thumbnailBuffer = null;
        try {
          const thumbResponse = await axios.get(thumbnail, {
            responseType: 'arraybuffer',
            timeout: 10000
          });
          thumbnailBuffer = Buffer.from(thumbResponse.data);
        } catch (thumbError) {
          console.log("⚠️ Could not fetch thumbnail");
        }

        // Prepare context info
        const contextInfo = {
          externalAdReply: {
            title: videoTitle.substring(0, 60),
            body: flags.doc ? '📄 Document' : '🎵 Audio',
            mediaType: 1,
            sourceUrl: videoUrl,
            thumbnail: thumbnailBuffer,
            renderLargerThumbnail: true
          }
        };

        // Send file based on flags
        if (flags.doc) {
          // Send as document
          await sock.sendMessage(jid, {
            document: fileBuffer,
            mimetype: "audio/mpeg",
            fileName: fileName,
            contextInfo: contextInfo
          }, { quoted: m });
        } else {
          // Send as audio message
          await sock.sendMessage(jid, {
            audio: fileBuffer,
            mimetype: 'audio/mpeg',
            ptt: false,
            fileName: fileName,
            contextInfo: contextInfo
          }, { quoted: m });
          
          // Also send as document if file is small (<15MB)
          if (fileSizeMB < 15) {
            await sock.sendMessage(jid, {
              document: fileBuffer,
              mimetype: "audio/mpeg",
              fileName: fileName,
              contextInfo: {
                ...contextInfo,
                externalAdReply: { ...contextInfo.externalAdReply, body: '📄 Document Version' }
              }
            });
          }
        }

        // Clean up
        if (fs.existsSync(tempFile)) {
          fs.unlinkSync(tempFile);
          console.log(`🧹 Cleaned temp file: ${tempFile}`);
        }

        await sock.sendMessage(jid, { 
          text: `✅ *Download Complete!*\n\n"${videoTitle}"\n📦 Size: ${fileSizeMB}MB\n📤 Format: ${flags.doc ? 'Document' : 'Audio Message'}\n🔧 API: ${apiUsed}`,
          edit: statusMsg.key 
        });

        console.log(`✅ [PLAY] Success: "${videoTitle}" (${fileSizeMB}MB) via ${apiUsed}`);

      } catch (downloadError) {
        console.error("❌ [PLAY] Download error:", downloadError.message);
        await sock.sendMessage(jid, { 
          text: `❌ Failed to process file: ${downloadError.message}`,
          edit: statusMsg.key 
        });
        if (fs.existsSync(tempFile)) {
          try { fs.unlinkSync(tempFile); } catch {}
        }
      }

    } catch (error) {
      console.error("❌ [PLAY] ERROR:", error);
      await sock.sendMessage(jid, { 
        text: `❌ Error: ${error.message}` 
      }, { quoted: m });
    }
  },
  
  // Helper function to format duration
  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
};