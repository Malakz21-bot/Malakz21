import axios from 'axios';
import moment from 'moment-timezone';

export default {
  name: "repo",
  aliases: ["r", "sc", "source", "github", "git", "wolfrepo", "botrepo", "update", "wolf"],
  description: "Shows WOLFBOT GitHub repository information",

  async execute(sock, m, args, PREFIX) {
    try {
      const jid = m.key.remoteJid;
      const sender = m.key.participant || m.key.remoteJid;
      const mentionTag = `@${sender.split('@')[0]}`;

      // Fake contact function
      function createFakeContact(message) {
        return {
          key: {
            participants: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            fromMe: false,
            id: "WOLFBOT"
          },
          message: {
            contactMessage: {
              vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:WOLFBOT\nitem1.TEL;waid=${message.key.participant?.split('@')[0] || message.key.remoteJid.split('@')[0]}:${message.key.participant?.split('@')[0] || message.key.remoteJid.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            }
          },
          participant: "0@s.whatsapp.net"
        };
      }

      const fkontak = createFakeContact(m);

      // UPDATED: New GitHub repository details
      const owner = "7silent-wolf";  // Changed from Silent-Wolf7
      const repo = "wolf";           // Changed from Silentwolf
      const repoUrl = `https://github.com/${owner}/${repo}`;
      
      // Your custom image URL
      const imageUrl = "https://i.ibb.co/39KMtVFZ/403aea2930de.jpg";

      try {
        // Fetch real-time repo info from GitHub API
        const { data } = await axios.get(
          `https://api.github.com/repos/${owner}/${repo}`,
          { 
            timeout: 10000,
            headers: { 
              "User-Agent": "WolfBot",
              "Accept": "application/vnd.github.v3+json"
            } 
          }
        );

        // Updated text structure with new repo info
        let txt = `◎  \`WOLF 𝚁𝙴𝙿𝙾 𝙸𝙽𝙵𝙾.\` \n`;
        txt += `◎ *Name* : ${data.name || "WOLFBOT"}\n`;
        txt += `◎ *Watchers* : ${data.watchers_count || 0}\n`;
        txt += `◎ *Size* : ${(data.size / 1024).toFixed(2)} MB\n`;
        txt += `◎ *Last Updated* : ${moment(data.updated_at).format('DD/MM/YY - HH:mm:ss')}\n`;
        txt += `◎ *REPO* : ${data.html_url || repoUrl}\n\n`;    
        txt += `◎ *Forks* : ${data.forks_count || 0}\n`;
        txt += `◎ *Stars* : ${data.stargazers_count || 0}\n`;
        txt += `◎ *Description* : ${data.description || ' \` Oficial Silent Wolf.\`'}\n`;
       // txt += `◎ *Owner* : ${owner}\n`;
       // txt += `◎ *Language* : ${data.language || 'JavaScript'}\n\n`;
        txt += `Hey👋 ${mentionTag} _Thank you for choosing Silent Wolf, please fork and star the new repository!_`;

        // Send message with image (not thumbnail)
        await sock.sendMessage(jid, {
          image: { url: imageUrl },
          caption: txt,
          mentions: [sender]
        }, { quoted: fkontak });

        // Send success reaction
        await sock.sendMessage(jid, {
          react: { text: '✅', key: m.key }
        });

      } catch (apiError) {
        console.error("GitHub API Error:", apiError);
        
        // Fallback static data with NEW repository details
        const fallbackText = `◎  \`WOLF 𝚁𝙴𝙿𝙾 𝙸𝙽𝙵𝙾.\` \n\n` +
          `◎ *Name* : WOLFBOT\n` +
          `◎ *Repository* : ${repoUrl}\n` +
          `◎ *Owner* : ${owner}\n` +
          `◎ *Watchers* : 0 (New Repository)\n` +
          `◎ *Size* : 11.5 MB\n` +
          `◎ *Last Updated* : ${moment().format('DD/MM/YY - HH:mm:ss')}\n\n` +    
          `◎ *Forks* : 0 (Be the first!)\n` +
          `◎ *Stars* : 0 (Star it first!)\n` +
          `◎ *Description* : A powerful WhatsApp bot with amazing features.\n\n` +
          `Hey👋 ${mentionTag} _Thank you for choosing Silent Wolf! This is our new repository!_`;

        // Send fallback message with image
        await sock.sendMessage(jid, {
          image: { url: imageUrl },
          caption: fallbackText,
          mentions: [sender]
        }, { quoted: fkontak });

        // Send warning reaction
        await sock.sendMessage(jid, {
          react: { text: '⚠️', key: m.key }
        });
      }

    } catch (err) {
      console.error("General Error:", err);
      
      // Minimal fallback with new repo URL
      const simpleText = `◎  \`WOLF 𝚁𝙴𝙿𝙾 𝙸𝙽𝙵𝙾.\` \n\n` +
        `◎ *Name* : WOLFBOT\n` +
        `◎ *Repository* : https://github.com/7silent-wolf/wolf\n` +
        `◎ *New Repository* : ✅ Yes\n` +
        `◎ *Status* : Active\n\n` +
        `Hey👋 @${(m.key.participant || m.key.remoteJid).split('@')[0]} _Thank you for choosing Silent Wolf!_`;

      await sock.sendMessage(m.key.remoteJid, {
        image: { url: "https://i.ibb.co/39KMtVFZ/403aea2930de.jpg" },
        caption: simpleText,
        mentions: [m.key.participant || m.key.remoteJid]
      }, { quoted: m });
    }
  },
};